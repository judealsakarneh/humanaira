'use client'
import React from 'react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Initialize supabase client on the client side
  // With @supabase/ssr, we don't need SessionContextProvider anymore
  // Components can create their own client instances as needed
  React.useEffect(() => {
    try {
      createSupabaseBrowser()
    } catch (e) {
      // If env vars are missing or other issues occur, log but don't crash the whole app
      // eslint-disable-next-line no-console
      console.error('createSupabaseBrowser failed on client:', e)
    }
  }, [])

  return <>{children}</>
}