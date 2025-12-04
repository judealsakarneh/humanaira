'use client'
import React, { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => {
    try {
      return createSupabaseBrowser()
    } catch (e) {
      // Log the error but don't crash the whole app during client init
      // (this can happen if env vars are missing)
      // eslint-disable-next-line no-console
      console.error('createSupabaseBrowser failed on client:', e)
      return null
    }
  })

  // Simple render - no need for SessionContextProvider with @supabase/ssr
  return <>{children}</>
}