/**
 * Server API route to create a conversation for an order.
 * Use this from your order creation flow so every new order has an associated conversation.
 *
 * POST body example:
 * {
 *   "order_id":"<order-id>",
 *   "gig_id":"<gig-id>",
 *   "seller_id":"<seller-uuid>",
 *   "buyer_id":"<buyer-uuid>"
 * }
 *
 * This will:
 *  - create a conversation if not exists for that gig & participants
 *  - return the conversation row
 *
 * NOTE: This route uses SUPABASE_SERVICE_ROLE and should be protected (only your backend/orders service should call it).
 */
import { NextResponse } from 'next/server'
import { supabaseServer } from '../../../../lib/supabaseServer'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { gig_id, seller_id, buyer_id, order_id } = body

    if (!seller_id || !buyer_id) {
      return NextResponse.json({ error: 'seller_id and buyer_id required' }, { status: 400 })
    }

    // Try to find existing conversation for these participants + gig
    const { data: existing, error: e1 } = await supabaseServer
      .from('conversations')
      .select('*')
      .eq('gig_id', gig_id ?? null)
      .eq('seller_id', seller_id)
      .eq('buyer_id', buyer_id)
      .limit(1)

    if (e1) {
      console.error('Error checking existing conversation', e1)
      return NextResponse.json({ error: 'db error' }, { status: 500 })
    }

    if (existing && existing.length > 0) {
      // Optionally: update metadata to include order reference
      const conv = existing[0]
      if (order_id) {
        await supabaseServer.from('conversations').update({ metadata: { ...(conv.metadata || {}), order_id } }).eq('id', conv.id)
      }
      return NextResponse.json({ conversation: conv })
    }

    // create new conversation
    const payload: any = {
      gig_id: gig_id ?? null,
      seller_id,
      buyer_id,
      status: 'ordered' /* since this was created as part of an order flow, mark ordered */,
      metadata: { order_id: order_id ?? null },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: created, error: insErr } = await supabaseServer.from('conversations').insert([payload]).select().single()
    if (insErr) {
      console.error('Failed to create conversation', insErr)
      return NextResponse.json({ error: 'failed to create conversation' }, { status: 500 })
    }

    // insert a system message to kick off the conversation (optional)
    try {
      const systemText = `Conversation opened for order ${order_id ?? ''}. Use this chat to discuss the order.`
      await supabaseServer.from('messages').insert([
        {
          conversation_id: created.id,
          sender_id: buyer_id, // show the buyer as sender for the initial system message if desired
          text: systemText,
          attachments: [],
          is_system: true,
          created_at: new Date().toISOString(),
        },
      ])
    } catch (err) {
      console.error('Failed to insert initial system message for conversation', err)
    }

    return NextResponse.json({ conversation: created })
  } catch (err: any) {
    console.error('create-from-order error', err)
    return NextResponse.json({ error: err?.message ?? 'unknown error' }, { status: 500 })
  }
}