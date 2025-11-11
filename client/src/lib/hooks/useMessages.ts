'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

export type Message = {
  id: string
  conversation_id: string
  sender_id: string
  text: string | null
  attachments?: string[] | null
  is_system?: boolean
  blocked?: boolean
  created_at: string
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    if (!conversationId) {
      setLoading(false)
      return
    }

    let mounted = true

    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })
          .limit(500)

        if (!mounted) return

        if (fetchError) {
          console.error('Error fetching messages:', fetchError)
          setError(fetchError.message)
          setLoading(false)
          return
        }

        setMessages((data || []) as Message[])
        setError(null)
        setLoading(false)
      } catch (err) {
        console.error('Exception fetching messages:', err)
        if (mounted) {
          setError('Failed to load messages')
          setLoading(false)
        }
      }
    }

    fetchMessages()

    // Subscribe to realtime inserts
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received:', payload)
          if (mounted) {
            const newMessage = payload.new as Message
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === newMessage.id)) {
                return prev
              }
              return [...prev, newMessage]
            })
          }
        }
      )
      .subscribe()

    return () => {
      mounted = false
      channel.unsubscribe()
    }
  }, [conversationId, supabase])

  return { messages, loading, error }
}
