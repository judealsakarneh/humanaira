'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Client as TwilioClient } from '@twilio/conversations'
import { createSupabaseBrowser } from '../app/api/lib/supabaseBrowser'

type TwilioChatContextType = {
  client: TwilioClient | null
  loading: boolean
  error: string | null
  fallbackMode: boolean
  refreshToken: () => Promise<void>
}

const TwilioChatContext = createContext<TwilioChatContextType>({
  client: null,
  loading: true,
  error: null,
  fallbackMode: false,
  refreshToken: async () => {},
})

export function useTwilioChat() {
  return useContext(TwilioChatContext)
}

export function TwilioChatProvider({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState<TwilioClient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const supabase = createSupabaseBrowser()

  const initializeTwilioClient = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Get Twilio access token from API
      const response = await fetch('/api/twilio/token')
      if (!response.ok) {
        throw new Error('Failed to fetch Twilio token')
      }

      const data = await response.json()
      
      if (data.fallbackMode) {
        console.log('Twilio not configured - using fallback Supabase mode')
        setFallbackMode(true)
        setLoading(false)
        return
      }

      if (!data.token) {
        throw new Error('No token received')
      }

      // Initialize Twilio Conversations client
      const twilioClient = new TwilioClient(data.token)
      
      twilioClient.on('initialized', () => {
        console.log('Twilio client initialized')
        setClient(twilioClient)
        setLoading(false)
      })

      twilioClient.on('initFailed', (err: any) => {
        console.error('Twilio client init failed:', err)
        setError('Failed to initialize chat')
        setFallbackMode(true)
        setLoading(false)
      })

      twilioClient.on('tokenAboutToExpire', async () => {
        console.log('Token about to expire, refreshing...')
        await refreshToken()
      })

      twilioClient.on('tokenExpired', async () => {
        console.log('Token expired, refreshing...')
        await refreshToken()
      })

    } catch (err: any) {
      console.error('Error initializing Twilio:', err)
      setError(err.message || 'Failed to initialize chat')
      setFallbackMode(true)
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/twilio/token')
      if (!response.ok) throw new Error('Failed to refresh token')
      
      const data = await response.json()
      if (data.fallbackMode) {
        setFallbackMode(true)
        return
      }
      
      if (client && data.token) {
        await client.updateToken(data.token)
      }
    } catch (err: any) {
      console.error('Error refreshing token:', err)
      setError('Failed to refresh token')
    }
  }

  useEffect(() => {
    initializeTwilioClient()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        initializeTwilioClient()
      } else if (event === 'SIGNED_OUT') {
        if (client) {
          client.shutdown()
        }
        setClient(null)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
      if (client) {
        client.shutdown()
      }
    }
  }, [])

  return (
    <TwilioChatContext.Provider
      value={{
        client,
        loading,
        error,
        fallbackMode,
        refreshToken,
      }}
    >
      {children}
    </TwilioChatContext.Provider>
  )
}
