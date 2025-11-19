import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createSupabaseServer } from '../../lib/supabaseServer'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
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

  const link = await stripe.accountLinks.create({
    account: accountId!,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/payouts`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/payouts?connected=1`,
    type: 'account_onboarding'
  })
  return NextResponse.json({ url: link.url })
}