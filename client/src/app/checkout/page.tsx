'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function CheckoutPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tier = params.get('tier') || 'Base'
  const title = params.get('title') || 'Service'
  const slug = params.get('slug') || ''
  const priceCents = Number(params.get('price_cents') || '0')
  const gigId = params.get('gig') || ''

  const price = useMemo(() => (priceCents / 100).toFixed(2), [priceCents])

  const handlePay = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gig: gigId,
          slug,
          title,
          tier,
          price_cents: priceCents,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.url) {
        throw new Error(data?.error || 'Failed to start checkout')
      }
      window.location.href = data.url as string
    } catch (e: any) {
      setError(e?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#080E1B] text-slate-200 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="text-sm text-slate-400 mb-6">
          <Link className="hover:text-[#3B82F6]" href="/">Home</Link> <span>/</span>{' '}
          <Link className="hover:text-[#3B82F6]" href="/browse">Browse</Link> <span>/</span>{' '}
          {slug ? <Link className="hover:text-[#3B82F6]" href={`/services/${encodeURIComponent(slug)}`}>{title}</Link> : <span>{title}</span>} <span>/</span>{' '}
          <span className="text-[#3B82F6] font-semibold">Checkout</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6 tracking-tight">Checkout</h1>

        <div className="bg-[#141A30] rounded-2xl border border-[#334155] shadow-2xl p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="uppercase text-xs tracking-wider text-slate-400 mb-1">Service</div>
              <div className="text-xl font-bold text-white">{title}</div>
              <div className="text-sm text-slate-400 mt-1">Package: <span className="text-slate-200 font-semibold">{tier}</span></div>
              {gigId && <div className="text-xs text-slate-500 mt-1">Gig ID: {gigId}</div>}
            </div>
            <div className="text-right">
              <div className="uppercase text-xs tracking-wider text-slate-400 mb-1">Total</div>
              <div className="text-3xl font-extrabold text-[#3B82F6]">${price}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#334155]">
            {error && <div className="mb-3 text-red-400 text-sm">{error}</div>}

            <button
              onClick={handlePay}
              disabled={loading || !gigId || priceCents <= 0}
              className={`w-full px-6 py-3.5 rounded-xl font-bold text-lg transition transform hover:scale-[1.01] active:scale-[0.99] ${
                loading || !gigId || priceCents <= 0
                  ? 'bg-gray-600 cursor-not-allowed text-white'
                  : 'bg-[#3B82F6] text-white shadow-xl shadow-[#3B82F6]/50 hover:bg-sky-500'
              }`}
            >
              {loading ? 'Redirecting...' : `Pay $${price}`}
            </button>

            <button
              onClick={() => {
                if (slug) router.push(`/services/${encodeURIComponent(slug)}`)
                else router.back()
              }}
              className="mt-3 w-full px-6 py-3.5 rounded-xl bg-[#080E1B] text-[#3B82F6] font-bold text-lg shadow border border-[#334155] hover:bg-[#151C30] transition"
            >
              Back to Service
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}