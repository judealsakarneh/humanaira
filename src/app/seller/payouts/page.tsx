'use client'
export default function PayoutsPage() {
  const connect = async () => {
    const res = await fetch('/api/stripe/connect', { method: 'POST' })
    const json = await res.json()
    if (json.url) window.location.href = json.url
    else alert(json.error || 'Error')
  }
  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold">Payouts</h1>
      <p className="mt-2 text-gray-600">Connect your Stripe account to receive payments.</p>
      <button onClick={connect} className="mt-4 px-4 py-2 bg-black text-white rounded">Connect with Stripe</button>
    </main>
  )
}