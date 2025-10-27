import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServer } from '../../lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

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
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id

        const md = session.metadata || {}
        const gigId = md.gigId || null
        const buyerId = md.buyerId || null
        const sellerId = md.sellerId || null
        const tier = md.tier || null
        const amount = Number(session.amount_total ?? 0)

        if (paymentIntentId) {
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

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await supabase
          .from('orders')
          .update({ status: 'IN_PROGRESS' })
          .eq('stripe_payment_intent_id', paymentIntent.id)
        break
      }

      default:
        // ignore other events
        break
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('Webhook error', e)
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}