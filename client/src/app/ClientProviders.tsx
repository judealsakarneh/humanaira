'use client'
import React, { useEffect, useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [supabaseClient, setSupabaseClient] = useState<any | null>(null)

  useEffect(() => {
    try {
      const sb = createSupabaseBrowser()
      setSupabaseClient(sb)
    } catch (e) {
      // Log the error but don't crash the whole app during client init
      // (this can happen if env vars are missing)
      // eslint-disable-next-line no-console
      console.error('createSupabaseBrowser failed on client:', e)
    }
  }, [])

  // Render children until supabase client is ready to avoid hydration mismatch
  if (!supabaseClient) return <>{children}</>

  return <SessionContextProvider supabaseClient={supabaseClient}>
    {children}
  </SessionContextProvider>
}