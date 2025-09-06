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
      else window.location.href = '/signup-success'
    }
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
    <main className="min-h-screen flex items-center justify-center bg-[#090a10] text-gray-100 font-inter relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#2563eb] via-[#38bdf8] to-[#0ea5e9] opacity-30 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-[#0ea5e9] via-[#2563eb] to-[#38bdf8] opacity-20 blur-2xl animate-pulse-slower" />
      </div>
      <div className="max-w-xl w-full bg-[#101a2a]/90 rounded-2xl shadow-2xl border border-blue-900 px-8 py-12 relative z-10">
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-200 mt-2 mb-2 text-center">
            {mode === 'signin'
              ? 'Sign in to humanaira'
              : mode === 'signup'
              ? 'Create your humanaira account'
              : 'Forgot Password'}
          </h1>
          <p className="text-blue-100 text-base text-center">AI-powered freelance marketplace</p>
        </div>
        {mode === 'forgot' ? (
          <form onSubmit={handleForgot} className="space-y-5">
            <input
              className="border border-blue-900 rounded-lg w-full p-3 bg-[#181a23] text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
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
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold text-lg shadow hover:from-[#1e40af] hover:to-[#0ea5e9] transition"
            >
              {loading ? 'Please wait...' : 'Send reset link'}
            </button>
            <div className="mt-6 text-center text-sm">
              <button
                className="text-blue-300 hover:underline"
                onClick={() => setMode('signin')}
                type="button"
              >
                ← Back to Sign in
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="space-y-5">
            {mode === 'signup' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border border-blue-900 rounded-lg w-full p-3 bg-[#181a23] text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Your Name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <input
                  className="border border-blue-900 rounded-lg w-full p-3 bg-[#181a23] text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="you@email.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <input
                  className="border border-blue-900 rounded-lg w-full p-3 bg-[#181a23] text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <input
                  className="border border-blue-900 rounded-lg w-full p-3 bg-[#181a23] text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            ) : (
              <>
                <input
                  className="border border-blue-900 rounded-lg w-full p-3 bg-[#181a23] text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="you@email.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <input
                  className="border border-blue-900 rounded-lg w-full p-3 bg-[#181a23] text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </>
            )}
            {mode === 'signup' && (
              <div className="text-xs text-blue-300 mt-2 mb-1">
                Password must be at least 8 characters and include a letter and a number.
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold text-lg shadow hover:from-[#1e40af] hover:to-[#0ea5e9] transition"
            >
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        )}
        {mode !== 'forgot' && (
          <div className="mt-4 flex justify-between items-center">
            <div />
            <button
              className="text-blue-300 hover:underline text-xs"
              onClick={() => setMode('forgot')}
              type="button"
            >
              Forgot password?
            </button>
          </div>
        )}
        <div className="mt-6 text-center text-sm flex flex-col items-center gap-2 relative z-10">
          {mode === 'signin' ? (
            <div className="flex flex-col items-center gap-2">
              <span>
                Don&apos;t have an account?{' '}
                <button
                  className="text-blue-300 hover:underline font-semibold inline"
                  onClick={() => setMode('signup')}
                  type="button"
                  style={{
                    position: 'static',
                    display: 'inline',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  Sign up
                </button>
              </span>
            </div>
          ) : mode === 'signup' ? (
            <div className="flex flex-col items-center gap-2">
              <span>
                Already have an account?{' '}
                <button
                  className="text-blue-300 hover:underline font-semibold inline"
                  onClick={() => setMode('signin')}
                  type="button"
                  style={{
                    position: 'static',
                    display: 'inline',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  Sign in
                </button>
              </span>
            </div>
          ) : null}
        </div>
        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-300 hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
      <style jsx global>{`
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(.4,0,.6,1) infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slow 12s cubic-bezier(.4,0,.6,1) infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </main>
  )
}