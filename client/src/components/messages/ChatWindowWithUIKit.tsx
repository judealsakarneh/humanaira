'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createSupabaseBrowser } from '../../app/api/lib/supabaseBrowser'
import { sendMessage } from '../../lib/messaging'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
} from '@chatscope/chat-ui-kit-react'

type Conversation = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  status?: string
}

type MessageRow = {
  id: string
  conversation_id: string
  sender_id: string
  text?: string | null
  attachments?: string[] | null
  is_system?: boolean
  blocked?: boolean
  created_at?: string
}

type Profile = {
  id: string
  username?: string | null
  full_name?: string | null
  avatar_url?: string | null
}

export default function ChatWindowWithUIKit({ conversation }: { conversation: Conversation }) {
  const supabase = createSupabaseBrowser()
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [otherUser, setOtherUser] = useState<Profile | null>(null)
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // Load current user
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUserId(data?.user?.id ?? null)
    })()
    return () => {
      mounted = false
    }
  }, [supabase])

  // Load other user's profile
  useEffect(() => {
    if (!conversation || !userId) return

    const otherUserId = conversation.buyer_id === userId ? conversation.seller_id : conversation.buyer_id
    
    let mounted = true
    ;(async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .eq('id', otherUserId)
          .single()
        
        if (mounted && data) {
          setOtherUser(data as Profile)
        }
      } catch (err) {
        console.error('Failed to load other user profile:', err)
      }
    })()
    
    return () => {
      mounted = false
    }
  }, [conversation, userId, supabase])

  // Load messages and subscribe to realtime
  useEffect(() => {
    if (!conversation) return
    let mounted = true

    const loadMessages = async () => {
      try {
        const res = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })
          .limit(500)
        
        const data = (res.data as unknown) as MessageRow[] | null
        if (mounted) {
          setMessages(data || [])
        }
      } catch (err) {
        console.error('Failed to load messages', err)
      }
    }

    loadMessages()

    const channel = supabase
      .channel(`public:messages:conversation=${conversation.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages', 
          filter: `conversation_id=eq.${conversation.id}` 
        },
        (payload: any) => {
          const newMsg = payload.new as MessageRow
          setMessages((prev) => {
            // Prevent duplicates
            if (prev.some(m => m.id === newMsg.id)) return prev
            return [...prev, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      mounted = false
    }
  }, [supabase, conversation])

  async function handleSend(text: string) {
    if (!text || text.trim().length === 0) return
    setSending(true)

    try {
      await sendMessage({
        conversationId: conversation.id,
        text: text.trim(),
        attachments: [],
        isSystem: false,
      })
    } catch (err) {
      console.error('sendMessage error', err)
      alert('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const otherUserName = otherUser?.full_name || otherUser?.username || 'User'
  const otherUserAvatar = otherUser?.avatar_url || undefined

  return (
    <div className="h-full flex flex-col bg-[#0B1024]" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Custom styling for Chat UI Kit to match app theme */}
      <style jsx global>{`
        .cs-main-container {
          background: #0B1024 !important;
          border: none !important;
        }
        
        .cs-chat-container {
          background: #0B1024 !important;
        }
        
        .cs-conversation-header {
          background: #070D1C !important;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1) !important;
          padding: 1rem !important;
        }
        
        .cs-conversation-header__content {
          color: white !important;
        }
        
        .cs-message-list {
          background: #080E1B !important;
          padding: 1rem !important;
        }
        
        .cs-message__content {
          background: #1E293B !important;
          color: #E2E8F0 !important;
        }
        
        .cs-message--incoming .cs-message__content {
          background: #1E293B !important;
        }
        
        .cs-message--outgoing .cs-message__content {
          background: #0369A1 !important;
          color: white !important;
        }
        
        .cs-message-input {
          background: #070D1C !important;
          border-top: 1px solid rgba(148, 163, 184, 0.1) !important;
          padding: 0.75rem !important;
        }
        
        .cs-message-input__content-editor {
          background: #0B1024 !important;
          border: 1px solid rgba(148, 163, 184, 0.2) !important;
          border-radius: 0.5rem !important;
          color: white !important;
        }
        
        .cs-message-input__content-editor:focus {
          border-color: rgba(56, 189, 248, 0.4) !important;
          outline: none !important;
        }
        
        .cs-button--send {
          background: #0369A1 !important;
          border-radius: 0.5rem !important;
        }
        
        .cs-button--send:hover {
          background: #0284C7 !important;
        }
        
        .cs-message__sent-time {
          color: #94A3B8 !important;
          font-size: 0.75rem !important;
        }
      `}</style>

      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <Avatar
              src={otherUserAvatar}
              name={otherUserName}
            />
            <ConversationHeader.Content
              userName={otherUserName}
              info={conversation.gig_id ? "About a service" : "Conversation"}
            />
          </ConversationHeader>
          
          <MessageList>
            {messages.map((msg) => {
              const isMe = userId && msg.sender_id === userId
              const time = msg.created_at 
                ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''

              return (
                <Message
                  key={msg.id}
                  model={{
                    message: msg.text || '',
                    sentTime: time,
                    sender: isMe ? 'You' : otherUserName,
                    direction: isMe ? 'outgoing' : 'incoming',
                    position: 'single',
                  }}
                >
                  {msg.attachments && msg.attachments.length > 0 && (
                    <Message.CustomContent>
                      <div className="flex gap-2 flex-wrap">
                        {msg.attachments.map((url, i) => (
                          <img 
                            key={i} 
                            src={url} 
                            alt="attachment" 
                            className="max-w-xs rounded"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                          />
                        ))}
                      </div>
                    </Message.CustomContent>
                  )}
                </Message>
              )
            })}
          </MessageList>
          
          <MessageInput
            placeholder="Type your message here..."
            onSend={handleSend}
            disabled={sending}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  )
}
