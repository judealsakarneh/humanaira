import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function getStripe() {
  const key = process.env.STRIPE_SECRET
  if (!key) throw new Error('STRIPE_SECRET not set')
  const Stripe = (await import('stripe')).default
  return new Stripe(key, {
    apiVersion: (process.env.STRIPE_API_VERSION ?? undefined) as any,
  })
}

export async function POST(req: Request) {
  // Ensure required envs configured at runtime; return controlled error if not
  const stripeSecret = process.env.STRIPE_SECRET
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeSecret || !stripeWebhookSecret) {
    console.error('Stripe webhook called but STRIPE_SECRET or STRIPE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'stripe not configured' }, { status: 500 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  // Initialize stripe lazily so constructor is not executed at module import time
  let stripe
  try {
    stripe = await getStripe()
  } catch (e: any) {
    console.error('Stripe init error:', e?.message ?? e)
    return NextResponse.json({ error: 'stripe not configured' }, { status: 500 })
  }

  // Read raw body for signature verification
  const buf = await req.arrayBuffer()
  const rawBody = Buffer.from(buf)

  let event: any
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret)
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err?.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    // Lazy-import supabaseServer to avoid any top-level side-effects during build
    const { supabaseServer } = await import('../../../../lib/supabaseServer')

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any
      const requestId = session?.metadata?.payment_request_id || session?.metadata?.request_id

      if (requestId) {
        // 1) mark payment_requests as paid
        const { data: pr, error: prErr } = await supabaseServer
          .from('payment_requests')
          .update({ status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', requestId)
          .select()
          .single()

        if (prErr) {
          console.error('Failed to update payment_request:', prErr)
        }

        // 2) ensure we have the payment row (fetch if update didn't return it)
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
          if (convId) {
            const { error: convErr } = await supabaseServer
              .from('conversations')
              .update({ status: 'ordered', updated_at: new Date().toISOString() })
              .eq('id', convId)
            if (convErr) console.error('Failed to update conversation status to ordered:', convErr)
          }

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
        console.warn('checkout.session.completed received without payment_request_id metadata')
      }
    } else if (event.type === 'payment_intent.succeeded') {
      // optionally handle other event types
    }
  } catch (err: any) {
    console.error('Error handling stripe webhook event:', err)
    return NextResponse.json({ error: err?.message ?? 'webhook handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}