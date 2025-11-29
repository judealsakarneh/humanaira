'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'

const BRAND = '#35BFFF'

type Faq = {
  q: string
  a: string | ReactNode
}

const faqs: Faq[] = [
  {
    q: 'How do I hire a freelancer?',
    a: (
      <>
        Browse services on the marketplace, open a service you like, and click “Continue” to place an order. You can
        also message sellers with questions before ordering to align on scope and delivery.
      </>
    ),
  },
  {
    q: 'How are payments handled?',
    a: (
      <>
        Payments are processed securely and held in escrow until you approve delivery. If anything isn’t right, request
        revisions or contact support before accepting.
      </>
    ),
  },
  {
    q: 'What if I need revisions?',
    a: (
      <>
        Most gigs include revisions. You can request changes directly in your order workspace. Be clear and specific so
        the seller can deliver the best result quickly.
      </>
    ),
  },
  {
    q: 'How do I contact support?',
    a: (
      <>
        Use the contact form below or email us at{' '}
        <a
          href="mailto:hello@humanaira.com"
          className="underline"
          style={{ color: BRAND }}
        >
          hello@humanaira.com
        </a>
        .
      </>
    ),
  },
]

export default function HelpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<string>('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('Please fill in all fields.')
      return
    }
    setSending(true)
    setStatus('Opening your email app…')

    const subject = encodeURIComponent(`Support request from ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n— Sent from Humanaira Help Center`
    )
    // Open default mail client with prefilled fields
    window.location.href = `mailto:hello@humanaira.com?subject=${subject}&body=${body}`

    setTimeout(() => {
      setSending(false)
      setStatus('If your email app did not open, please email hello@humanaira.com directly.')
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans relative overflow-hidden">
      {/* Brand background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-[160px]" style={{ background: 'rgba(53,191,255,0.22)' }} />
        <div className="absolute bottom-[-10rem] right-[-8rem] w-[34rem] h-[34rem] rounded-full blur-[160px]" style={{ background: 'rgba(53,191,255,0.18)' }} />
      </div>

      {/* Page container */}
      <section className="max-w-5xl mx-auto px-4 py-28">
        {/* Hero */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg,#e2e8f0,${BRAND})` }}>
              Help Center
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-300 mt-3">
            Need assistance? Find quick answers or reach our support team.
          </p>
        </header>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <Link
            href="/browse"
            className="rounded-2xl border bg-slate-900/60 backdrop-blur-md p-4 hover:bg-slate-900/80 transition"
            style={{ borderColor: 'rgba(53,191,255,0.25)' }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: BRAND }}>Browse Services</div>
            <div className="text-xs text-slate-400">Discover top categories and trending gigs</div>
          </Link>
          <Link
            href="/account"
            className="rounded-2xl border bg-slate-900/60 backdrop-blur-md p-4 hover:bg-slate-900/80 transition"
            style={{ borderColor: 'rgba(53,191,255,0.25)' }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: BRAND }}>Your Account</div>
            <div className="text-xs text-slate-400">Profile, settings, and preferences</div>
          </Link>
          <Link
            href="/seller/orders"
            className="rounded-2xl border bg-slate-900/60 backdrop-blur-md p-4 hover:bg-slate-900/80 transition"
            style={{ borderColor: 'rgba(53,191,255,0.25)' }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: BRAND }}>Orders & Payments</div>
            <div className="text-xs text-slate-400">Track orders and payment information</div>
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border bg-slate-900/60 backdrop-blur-md p-4 hover:bg-slate-900/80 transition"
            style={{ borderColor: 'rgba(53,191,255,0.25)' }}
          >
            <div className="text-sm font-semibold mb-1" style={{ color: BRAND }}>Getting Started</div>
            <div className="text-xs text-slate-400">Log in or create an account</div>
          </Link>
        </div>

        {/* FAQ + Contact split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ */}
          <div
            className="rounded-2xl border bg-slate-900/70 backdrop-blur-md p-6"
            style={{ borderColor: 'rgba(53,191,255,0.25)', boxShadow: '0 12px 36px rgba(3,6,16,0.45)' }}
          >
            <h2 className="text-2xl font-bold mb-5">Frequently Asked Questions</h2>

            <div className="space-y-3">
              {faqs.map((item, idx) => (
                <details
                  key={idx}
                  className="group rounded-xl border overflow-hidden"
                  style={{ borderColor: 'rgba(53,191,255,0.18)' }}
                >
                  <summary className="cursor-pointer list-none select-none px-4 py-3 bg-slate-900/60 hover:bg-slate-900/80 transition flex items-start gap-3">
                    <span
                      className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{
                        background: 'rgba(53,191,255,0.18)',
                        color: BRAND,
                        boxShadow: 'inset 0 0 0 1px rgba(53,191,255,0.35)',
                      }}
                    >
                      Q
                    </span>
                    <span className="font-medium text-slate-100">{item.q}</span>
                    <span className="ml-auto text-slate-400 transition group-open:rotate-180">⌄</span>
                  </summary>
                  <div className="px-4 py-3 bg-slate-900/40 text-slate-300 border-t" style={{ borderColor: 'rgba(53,191,255,0.12)' }}>
                    {item.a}
                  </div>
                </details>
              ))}
            </div>

            {/* Still need help */}
            <div className="mt-6 rounded-xl border p-4 text-sm"
              style={{ borderColor: 'rgba(53,191,255,0.18)', background: 'linear-gradient(0deg, rgba(53,191,255,0.06), rgba(53,191,255,0.02))' }}
            >
              Still need help? Contact us below or email{' '}
              <a href="mailto:hello@humanaira.com" className="underline" style={{ color: BRAND }}>
                hello@humanaira.com
              </a>
              .
            </div>
          </div>

          {/* Contact form */}
          <div
            className="rounded-2xl border bg-slate-900/70 backdrop-blur-md p-6"
            style={{ borderColor: 'rgba(53,191,255,0.25)', boxShadow: '0 12px 36px rgba(3,6,16,0.45)' }}
          >
            <h3 className="text-xl font-semibold mb-4" style={{ color: BRAND }}>Contact Support</h3>

            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
              <input
                type="text"
                name="name"
                required
                placeholder="Your Name"
                className="px-4 py-3 rounded-lg border bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2"
                style={{ borderColor: '#334155', boxShadow: 'inset 0 0 0 1px rgba(53,191,255,0.06)' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Your Email"
                className="px-4 py-3 rounded-lg border bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2"
                style={{ borderColor: '#334155', boxShadow: 'inset 0 0 0 1px rgba(53,191,255,0.06)' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                name="message"
                required
                placeholder="How can we help you?"
                rows={6}
                className="px-4 py-3 rounded-lg border bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2"
                style={{ borderColor: '#334155', boxShadow: 'inset 0 0 0 1px rgba(53,191,255,0.06)' }}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {status && (
                <div
                  className="text-sm px-3 py-2 rounded-lg border"
                  style={{
                    color: status.toLowerCase().includes('open') ? BRAND : '#cbd5e1',
                    background: 'rgba(53,191,255,0.08)',
                    borderColor: 'rgba(53,191,255,0.25)',
                  }}
                >
                  {status}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="px-6 py-3 rounded-xl font-bold transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: BRAND,
                  color: '#06121f',
                  boxShadow: '0 12px 26px rgba(53,191,255,0.25)',
                }}
              >
                {sending ? 'Opening Email…' : 'Send Message'}
              </button>
            </form>

            <p className="text-xs text-slate-400 mt-3">
              We typically respond within 24 hours. For urgent issues, email us directly at{' '}
              <a href="mailto:hello@humanaira.com" className="underline" style={{ color: BRAND }}>
                hello@humanaira.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}