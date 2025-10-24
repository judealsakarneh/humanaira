import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'newsletter@your-domain.com'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const { email, source = 'blog' } = await req.json()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ ok: false, error: 'Server is not configured' }, { status: 500 })
    }

    const ip =
      (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '').split(',')[0]?.trim() ||
      undefined

    // Use service role on the server to bypass RLS safely
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Upsert subscriber (dedupe by email)
    const { error: upsertError } = await supabase
      .from('subscribers')
      .upsert(
        { email, source, ip, confirmed_at: null },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    if (upsertError) {
      // If unique constraint violation or similar, we still respond OK
      // so users don’t get an error when already subscribed.
      if (!String(upsertError.message).toLowerCase().includes('duplicate')) {
        return NextResponse.json({ ok: false, error: upsertError.message }, { status: 500 })
      }
    }

    // Send a real email via Resend (welcome/confirm)
    if (!resend || !process.env.RESEND_API_KEY) {
      // If email provider not configured, still succeed but mention it
      return NextResponse.json({ ok: true, message: 'Subscribed (email not sent: provider not configured)' })
    }

    const html = `
      <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #0b1220;">
        <h2>Welcome to the AI Services Journal 👋</h2>
        <p>Thanks for subscribing to Humanaira’s weekly digest.</p>
        <p>You’ll get practical playbooks, case studies, and market intel for AI freelancers and buyers.</p>
        <p style="margin-top: 16px;">— Team Humanaira</p>
      </div>
    `

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: 'Welcome to Humanaira — AI Services Journal',
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 })
  }
}