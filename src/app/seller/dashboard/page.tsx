'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

type GigRow = {
  id: string
  slug?: string | null
  title: string
  category?: string | null
  description?: string | null
  seller_id: string
  status?: string | null
  views?: number | null
}

type OrderRow = {
  id: string
  buyer_id: string
  seller_id: string
  gig_id: string
  price_cents: number
  status: string
  created_at: string
}

type WeeklyPoint = { label: string; start: number; end: number; totalCents: number }

const COMPLETED_STATUSES = ['COMPLETED', 'DELIVERED', 'FULFILLED']

export default function SellerDashboard() {
  // Page + errors
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auth + profile basics
  const [userId, setUserId] = useState<string | null>(null)
  const [isFreelancer, setIsFreelancer] = useState<boolean | null>(null)

  // Data
  const [gigs, setGigs] = useState<GigRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [viewsByGig, setViewsByGig] = useState<Record<string, number>>({})
  const [ordersByGig, setOrdersByGig] = useState<Record<string, number>>({})
  const [availableCents, setAvailableCents] = useState<number>(0)
  const [pendingCents, setPendingCents] = useState<number>(0)

  // Withdraw modal
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null)
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [amount, setAmount] = useState<string>('') // USD as string

  // Payout method from settings
  type PayoutMethod = 'paypal' | 'bank' | null
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>(null)
  const [paypalEmail, setPaypalEmail] = useState<string>('')

  // Bank details (read-only summary pulled from profile)
  const [country, setCountry] = useState<string>('') // user country (ISO-2)
  const [wiseCurrency, setWiseCurrency] = useState<string>('USD')
  const [holderName, setHolderName] = useState<string>('')
  const [bankCountry, setBankCountry] = useState<string>('') // bank country (ISO-2)
  const [iban, setIban] = useState<string>('')
  const [acctNumber, setAcctNumber] = useState<string>('')
  const [swiftBic, setSwiftBic] = useState<string>('')
  const [bankName, setBankName] = useState<string>('')
  const [bankCity, setBankCity] = useState<string>('')
  const [bankInfo, setBankInfo] = useState<string>('')

  // Load all data
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const supabase = createSupabaseBrowser()

        // Auth
        const { data: authRes, error: authErr } = await supabase.auth.getUser()
        if (authErr || !authRes?.user) {
          setError('You must be logged in to view this page.')
          setLoading(false)
          return
        }
        const uid = authRes.user.id
        setUserId(uid)

        // Profile, payout + bank details (prefill)
        const { data: prof } = await supabase
          .from('profiles')
          .select(
            'is_freelancer, payout_method, paypal_email, country, wise_currency, bank_holder_name, bank_country, iban, bank_account_number, bank_swift_bic, bank_name, bank_city, bank_additional_info'
          )
          .eq('id', uid)
          .maybeSingle()

        setIsFreelancer(Boolean(prof?.is_freelancer))
        setPayoutMethod((prof?.payout_method as PayoutMethod) ?? null)
        setPaypalEmail(prof?.paypal_email || '')

        setCountry((prof?.country || '').toUpperCase())
        setWiseCurrency((prof?.wise_currency || 'USD').toUpperCase())
        setHolderName(prof?.bank_holder_name || '')
        setBankCountry((prof?.bank_country || '').toUpperCase())
        setIban(prof?.iban || '')
        setAcctNumber(prof?.bank_account_number || '')
        setSwiftBic(prof?.bank_swift_bic || '')
        setBankName(prof?.bank_name || '')
        setBankCity(prof?.bank_city || '')
        setBankInfo(prof?.bank_additional_info || '')

        // Balances
        const { data: bal } = await supabase
          .from('seller_balances')
          .select('available_cents, pending_cents')
          .eq('seller_id', uid)
          .maybeSingle()
        setAvailableCents(Number(bal?.available_cents || 0))
        setPendingCents(Number(bal?.pending_cents || 0))

        // Gigs
        const { data: gigsData } = await supabase
          .from('gigs')
          .select('id, slug, title, category, description, seller_id, status, views')
          .eq('seller_id', uid)
          .order('created_at', { ascending: false })
        const gigsList = (gigsData as GigRow[]) || []
        setGigs(gigsList)

        // Orders
        const { data: ordersData } = await supabase
          .from('orders')
          .select('id, buyer_id, seller_id, gig_id, price_cents, status, created_at')
          .eq('seller_id', uid)
          .order('created_at', { ascending: false })
        const ordersList = (ordersData as OrderRow[]) || []
        setOrders(ordersList)

        // Derived counts
        const obg = ordersList.reduce((acc, o) => {
          acc[o.gig_id] = (acc[o.gig_id] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        setOrdersByGig(obg)

        const vbg: Record<string, number> = {}
        for (const g of gigsList) {
          vbg[g.id] = typeof g.views === 'number' ? (g.views || 0) : 0
        }
        setViewsByGig(vbg)
      } catch (e: any) {
        setError(e?.message || 'Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Stats
  const {
    grossCents,
    completedOrders,
    totalOrders,
    activeGigs,
    totalViews,
    weeklySeries,
    seriesMax,
    periodTotalCents,
  } = useMemo(() => {
    const completed = orders.filter((o) => COMPLETED_STATUSES.includes(o.status?.toUpperCase?.() || ''))
    const gross = completed.reduce((sum, o) => sum + (o.price_cents || 0), 0)

    const hasStatus = gigs.some((g) => typeof g.status === 'string' && g.status.length > 0)
    const active = hasStatus
      ? gigs.filter((g) => String(g.status || '').toLowerCase() === 'active').length
      : gigs.length

    const views = Object.values(viewsByGig).reduce((s, v) => s + (v || 0), 0)

    const series = buildWeeklyRevenueSeries(completed, 12)
    const maxVal = Math.max(1, ...series.map((p) => p.totalCents))
    const periodTotal = series.reduce((s, p) => s + p.totalCents, 0)

    return {
      grossCents: gross,
      completedOrders: completed.length,
      totalOrders: orders.length,
      activeGigs: active,
      totalViews: views,
      weeklySeries: series,
      seriesMax: maxVal,
      periodTotalCents: periodTotal,
    }
  }, [orders, gigs, viewsByGig])

  // Formatters
  const fmtMoney = (cents?: number | null, currency = 'USD') => `${currency.toUpperCase()} ${((cents || 0) / 100).toFixed(2)}`
  const fmtShort = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : String(n))

  // Withdraw
  const openWithdraw = () => {
    setWithdrawError(null)
    setWithdrawSuccess(null)
    setAmount(((availableCents || 0) / 100).toFixed(2))
    setWithdrawOpen(true)
  }

  const submitWithdraw = async () => {
    try {
      setWithdrawLoading(true)
      setWithdrawError(null)
      setWithdrawSuccess(null)

      if (!payoutMethod) throw new Error('Please set your payout method in Settings first.')
      const amt = Math.floor(Number(amount) * 100)
      if (!amt || amt <= 0) throw new Error('Enter a valid amount.')
      if (amt > availableCents) throw new Error('Amount exceeds your available balance.')

      if (payoutMethod === 'paypal') {
        if (!paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
          throw new Error('Your PayPal email is missing or invalid. Update it in Settings.')
        }
      } else if (payoutMethod === 'bank') {
        const hasIban = !!iban.trim()
        const hasLocal = !!acctNumber.trim() && !!swiftBic.trim()
        if (!country) throw new Error('Please set your country (ISO‑2) in Settings.')
        if (!holderName) throw new Error('Please set your account holder name in Settings.')
        if (!bankCountry) throw new Error('Please set your bank country (ISO‑2) in Settings.')
        if (!hasIban && !hasLocal) throw new Error('Add IBAN, or Account Number + SWIFT/BIC in Settings.')
      }

      // Create payout request (backend emails admin)
      const res = await fetch('/api/payouts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_cents: amt, method: payoutMethod }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to request payout')

      setWithdrawSuccess('Withdrawal request submitted. We process payouts manually within 7 days.')
      // Update local balances
      setAvailableCents((v) => Math.max(0, v - (amt || 0)))
      setPendingCents((v) => (v || 0) + (amt || 0))
    } catch (e: any) {
      setWithdrawError(e?.message || 'Something went wrong')
    } finally {
      setWithdrawLoading(false)
    }
  }

  // Loading
  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-[#0A0F1F] overflow-x-hidden pt-24 md:pt-28">
        <HumanairaLoader subtitle="Loading your dashboard…" />
      </main>
    )
  }

  // Not a freelancer
  if (isFreelancer === false) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-[#0A0F1F] overflow-x-hidden pt-24 md:pt-28">
        <div className="max-w-md text-center space-y-4 p-6 rounded-2xl bg-[#101735] border border-slate-700/60 shadow-xl">
          <h2 className="text-xl font-bold text-white">Become a Freelancer</h2>
          <p className="text-slate-300 text-sm">Enable the freelancer option in Settings to access the seller dashboard.</p>
          <Link href="/account/settings" className="inline-block px-5 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-500 transition">
            Open Settings
          </Link>
        </div>
      </main>
    )
  }

  // Errors
  if (error) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-[#0A0F1F] overflow-x-hidden pt-24 md:pt-28">
        <div className="text-rose-400 text-lg font-semibold">{error}</div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#050812] via-[#0A0F1F] to-[#0D1328] text-slate-100 overflow-x-hidden pt-24 md:pt-28">
      {/* Enhanced gradient background accents with animation */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/25 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute -bottom-32 -right-24 w-[32rem] h-[32rem] bg-indigo-500/25 rounded-full blur-[140px] animate-pulse-slower" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
      `}</style>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white bg-gradient-to-r from-white via-sky-200 to-indigo-300 bg-clip-text text-transparent">
                Freelancer Dashboard
              </h1>
              {payoutMethod && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-200 border border-sky-500/30 shadow-lg shadow-sky-500/10">
                  <span className="mr-1.5">💳</span>
                  Payout: {payoutMethod === 'paypal' ? `PayPal` : `Bank`}
                </span>
              )}
            </div>
            <p className="text-slate-400 text-base">Track performance, manage payouts, and grow your services.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openWithdraw}
              className="px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:scale-105 active:scale-95"
            >
              💰 Withdraw
            </button>
            <Link
              href="/account/settings"
              className="px-5 py-2.5 rounded-lg font-semibold bg-slate-800/80 text-white hover:bg-slate-700 transition border border-slate-600/50 hover:border-sky-500/50 shadow-lg"
            >
              ⚙️ Payout Settings
            </Link>
            <Link
              href="/seller/gigs/new"
              className="px-5 py-2.5 rounded-lg font-semibold bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 transition shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transform hover:scale-105 active:scale-95"
            >
              ✨ Post New Gig
            </Link>
          </div>
        </div>

        {/* KPI cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPI title="Available Balance" value={fmtMoney(availableCents)} accent="sky" />
          <KPI title="Pending Payouts" value={fmtMoney(pendingCents)} accent="violet" />
          <KPI title="Gross Sales" value={fmtMoney(grossCents)} accent="emerald" />
          <KPI title="Completed Orders" value={fmtShort(completedOrders)} accent="amber" />
        </section>

        {/* Secondary KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <KPI title="Active Gigs" value={fmtShort(activeGigs)} accent="indigo" />
          <KPI title="Total Views" value={fmtShort(totalViews)} accent="fuchsia" />
        </section>

        {/* Earnings Overview with working chart */}
        <section className="bg-gradient-to-br from-[#0D1328]/95 via-[#0F1535]/95 to-[#0D1328]/95 border border-slate-700/60 rounded-3xl p-8 shadow-2xl mb-10 backdrop-blur-sm relative overflow-hidden group">
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent flex items-center gap-2">
                📊 Earnings Overview
              </h2>
              <p className="text-sm text-slate-400 mt-1">Revenue trajectory over the last 12 weeks</p>
            </div>
            <div className="text-right bg-gradient-to-br from-sky-500/10 to-indigo-500/10 rounded-xl px-5 py-3 border border-sky-500/20">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total (12w)</div>
              <div className="text-3xl font-extrabold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                {fmtMoney(periodTotalCents)}
              </div>
            </div>
          </div>

          <RevenueAreaChart series={weeklySeries} maxVal={seriesMax} />

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-300 relative z-10">
            {weeklySeries.map((p) => (
              <div
                key={p.label}
                className="flex items-center justify-between bg-[#0B1024]/80 border border-slate-700/50 rounded-lg px-3 py-2.5 hover:border-sky-500/40 hover:bg-[#0C1228] transition-all duration-200 backdrop-blur-sm"
              >
                <span className="text-slate-400 text-xs">{p.label}</span>
                <span className="font-semibold text-slate-100">{fmtMoney(p.totalCents)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Gigs Table */}
        <section className="bg-gradient-to-br from-[#0D1328]/95 via-[#0F1535]/95 to-[#0D1328]/95 border border-slate-700/60 rounded-3xl p-8 shadow-2xl mb-10 backdrop-blur-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-sky-200 bg-clip-text text-transparent flex items-center gap-2">
              🎯 Your Gigs
            </h2>
            <Link 
              href="/seller/gigs/new" 
              className="text-sky-400 hover:text-sky-300 font-semibold transition-colors flex items-center gap-2 px-4 py-2 rounded-lg border border-sky-500/30 hover:border-sky-500/50 hover:bg-sky-500/10"
            >
              <span>✨</span>
              <span>Add Gig</span>
            </Link>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-700/40">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-300 border-b border-slate-700/60 bg-[#0A0F1F]/60">
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Orders</th>
                  <th className="py-3 px-4 font-semibold">Views</th>
                  <th className="py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((gig) => {
                  const statusText = gig.status ? String(gig.status) : 'Active'
                  const isActive = String(statusText).toLowerCase() === 'active'
                  const perGigOrders = ordersByGig[gig.id] || 0
                  const perGigViews = viewsByGig[gig.id] || 0
                  return (
                    <tr key={gig.id} className="border-b border-slate-800/40 hover:bg-[#0B1024]/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{gig.title}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isActive
                              ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/60 shadow-emerald-500/20 shadow-sm'
                              : 'bg-amber-900/30 text-amber-300 border border-amber-700/60'
                          }`}
                        >
                          {statusText}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-100 font-medium">{perGigOrders}</td>
                      <td className="py-3 px-4 text-slate-100 font-medium">{perGigViews}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-3">
                          <Link href={`/services/${gig.slug ?? gig.id}`} className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
                            View
                          </Link>
                          <Link href={`/seller/gigs/${gig.slug ?? gig.id}/edit`} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {gigs.length === 0 && (
                  <tr>
                    <td className="py-12 px-4 text-center text-slate-300" colSpan={5}>
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl opacity-40">📦</span>
                        <p>You haven't posted any gigs yet.</p>
                        <Link href="/seller/gigs/new" className="mt-2 px-5 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-500 transition">
                          Create Your First Gig
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Withdraw Modal */}
        {withdrawOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl bg-[#0D1328] border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Withdraw Funds</h3>
                <button onClick={() => setWithdrawOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {withdrawError && <div className="mb-3 text-rose-400 text-sm">{withdrawError}</div>}
              {withdrawSuccess && <div className="mb-3 text-emerald-400 text-sm">{withdrawSuccess}</div>}

              {!payoutMethod ? (
                <div className="rounded-xl border border-amber-700/50 bg-amber-900/20 p-4 mb-5 text-amber-200">
                  You haven’t set a payout method yet. Choose PayPal or Bank Transfer in Settings.
                  <div className="mt-3">
                    <Link
                      href="/account/settings"
                      className="inline-block px-4 py-2 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-500"
                    >
                      Open Payout Settings
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-slate-700/60 bg-[#0B1024] p-4 mb-5 text-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="text-slate-400">Payout method</div>
                      <div className="font-semibold">
                        {payoutMethod === 'paypal' ? `PayPal — ${paypalEmail || 'not set'}` : 'Bank transfer'}
                      </div>
                    </div>
                    <Link href="/account/settings" className="text-sky-400 hover:text-sky-300 text-sm font-semibold">
                      Edit
                    </Link>
                  </div>
                  {payoutMethod === 'bank' && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <InfoRow label="Country" value={country || '-'} />
                      <InfoRow label="Bank Country" value={bankCountry || '-'} />
                      <InfoRow label="Holder" value={holderName || '-'} />
                      <InfoRow label="Currency" value={wiseCurrency || 'USD'} />
                      <InfoRow label="IBAN" value={maskIban(iban) || '-'} />
                      <InfoRow label="Acct + SWIFT/BIC" value={maskAcct(acctNumber, swiftBic) || '-'} />
                    </div>
                  )}
                </div>
              )}

              {/* Amount */}
              <div className="mb-4">
                <label className="block text-sm text-slate-300 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={(availableCents / 100).toFixed(2)}
                  className="w-full px-3 py-2 rounded-md bg-[#0B1024] border border-slate-700/60 text-white"
                  disabled={!payoutMethod}
                />
                <div className="text-xs text-slate-400 mt-1">
                  Available: {(availableCents / 100).toFixed(2)} USD. Minimum may apply.
                </div>
              </div>

              {/* 7-day notice */}
              <div className="mb-5 rounded-lg border border-indigo-700/50 bg-indigo-900/20 p-3 text-indigo-200 text-sm">
                Note: Payout requests are processed manually within 7 days.
              </div>

              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setWithdrawOpen(false)} className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600">
                  Cancel
                </button>
                <button
                  onClick={submitWithdraw}
                  disabled={withdrawLoading || !payoutMethod}
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {withdrawLoading ? 'Submitting…' : 'Submit Withdrawal'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

/* ---------- Loader component ---------- */

function HumanairaLoader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-[560px] max-w-[80vw]">
        <svg
          viewBox="0 0 560 140"
          className="w-full h-auto"
          role="img"
          aria-label="humanaira loading"
        >
          <defs>
            <linearGradient id="humanaira-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>

            {/* Soft glow */}
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Stroke (outline drawing) */}
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
            fontWeight="800"
            fontSize="72"
            fill="transparent"
            stroke="url(#humanaira-grad)"
            strokeWidth="2.2"
            className="hum-stroke"
            filter="url(#soft-glow)"
          >
            humanaira
          </text>

          {/* Fill fades in after stroke draws */}
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
            fontWeight="800"
            fontSize="72"
            fill="url(#humanaira-grad)"
            className="hum-fill"
          >
            humanaira
          </text>
        </svg>
      </div>

      {subtitle && (
        <div className="text-slate-300 text-sm tracking-wide">{subtitle}</div>
      )}

      <style jsx>{`
        /* Approximate total path length for text outlines; large enough for smooth draw */
        .hum-stroke {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: hum-draw 2.2s ease-in-out forwards;
        }
        .hum-fill {
          opacity: 0;
          animation: hum-fill 0.8s ease-in forwards;
          animation-delay: 1.8s;
        }
        @keyframes hum-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes hum-fill {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

/* ---------- Small components & helpers ---------- */

function KPI({
  title,
  value,
  accent,
}: {
  title: string
  value: string
  accent: 'sky' | 'violet' | 'emerald' | 'amber' | 'indigo' | 'fuchsia'
}) {
  const ring = {
    sky: 'ring-sky-500/40',
    violet: 'ring-violet-500/40',
    emerald: 'ring-emerald-500/40',
    amber: 'ring-amber-500/40',
    indigo: 'ring-indigo-500/40',
    fuchsia: 'ring-fuchsia-500/40',
  }[accent]

  const gradient = {
    sky: 'from-sky-600/30 via-sky-500/15 to-transparent',
    violet: 'from-violet-600/30 via-violet-500/15 to-transparent',
    emerald: 'from-emerald-600/30 via-emerald-500/15 to-transparent',
    amber: 'from-amber-600/30 via-amber-500/15 to-transparent',
    indigo: 'from-indigo-600/30 via-indigo-500/15 to-transparent',
    fuchsia: 'from-fuchsia-600/30 via-fuchsia-500/15 to-transparent',
  }[accent]

  const iconGlow = {
    sky: 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]',
    violet: 'text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]',
    emerald: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    amber: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    indigo: 'text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]',
    fuchsia: 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.6)]',
  }[accent]

  const icon = {
    sky: '💵',
    violet: '⏳',
    emerald: '💰',
    amber: '✅',
    indigo: '🎯',
    fuchsia: '👁️',
  }[accent]

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#0D1328]/90 border border-slate-700/60 p-6 shadow-2xl ring-1 ${ring} backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:shadow-3xl group`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
      <div className="absolute top-3 right-3 text-2xl opacity-40 group-hover:opacity-60 transition-opacity">
        <span className={iconGlow}>{icon}</span>
      </div>
      <div className="relative">
        <div className="text-sm text-slate-400 font-medium tracking-wide uppercase mb-2">{title}</div>
        <div className="mt-1 text-3xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">{value}</div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-[#0A1126] border border-slate-800 px-3 py-2">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200 font-medium">{value}</span>
    </div>
  )
}

function maskIban(i: string) {
  const s = (i || '').replace(/\s+/g, '')
  if (!s) return ''
  if (s.length <= 6) return s
  return `${s.slice(0, 4)} •••• •••• ${s.slice(-4)}`
}

function maskAcct(acct: string, swift: string) {
  const a = (acct || '').replace(/\s+/g, '')
  const s = (swift || '').toUpperCase()
  const masked = a ? (a.length <= 4 ? a : `•••• ${a.slice(-4)}`) : ''
  return [masked, s].filter(Boolean).join(' / ')
}

function buildWeeklyRevenueSeries(orders: OrderRow[], weeksBack: number): WeeklyPoint[] {
  const completed = orders.filter((o) => COMPLETED_STATUSES.includes(o.status?.toUpperCase?.() || ''))
  const now = new Date()
  const endOfThisWeek = endOfWeekUTC(now)
  const series: WeeklyPoint[] = []

  for (let i = weeksBack - 1; i >= 0; i--) {
    const end = addDaysUTC(endOfThisWeek, -7 * i)
    const start = addDaysUTC(end, -6)
    const label = labelForWeek(start, end)
    const startMs = start.getTime()
    const endMs = end.getTime()

    const totalCents = completed.reduce((sum, o) => {
      const t = new Date(o.created_at).getTime()
      if (t >= startMs && t <= endMs) return sum + (o.price_cents || 0)
      return sum
    }, 0)

    series.push({ label, start: startMs, end: endMs, totalCents })
  }

  return series
}

function endOfWeekUTC(d: Date) {
  const day = d.getUTCDay()
  const diff = 6 - day // to Saturday
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  end.setUTCDate(end.getUTCDate() + diff)
  end.setUTCHours(23, 59, 59, 999)
  return end
}

function addDaysUTC(d: Date, days: number) {
  const copy = new Date(d.getTime())
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

function labelForWeek(start: Date, end: Date) {
  const short = (dt: Date) => `${String(dt.getUTCMonth() + 1).padStart(2, '0')}/${String(dt.getUTCDate()).padStart(2, '0')}`
  return `${short(start)}–${short(end)}`
}

function RevenueAreaChart({ series, maxVal }: { series: WeeklyPoint[]; maxVal: number }) {
  const width = 900
  const height = 220
  const paddingX = 32
  const paddingY = 28

  const points = series.map((p, idx) => {
    const x = paddingX + (idx * (width - paddingX * 2)) / Math.max(1, series.length - 1)
    const y = height - paddingY - (p.totalCents / (maxVal || 1)) * (height - paddingY * 2)
    return { x, y, v: p.totalCents }
  })

  const path = buildPath(points, height - paddingY)
  const line = buildLine(points)

  return (
    <div className="w-full overflow-hidden rounded-xl bg-[#0B1024] border border-slate-700/40">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Revenue area chart" className="w-full h-[220px] block" preserveAspectRatio="none">
        <rect x="0" y="0" width={width} height={height} fill="#0B1024" />
        <g opacity="0.25">
          {Array.from({ length: 4 }).map((_, i) => {
            const y = paddingY + (i * (height - paddingY * 2)) / 3
            return <line key={i} x1={paddingX} x2={width - paddingX} y1={y} y2={y} stroke="#334155" strokeDasharray="4 4" />
          })}
        </g>
        <path d={path} fill="url(#grad)" opacity="0.9" />
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={line} fill="none" stroke="#38bdf8" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#38bdf8" />
        ))}
      </svg>
    </div>
  )
}

function buildLine(points: { x: number; y: number }[]) {
  if (points.length === 0) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

function buildPath(points: { x: number; y: number }[], baselineY: number) {
  if (points.length === 0) return ''
  const top = buildLine(points)
  const last = points[points.length - 1]
  const first = points[0]
  return `${top} L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`
}