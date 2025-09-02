'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

export default function UserMenu({ user }: { user: any }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowser()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials =
    user?.user_metadata?.name
      ? user.user_metadata.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
      : user?.email?.slice(0, 2).toUpperCase()

  const avatarUrl = user?.user_metadata?.avatar_url

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg hover:bg-blue-700 transition focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[220px] bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
          <button
            className="w-full text-left px-5 py-3 hover:bg-blue-50 text-gray-700 text-base font-medium"
            onClick={() => {
              setOpen(false)
              router.push('/account')
            }}
          >
            Account
          </button>
          <Link
            href="/seller/dashboard"
            className="block px-5 py-3 hover:bg-blue-50 text-gray-700 text-base font-medium"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/seller/gigs/new"
            className="block px-5 py-3 hover:bg-blue-50 text-gray-700 text-base font-medium"
            onClick={() => setOpen(false)}
          >
            Post a Gig
          </Link>
          <Link
            href="/saved"
            className="block px-5 py-3 hover:bg-blue-50 text-gray-700 text-base font-medium"
            onClick={() => setOpen(false)}
          >
            Saved Gigs
          </Link>
          <button
            className="w-full text-left px-5 py-3 hover:bg-blue-50 text-gray-700 text-base font-medium"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}