import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getOrCreateConversation } from '@/lib/twilio/conversations'

/**
 * POST /api/chat/conversations
 * 
 * Creates or retrieves a Twilio Conversation for an order or buyer-seller pair
 * Stores the mapping in the database for quick lookups
 * 
 * Body:
 * - orderId (optional): order ID for order-specific conversation
 * - sellerId: seller user ID  
 * - gigId (optional): gig ID for context
 * 
 * Returns:
 * - conversationSid: Twilio conversation SID
 * - dbConversationId: Database conversation ID
 */
export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Authenticate user
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { orderId, sellerId, gigId } = body

    if (!sellerId) {
      return NextResponse.json(
        { error: 'sellerId is required' },
        { status: 400 }
      )
    }

    if (user.id === sellerId) {
      return NextResponse.json(
        { error: 'Cannot create conversation with yourself' },
        { status: 400 }
      )
    }

    const buyerId = user.id

    // Create or get Twilio conversation
    const twilioResult = await getOrCreateConversation(
      orderId || `pair_${buyerId}_${sellerId}`,
      buyerId,
      sellerId
    )

    // Store/update mapping in database
    // Check if conversation already exists
    console.log('[API] Querying for existing conversation:', { sellerId, buyerId, gigId })
    
    let query = supabase
      .from('conversations')
      .select('id, twilio_conversation_sid')
      .eq('seller_id', sellerId)
      .eq('buyer_id', buyerId)

    if (gigId) {
      query = query.eq('gig_id', gigId)
    } else {
      query = query.is('gig_id', null)
    }

    const { data: existing, error: findError } = await query.limit(1).maybeSingle()

    if (findError) {
      console.error('[API] Error finding conversation:', findError)
      console.error('[API] Full error details:', JSON.stringify(findError, null, 2))
      return NextResponse.json(
        { 
          error: 'Database error',
          details: findError.message,
          hint: findError.hint || 'Check if conversations table has required columns: seller_id, buyer_id, gig_id, twilio_conversation_sid'
        },
        { status: 500 }
      )
    }

    let dbConversationId: string | undefined

    if (existing) {
      // Update Twilio SID if not set
      if (!existing.twilio_conversation_sid) {
        const { error: updateError } = await supabase
          .from('conversations')
          .update({ twilio_conversation_sid: twilioResult.conversationSid })
          .eq('id', existing.id)

        if (updateError) {
          console.error('Error updating conversation:', updateError)
        }
      }
      dbConversationId = existing.id
      console.log('[API] Using existing conversation:', dbConversationId)
    } else {
      // Create new conversation record
      console.log('[API] Creating new conversation record')
      const { data: created, error: insertError } = await supabase
        .from('conversations')
        .insert([{
          seller_id: sellerId,
          buyer_id: buyerId,
          gig_id: gigId || null,
          twilio_conversation_sid: twilioResult.conversationSid,
          status: 'open'
        }])
        .select('id')
        .single()

      if (insertError) {
        console.error('[API] Insert error:', insertError)
        console.error('[API] Full insert error:', JSON.stringify(insertError, null, 2))
        // Race condition - try to fetch again
        const { data: after } = await query.limit(1).maybeSingle()
        if (after) {
          dbConversationId = after.id
          console.log('[API] Found conversation after race condition:', dbConversationId)
        } else {
          console.error('Error creating conversation:', insertError)
          return NextResponse.json(
            { 
              error: 'Failed to create conversation', 
              details: insertError.message,
              hint: insertError.hint || 'Check if conversations table exists and has columns: seller_id, buyer_id, gig_id, twilio_conversation_sid, status'
            },
            { status: 500 }
          )
        }
      } else {
        dbConversationId = created?.id
        console.log('[API] Created new conversation:', dbConversationId, created)
      }
    }

    if (!dbConversationId) {
      console.error('[API] No conversation ID after processing')
      return NextResponse.json(
        { error: 'Failed to get conversation ID' },
        { status: 500 }
      )
    }

    console.log('[API] Returning conversation:', { dbConversationId, conversationSid: twilioResult.conversationSid })
    return NextResponse.json({
      conversationSid: twilioResult.conversationSid,
      dbConversationId,
      uniqueName: twilioResult.uniqueName,
    })
  } catch (error: any) {
    console.error('Error in /api/chat/conversations:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
