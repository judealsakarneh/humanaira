'use client'
import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser' 
import Link from 'next/link'

// SVG Icon Components
const MailIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.83 1.83 0 0 1-2.06 0L2 7"/></svg>
);
const LockIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const UserIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

function isPasswordValid(password: string) {
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
        toast.success('Signed in successfully! Redirecting...')
        setTimeout(() => window.location.href = '/', 500)
      }
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) toast.error(error.message)
      else {
        toast.success('Account created! Check your email for confirmation.')
        setTimeout(() => window.location.href = '/signup-success', 500)
      }
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
    else toast.success('Password reset email sent! Check your inbox.')
    setLoading(false)
  }

  const buttonLabel = useMemo(() => {
    if (loading) return 'Processing...'
    if (mode === 'signin') return 'Sign In Securely'
    if (mode === 'signup') return 'Create Account'
    return 'Send Reset Link'
  }, [loading, mode]);

  const changeMode = (newMode: typeof mode) => {
    setMode(newMode);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#070D1C] via-[#0A0F1E] to-[#050A14] text-gray-100 font-inter relative overflow-hidden p-4">
      {/* Dynamic Animated Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#35BFFF]/10 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#2A9FE6]/10 blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#35BFFF]/5 blur-[100px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
      </div>

      {/* Main Form Container - Premium Glassy Card */}
      <div className="max-w-md w-full bg-gradient-to-br from-[#0D1328]/90 to-[#0A0F1E]/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-[#35BFFF]/30 px-8 py-12 relative z-10 transform transition-all duration-300">
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#35BFFF]/5 to-transparent pointer-events-none" />
        
        {/* Header and Branding */}
        <div className="mb-10 flex flex-col items-center relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#35BFFF] to-[#2A9FE6] flex items-center justify-center mb-4 shadow-lg shadow-[#35BFFF]/50">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 text-center tracking-tight bg-gradient-to-r from-white to-[#93C5FD] bg-clip-text text-transparent">
            {mode === 'signin'
              ? 'Welcome Back'
              : mode === 'signup'
              ? 'Join Humanaira'
              : 'Reset Password'}
          </h1>
          <p className="text-slate-400 text-sm text-center max-w-xs">
            {mode === 'signin' ? 'Access your AI freelance marketplace' :
             mode === 'signup' ? 'Create your account and start selling AI services' : 
             'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' ? (
          <form onSubmit={handleForgot} className="space-y-6 relative">
            <div className="relative group">
              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#35BFFF] transition-colors" />
              <input
                className="pl-12 pr-4 py-4 border-2 border-[#35BFFF]/20 rounded-xl w-full bg-[#0B1024] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/50 focus:border-[#35BFFF] transition-all"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#35BFFF] to-[#2A9FE6] text-white font-bold text-lg shadow-xl shadow-[#35BFFF]/30 transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#35BFFF]/40 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {buttonLabel}
            </button>
            
            <div className="mt-6 text-center text-sm">
              <button
                className="text-[#35BFFF] hover:text-[#2A9FE6] transition font-medium"
                onClick={() => changeMode('signin')}
                type="button"
              >
                ← Back to Sign in
              </button>
            </div>
          </form>
        ) : (
          /* SIGN IN / SIGN UP FORM */
          <form onSubmit={handleAuth} className="space-y-5 relative">
            
            {mode === 'signup' && (
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#35BFFF] transition-colors" />
                <input
                  className="pl-12 pr-4 py-4 border-2 border-[#35BFFF]/20 rounded-xl w-full bg-[#0B1024] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/50 focus:border-[#35BFFF] transition-all"
                  placeholder="Your Full Name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}
            
            <div className="relative group">
              <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#35BFFF] transition-colors" />
              <input
                className="pl-12 pr-4 py-4 border-2 border-[#35BFFF]/20 rounded-xl w-full bg-[#0B1024] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/50 focus:border-[#35BFFF] transition-all"
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="relative group">
              <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#35BFFF] transition-colors" />
              <input
                className="pl-12 pr-4 py-4 border-2 border-[#35BFFF]/20 rounded-xl w-full bg-[#0B1024] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/50 focus:border-[#35BFFF] transition-all"
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>
            
            {mode === 'signup' && (
              <div className="relative group">
                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#35BFFF] transition-colors" />
                <input
                  className="pl-12 pr-4 py-4 border-2 border-[#35BFFF]/20 rounded-xl w-full bg-[#0B1024] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/50 focus:border-[#35BFFF] transition-all"
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex justify-end">
                <button
                  onClick={() => changeMode('forgot')}
                  type="button"
                  className="text-sm text-[#35BFFF] hover:text-[#2A9FE6] transition font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#35BFFF] to-[#2A9FE6] text-white font-bold text-lg shadow-xl shadow-[#35BFFF]/30 transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#35BFFF]/40 active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {buttonLabel}
            </button>
            
            {mode === 'signup' && (
              <p className="text-xs text-slate-500 text-center">
                Password must be at least 8 characters with a letter and a number
              </p>
            )}
          </form>
        )}
        
        {/* Mode Switcher */}
        {mode !== 'forgot' && (
          <div className="mt-8 text-center border-t border-[#35BFFF]/20 pt-6">
            <p className="text-slate-400 text-sm">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => changeMode(mode === 'signin' ? 'signup' : 'signin')}
                type="button"
                className="text-[#35BFFF] hover:text-[#2A9FE6] transition font-bold ml-1"
              >
                {mode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        )}

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-[#35BFFF] transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
