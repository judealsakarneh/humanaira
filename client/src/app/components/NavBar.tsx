'use client'
import Link from 'next/link'
import UserMenu from './UserMenu'
import { useSession } from '@supabase/auth-helpers-react'

export default function NavBar() {
  const session = useSession()
  const user = session?.user

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-black border-b border-gray-900 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="focus:outline-none group flex items-center">
          <span
            className="text-2xl font-extrabold tracking-tight cursor-pointer font-sans flex items-center select-none"
            style={{
              letterSpacing: '-0.04em',
              textShadow: '0 2px 8px #0f172a',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: '2rem',
              lineHeight: 1,
            }}
          >
            <span style={{ color: '#2563eb' }}>hum</span>
            <span style={{ color: '#fff' }}>anae</span>
            <span className="inline-block align-middle ml-2 w-2.5 h-2.5 rounded-full bg-blue-700 animate-pulse"></span>
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {!user ? (
          <Link
            href="/login"
            className="ml-2 px-4 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            Sign up / Login
          </Link>
        ) : (
          <UserMenu user={user} />
        )}
      </div>
    </nav>
  )
}