'use server'
// Server-side Supabase client (service role) used by server routes (webhooks, order-created handler).
// IMPORTANT: set SUPABASE_URL and SUPABASE_SERVICE_ROLE in your environment (Vercel / deployment).
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRole =
  process.env.SUPABASE_SERVICE_ROLE ??
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_KEY

if (!url || !serviceRole) {
  // This will warn during dev; server routes will error if these are not set at runtime.
  // eslint-disable-next-line no-console
  console.warn('Supabase server client created without SUPABASE_URL or SUPABASE_SERVICE_ROLE env set')
}

export const supabaseServer = createClient(url ?? '', serviceRole ?? '', {
  auth: { persistSession: false },
})