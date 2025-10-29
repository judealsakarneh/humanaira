import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

async function getStripe() {
  const stripeKey = process.env.STRIPE_SECRET
  if (!stripeKey) throw new Error('STRIPE_SECRET not set')
  // dynamic import so Stripe constructor is not evaluated at module import time
  const StripeMod = (await import('stripe')).default
  return new StripeMod(stripeKey, {
    apiVersion: (process.env.STRIPE_API_VERSION ?? undefined) as any,
  })
}

export async function POST(req: Request) {
  try {
    // Lazy-import supabase server to avoid module-eval side-effects at build time
    const { supabaseServer } = await import('@/lib/supabaseServer')

    // Create stripe inside handler (will throw if missing and we'll catch it)
    let stripe
    try {
      stripe = await getStripe()
    } catch (e: any) {
      console.error('Stripe init error:', e?.message ?? e)
      return NextResponse.json({ error: 'stripe not configured' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const { payment_request_id, success_url, cancel_url } = body

    if (!payment_request_id) return NextResponse.json({ error: 'payment_request_id required' }, { status: 400 })

    // Fetch the payment_request row (service role bypasses RLS)
    const { data: prRows, error: prErr } = await supabaseServer
      .from('payment_requests')
      .select('*')
      .eq('id', payment_request_id)
      .limit(1)

    if (prErr) {
      console.error('Failed to fetch payment_request', prErr)
      return NextResponse.json({ error: 'db error' }, { status: 500 })
    }
    const pr = prRows?.[0]
    if (!pr) return NextResponse.json({ error: 'payment_request not found' }, { status: 404 })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: pr.currency ?? 'usd',
            product_data: {
              name: `Payment request #${pr.id}`,
              description: `Payment for conversation ${pr.conversation_id}`,
            },
            unit_amount: pr.amount_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url ?? `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url ?? `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/payments/cancel`,
      metadata: {
        payment_request_id: pr.id,
        conversation_id: pr.conversation_id ?? '',
        from_id: pr.from_id ?? '',
        to_id: pr.to_id ?? '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('create-session error', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}