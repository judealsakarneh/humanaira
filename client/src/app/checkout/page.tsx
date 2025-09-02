'use client'
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ gigId, tier }: { gigId: string, tier: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gigId, tier })
      })
      const json = await res.json()
      if (json.clientSecret) setClientSecret(json.clientSecret)
      else alert(json.error || 'Error')
    })()
  }, [gigId, tier])

  const pay = async (e: any) => {
    e.preventDefault()
    if (!stripe || !elements) return
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/orders' }
    })
    if (error) alert(error.message)
  }

  if (!clientSecret) return <p>Loading…</p>
  return (
    <form onSubmit={pay} className="max-w-md mx-auto pt-10">
      <PaymentElement />
      <button className="mt-4 px-4 py-2 bg-black text-white rounded" disabled={!stripe}>Pay</button>
    </form>
  )
}

export default function CheckoutPage({ searchParams }: { searchParams: { gigId?: string, tier?: string } }) {
  const gigId = searchParams.gigId || ''
  const tier = searchParams.tier || 'BASIC'
  return (
    <Elements stripe={stripePromise} options={{ appearance: { theme: 'stripe' } }}>
      <CheckoutForm gigId={gigId} tier={tier} />
    </Elements>
  )
}