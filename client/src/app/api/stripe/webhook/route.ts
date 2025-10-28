import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseServer } from '../../../../lib/supabaseServer'

export const runtime = 'nodejs'

// Ensure STRIPE_SECRET and STRIPE_WEBHOOK_SECRET are set in env
const stripeSecret = process.env.STRIPE_SECRET
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const stripe = new Stripe(stripeSecret ?? '', {
  apiVersion: (process.env.STRIPE_API_VERSION ?? undefined) as any,
})

/**
 * Webhook handler for Stripe events.
 * - Validates signature with STRIPE_WEBHOOK_SECRET
 * - On checkout.session.completed: if metadata.payment_request_id (or request_id) is present,
 *   mark payment_requests as paid, update conversations.status='ordered', and insert a system message.
 */
export async function POST(req: Request) {
  if (!stripeSecret || !stripeWebhookSecret) {
    console.error('Stripe webhook called but STRIPE_SECRET or STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'stripe not configured' }, { status: 500 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // Read raw body
  const buf = await req.arrayBuffer()
  const rawBody = Buffer.from(buf)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret)
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err?.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    // Handle relevant event types
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      // metadata may include payment_request id (we set metadata when creating session)
      const requestId = (session.metadata as any)?.payment_request_id || (session.metadata as any)?.request_id

      if (requestId) {
        // mark payment_request as paid and insert system message + update conversation.status
        // Use supabaseServer (service role) to bypass RLS
        // 1) update payment_requests
        const { data: pr, error: prErr } = await supabaseServer
          .from('payment_requests')
          .update({ status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', requestId)
          .select()
          .single()

        if (prErr) {
          console.error('Failed to update payment_request:', prErr)
          // continue so we try to insert message if we can fetch pr separately
        }

        // If we have pr, use its conversation_id and participants; otherwise attempt to fetch row
        let paymentRow = pr
        if (!paymentRow) {
          const { data: fetched, error: fetchErr } = await supabaseServer
            .from('payment_requests')
            .select('*')
            .eq('id', requestId)
            .limit(1)
          if (fetchErr) {
            console.error('Failed to fetch payment_request after update attempt:', fetchErr)
          } else {
            paymentRow = fetched?.[0]
          }
        }

        if (paymentRow) {
          const convId = paymentRow.conversation_id
          // 2) update conversation.status = 'ordered' (so chats are easily filterable)
          if (convId) {
            const { error: convErr } = await supabaseServer
              .from('conversations')
              .update({ status: 'ordered', updated_at: new Date().toISOString() })
              .eq('id', convId)
            if (convErr) console.error('Failed to update conversation status to ordered:', convErr)
          }

          // 3) insert a system message into messages
          // We'll use the receiver (to_id) as sender_id for the system message to keep sender_id not null.
          // Mark is_system=true to indicate a system-generated message.
          const systemText = `Payment received: ${(paymentRow.amount_cents / 100).toFixed(2)} ${paymentRow.currency?.toUpperCase() || 'USD'}. Payment request #${paymentRow.id} marked as paid.`

          const { error: msgErr } = await supabaseServer
            .from('messages')
            .insert([
              {
                conversation_id: convId,
                sender_id: paymentRow.to_id || paymentRow.from_id,
                text: systemText,
                attachments: [],
                is_system: true,
                created_at: new Date().toISOString(),
              },
            ])
          if (msgErr) console.error('Failed to insert system message after payment:', msgErr)
        } else {
          console.warn('Payment request row not found after webhook for id=', requestId)
        }
      } else {
        // No request id in metadata — nothing to do
        console.warn('checkout.session.completed received without payment_request_id metadata')
      }
    } else if (event.type === 'payment_intent.succeeded') {
      // Optionally handle payment intents if you use them
      // const pi = event.data.object as Stripe.PaymentIntent
      // console.log('Payment intent succeeded', pi.id)
    }
    // You may handle other event types as needed (refunds, disputes, etc.)
  } catch (err: any) {
    console.error('Error handling stripe webhook event:', err)
    return NextResponse.json({ error: err?.message ?? 'webhook handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}