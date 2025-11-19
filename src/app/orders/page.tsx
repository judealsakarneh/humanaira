import Link from 'next/link'
import { createSupabaseServer } from '../api/lib/supabaseServer'

export default async function Orders() {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div className="p-10">Please <a className="underline" href="/login">login</a>.</div>

  const { data: orders } = await supabase
    .from('orders')
    .select('id,status,price_cents,created_at,gig:gigs(title,slug)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      // ...existing code...
<ul className="space-y-3">
  {(orders || []).map(o => {
    const gig = Array.isArray(o.gig) ? o.gig[0] : o.gig
    return (
      <li key={o.id} className="border rounded p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">{gig?.title}</div>
          <div className="text-sm text-gray-600">{o.status} • ${(o.price_cents / 100).toFixed(2)}</div>
        </div>
        <Link href={`/order/${o.id}`} className="px-3 py-1 border rounded">Open</Link>
      </li>
    )
  })}
</ul>
// ...existing code...
    </main>
  )
}