import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { conversation_id, sender_id, gig_title } = await req.json().catch(() => ({}))
    
    if (!conversation_id || !sender_id) {
      return NextResponse.json(
        { error: 'conversation_id and sender_id required' },
        { status: 400 }
      )
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      return NextResponse.json({ error: 'Server env not configured' }, { status: 500 })
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } })

    // Verify the conversation exists and the sender is a participant
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, buyer_id, seller_id')
      .eq('id', conversation_id)
      .single()

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Verify sender is either buyer or seller
    if (conversation.buyer_id !== sender_id && conversation.seller_id !== sender_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create the initial message
    const gigTitle = gig_title || 'your service'
    const initialMessage = `Hi! I'm interested in "${gigTitle}". I'd like to learn more about this service.`

    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id,
          sender_id,
          text: initialMessage,
          attachments: [],
          is_system: false,
        },
      ])
      .select()
      .single()

    if (msgError) {
      console.error('Failed to insert initial message:', msgError)
      return NextResponse.json({ error: msgError.message }, { status: 500 })
    }

    // Update conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString(), last_message: initialMessage })
      .eq('id', conversation_id)

    return NextResponse.json({ success: true, message }, { status: 200 })
  } catch (e: any) {
    console.error('send-initial-message POST error', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
