'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Client as ConversationsClient, Conversation, Message } from '@twilio/conversations'

/**
 * Client-side React hook for Twilio Conversations
 * 
 * This hook:
 * - Fetches a Twilio access token from the backend
 * - Initializes the Twilio Conversations JS client
 * - Joins a conversation using the provided conversationSid
 * - Returns messages, sendMessage function, and state
 */

interface UseTwilioConversationOptions {
  conversationSid: string | null
}

interface TwilioMessage {
  sid: string
  author: string | null
  body: string | null
  dateCreated: Date | null
}

export function useTwilioConversation({ conversationSid }: UseTwilioConversationOptions) {
  const [messages, setMessages] = useState<TwilioMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [identity, setIdentity] = useState<string | null>(null)
  
  const clientRef = useRef<ConversationsClient | null>(null)
  const conversationRef = useRef<Conversation | null>(null)

  // Initialize Twilio client and join conversation
  useEffect(() => {
    if (!conversationSid) {
      setLoading(false)
      return
    }

    let mounted = true
    let client: ConversationsClient | null = null
    let conversation: Conversation | null = null

    const initConversation = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch token from backend
        const response = await fetch('/api/chat/token')
        if (!response.ok) {
          throw new Error('Failed to fetch token')
        }

        const data = await response.json()
        const { token, identity: fetchedIdentity } = data

        if (!mounted) return

        setIdentity(fetchedIdentity)

        // Initialize Twilio Conversations client
        client = new ConversationsClient(token)
        clientRef.current = client

        // Wait for client to be ready
        await new Promise<void>((resolve, reject) => {
          client!.on('stateChanged', (state) => {
            if (state === 'initialized') {
              resolve()
            } else if (state === 'failed') {
              reject(new Error('Client initialization failed'))
            }
          })
        })

        if (!mounted) return

        // Get the conversation
        conversation = await client.getConversationBySid(conversationSid)
        conversationRef.current = conversation

        // Load existing messages
        const messagePaginator = await conversation.getMessages()
        const items = messagePaginator.items

        if (!mounted) return

        setMessages(
          items.map((msg: Message) => ({
            sid: msg.sid,
            author: msg.author,
            body: msg.body,
            dateCreated: msg.dateCreated,
          }))
        )

        // Listen for new messages
        conversation.on('messageAdded', (message: Message) => {
          if (!mounted) return
          setMessages((prev) => [
            ...prev,
            {
              sid: message.sid,
              author: message.author,
              body: message.body,
              dateCreated: message.dateCreated,
            },
          ])
        })

        setLoading(false)
      } catch (err: any) {
        console.error('Error initializing conversation:', err)
        if (!mounted) return
        setError(err.message || 'Failed to initialize conversation')
        setLoading(false)
      }
    }

    initConversation()

    return () => {
      mounted = false
      // Cleanup: shutdown client when component unmounts
      if (client) {
        client.removeAllListeners()
        client.shutdown()
      }
    }
  }, [conversationSid])

  // Send a message
  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversationRef.current) {
        throw new Error('Conversation not initialized')
      }

      try {
        await conversationRef.current.sendMessage(text)
      } catch (err: any) {
        console.error('Error sending message:', err)
        throw err
      }
    },
    []
  )

  return {
    messages,
    sendMessage,
    loading,
    error,
    identity,
  }
}
