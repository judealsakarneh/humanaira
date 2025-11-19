import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { amount_cents, currency = 'usd', metadata = {} } = body

    if (!process.env.STRIPE_SECRET) {
      return NextResponse.json({ error: 'Stripe not configured (missing STRIPE_SECRET)' }, { status: 500 })
    }
    if (!amount_cents || typeof amount_cents !== 'number') {
      return NextResponse.json({ error: 'Invalid amount_cents' }, { status: 400 })
    }

    const stripeSecret = process.env.STRIPE_SECRET

    // You can optionally set STRIPE_API_VERSION in your environment to explicitly control the version.
    // Example: STRIPE_API_VERSION=2025-08-27.basil
    // Because TypeScript's Stripe types currently expect a specific literal, we cast apiVersion to `any`.
    const apiVersionEnv = process.env.STRIPE_API_VERSION
    const stripe = new Stripe(stripeSecret, {
      // cast to any to avoid TS literal mismatch while still allowing runtime control
      apiVersion: (apiVersionEnv ?? undefined) as any,
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: 'Chat payment' },
            unit_amount: amount_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/payments/cancel`,
      metadata,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('create-session error', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}