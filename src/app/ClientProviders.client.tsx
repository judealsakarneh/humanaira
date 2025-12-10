'use client'
import React, { useEffect, useState } from 'react'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

export default function ClientProvidersClient({ children }: { children: React.ReactNode }) {
  const [supabaseClient, setSupabaseClient] = useState<any | null>(null)

  useEffect(() => {
    try {
      const sb = createSupabaseBrowser()
      setSupabaseClient(sb)
    } catch (e) {
      // If env vars are missing or other issues occur, log but don't crash the whole app
      // eslint-disable-next-line no-console
      console.error('createSupabaseBrowser failed on client:', e)
    }
  }, [])

  // Render children while the supabase client is being created to avoid hydration mismatch.
  if (!supabaseClient) return <>{children}</>

  return <SessionContextProvider supabaseClient={supabaseClient}>{children}</SessionContextProvider>
}