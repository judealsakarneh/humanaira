import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../lib/supabaseServer'

/**
 * LEGACY MESSAGING SYSTEM - DISABLED
 * 
 * This endpoint is part of the old messaging system.
 * It has been replaced by Twilio Conversations.
 * 
 * To re-enable, uncomment the code below and remove the deprecation notice.
 */

export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    error: 'This endpoint is deprecated. Please use Twilio Conversations instead.',
    migration_note: 'See /api/chat/token for the new messaging system'
  }, { status: 410 })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ 
    error: 'This endpoint is deprecated. Please use Twilio Conversations instead.',
    migration_note: 'See /api/chat/token for the new messaging system'
  }, { status: 410 })
}

/*
// ORIGINAL CODE - COMMENTED OUT FOR MIGRATION TO TWILIO CONVERSATIONS

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const order_id = searchParams.get('order_id')
  if (!order_id) return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
  const supabase = await createSupabaseServer()
  const { data: messages } = await supabase
    .from('messages')
    .select('id,sender_id,content,created_at')
    .eq('order_id', order_id)
    .order('created_at', { ascending: true })
  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { order_id, content } = await req.json()
  if (!order_id || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const { error } = await supabase.from('messages').insert({
    order_id,
    sender_id: user.id,
    content,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true })
}
*/