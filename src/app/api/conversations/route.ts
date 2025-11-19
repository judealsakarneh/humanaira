import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
// import twilio from 'twilio' // Uncomment when ready for Twilio integration

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    console.log('API /api/conversations POST body:', body)
    const { buyer_id, seller_id, gig_id } = body

    if (!buyer_id || !seller_id) {
      console.error('Missing buyer_id or seller_id')
      return NextResponse.json({ error: 'buyer_id and seller_id required' }, { status: 400 })
    }
    if (buyer_id === seller_id) {
      console.error('buyer_id and seller_id are the same')
      return NextResponse.json({ error: 'Cannot chat with yourself' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error('Supabase env not configured')
      return NextResponse.json({ error: 'Server env not configured' }, { status: 500 })
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } })

    // Find existing conversation
    let query = supabase
      .from('conversations')
      .select('id')
      .eq('seller_id', seller_id)
      .eq('buyer_id', buyer_id)

    query = gig_id == null ? query.is('gig_id', null) : query.eq('gig_id', gig_id)

    const { data: existing, error: findErr } = await query.limit(1).maybeSingle()
    if (findErr) {
      console.error('Supabase findErr:', findErr)
      return NextResponse.json({ error: findErr.message }, { status: 500 })
    }
    if (existing) {
      console.log('Found existing conversation:', existing.id)
      return NextResponse.json({ id: existing.id }, { status: 200 })
    }

    // --- Twilio integration (optional, for future) ---
    // const accountSid = process.env.TWILIO_ACCOUNT_SID
    // const apiKey = process.env.TWILIO_API_KEY
    // const apiSecret = process.env.TWILIO_API_SECRET
    // const chatServiceSid = process.env.TWILIO_CHAT_SERVICE_SID
    // const twilioClient = twilio(accountSid, apiKey, apiSecret)
    // const twilioConversation = await twilioClient.conversations.conversations.create({
    //   friendlyName: `Gig ${gig_id} - ${buyer_id} & ${seller_id}`,
    // })
    // await twilioClient.conversations.conversations(twilioConversation.sid)
    //   .participants.create({ identity: buyer_id })
    // await twilioClient.conversations.conversations(twilioConversation.sid)
    //   .participants.create({ identity: seller_id })
    // const twilio_sid = twilioConversation.sid

    // Create new conversation in Supabase
    const insertRow = { seller_id, buyer_id, gig_id: gig_id ?? null, status: 'open' /*, twilio_sid */ }
    const { data: created, error: insertErr } = await supabase
      .from('conversations')
      .insert([insertRow])
      .select('id')
      .single()

    if (insertErr) {
      console.error('Supabase insertErr:', insertErr)
      // Race fallback
      let again = supabase
        .from('conversations')
        .select('id')
        .eq('seller_id', seller_id)
        .eq('buyer_id', buyer_id)

      again = gig_id == null ? again.is('gig_id', null) : again.eq('gig_id', gig_id)

      const { data: after } = await again.limit(1).maybeSingle()
      if (after) {
        console.log('Race fallback found conversation:', after.id)
        return NextResponse.json({ id: after.id }, { status: 200 })
      }
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    console.log('Created new conversation:', created.id)
    return NextResponse.json({ id: created.id }, { status: 200 })
  } catch (e: any) {
    console.error('conversations POST error', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}