'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseBrowser'

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  text: string
  attachments?: any[]
  is_system?: boolean
  blocked?: boolean
  created_at: string
}

export default function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (!conversationId) return
    let mounted = true
    setLoading(true)

    ;(async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (!mounted) return
      if (error) {
        console.error('fetch messages error', error)
        setError(error)
        setMessages([])
      } else {
        setMessages(data || [])
      }
      setLoading(false)
    })()

    // subscribe to new messages for the conversation
    const channel = supabase
      .channel(`messages_conv_${conversationId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          if (payload?.new) {
            setMessages((prev) => {
              // avoid duplicates by id
              if (prev.find((m) => m.id === payload.new.id)) return prev
              return [...prev, payload.new as Message]
            })
          }
        }
      )
      .subscribe((status) => {
        // helpful logging for debugging
        console.debug('messages subscription status', conversationId, status)
      })

    channelRef.current = channel

    return () => {
      mounted = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [conversationId])

  return { messages, loading, error, setMessages }
}
