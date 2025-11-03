'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

type Props = {
  user: any
  avatarUrl?: string
  username?: string
}

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
)
const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="15" width="7" height="6"/></svg>
)
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
)
const IconLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
)
const IconOrders = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7h18" />
    <path d="M5 7l1.5-3h11L19 7" />
    <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
    <path d="M8 11h8" />
    <path d="M8 15h6" />
  </svg>
)
const IconBell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
)

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

export default function UserMenu({ user, avatarUrl, username }: Props) {
  const supabase = createSupabaseBrowser()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [notifications, setNotifications] = useState<any[]>([])
  const [notifLoading, setNotifLoading] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const notifPanelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Load unread notifications and recent items
  useEffect(() => {
    let mounted = true
    if (!user) {
      setUnread(0)
      setNotifications([])
      setNotifLoading(false)
      return
    }

    async function loadNotifs() {
      setNotifLoading(true)
      try {
        const { data: unreadRows } = await supabase
          .from('notifications')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('read', false)

        const unreadCount = Array.isArray(unreadRows) ? unreadRows.length : (unreadRows ? 1 : 0)
        if (mounted) setUnread(unreadCount)

        const { data: recent } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6)

        if (mounted) setNotifications(recent || [])
      } catch (err) {
        // ignore for now
        console.error('load notifications', err)
      } finally {
        if (mounted) setNotifLoading(false)
      }
    }

    loadNotifs()

    // realtime subscription for notifications count (new & updates)
    const channel = supabase
      .channel(`public:notifications:user=${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        setUnread((u) => u + 1)
        setNotifications((prev) => [payload.new, ...prev].slice(0, 6))
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        // update in list
        setNotifications((prev) => prev.map(n => n.id === payload.new.id ? payload.new : n))
        // adjust unread count simply by recounting unread notifications (safer)
        ;(async () => {
          try {
            const { data: unreadRows } = await supabase.from('notifications').select('id').eq('user_id', user.id).eq('read', false)
            setUnread((unreadRows || []).length)
          } catch { /* noop */ }
        })()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      mounted = false
    }
  }, [user, supabase])

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

  const handleOpenMessages = () => {
    setOpen(false)
    router.push('/messages')
  }

  const markAsRead = async (id?: string) => {
    if (!user) return
    try {
      if (id) {
        await supabase.from('notifications').update({ read: true }).eq('id', id)
        setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n))
      } else {
        // mark all displayed as read
        const ids = notifications.filter(n => !n.read).map(n => n.id)
        if (ids.length > 0) {
          await supabase.from('notifications').update({ read: true }).in('id', ids)
          setNotifications((prev) => prev.map(n => ({ ...n, read: true })))
        }
      }
      // refresh unread count
      const { data: unreadRows } = await supabase.from('notifications').select('id').eq('user_id', user.id).eq('read', false)
      setUnread((unreadRows || []).length)
    } catch (err) {
      console.error('markAsRead error', err)
    }
  }

  // If no user — render a compact sign-in CTA
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/account" className="px-3 py-2 rounded-lg bg-slate-800 text-sky-300 hover:bg-slate-700 transition">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="relative z-50" ref={menuRef}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => { setOpen(v => !v); setNotifOpen(false) }}
          className="relative rounded-xl p-0.5 hover:bg-slate-800 transition"
          aria-label="Open user menu"
        >
          <UserAvatar avatarUrl={avatarUrl} username={username || user?.email || user?.id} />
        </button>

        <button
          onClick={() => { handleOpenMessages() }}
          className="relative px-2 py-1 rounded hover:bg-slate-800 transition text-sm text-slate-200 hidden sm:inline-flex"
          aria-label="Messages"
        >
          Messages
          {unread > 0 && <span className="ml-2 inline-flex items-center justify-center bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{unread}</span>}
        </button>

        {/* inline bell button that toggles notifications panel */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setOpen(false) }}
            className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-200"
            aria-label="Notifications"
            title="Notifications"
          >
            <span className="inline-flex items-center gap-1">
              <IconBell />
              {unread > 0 && <span className="ml-1 inline-flex items-center justify-center bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{unread}</span>}
            </span>
          </button>

          {notifOpen && (
            <div ref={notifPanelRef} className="absolute right-0 mt-2 w-[360px] max-w-[90vw] bg-[#0f172a] rounded-xl shadow-2xl border border-slate-700/60 p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-white">Notifications</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => markAsRead()} className="text-xs text-slate-300 hover:text-white">Mark all read</button>
                  <button onClick={() => setNotifOpen(false)} className="text-xs text-slate-400">Close</button>
                </div>
              </div>

              <div className="max-h-64 overflow-auto space-y-2">
                {notifLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-10 bg-[#09101a] rounded" />
                    <div className="h-10 bg-[#09101a] rounded" />
                    <div className="h-10 bg-[#09101a] rounded" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-slate-400 text-sm p-3">No notifications</div>
                ) : (
                  notifications.map((n: any) => (
                    <div key={n.id} className={`p-2 rounded-lg ${n.read ? 'bg-[#061018]' : 'bg-slate-900/60'} flex items-start gap-3`}>
                      <div className="flex-1">
                        <div className="text-sm text-slate-200 font-medium">{n.type}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{n.payload?.snippet || JSON.stringify(n.payload || {})}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</div>
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="text-xs text-sky-300 bg-sky-900/10 px-2 py-0.5 rounded"
                          >
                            Mark
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-3 text-center">
                <Link href="/notifications" className="text-sm text-sky-300 hover:underline">View all</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* main user menu */}
      {open && (
        <div className="absolute right-0 mt-3 min-w-[260px] bg-[#10131e] rounded-xl shadow-2xl shadow-black/90 p-1.5 border border-slate-700/50 backdrop-blur-sm animate-fade-in">
          <div className="px-3 pt-2 pb-3 border-b border-slate-700/50 mb-1">
            <div className="text-white font-semibold text-base">{username || user?.display_name || user?.email || 'User'}</div>
            <div className="text-sky-400 text-xs">Signed in</div>
          </div>

          <button
            onClick={handleAccountClick}
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-100 text-sm font-medium transition duration-150 hover:bg-sky-500/15 hover:text-sky-300"
          >
            <IconUser />
            <span>Account Settings</span>
          </button>

          <button
            onClick={handleOpenMessages}
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-100 text-sm font-medium transition duration-150 hover:bg-sky-500/15 hover:text-sky-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span>Messages</span>
            {unread > 0 && <span className="ml-auto inline-flex items-center justify-center bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{unread}</span>}
          </button>

          <Link
            href="/orders"
            onClick={() => setOpen(false)}
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-100 text-sm font-medium transition duration-150 hover:bg-sky-500/15 hover:text-sky-300"
          >
            <IconOrders />
            <span>My Orders</span>
          </Link>

          <Link
            href="/seller/dashboard"
            onClick={() => setOpen(false)}
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-100 text-sm font-medium transition duration-150 hover:bg-sky-500/15 hover:text-sky-300"
          >
            <IconDashboard />
            <span>Seller Dashboard</span>
          </Link>

          <Link
            href="/seller/gigs/new"
            onClick={() => setOpen(false)}
            className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg text-blue-100 text-sm font-medium transition duration-150 hover:bg-sky-500/15 hover:text-sky-300"
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