'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function OrderRoom() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [note, setNote] = useState('')
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewed, setReviewed] = useState(false)

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/order/${id}`)
      const json = await res.json()
      setOrder(json.order)
      // Check if already reviewed
      if (json.order?.status === 'COMPLETED') {
        const r = await fetch(`/api/reviews?order_id=${id}`)
        const rjson = await r.json()
        setReviewed(!!rjson.review)
      }
    })()
  }, [id])

  const action = async (next: string) => {
    const res = await fetch(`/api/order/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: next, note })
    })
    const json = await res.json()
    if (!res.ok) alert(json.error || 'Error')
    else setOrder(json.order)
  }

  const submitReview = async () => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: id, ...review })
    })
    if (res.ok) {
      alert('Review submitted!')
      setReviewed(true)
    } else {
      alert('Error submitting review')
    }
  }

  if (!order) return <div className="p-10">Loading…</div>

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-3">{order.gig?.title}</h1>
      <div className="text-sm text-gray-600 mb-4">Status: {order.status}</div>
      <textarea className="border w-full p-3" rows={4} placeholder="Message or delivery note"
        value={note} onChange={e => setNote(e.target.value)} />

      <div className="flex gap-3 mt-3">
        {order.status === 'IN_PROGRESS' && (
          <button onClick={() => action('DELIVER')} className="px-3 py-2 bg-black text-white rounded">Deliver</button>
        )}
        {order.status === 'DELIVERED' && (
          <button onClick={() => action('ACCEPT')} className="px-3 py-2 bg-green-600 text-white rounded">Accept</button>
        )}
      </div>

      {/* Review form for completed orders */}
      {order.status === 'COMPLETED' && !reviewed && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">Leave a Review</h2>
          <div className="flex items-center gap-2 mb-2">
            <span>Rating:</span>
            <input
              type="number"
              min={1}
              max={5}
              value={review.rating}
              onChange={e => setReview(r => ({ ...r, rating: Number(e.target.value) }))}
              className="border rounded w-16 p-1"
            />
            <span className="text-yellow-600">{'★'.repeat(review.rating)}</span>
          </div>
          <textarea
            className="border w-full p-2 mb-2"
            rows={3}
            placeholder="Write your review..."
            value={review.comment}
            onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
          />
          <button onClick={submitReview} className="px-4 py-2 bg-black text-white rounded">Submit Review</button>
        </div>
      )}
      {order.status === 'COMPLETED' && reviewed && (
        <div className="mt-8 text-green-600">You have already reviewed this order.</div>
      )}
    </main>
  )
}