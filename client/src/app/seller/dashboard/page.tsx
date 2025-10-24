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

export default function SellerDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auth + data
  const [userId, setUserId] = useState<string | null>(null)
  const [gigs, setGigs] = useState<GigRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])

  // Derived
  const [viewsByGig, setViewsByGig] = useState<Record<string, number>>({})
  const [ordersByGig, setOrdersByGig] = useState<Record<string, number>>({})

  // Fees and statuses
  const FEE_RATE = 0.05
  const COMPLETED_STATUSES = ['COMPLETED', 'DELIVERED', 'FULFILLED']

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

        // (Optional) ensure this account is a freelancer; if you have is_freelancer on profiles, enforce it
        // const { data: prof, error: profErr } = await supabase.from('profiles').select('is_freelancer').eq('id', uid).maybeSingle()
        // if (profErr || !prof?.is_freelancer) { setError('Only freelancers can access this page.'); setLoading(false); return }

        // Gigs for this seller
        const { data: gigsData, error: gigsErr } = await supabase
          .from('gigs')
          .select('id, slug, title, category, description, seller_id, status, views')
          .eq('seller_id', uid)
          .order('created_at', { ascending: false })
        if (gigsErr) throw gigsErr
        const gigsList = (gigsData as GigRow[]) || []
        setGigs(gigsList)

        // Orders for this seller
        const { data: ordersData, error: ordersErr } = await supabase
          .from('orders')
          .select('id, buyer_id, seller_id, gig_id, price_cents, status, created_at')
          .eq('seller_id', uid)
          .order('created_at', { ascending: false })
        if (ordersErr) throw ordersErr
        const ordersList = (ordersData as OrderRow[]) || []
        setOrders(ordersList)

        // Per-gig order counts
        const obg = ordersList.reduce((acc, o) => {
          acc[o.gig_id] = (acc[o.gig_id] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        setOrdersByGig(obg)

        // Views:
        // 1) If gigs table has a views column, sum from there.
        // 2) If you track per-view rows in a gig_views table, you can fetch and sum here instead.
        const vbg: Record<string, number> = {}
        for (const g of gigsList) {
          if (typeof g.views === 'number') vbg[g.id] = g.views || 0
          else vbg[g.id] = 0
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
    walletNetCents,
    grossCents,
    feeCents,
    totalOrders,
    completedOrders,
    activeGigs,
    totalViews,
  } = useMemo(() => {
    const completed = orders.filter((o) => COMPLETED_STATUSES.includes(o.status?.toUpperCase?.() || ''))
    const gross = completed.reduce((sum, o) => sum + (o.price_cents || 0), 0)
    // Fee and net: compute fee per-order to avoid rounding drift
    let totalFee = 0
    for (const o of completed) {
      const f = Math.round((o.price_cents || 0) * FEE_RATE)
      totalFee += f
    }
    const net = gross - totalFee

    // Active gigs: prefer status if present, else count all
    const hasStatus = gigs.some((g) => typeof g.status === 'string' && g.status.length > 0)
    const active = hasStatus
      ? gigs.filter((g) => String(g.status || '').toLowerCase() === 'active').length
      : gigs.length

    const views = Object.values(viewsByGig).reduce((s, v) => s + (v || 0), 0)

    return {
      walletNetCents: net,
      grossCents: gross,
      feeCents: totalFee,
      totalOrders: orders.length,
      completedOrders: completed.length,
      activeGigs: active,
      totalViews: views,
    }
  }, [orders, gigs, viewsByGig])

  const fmtMoney = (cents?: number | null) => {
    if (!cents) return '$0.00'
    return `$${(cents / 100).toFixed(2)}`
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#090a10]">
        <div className="text-blue-400 text-lg font-semibold animate-pulse">Loading your dashboard...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#090a10]">
        <div className="text-red-400 text-lg font-semibold">{error}</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090a10] via-[#07102a] to-[#123055] text-gray-100 font-inter relative overflow-hidden">
      {/* Vibrant Blur Backgrounds */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 rounded-full blur-[120px] opacity-40" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 bg-blue-100 rounded-full blur-[80px] opacity-25" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 pt-28">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-200">Freelancer Dashboard</h1>
          <Link
            href="/seller/gigs/new"
            className="mt-2 md:mt-0 px-6 py-3 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
          >
            + Post New Gig
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{fmtMoney(walletNetCents)}</span>
            <span className="text-blue-400 text-sm">Wallet Balance (net)</span>
            <span className="text-[10px] text-blue-500 mt-1">After 5% fee</span>
          </div>

          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{fmtMoney(grossCents)}</span>
            <span className="text-blue-400 text-sm">Gross Sales</span>
          </div>

          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">-{fmtMoney(feeCents)}</span>
            <span className="text-blue-400 text-sm">Platform Fee (5%)</span>
          </div>

          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{completedOrders}/{totalOrders}</span>
            <span className="text-blue-400 text-sm">Orders (completed/total)</span>
          </div>

          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{activeGigs}</span>
            <span className="text-blue-400 text-sm">Active Gigs</span>
          </div>

          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{totalViews}</span>
            <span className="text-blue-400 text-sm">Views</span>
          </div>
        </div>

        {/* Gigs Table */}
        <div className="bg-[#181a23]/90 rounded-xl shadow-xl border border-blue-900 p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-100">Your Gigs</h2>
            <Link href="/seller/gigs/new" className="text-blue-400 hover:underline font-semibold">
              + Add Gig
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-blue-300 border-b border-blue-800">
                  <th className="py-2 px-2">Title</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Orders</th>
                  <th className="py-2 px-2">Views</th>
                  <th className="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((gig) => {
                  const statusText = gig.status ? String(gig.status) : 'Active'
                  const isActive = String(statusText).toLowerCase() === 'active'
                  const perGigOrders = ordersByGig[gig.id] || 0
                  const perGigViews = viewsByGig[gig.id] || 0
                  return (
                    <tr key={gig.id} className="border-b border-blue-900 hover:bg-blue-950 transition">
                      <td className="py-2 px-2 font-semibold text-blue-200">{gig.title}</td>
                      <td className="py-2 px-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            isActive ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'
                          }`}
                        >
                          {statusText}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-blue-200">{perGigOrders}</td>
                      <td className="py-2 px-2 text-blue-200">{perGigViews}</td>
                      <td className="py-2 px-2">
                        <div className="flex gap-3">
                          <Link
                            href={`/services/${gig.slug ?? gig.id}`}
                            className="text-blue-400 hover:underline"
                          >
                            View
                          </Link>
                          <Link
                            href={`/seller/gigs/${gig.slug ?? gig.id}/edit`}
                            className="text-blue-400 hover:underline"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {gigs.length === 0 && (
                  <tr>
                    <td className="py-8 px-2 text-center text-blue-300" colSpan={5}>
                      You have not posted any gigs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Earnings Overview (placeholder) */}
        <div className="bg-[#181a23]/90 rounded-xl shadow-xl border border-blue-900 p-6 mb-10">
          <h2 className="text-xl font-bold text-blue-100 mb-4">Earnings Overview</h2>
          <div className="h-40 flex items-center justify-center text-blue-400">
            <span>[Earnings chart coming soon]</span>
          </div>
        </div>
      </div>
    </main>
  )
}