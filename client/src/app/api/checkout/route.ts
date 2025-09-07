"use server"
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../lib/supabaseServer'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set')
}
const stripe = new Stripe(stripeSecretKey)

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { gigId, tier } = await req.json()
  // Fetch gig + package + seller
  const { data: gig } = await supabase.from('gigs').select('id,title,seller_id').eq('id', gigId).single()
  if (!gig) return NextResponse.json({ error: 'Gig not found' }, { status: 404 })

  const { data: seller } = await supabase.from('profiles').select('stripe_account_id').eq('id', gig.seller_id).single()
  if (!seller?.stripe_account_id) return NextResponse.json({ error: 'Seller not connected to Stripe' }, { status: 400 })

  const { data: pkg } = await supabase
    .from('gig_packages')
    .select('price_cents')
    .eq('gig_id', gigId).eq('tier', tier).single()
  if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 })

  const amount = pkg.price_cents
  const fee = Math.round(amount * (Number(process.env.PLATFORM_FEE_PERCENT || 20) / 100))

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    application_fee_amount: fee,
    transfer_data: { destination: seller.stripe_account_id },
    metadata: { gigId, buyerId: user.id, sellerId: gig.seller_id, tier }
  })

  // create order in PLACED
  await supabase.from('orders').insert({
    buyer_id: user.id,
    seller_id: gig.seller_id,
    gig_id: gig.id,
    package: tier,
    price_cents: amount,
    status: 'PLACED',
    stripe_payment_intent_id: paymentIntent.id
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}