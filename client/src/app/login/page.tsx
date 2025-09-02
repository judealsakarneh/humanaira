'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'
import Link from 'next/link'

function isPasswordValid(password: string) {
  // At least 8 chars, one letter, one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)
}

export default function LoginPage() {
  const supabase = createSupabaseBrowser()
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'signup') {
      if (!isPasswordValid(password)) {
        toast.error('Password must be at least 8 characters and include a letter and a number.')
        return
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match!')
        return
      }
    }
    setLoading(true)
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) toast.error(error.message)
      else {
  toast.success('Signed in!')
  window.location.href = '/'
}
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      })
      if (error) toast.error(error.message)
else window.location.href = '/signup-success'    }
    setLoading(false)
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    })
    if (error) toast.error(error.message)
    else toast.success('Password reset email sent!')
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          {mode === 'signin'
            ? 'Sign in to Zentask AI'
            : mode === 'signup'
            ? 'Create your Zentask AI account'
            : 'Forgot Password'}
        </h1>
        {mode === 'forgot' ? (
          <form onSubmit={handleForgot}>
            <input
              className="border border-gray-300 rounded w-full p-3 mt-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300"
            >
              {loading ? 'Please wait...' : 'Send reset link'}
            </button>
            <div className="mt-6 text-center text-sm">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode('signin')}
                type="button"
              >
                ← Back to Sign in
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAuth}>
            {mode === 'signup' && (
              <input
                className="border border-gray-300 rounded w-full p-3 mt-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Your Name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            )}
            <input
              className="border border-gray-300 rounded w-full p-3 mt-2 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="you@email.com"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="border border-gray-300 rounded w-full p-3 mt-4 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
            {mode === 'signup' && (
              <>
                <input
                  className="border border-gray-300 rounded w-full p-3 mt-4 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <div className="text-xs text-gray-500 mt-2 mb-1">
                  Password must be at least 8 characters and include a letter and a number.
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring focus:ring-blue-300"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        )}
        {mode !== 'forgot' && (
          <div className="mt-4 text-right">
            <button
              className="text-blue-600 hover:underline text-xs"
              onClick={() => setMode('forgot')}
              type="button"
            >
              Forgot password?
            </button>
          </div>
        )}
        <div className="mt-6 text-center text-sm">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode('signup')}
                type="button"
              >
                Sign up
              </button>
            </>
          ) : mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setMode('signin')}
                type="button"
              >
                Sign in
              </button>
            </>
          ) : null}
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}