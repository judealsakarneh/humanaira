'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const params = useSearchParams()
  const sessionId = params.get('session_id') || ''

  return (
    <main className="min-h-screen bg-[#080E1B] text-slate-200 font-sans flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-[#141A30] rounded-2xl border border-[#334155] shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-extrabold text-white mb-2">Payment successful 🎉</h1>
        <p className="text-slate-400 mb-6">Thank you! Your order has been placed.</p>
        {sessionId && <p className="text-xs text-slate-500 mb-6">Session: {sessionId}</p>}
        <Link href="/browse" className="inline-block px-6 py-3.5 rounded-xl bg-[#35BFFF] text-white font-bold hover:bg-sky-500">
          Continue browsing
        </Link>
      </div>
    </main>
  )
}