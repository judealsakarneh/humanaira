'use client'
import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
// NOTE: Ensure these imports are correct in your project structure
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser' 
import Link from 'next/link'

// Inline SVG Icon Components (Lucide style) for a modern look
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
    
    // Auth logic preserved
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) toast.error(error.message)
      else {
        toast.success('Signed in successfully! Redirecting...')
        // NOTE: Use a slight delay for toast visibility before redirect
        setTimeout(() => window.location.href = '/', 500)
      }
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } } // Changed 'name' to 'full_name' for common practice
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
    // Forgot password logic preserved
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    })
    if (error) toast.error(error.message)
    else toast.success('Password reset email sent! Check your inbox.')
    setLoading(false)
  }

  // Determine button label based on mode and loading state
  const buttonLabel = useMemo(() => {
    if (loading) return 'Processing...'
    if (mode === 'signin') return 'Sign In Securely'
    if (mode === 'signup') return 'Create Account'
    return 'Send Reset Link'
  }, [loading, mode]);

  // Handle mode change reset
  const changeMode = (newMode: typeof mode) => {
    setMode(newMode);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-gray-100 font-inter relative overflow-hidden p-4">
      {/* Dynamic Animated Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sky-700 opacity-10 blur-3xl animate-blob-one" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-700 opacity-10 blur-3xl animate-blob-two" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-blue-700 opacity-10 blur-3xl animate-blob-three" />
      </div>

      {/* Main Form Container - Glassy Card */}
      <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-slate-700/50 px-6 py-10 sm:p-10 relative z-10 transform transition-all duration-300">
        
        {/* Header and Branding */}
        <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-white mb-1 text-center tracking-tight">
            {mode === 'signin'
              ? 'Welcome Back'
              : mode === 'signup'
              ? 'Join humanaira'
              : 'Trouble Logging In?'}
          </h1>
          <p className="text-slate-400 text-sm text-center">
            {mode === 'signin' ? 'Sign in to access your AI freelance marketplace.' :
             mode === 'signup' ? 'Create your account in seconds.' : 
             'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' ? (
          <form onSubmit={handleForgot} className="space-y-6">
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="pl-10 pr-4 py-3 border border-slate-700 rounded-xl w-full bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
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
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-sky-900/50 transition transform hover:scale-[1.01] active:scale-[0.99] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {buttonLabel}
            </button>
            
            <div className="mt-6 text-center text-sm">
              <button
                className="text-sky-400 hover:text-sky-300 transition"
                onClick={() => changeMode('signin')}
                type="button"
              >
                ← Back to Sign in
              </button>
            </div>
          </form>
        ) : (
          /* SIGN IN / SIGN UP FORM */
          <form onSubmit={handleAuth} className="space-y-6">
            
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  className="pl-10 pr-4 py-3 border border-slate-700 rounded-xl w-full bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  placeholder="Your Full Name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            )}
            
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="pl-10 pr-4 py-3 border border-slate-700 rounded-xl w-full bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="pl-10 pr-4 py-3 border border-slate-700 rounded-xl w-full bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
            </div>

            {mode === 'signup' && (
              <>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    className="pl-10 pr-4 py-3 border border-slate-700 rounded-xl w-full bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="text-xs text-slate-400 pt-1">
                  Password requires 8+ characters, including one letter and one number.
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold text-lg shadow-lg shadow-sky-900/50 transition transform hover:scale-[1.01] active:scale-[0.99] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {buttonLabel}
            </button>
            
            {mode === 'signin' && (
              <div className="text-right text-sm pt-1">
                <button
                  className="text-sky-400 hover:text-sky-300 transition"
                  onClick={() => changeMode('forgot')}
                  type="button"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </form>
        )}

        {/* Footer Toggle and Home Link */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm relative z-10">
          {mode === 'signin' ? (
            <p className="text-slate-400">
              Don't have an account?{' '}
              <button
                className="text-sky-400 hover:text-sky-300 font-semibold transition"
                onClick={() => changeMode('signup')}
                type="button"
              >
                Sign up now
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p className="text-slate-400">
              Already have an account?{' '}
              <button
                className="text-sky-400 hover:text-sky-300 font-semibold transition"
                onClick={() => changeMode('signin')}
                type="button"
              >
                Sign in
              </button>
            </p>
          ) : null}
          
          <div className="mt-4">
            <Link href="/" className="text-slate-500 hover:text-slate-400 text-xs transition">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
      
      {/* CSS for custom background animations */}
      <style jsx global>{`
        /* Blob Animation Keyframes */
        @keyframes blob-one {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes blob-two {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          40% {
            transform: translate(-30px, 40px) scale(1.2);
          }
          80% {
            transform: translate(10px, -30px) scale(0.8);
          }
        }
        @keyframes blob-three {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(0px, 0px) scale(1.3);
          }
        }
        
        .animate-blob-one {
          animation: blob-one 15s infinite alternate ease-in-out;
        }
        .animate-blob-two {
          animation: blob-two 18s infinite alternate-reverse ease-in-out;
        }
        .animate-blob-three {
          animation: blob-three 12s infinite linear;
        }

        /* Input field focus glow */
        input:focus {
          box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.5); /* ring-sky-500 equivalent */
        }
      `}</style>
    </main>
  )
}
