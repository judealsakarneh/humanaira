import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServer } from '../../lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

// Do NOT pin apiVersion to avoid TS error; the SDK types reflect the latest API version
const stripe = new Stripe(STRIPE_SECRET_KEY)

export async function POST(req: Request) {
  try {
    if (!STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 500 })
    }

    // Stripe requires the raw body for signature verification
    const sig = req.headers.get('stripe-signature') || ''
    const raw = Buffer.from(await req.arrayBuffer())

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET)
    } catch (err: any) {
      return new NextResponse(`Webhook signature verification failed: ${err.message}`, { status: 400 })
    }

    const supabase = createSupabaseServer()

    switch (event.type) {
      // For the Checkout Session flow (recommended)
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Extract the PaymentIntent id created by Checkout
        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id

        // Metadata we set when creating the session (gigId, buyerId, sellerId, tier)
        const md = session.metadata || {}
        const gigId = md.gigId || null
        const buyerId = md.buyerId || null
        const sellerId = md.sellerId || null
        const tier = md.tier || null

        // Amount paid (in cents). Prefer amount_total from the session.
        const amount = Number(session.amount_total ?? 0)

        if (paymentIntentId) {
          // If an order already exists for this PI, update status
          const { data: existing } = await supabase
            .from('orders')
            .select('id')
            .eq('stripe_payment_intent_id', paymentIntentId)
            .maybeSingle()

          if (existing?.id) {
            await supabase
              .from('orders')
              .update({ status: 'IN_PROGRESS' })
              .eq('id', existing.id)
          } else if (gigId && buyerId && sellerId && tier) {
            // Otherwise, create the order now
            await supabase.from('orders').insert({
              buyer_id: buyerId,
              seller_id: sellerId,
              gig_id: gigId,
              package: tier,
              price_cents: amount > 0 ? amount : null,
              status: 'IN_PROGRESS',
              stripe_payment_intent_id: paymentIntentId,
            })
          }
        }
        break
      }

      // For your original Payment Intent + Elements flow (still supported)
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await supabase
          .from('orders')
          .update({ status: 'IN_PROGRESS' })
          .eq('stripe_payment_intent_id', paymentIntent.id)
        break
      }

      default:
        // no-op for other events
        break
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('Webhook error', e)
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}