'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

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
// Replaced with a clean, balanced cog icon
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
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gigs, setGigs] = useState<any[]>([])

  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        setError('You must be logged in to view this page.')
        setLoading(false)
        return
      }

      const user = session.user
      setUser(user)

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profileData) {
        console.error('Profile load error:', profileError?.message)
        setError('Could not load your full profile details.')
      } else {
        setProfile(profileData)
        if (profileData.is_freelancer) {
          fetchGigs(user.id)
        }
      }

      setLoading(false)
    }

    async function fetchGigs(userId: string) {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (!error && data) setGigs(data)
      else console.error('Gigs load error:', error?.message)
    }

    fetchUser()
  }, [])

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-medium text-blue-400">Loading your account dashboard...</div>
      </div>
    )
  }

  // Error
  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="bg-red-900/30 border border-red-700 p-8 rounded-xl shadow-xl text-center">
          <div className="text-xl font-bold text-red-400 mb-3">Authentication Required</div>
          <div className="text-red-300 text-sm">{error}</div>
          <Link href="/login" className="mt-4 inline-block px-4 py-2 bg-red-600 rounded-lg text-white font-semibold hover:bg-red-700 transition">
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
      {/* Subtle Blue Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-700 rounded-full blur-[150px] opacity-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-700 rounded-full blur-[150px] opacity-15" />
      </div>

      <section className="relative z-10 w-full max-w-4xl bg-slate-900/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-black/50 border border-slate-800 p-6 sm:p-10">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Account Overview</h1>
        <p className="text-slate-400 text-lg mb-8">Manage your profile and service offerings.</p>

        {/* Profile Header and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 border-b border-slate-800 pb-8 mb-8">
          <div className="flex items-center gap-6">
            <img
              src={profile?.avatar_url || 'https://placehold.co/80x80/1e293b/94a3b8?text=AI'}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-blue-600 object-cover bg-slate-800 flex-shrink-0"
            />
            <div>
              <div className="text-2xl font-bold text-white mb-1">{profile?.username || user?.email || 'User'}</div>
              <div className="text-blue-300 text-sm font-mono">{user?.email}</div>
              <div className="text-xs text-slate-500 mt-1 break-all">ID: {user?.id}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3">
            <Link
              href="/account/edit"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-600 transition text-sm shadow-md shadow-blue-900/50"
            >
              <EditIcon className="w-4 h-4" /> Edit Profile
            </Link>
            <Link
              href="/account/settings"
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-blue-300 font-semibold hover:bg-slate-700 transition text-sm border border-slate-700"
            >
              <SettingsIcon className="w-4 h-4" /> Settings
            </Link>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-white">Biography</h3>
            <Link href="/account/edit" className="text-sm text-blue-400 hover:text-blue-300 transition">
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

        {/* Freelancer Dashboard - updated to blue theme */}
        {profile?.is_freelancer && (
          <div className="mt-12 p-8 bg-slate-900 border border-blue-900/70 rounded-2xl shadow-xl shadow-blue-950/20">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Freelancer Hub</h2>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <Link
                href="/seller/gigs/new"
                className="flex flex-col items-center p-4 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-blue-600/50"
              >
                <PlusCircle className="w-6 h-6 mb-2" />
                <span className="text-sm">Post a New Gig</span>
              </Link>
              <Link
                href="/seller/gigs"
                className="flex flex-col items-center p-4 rounded-xl bg-slate-800 text-blue-300 font-semibold hover:bg-slate-700 transition border border-blue-800"
              >
                <ListChecks className="w-6 h-6 mb-2" />
                <span className="text-sm">Manage My Gigs</span>
              </Link>
              <Link
                href="/seller/orders"
                className="flex flex-col items-center p-4 rounded-xl bg-slate-800 text-blue-300 font-semibold hover:bg-slate-700 transition border border-blue-800"
              >
                <ShoppingBag className="w-6 h-6 mb-2" />
                <span className="text-sm">View Orders</span>
              </Link>
            </div>

            {/* My Gigs */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-blue-300 mb-4 border-b border-blue-900 pb-2">
                My Active Gigs ({gigs.length})
              </h3>
              {gigs.length === 0 ? (
                <div className="text-slate-400 italic py-6 text-center bg-slate-800/50 rounded-lg">
                  You haven't posted any services yet. Start earning today!
                </div>
              ) : (
                <ul className="space-y-4">
                  {gigs.map((gig) => (
                    <li
                      key={gig.id}
                      className="bg-slate-800 hover:bg-slate-700/70 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition duration-200 cursor-pointer"
                      onClick={() => router.push(`/seller/gigs/${gig.slug}`)}
                    >
                      <img
                        src={gig.cover_image_url || 'https://placehold.co/64x64/1e3a8a/e0f2fe?text=GIG'}
                        alt={gig.title}
                        className="w-16 h-16 rounded-lg object-cover border border-blue-600 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-200">{gig.title}</div>
                        <div className="text-blue-400 text-sm font-mono">{gig.category}</div>
                        <div className="text-slate-400 text-xs mt-1 truncate max-w-full">
                          Tags: {gig.tags && Array.isArray(gig.tags) && gig.tags.length > 0 ? gig.tags.join(', ') : 'N/A'}
                        </div>
                      </div>
                      <Link
                        href={`/seller/gigs/${gig.slug}`}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition text-sm flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}