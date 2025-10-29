// Safe lazy Supabase server helper.
// Do NOT construct the client at module import time (avoid build-time errors).
// Export a named async function getSupabaseServer that returns the client or null.

export async function getSupabaseServer() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_KEY ??
    process.env.SUPABASE_ANON_KEY

  if (!url || !serviceKey) {
    // Warning instead of throwing so imports don't fail at build-time.
    console.warn('getSupabaseServer: SUPABASE envs missing')
    return null
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey, {
    // optional client options
    // fetch is provided by Node 18+ on Vercel serverless runtimes
  })

  return supabase
}