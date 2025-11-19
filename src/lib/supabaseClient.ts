'use server'
// Server-side Supabase client (service role) used by server routes (webhooks, order-created handler).
// IMPORTANT: set SUPABASE_URL and SUPABASE_SERVICE_ROLE in your environment (Vercel / deployment).
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRole = process.env.SUPABASE_SERVICE_ROLE ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY

if (!url || !serviceRole) {
  // We do not throw here to avoid breaking dev-time type checks, but server routes that call this client will fail if envs are not set.
  // Make sure to configure these env vars in production (Vercel/Netlify/etc.) and locally in .env.local for testing.
  // eslint-disable-next-line no-console
  console.warn('Supabase server client created without SUPABASE_URL or SUPABASE_SERVICE_ROLE env set')
}

export const supabaseServer = createClient(url ?? '', serviceRole ?? '', {
  auth: { persistSession: false },
  // In Next runtimes, createClient will use global fetch automatically.
})