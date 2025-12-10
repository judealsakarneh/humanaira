import { NextResponse } from 'next/server'
import { createSupabaseServer } from '../../lib/supabaseServer'
import { sendEmail } from '../../lib/mailer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PAYOUT_MIN_CENTS = Number(process.env.PAYOUT_MIN_CENTS || 1000) // $10 default

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: userRes } = await supabase.auth.getUser()
    if (!userRes?.user) return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 })
    const sellerId = userRes.user.id

    const body = await req.json().catch(() => ({}))
    const amount_cents = Math.floor(Number(body.amount_cents || 0))

    // Load profile and current balances
    const [{ data: prof }, { data: bal }] = await Promise.all([
      supabase.from('profiles').select('email, country, payout_method, wise_currency, bank_holder_name, bank_country, iban, bank_account_number, bank_swift_bic, bank_name, bank_city, bank_additional_info').eq('id', sellerId).maybeSingle(),
      supabase.from('seller_balances').select('available_cents, pending_cents').eq('seller_id', sellerId).maybeSingle(),
    ])
    if (!prof) return NextResponse.json({ ok: false, error: 'Profile not found' }, { status: 404 })

    // Must have country and bank details for manual payout
    const currency = (prof.wise_currency || 'USD').toUpperCase()
    const available = Number(bal?.available_cents || 0)
    const amount = amount_cents > 0 ? amount_cents : available

    if (!prof.country) {
      return NextResponse.json({ ok: false, error: 'Please set your country in Settings before withdrawing.' }, { status: 400 })
    }
    if (amount < PAYOUT_MIN_CENTS) {
      return NextResponse.json({ ok: false, error: `Minimum withdrawal is ${(PAYOUT_MIN_CENTS / 100).toFixed(2)}` }, { status: 400 })
    }
    if (amount > available) {
      return NextResponse.json({ ok: false, error: 'Amount exceeds your available balance.' }, { status: 400 })
    }

    // Require essential bank fields (IBAN OR account_number + SWIFT/BIC)
    const hasIban = Boolean((prof.iban || '').trim())
    const hasLocal = Boolean((prof.bank_account_number || '').trim() && (prof.bank_swift_bic || '').trim())
    if (!hasIban && !hasLocal) {
      return NextResponse.json({ ok: false, error: 'Please add your IBAN or your Account Number + SWIFT/BIC in Settings.' }, { status: 400 })
    }
    if (!prof.bank_holder_name || !prof.bank_country) {
      return NextResponse.json({ ok: false, error: 'Please add your account holder name and bank country in Settings.' }, { status: 400 })
    }

    // Move available -> pending and create payout
    await supabase.from('seller_balances').upsert({
      seller_id: sellerId,
      available_cents: available - amount,
      pending_cents: Number(bal?.pending_cents || 0) + amount,
    }, { onConflict: 'seller_id' })

    const { data: payout, error: payoutErr } = await supabase
      .from('payouts')
      .insert({
        seller_id: sellerId,
        amount_cents: amount,
        currency,
        status: 'requested',
      })
      .select('id, created_at')
      .single()
    if (payoutErr) throw payoutErr

    // Ledger "hold" entry
    await supabase.from('ledger_transactions').insert({
      seller_id: sellerId,
      type: 'payout',
      amount_cents: -amount, // hold
      currency: currency.toLowerCase(),
      source: `manual:requested:${payout.id}`,
    })

    // Email admin
    const adminEmail = 'jude@humanaira.com'
    const html = `
      <div style="font-family:system-ui,sans-serif">
        <h2>New Withdrawal Request</h2>
        <p><b>Payout ID:</b> ${payout.id}</p>
        <p><b>Seller:</b> ${prof.email || sellerId}</p>
        <p><b>Amount:</b> ${(amount / 100).toFixed(2)} ${currency}</p>
        <p><b>Country:</b> ${prof.country}</p>
        <hr />
        <h3>Bank Details</h3>
        <p><b>Holder Name:</b> ${prof.bank_holder_name || ''}</p>
        <p><b>Bank Country:</b> ${prof.bank_country || ''}</p>
        <p><b>IBAN:</b> ${prof.iban || '-'}</p>
        <p><b>Account Number:</b> ${prof.bank_account_number || '-'}</p>
        <p><b>SWIFT/BIC:</b> ${prof.bank_swift_bic || '-'}</p>
        <p><b>Bank Name:</b> ${prof.bank_name || '-'}</p>
        <p><b>Bank City:</b> ${prof.bank_city || '-'}</p>
        <p><b>Additional Info:</b> ${prof.bank_additional_info || '-'}</p>
      </div>
    `
    await sendEmail({
      to: adminEmail,
      subject: `Withdrawal request ${payout.id} — ${(amount / 100).toFixed(2)} ${currency}`,
      html,
    })

    return NextResponse.json({ ok: true, payout_id: payout.id, amount_cents: amount })
  } catch (e: any) {
    console.error('Payout request error:', e?.message || e)
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}