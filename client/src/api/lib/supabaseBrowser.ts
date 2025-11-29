import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

export function createSupabaseBrowser() {
  if (typeof window === 'undefined') {
    throw new Error('createSupabaseBrowser should only be called in the browser')
  }

  if (supabaseClient) return supabaseClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars')
  }

  supabaseClient = createClient(url, anonKey, {
    auth: {
      // do not persist sessions on server-side; this is a browser client
      persistSession: true,
      // optionally: storageKey, detectSessionInUrl, etc.
    },
  })

  return supabaseClient
}