'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
const supabase = createSupabaseBrowser()

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
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    checkFreelancerAndFetchOrders()
    // eslint-disable-next-line
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a10]">
        <div className="text-blue-400 text-lg font-semibold animate-pulse">Loading your orders...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a10]">
        <div className="text-red-400 text-lg font-semibold">{error}</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#090a10] py-20 px-2 overflow-hidden">
      {/* Dreamy gradients background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-700 rounded-full blur-[120px] opacity-20" />
      </div>
      <main className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-blue-100 text-center tracking-tight drop-shadow">
          My Orders
        </h1>
        <div className="bg-[#181a23] rounded-2xl shadow-2xl border border-blue-900/60 p-8">
          {orders.length === 0 ? (
            <div className="text-center text-blue-300 text-lg py-12">You have not received any orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="py-2 px-3 text-blue-300 font-semibold">Order ID</th>
                    <th className="py-2 px-3 text-blue-300 font-semibold">Gig</th>
                    <th className="py-2 px-3 text-blue-300 font-semibold">Buyer</th>
                    <th className="py-2 px-3 text-blue-300 font-semibold">Status</th>
                    <th className="py-2 px-3 text-blue-300 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="bg-[#10131e] border border-blue-900/40 rounded-xl shadow hover:bg-blue-950/40 transition">
                      <td className="py-2 px-3 font-mono text-blue-200">{order.id}</td>
                      <td className="py-2 px-3 text-blue-100">{order.gig_title || order.gig_id}</td>
                      <td className="py-2 px-3 text-blue-200">{order.buyer_email || order.buyer_id}</td>
                      <td className="py-2 px-3">
                        <span className={
                          order.status === 'completed'
                            ? 'bg-green-700/80 text-green-100 px-3 py-1 rounded-full text-xs font-bold'
                            : order.status === 'in_progress'
                            ? 'bg-yellow-700/80 text-yellow-100 px-3 py-1 rounded-full text-xs font-bold'
                            : 'bg-blue-800/80 text-blue-100 px-3 py-1 rounded-full text-xs font-bold'
                        }>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-blue-300">{new Date(order.created_at).toLocaleDateString()}</td>
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