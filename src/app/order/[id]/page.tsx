'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function OrderRoom() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [note, setNote] = useState('')
  const [review, setReview] = useState({ rating: 5, comment: '' })
  const [reviewed, setReviewed] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/order/${id}`)
      const json = await res.json()
      setOrder(json.order)
      setUserId(json.order?.buyer_id || json.order?.seller_id || null)
      if (json.order?.status === 'COMPLETED') {
        const r = await fetch(`/api/reviews?order_id=${id}`)
        const rjson = await r.json()
        setReviewed(!!rjson.review)
      }
    })()
  }, [id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    const fetchMessages = async () => {
      const res = await fetch(`/api/messages?order_id=${id}`)
      const json = await res.json()
      setMessages(json.messages || [])
      setTimeout(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
      }, 100)
    }
    fetchMessages()
    interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [id])

  const sendMsg = async (e: any) => {
    e.preventDefault()
    if (!msg.trim()) return
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: id, content: msg })
    })
    if (res.ok) toast.success('Message sent!')
    else toast.error('Failed to send message')
    setMsg('')
  }

  const action = async (next: string) => {
    const res = await fetch(`/api/order/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: next, note })
    })
    const json = await res.json()
    if (!res.ok) toast.error(json.error || 'Error')
    else {
      setOrder(json.order)
      toast.success('Order updated!')
    }
  }

  const submitReview = async () => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: id, ...review })
    })
    if (res.ok) {
      toast.success('Review submitted!')
      setReviewed(true)
    } else {
      toast.error('Error submitting review')
    }
  }

  if (!order) return (
    <div className="flex justify-center items-center py-10">
      <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
    </div>
  )

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-3">{order.gig?.title}</h1>
      <div className="text-sm text-gray-600 mb-4">Status: {order.status}</div>
      <textarea
        className="border w-full p-3 focus:outline-none focus:ring focus:ring-blue-300"
        rows={4}
        placeholder="Message or delivery note"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <div className="flex gap-3 mt-3">
        {order.status === 'IN_PROGRESS' && (
          <button
            onClick={() => action('DELIVER')}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition focus:outline-none focus:ring focus:ring-blue-300"
          >
            Deliver
          </button>
        )}
        {order.status === 'DELIVERED' && (
          <button
            onClick={() => action('ACCEPT')}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition focus:outline-none focus:ring focus:ring-green-300"
          >
            Accept
          </button>
        )}
      </div>

      {/* Chat section */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Order Chat</h2>
        <div ref={chatRef} className="border rounded h-64 overflow-y-auto bg-white p-3 mb-2">
          {messages.length === 0 && <div className="text-gray-400">No messages yet.</div>}
          {messages.map((m, i) => (
            <div key={m.id || i} className={`mb-2 flex ${m.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-3 py-2 rounded ${m.sender_id === userId ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <span className="text-sm">{m.content}</span>
                <div className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMsg} className="flex gap-2">
          <input
            className="border rounded w-full p-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Type a message…"
            value={msg}
            onChange={e => setMsg(e.target.value)}
          />
          <button
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition focus:outline-none focus:ring focus:ring-blue-300"
            type="submit"
          >
            Send
          </button>
        </form>
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
              className="border rounded w-16 p-1 focus:outline-none focus:ring focus:ring-blue-300"
            />
            <span className="text-yellow-600">{'★'.repeat(review.rating)}</span>
          </div>
          <textarea
            className="border w-full p-2 mb-2 focus:outline-none focus:ring focus:ring-blue-300"
            rows={3}
            placeholder="Write your review..."
            value={review.comment}
            onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
          />
          <button
            onClick={submitReview}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit Review
          </button>
        </div>
      )}
      {order.status === 'COMPLETED' && reviewed && (
        <div className="mt-8 text-green-600">You have already reviewed this order.</div>
      )}
    </main>
  )
}