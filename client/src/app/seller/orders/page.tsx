'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    async function fetchOrders() {
      // Fetch current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setOrders([])
        setLoading(false)
        return
      }
      // Fetch orders where the seller is the current user
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading orders...</div>
  }

  if (!orders.length) {
    return <div className="p-8 text-center text-gray-500">No orders yet.</div>
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">My Orders</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Gig</th>
              <th className="py-2 px-3">Buyer</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-t">
                <td className="py-2 px-3">{order.id}</td>
                <td className="py-2 px-3">{order.gig_title || order.gig_id}</td>
                <td className="py-2 px-3">{order.buyer_email || order.buyer_id}</td>
                <td className="py-2 px-3">{order.status}</td>
                <td className="py-2 px-3">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}