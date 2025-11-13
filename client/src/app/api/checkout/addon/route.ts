import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServer } from '../../lib/supabaseServer'

const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT || 20)

let stripe: Stripe | null = null

const getStripe = () => {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('Payments not configured')
    }
    stripe = new Stripe(secretKey)
  }

  return stripe
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY environment variable for addon checkout route')
      return NextResponse.json(
        { ok: false, error: 'Payments are temporarily unavailable. Please try again later.' },
        { status: 500 }
      )
    }

    const stripe = getStripe()
    const supabase = createSupabaseServer()
    const { data: userRes } = await supabase.auth.getUser()
    if (!userRes?.user) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 })
    const buyer = userRes.user

    const { orderId, title, amount_cents } = await req.json()
    if (!orderId || !amount_cents || amount_cents <= 0) {
      return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 })
    }

    const { data: order } = await supabase
      .from('orders')
      .select('id, seller_id, buyer_id')
      .eq('id', orderId)
      .single()
    if (!order || order.buyer_id !== buyer.id) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
    }

    const { data: seller } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', order.seller_id)
      .single()
    if (!seller?.stripe_account_id) {
      return NextResponse.json({ ok: false, error: 'Seller not connected to Stripe' }, { status: 400 })
    }

    const fee = Math.round(amount_cents * (PLATFORM_FEE_PERCENT / 100))

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: buyer.email || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amount_cents,
            product_data: {
              name: `Add-on — ${title}`,
              metadata: { orderId: String(orderId) },
            },
          },
        },
      ],
      payment_intent_data: {
        application_fee_amount: fee,
        transfer_data: { destination: seller.stripe_account_id },
        metadata: {
          orderId: String(orderId),
          buyerId: String(buyer.id),
          sellerId: String(order.seller_id),
          type: 'addon',
        },
      },
      metadata: {
        orderId: String(orderId),
        buyerId: String(buyer.id),
        sellerId: String(order.seller_id),
        type: 'addon',
      },
      success_url: `${baseUrl}/orders/${orderId}?addon=1&success=1`,
      cancel_url: `${baseUrl}/orders/${orderId}?addon=1&canceled=1`,
    })

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 })
  } catch (err: any) {
    console.error('Addon checkout error:', err?.message || err)
    return NextResponse.json(
      { ok: false, error: err?.message || 'Payments are temporarily unavailable. Please try again later.' },
      { status: 500 }
    )
  }
}
