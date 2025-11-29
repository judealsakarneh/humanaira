import { NextResponse } from 'next/server'
import { createSupabaseServer } from '../lib/supabaseServer'

export async function POST() {
  const supabase = createSupabaseServer()
  // Example: get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Example: upsert a profile
  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    display_name: user.user_metadata?.full_name || 'New User',
    username: `user_${user.id.slice(0,6)}`
  }, { onConflict: 'id' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
