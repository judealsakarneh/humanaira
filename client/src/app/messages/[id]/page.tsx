'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../../api/lib/supabaseBrowser'
import { useMessages } from '../../../lib/hooks/useMessages'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationHeader,
} from '@chatscope/chat-ui-kit-react'

type Conversation = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  last_message?: string | null
  status?: string
  created_at?: string
  updated_at?: string
}

type Profile = {
  id: string
  username?: string | null
  full_name?: string | null
  avatar_url?: string | null
}

export default function ChatPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const conversationId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const supabase = createSupabaseBrowser()
  
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [otherUser, setOtherUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { messages, loading: messagesLoading, error: messagesError } = useMessages(conversationId)

  // Load current user
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (mounted) {
        setCurrentUser(data?.user ?? null)
      }
    })()
    return () => { mounted = false }
  }, [supabase])

  // Load conversation
  useEffect(() => {
    if (!conversationId) {
      setLoading(false)
      return
    }

    let mounted = true
    const fetchConversation = async () => {
      try {
        // Try API route to bypass RLS
        const res = await fetch(`/api/conversations/${conversationId}`)
        if (!res.ok) {
          console.error('Failed to fetch conversation')
          setLoading(false)
          return
        }

        const data = await res.json()
        if (mounted) {
          setConversation(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Error fetching conversation:', err)
        if (mounted) setLoading(false)
      }
    }

    fetchConversation()
    return () => { mounted = false }
  }, [conversationId])

  // Load other user's profile
  useEffect(() => {
    if (!conversation || !currentUser) return

    const otherUserId = conversation.buyer_id === currentUser.id 
      ? conversation.seller_id 
      : conversation.buyer_id

    let mounted = true
    ;(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .eq('id', otherUserId)
        .single()

      if (mounted && data) {
        setOtherUser(data as Profile)
      }
    })()
    return () => { mounted = false }
  }, [conversation, currentUser, supabase])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (textContent: string) => {
    if (!textContent.trim() || !conversationId || !currentUser || sending) return

    setSending(true)
    try {
      const { error } = await supabase.from('messages').insert([{
        conversation_id: conversationId,
        sender_id: currentUser.id,
        text: textContent.trim(),
        created_at: new Date().toISOString(),
      }])

      if (error) {
        console.error('Error sending message:', error)
      }
    } catch (err) {
      console.error('Exception sending message:', err)
    } finally {
      setSending(false)
    }
  }

  if (loading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-700">Conversation not found</p>
          <button
            onClick={() => router.push('/messages')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Messages
          </button>
        </div>
      </div>
    )
  }

  const otherUserName = otherUser?.full_name || otherUser?.username || 'User'

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push('/messages')}
          className="text-gray-600 hover:text-gray-900"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3 flex-1">
          {otherUser?.avatar_url ? (
            <img
              src={otherUser.avatar_url}
              alt={otherUserName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {otherUserName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-semibold text-gray-900">{otherUserName}</h1>
            <p className="text-sm text-gray-500">Active now</p>
          </div>
        </div>
      </div>

      {/* Chat UI */}
      <div className="flex-1 relative">
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {messages.map((msg) => {
                const isSentByMe = msg.sender_id === currentUser?.id
                const timestamp = new Date(msg.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })
                
                return (
                  <Message
                    key={msg.id}
                    model={{
                      message: msg.text || '',
                      sentTime: timestamp,
                      sender: isSentByMe ? 'You' : otherUserName,
                      direction: isSentByMe ? 'outgoing' : 'incoming',
                      position: 'single',
                    }}
                  >
                    {!isSentByMe && otherUser?.avatar_url && (
                      <Avatar src={otherUser.avatar_url} name={otherUserName} />
                    )}
                  </Message>
                )
              })}
              <div ref={messagesEndRef} />
            </MessageList>
            <MessageInput
              placeholder="Type a message..."
              onSend={handleSendMessage}
              disabled={sending}
              attachButton={false}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}