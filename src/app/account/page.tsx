'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

const BRAND = '#35BFFF'

// Initialize Supabase instance
const supabase = createSupabaseBrowser()

// Icons
const PlusCircle = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>
  </svg>
)
const ListChecks = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 14 5 5 9-9"/><path d="M14 6L8 12"/><path d="M19 6h5"/><path d="M14 18h10"/>
  </svg>
)
// Clean, balanced cog icon
const SettingsIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
)
const ShoppingBag = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const EditIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
  </svg>
)

const HEADER_HEIGHT = 64

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        setError('You must be logged in to view this page.')
        setLoading(false)
        return
      }

      const currentUser = session.user
      setUser(currentUser)

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (profileError || !profileData) {
        console.error('Profile load error:', profileError?.message)
        setError('Could not load your full profile details.')
      } else {
        setProfile(profileData)
      }

      setLoading(false)
    }

    fetchUser()
  }, [])

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div
          className="w-12 h-12 border-4 border-solid border-t-transparent rounded-full animate-spin mb-4"
          style={{ borderColor: BRAND }}
        />
        <div className="text-xl font-medium" style={{ color: BRAND }}>
          Loading your account dashboard...
        </div>
      </div>
    )
  }

  // Error
  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="bg-[rgba(53,191,255,0.10)] border border-[rgba(53,191,255,0.35)] p-8 rounded-xl shadow-xl text-center">
          <div className="text-xl font-bold mb-3" style={{ color: BRAND }}>Authentication Required</div>
          <div className="text-slate-300 text-sm">{error}</div>
          <Link
            href="/login"
            className="mt-4 inline-block px-4 py-2 rounded-lg font-semibold transition"
            style={{
              backgroundColor: BRAND,
              color: '#06121f',
              boxShadow: '0 8px 20px rgba(53,191,255,0.25)',
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  // Main
  return (
    <main
      className="min-h-screen w-full bg-slate-950 flex flex-col items-center pb-16 px-4 md:px-0 font-sans"
      style={{ paddingTop: HEADER_HEIGHT + 32 }}
    >
      {/* Subtle Brand Background Accents */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-[150px]" style={{ background: 'rgba(53,191,255,0.22)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[150px]" style={{ background: 'rgba(53,191,255,0.18)' }} />
      </div>

      <section className="relative z-10 w-full max-w-4xl bg-slate-900/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/50 border border-slate-800 p-6 sm:p-10">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Account Overview</h1>
        <p className="text-slate-300 text-lg mb-8">Manage your profile and service offerings.</p>

        {/* Profile Header and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 border-b border-slate-800 pb-8 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={profile?.avatar_url || 'https://placehold.co/80x80/1e293b/94a3b8?text=AI'}
              alt="User Avatar"
              className="w-20 h-20 rounded-full object-cover bg-slate-800 flex-shrink-0 border-4"
              style={{ borderColor: BRAND }}
            />
            <div>
              <div className="text-2xl font-bold text-white mb-1">{profile?.username || user?.email || 'User'}</div>
              <div className="text-sm font-mono" style={{ color: BRAND }}>{user?.email}</div>
              <div className="text-xs text-slate-500 mt-1 break-all">ID: {user?.id}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <Link
              href="/account/edit"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition text-sm"
              style={{
                backgroundColor: BRAND,
                color: '#06121f',
                boxShadow: '0 8px 20px rgba(53,191,255,0.25)',
              }}
            >
              <EditIcon className="w-4 h-4" /> Edit Profile
            </Link>
            <Link
              href="/account/settings"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition text-sm border bg-slate-800 hover:bg-slate-700"
              style={{ color: BRAND, borderColor: 'rgba(53,191,255,0.35)' }}
            >
              <SettingsIcon className="w-4 h-4" /> Settings
            </Link>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-white">Biography</h3>
            <Link href="/account/edit" className="text-sm transition" style={{ color: BRAND }}>
              Update Bio
            </Link>
          </div>
          <div
            className="text-slate-300 text-base p-4 bg-slate-800/50 border border-slate-800 rounded-xl min-h-[80px]"
            dangerouslySetInnerHTML={{
              __html: profile?.bio
                ? profile.bio
                : '<span class="italic text-slate-500">No professional bio set yet. Click "Update Bio" to add one.</span>',
            }}
          />
        </div>

        {/* Freelancer Dashboard - brand theme (without "My Active Gigs" section) */}
        {profile?.is_freelancer && (
          <div
            className="mt-12 p-8 bg-slate-900 rounded-2xl shadow-xl"
            style={{
              border: '1px solid rgba(53,191,255,0.35)',
              boxShadow: '0 20px 40px rgba(3,6,16,0.6), 0 0 0 1px rgba(53,191,255,0.08) inset',
            }}
          >
            <h2 className="text-3xl font-bold mb-6" style={{ color: BRAND }}>Freelancer Hub</h2>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/seller/gigs/new"
                className="flex flex-col items-center p-4 rounded-xl font-bold transition shadow-lg"
                style={{
                  backgroundColor: BRAND,
                  color: '#06121f',
                  boxShadow: '0 12px 26px rgba(53,191,255,0.25)',
                }}
              >
                <PlusCircle className="w-6 h-6 mb-2" />
                <span className="text-sm">Post a New Gig</span>
              </Link>
              <Link
                href="/seller/gigs"
                className="flex flex-col items-center p-4 rounded-xl font-semibold transition border bg-slate-800 hover:bg-slate-700"
                style={{ color: BRAND, borderColor: 'rgba(53,191,255,0.35)' }}
              >
                <ListChecks className="w-6 h-6 mb-2" />
                <span className="text-sm">Manage My Gigs</span>
              </Link>
              <Link
                href="/seller/orders"
                className="flex flex-col items-center p-4 rounded-xl font-semibold transition border bg-slate-800 hover:bg-slate-700"
                style={{ color: BRAND, borderColor: 'rgba(53,191,255,0.35)' }}
              >
                <ShoppingBag className="w-6 h-6 mb-2" />
                <span className="text-sm">View Orders</span>
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}