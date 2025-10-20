'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

type UserMenuProps = {
  user: any
  avatarUrl?: string
  username?: string
}

// Icons (inline SVG)
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="15" width="7" height="6"/></svg>
)
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
)
const IconLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
)

// Avatar (new theme)
function UserAvatar({ avatarUrl, username }: { avatarUrl?: string; username?: string }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username || 'Profile'}
        className="w-10 h-10 rounded-xl object-cover border-2 border-sky-500 bg-[#10131e] transition duration-150"
        style={{ borderRadius: '0.65rem' }}
        onError={(e) => {
          e.currentTarget.onerror = null
          e.currentTarget.src = 'https://placehold.co/40x40/1f2937/ffffff?text=U'
        }}
      />
    )
  }
  return (
    <div
      className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold border-2 border-sky-500 text-lg transition duration-150"
      style={{ borderRadius: '0.65rem' }}
    >
      {username?.[0]?.toUpperCase() || '?'}
    </div>
  )
}

export default function UserMenu({ user, avatarUrl, username }: UserMenuProps) {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  const handleAccountClick = () => {
    setOpen(false)
    router.push('/account')
  }

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        className="w-10 h-10 rounded-xl flex items-center justify-center transition focus:outline-none focus:ring-4 focus:ring-sky-500/50"
        onClick={() => setOpen((v) => !v)}
        aria-label="User menu"
        style={{ borderRadius: '0.65rem' }}
      >
        <UserAvatar avatarUrl={avatarUrl} username={username} />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 min-w-[240px] bg-[#10131e] rounded-xl shadow-2xl shadow-black/90 p-1.5 border border-slate-700/50 backdrop-blur-sm animate-fade-in">
          <div className="px-3 pt-2 pb-3 border-b border-slate-700/50 mb-1">
            <div className="text-white font-semibold text-base">{username || 'User Profile'}</div>
            <div className="text-sky-400 text-xs">Signed in</div>
          </div>

          <button
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-100 text-sm font-medium transition duration-150 hover:bg-sky-500/15 hover:text-sky-300"
            onClick={handleAccountClick}
          >
            <IconUser />
            <span>Account Settings</span>
          </button>

          <Link
            href="/seller/dashboard"
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-100 text-sm font-medium transition duration-150 hover:bg-sky-500/15 hover:text-sky-300"
            onClick={() => setOpen(false)}
          >
            <IconDashboard />
            <span>Seller Dashboard</span>
          </Link>

          <Link
            href="/seller/gigs/new"
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-100 text-sm font-medium transition duration-150 hover:bg-sky-500/15 hover:text-sky-300"
            onClick={() => setOpen(false)}
          >
            <IconPlus />
            <span>Post a New Gig</span>
          </Link>

          <div className="border-t border-slate-700/50 mt-2 pt-1">
            <button
              className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-red-300 text-sm font-medium transition duration-150 hover:bg-red-900/15 hover:text-red-300"
              onClick={handleSignOut}
            >
              <IconLogOut />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  )
}