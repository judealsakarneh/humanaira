import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const conversationId = params.id
    
    console.log('[API /conversations/:id] GET request for:', conversationId)
    
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error('[API /conversations/:id] Missing env config')
      return NextResponse.json({ error: 'Server env not configured' }, { status: 500 })
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } })

    // Fetch conversation using service role (bypasses RLS)
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (error) {
      console.error('[API /conversations/:id] Error fetching conversation:', error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    if (!data) {
      console.error('[API /conversations/:id] Conversation not found')
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    console.log('[API /conversations/:id] Conversation found:', data.id)
    return NextResponse.json(data, { status: 200 })
  } catch (e: any) {
    console.error('[API /conversations/:id] GET error', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
