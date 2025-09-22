'use client'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

const supabase = createSupabaseBrowser()

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  )
}