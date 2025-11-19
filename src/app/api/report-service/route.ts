import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Optional SMTP email helper. It only attempts to import nodemailer
// if SMTP envs are present. If nodemailer is not installed, the import
// is skipped safely.
async function trySendEmail({
  to,
  subject,
  text,
}: {
  to: string
  subject: string
  text: string
}) {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || 'no-reply@humanaira.com'

  // If SMTP isn’t configured, do nothing (we rely on mailto fallback).
  if (!host || !port || !user || !pass) return

  // Try to import nodemailer only when needed
  let nodemailerMod: any
  try {
    nodemailerMod = await import('nodemailer')
  } catch {
    // nodemailer not installed – skip silently
    return
  }

  const nodemailer = nodemailerMod?.default ?? nodemailerMod
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for others
    auth: { user, pass },
  })

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      slug = '',
      gig_id = '',
      title = '',
      reason = '',
      details = '',
      page_url = '',
    } = body || {}

    const lines = [
      'New service report received:',
      `Title: ${title}`,
      `Slug: ${slug}`,
      `Gig ID: ${gig_id}`,
      `URL: ${page_url}`,
      `Reason: ${reason}`,
      'Details:',
      details || '(none)',
    ]
    const text = lines.join('\n')

    // Attempt SMTP if configured (safe no-op otherwise)
    await trySendEmail({
      to: 'hello@humanaira.com',
      subject: `Report: ${title || slug || 'Humanaira Service'}`,
      text,
    })

    // You could also persist this to DB here if desired.

    // Always respond ok so the client can open the mailto fallback confidently
    return NextResponse.json({ ok: true })
  } catch {
    // Still respond ok to allow the mailto fallback UX
    return NextResponse.json({ ok: true })
  }
}