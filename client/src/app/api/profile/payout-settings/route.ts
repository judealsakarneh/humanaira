import { NextResponse } from 'next/server'
import { createSupabaseServer } from '../../lib/supabaseServer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Login required' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({} as any))
    const allowedKeys = [
      'payout_method',         // 'paypal' | 'bank'
      'paypal_email',
      'country',               // ISO-2 user country
      'wise_currency',         // payout currency, e.g. USD/EUR
      'bank_holder_name',
      'bank_country',          // ISO-2 bank country
      'iban',
      'bank_account_number',
      'bank_swift_bic',
      'bank_name',
      'bank_city',
      'bank_additional_info',
    ] as const

    const payload: Record<string, any> = {}
    for (const k of allowedKeys) {
      if (Object.prototype.hasOwnProperty.call(body, k)) {
        payload[k] = body[k]
      }
    }

    // Basic validation
    if (payload.payout_method && !['paypal', 'bank'].includes(String(payload.payout_method))) {
      return NextResponse.json({ ok: false, error: 'Invalid payout_method' }, { status: 400 })
    }
    if (payload.payout_method === 'paypal') {
      const email = String(payload.paypal_email || '')
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ ok: false, error: 'Valid PayPal email required' }, { status: 400 })
      }
    }
    if (payload.payout_method === 'bank') {
      // We don’t force all bank fields here; the Withdraw flow will check before requesting payout.
      if (payload.country) payload.country = String(payload.country).toUpperCase()
      if (payload.bank_country) payload.bank_country = String(payload.bank_country).toUpperCase()
      if (payload.wise_currency) payload.wise_currency = String(payload.wise_currency).toUpperCase()
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ ok: false, error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', user.id)
      .select('payout_method, paypal_email, country, wise_currency, bank_holder_name, bank_country, iban, bank_account_number, bank_swift_bic, bank_name, bank_city, bank_additional_info')
      .single()

    if (error) {
      console.error('payout-settings update error:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, data })
  } catch (e: any) {
    console.error('payout-settings route error:', e?.message || e)
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}