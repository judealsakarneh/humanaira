import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { conversation_id, sender_id, gig_title } = await req.json().catch(() => ({}))
    
    console.log('[API /send-initial-message] Request:', { conversation_id, sender_id, gig_title })
    
    if (!conversation_id || !sender_id) {
      console.error('[API /send-initial-message] Missing required fields')
      return NextResponse.json(
        { error: 'conversation_id and sender_id required' },
        { status: 400 }
      )
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error('[API /send-initial-message] Missing env config')
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
      console.error('[API /send-initial-message] Conversation not found:', convError)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }
    
    console.log('[API /send-initial-message] Found conversation:', conversation)

    // Verify sender is either buyer or seller
    if (conversation.buyer_id !== sender_id && conversation.seller_id !== sender_id) {
      console.error('[API /send-initial-message] Unauthorized - sender not participant')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create the initial message
    const gigTitle = gig_title || 'your service'
    const initialMessage = `Hi! I'm interested in "${gigTitle}". I'd like to learn more about this service.`
    
    console.log('[API /send-initial-message] Sending message:', initialMessage)

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
      console.error('[API /send-initial-message] Failed to insert message:', msgError)
      return NextResponse.json({ error: msgError.message }, { status: 500 })
    }
    
    console.log('[API /send-initial-message] Message created:', message.id)

    // Update conversation's updated_at timestamp
    const updateResult = await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString(), last_message: initialMessage })
      .eq('id', conversation_id)
      
    if (updateResult.error) {
      console.error('[API /send-initial-message] Failed to update conversation:', updateResult.error)
    } else {
      console.log('[API /send-initial-message] Updated conversation timestamp')
    }

    return NextResponse.json({ success: true, message }, { status: 200 })
  } catch (e: any) {
    console.error('[API /send-initial-message] POST error', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
