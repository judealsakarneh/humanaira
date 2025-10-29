// Safe lazy Supabase server helper.
// Never construct the Supabase client at module import time (prevents build-time throws).
// Export a named async function `getSupabaseServer` that returns the client or null.

export async function getSupabaseServer(): Promise<any | null> {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_KEY ??
    process.env.SUPABASE_ANON_KEY

  if (!url || !serviceKey) {
    // warn instead of throwing so imports won't fail during Next.js build
    console.warn('getSupabaseServer: SUPABASE envs missing (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)')
    return null
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(url, serviceKey, {
    // any options you had previously can be added here
    // avoid doing network/database calls at construction time
  })

  return supabase
}

// Optional: export a compatibility alias if some files import { getSupabaseServer as supabaseServer }
// (This keeps exports explicit and avoids creating a client at module load time.)
export { getSupabaseServer as supabaseServer }