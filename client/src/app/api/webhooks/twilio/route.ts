import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

/**
 * POST /api/webhooks/twilio
 * 
 * Twilio webhook endpoint for Conversation events
 * Persists message data to the database for durability and search
 * 
 * Events handled:
 * - onMessageAdded: Store new message in DB
 * - onMessageUpdated: Update message in DB  
 * - onMessageRemoved: Mark message as deleted
 */

// Verify Twilio signature for security
function validateTwilioSignature(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, any>
): boolean {
  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url)

  const hmac = crypto
    .createHmac('sha1', authToken)
    .update(Buffer.from(data, 'utf-8'))
    .digest('base64')

  return hmac === signature
}

export async function POST(req: NextRequest) {
  try {
    // Parse form data from Twilio webhook
    const formData = await req.formData()
    const params: Record<string, any> = {}
    formData.forEach((value, key) => {
      params[key] = value
    })

    // Verify Twilio signature (important for security!)
    const twilioSignature = req.headers.get('x-twilio-signature')
    const authToken = process.env.TWILIO_AUTH_TOKEN

    if (!authToken) {
      console.error('TWILIO_AUTH_TOKEN not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const url = req.url
    if (twilioSignature && !validateTwilioSignature(authToken, twilioSignature, url, params)) {
      console.error('Invalid Twilio signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    // Initialize Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    const eventType = params.EventType
    const conversationSid = params.ConversationSid
    const messageSid = params.MessageSid
    const author = params.Author
    const body = params.Body
    const dateCreated = params.DateCreated

    // Find conversation by Twilio SID
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .eq('twilio_conversation_sid', conversationSid)
      .single()

    if (convError || !conversation) {
      console.warn(`Conversation not found for SID: ${conversationSid}`)
      // Still return 200 so Twilio doesn't retry
      return NextResponse.json({ status: 'conversation_not_found' })
    }

    const conversationId = conversation.id

    // Handle different event types
    switch (eventType) {
      case 'onMessageAdded': {
        // Insert message into database
        const { error: insertError } = await supabase
          .from('messages')
          .insert([{
            conversation_id: conversationId,
            sender_id: author, // This is the Supabase user ID
            text: body || null,
            twilio_message_sid: messageSid,
            attachments: [], // TODO: Handle attachments if needed
            is_system: false,
            created_at: dateCreated ? new Date(dateCreated).toISOString() : new Date().toISOString()
          }])

        if (insertError) {
          console.error('Error inserting message:', insertError)
          // Check if it's a duplicate
          if (insertError.code !== '23505') { // Unique violation
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
          }
        }

        // Update conversation's updated_at timestamp
        await supabase
          .from('conversations')
          .update({ 
            updated_at: new Date().toISOString(),
            last_message: body?.substring(0, 100) || null
          })
          .eq('id', conversationId)

        break
      }

      case 'onMessageUpdated': {
        // Update message in database
        await supabase
          .from('messages')
          .update({
            text: body || null,
            updated_at: new Date().toISOString()
          })
          .eq('twilio_message_sid', messageSid)
        break
      }

      case 'onMessageRemoved': {
        // Mark message as deleted
        await supabase
          .from('messages')
          .update({
            deleted_at: new Date().toISOString()
          })
          .eq('twilio_message_sid', messageSid)
        break
      }

      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal error' },
      { status: 500 }
    )
  }
}
