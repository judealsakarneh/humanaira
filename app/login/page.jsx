'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

export default function LoginPage() {
  const supabase = createSupabaseBrowser()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const send = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) toast.error(error.message)
    else {
      setSent(true)
      toast.success('Check your email to finish sign-in.')
    }
  }

  return (
    <main className="max-w-md mx-auto pt-24 px-4">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      {!sent ? (
        <>
          <input
            className="border rounded w-full p-3 mt-4 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="you@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
          />
          <button
            onClick={send}
            className="mt-4 px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition focus:outline-none focus:ring focus:ring-blue-300"
          >
            Send magic link
          </button>
        </>
      ) : <p className="mt-4">Check your email to finish sign-in.</p>}
    </main>
  )
}