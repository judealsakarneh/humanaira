'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

const supabase = createSupabaseBrowser()
const BRAND = '#35BFFF'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Protect page: Only freelancers can access
  useEffect(() => {
    async function checkFreelancerAndFetchOrders() {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        setError('You must be logged in to view this page.')
        setLoading(false)
        return
      }
      setUser(session.user)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_freelancer')
        .eq('id', session.user.id)
        .single()
      if (profileError || !profileData) {
        setError('Could not load your profile.')
        setLoading(false)
        return
      }
      if (!profileData.is_freelancer) {
        setError('Only freelancers can access this page.')
        setLoading(false)
        setTimeout(() => router.replace('/account'), 2000)
        return
      }
      setProfile(profileData)
      fetchOrders(session.user.id)
    }
    async function fetchOrders(userId: string) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    checkFreelancerAndFetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 border-4 border-solid border-t-transparent rounded-full animate-spin"
            style={{ borderColor: BRAND }}
          />
          <div className="text-slate-300 text-sm">Loading your orders…</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div
          className="px-6 py-4 rounded-xl border"
          style={{ color: BRAND, borderColor: 'rgba(53,191,255,0.35)', background: 'rgba(53,191,255,0.10)' }}
        >
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#030712] py-24 px-3 overflow-hidden">
      {/* Brand glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[140px]" style={{ background: 'rgba(53,191,255,0.22)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px]" style={{ background: 'rgba(53,191,255,0.18)' }} />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto">
        <h1
          className="text-4xl font-extrabold mb-8 text-center tracking-tight"
          style={{ backgroundImage: `linear-gradient(90deg,#ffffff,${BRAND})`, WebkitBackgroundClip: 'text', color: 'transparent' as any }}
        >
          My Orders
        </h1>

        <div
          className="rounded-2xl shadow-2xl p-6 md:p-8 border bg-slate-900/80 backdrop-blur-sm"
          style={{ borderColor: 'rgba(53,191,255,0.35)', boxShadow: '0 24px 64px rgba(3,6,16,0.6)' }}
        >
          {orders.length === 0 ? (
            <div className="text-center text-slate-300 text-base py-12">
              You have not received any orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-8">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-400">
                    <th className="pb-2 pr-3">Order ID</th>
                    <th className="pb-2 pr-3">Gig</th>
                    <th className="pb-2 pr-3">Buyer</th>
                    <th className="pb-2 pr-3">Status</th>
                    <th className="pb-2 pr-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td colSpan={5}>
                        <div
                          className="grid grid-cols-[1.4fr_2fr_1.6fr_1.2fr_1.2fr] items-center gap-3 md:gap-4 rounded-xl border p-4 md:p-5 bg-slate-900/60 hover:bg-slate-900/80 transition"
                          style={{ borderColor: 'rgba(53,191,255,0.20)' }}
                        >
                          <div className="font-mono text-slate-200 truncate">{order.id}</div>
                          <div className="text-slate-200 truncate">{order.gig_title || order.gig_id}</div>
                          <div className="text-slate-300 truncate">{order.buyer_email || order.buyer_id}</div>
                          <div>
                            <span
                              className="px-3 py-1 rounded-full text-[11px] font-bold"
                              style={
                                order.status === 'completed'
                                  ? { background: 'rgba(16,185,129,0.16)', color: '#A7F3D0', boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.35)' }
                                  : order.status === 'in_progress'
                                  ? { background: 'rgba(245,158,11,0.16)', color: '#FDE68A', boxShadow: 'inset 0 0 0 1px rgba(245,158,11,0.35)' }
                                  : { background: 'rgba(53,191,255,0.16)', color: BRAND, boxShadow: 'inset 0 0 0 1px rgba(53,191,255,0.35)' }
                              }
                            >
                              {(order.status || 'pending').replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          <div className="text-slate-400">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : '--'}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}