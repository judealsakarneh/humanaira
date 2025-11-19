'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const supabase = createSupabaseBrowser()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function isPasswordValid(password: string) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isPasswordValid(password)) {
      toast.error('Password must be at least 8 characters and include a letter and a number.')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated! You can now sign in.')
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Reset Password</h1>
        {success ? (
          <div className="text-center">
            <p className="mb-4 text-green-600">Your password has been reset!</p>
            <Link href="/login" className="text-blue-600 hover:underline text-sm">
              ← Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset}>
            <input
              className="border border-gray-300 rounded w-full p-3 mt-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="New Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <input
              className="border border-gray-300 rounded w-full p-3 mt-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <div className="text-xs text-gray-500 mt-2 mb-1">
              Password must be at least 8 characters and include a letter and a number.
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300"
            >
              {loading ? 'Please wait...' : 'Reset Password'}
            </button>
          </form>
        )}
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}