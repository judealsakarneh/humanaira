import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createSupabaseServer } from '../../lib/supabaseServer'

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

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing STRIPE_SECRET_KEY environment variable for Stripe connect route')
      return NextResponse.json(
        { error: 'Payments are temporarily unavailable. Please try again later.' },
        { status: 500 }
      )
    }

    const stripe = getStripe()
    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // fetch profile
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

    let accountId = profile.stripe_account_id as string | null
    if (!accountId) {
      const account = await stripe.accounts.create({ type: 'express' })
      accountId = account.id
      await supabase.from('profiles').update({ stripe_account_id: accountId }).eq('id', user.id)
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const link = await stripe.accountLinks.create({
      account: accountId!,
      refresh_url: `${baseUrl}/seller/payouts`,
      return_url: `${baseUrl}/seller/payouts?connected=1`,
      type: 'account_onboarding'
    })
    return NextResponse.json({ url: link.url })
  } catch (err: any) {
    console.error('Stripe connect route error:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Payments are temporarily unavailable. Please try again later.' },
      { status: 500 }
    )
  }
}
