import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../lib/supabaseServer'

/**
 * POST /api/conversations/send-message
 * Send a message in a conversation
 * Uses service role to bypass RLS
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[API /send-message] Authentication error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await req.json()
    const { conversation_id, text, attachments, is_system } = body

    if (!conversation_id) {
      return NextResponse.json({ error: 'conversation_id is required' }, { status: 400 })
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    console.log('[API /send-message] Request:', {
      conversation_id,
      sender_id: user.id,
      text_length: text?.length,
      attachments_count: attachments?.length || 0,
    })

    // Verify user is participant in this conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id, buyer_id, seller_id')
      .eq('id', conversation_id)
      .single()

    if (convError || !conversation) {
      console.error('[API /send-message] Conversation not found:', convError)
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Check if user is buyer or seller in this conversation
    if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) {
      console.error('[API /send-message] User not authorized for conversation')
      return NextResponse.json({ error: 'Not authorized for this conversation' }, { status: 403 })
    }

    // Insert message using service role (bypasses RLS)
    const { data: message, error: insertError } = await supabase
      .from('messages')
      .insert([{
        conversation_id,
        sender_id: user.id,
        text: text.trim(),
        attachments: attachments || [],
        is_system: is_system || false,
        blocked: false,
      }])
      .select('*')
      .single()

    if (insertError) {
      console.error('[API /send-message] Insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    console.log('[API /send-message] Message inserted successfully:', message.id)

    // Update conversation's updated_at and last_message
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        updated_at: new Date().toISOString(),
        last_message: text.trim().substring(0, 100), // Store first 100 chars
      })
      .eq('id', conversation_id)

    if (updateError) {
      console.error('[API /send-message] Failed to update conversation:', updateError)
      // Don't fail the request if conversation update fails
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error: any) {
    console.error('[API /send-message] Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
