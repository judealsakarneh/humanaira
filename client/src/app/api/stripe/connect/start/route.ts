import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServer } from '../../../lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ ok: false, error: 'Payments not configured' }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    
    // Determine if we're in live mode based on the Stripe key
    const isLive = (process.env.STRIPE_SECRET_KEY ?? '').startsWith('sk_live_')

    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 })

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, stripe_account_id_live, stripe_account_id_test')
      .eq('id', user.id)
      .single()
    if (error || !profile) return NextResponse.json({ ok: false, error: 'Profile not found' }, { status: 404 })

    const columnName = isLive ? 'stripe_account_id_live' : 'stripe_account_id_test'
    let accountId = (profile as any)[columnName] as string | null

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: profile.email || undefined,
      })
      accountId = account.id
      await supabase
        .from('profiles')
        .update({ [columnName]: accountId })
        .eq('id', profile.id)
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const link = await stripe.accountLinks.create({
      account: accountId!,
      refresh_url: `${baseUrl}/dashboard/billing?refresh=1`,
      return_url: `${baseUrl}/dashboard/billing?connected=1`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ ok: true, url: link.url })
  } catch (e: any) {
    console.error('Connect start error:', e?.message || e)
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}