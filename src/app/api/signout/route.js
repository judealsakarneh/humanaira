import { NextResponse } from 'next/server'
import { createSupabaseServer } from '../lib/supabaseServer'

export async function POST() {
  const supabase = createSupabaseServer()
  await supabase.auth.signOut()
  // Redirect to home page after sign out
  return NextResponse.redirect('/', { status: 302 })
}