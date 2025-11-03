import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServer } from '../lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PLATFORM_FEE_PERCENT = Number(process.env.PLATFORM_FEE_PERCENT || 20)

export async function POST(req: Request) {
  try {
    // Check for Stripe key at runtime
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: 'Stripe not configured' }, { status: 500 })
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    
    const supabase = createSupabaseServer()
    const { data: userRes } = await supabase.auth.getUser()
    if (!userRes?.user) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 })
    const buyer = userRes.user

    const { gig: gigIdRaw, tier = 'Base' } = await req.json()
    const gigId = String(gigIdRaw || '')
    if (!gigId) return NextResponse.json({ ok: false, error: 'Missing gig' }, { status: 400 })

    const { data: gig } = await supabase
      .from('gigs')
      .select('id, title, slug, seller_id')
      .eq('id', gigId)
      .single()
    if (!gig) return NextResponse.json({ ok: false, error: 'Gig not found' }, { status: 404 })

    const { data: seller } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', gig.seller_id)
      .single()
    if (!seller?.stripe_account_id) {
      return NextResponse.json({ ok: false, error: 'Seller not connected to Stripe' }, { status: 400 })
    }

    const { data: pkg } = await supabase
      .from('gig_packages')
      .select('price_cents, tier, description')
      .eq('gig_id', gig.id)
      .eq('tier', tier)
      .single()
    if (!pkg) return NextResponse.json({ ok: false, error: 'Package not found' }, { status: 404 })

    const amount = Math.max(0, Math.floor(Number(pkg.price_cents) || 0))
    if (amount <= 0) return NextResponse.json({ ok: false, error: 'Invalid package amount' }, { status: 400 })
    const fee = Math.round(amount * (PLATFORM_FEE_PERCENT / 100))

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
            unit_amount: amount,
            product_data: {
              name: `${gig.title} — ${pkg.tier}`,
              description: pkg.description || undefined,
              metadata: {
                gigId: String(gig.id),
                tier: String(pkg.tier),
                sellerId: String(gig.seller_id),
              },
            },
          },
        },
      ],
      payment_intent_data: {
        application_fee_amount: fee,
        transfer_data: { destination: seller.stripe_account_id },
        metadata: {
          gigId: String(gig.id),
          buyerId: String(buyer.id),
          sellerId: String(gig.seller_id),
          tier: String(pkg.tier),
        },
      },
      metadata: {
        gigId: String(gig.id),
        buyerId: String(buyer.id),
        sellerId: String(gig.seller_id),
        tier: String(pkg.tier),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&gig=${encodeURIComponent(
        String(gig.id)
      )}&slug=${encodeURIComponent(String(gig.slug || ''))}`,
      cancel_url: `${baseUrl}/checkout?gig=${encodeURIComponent(
        String(gig.id)
      )}&slug=${encodeURIComponent(String(gig.slug || ''))}&title=${encodeURIComponent(
        gig.title
      )}&tier=${encodeURIComponent(pkg.tier)}&price_cents=${amount}`,
    })

    return NextResponse.json({ ok: true, url: session.url }, { status: 200 })
  } catch (err: any) {
    console.error('Create checkout session error:', err?.message || err)
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 })
  }
}