'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'
const supabase = createSupabaseBrowser()

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
      // Fetch profile from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profileError || !profileData) {
        setError('Could not load your profile.')
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
    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#0a0d14]">
        <div className="text-blue-400 text-lg font-semibold animate-pulse">Loading your account...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#0a0d14]">
        <div className="text-red-400 text-lg font-semibold">{error}</div>
      </div>
    )
  }

  return (
    <main
      className="min-h-screen w-full bg-[#090a10] flex flex-col items-center pb-12 px-2 md:px-0"
      style={{ paddingTop: HEADER_HEIGHT + 24 }}
    >
      {/* Gradient background for subtle effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-700 rounded-full blur-[120px] opacity-20" />
      </div>
      <section className="relative z-10 w-full max-w-3xl bg-[#181a23] rounded-2xl shadow-2xl border border-blue-900/60 p-8 mt-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <img
              src={profile?.avatar_url || '/default-avatar.png'}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-blue-700 object-cover bg-[#10131e]"
            />
            <div>
              <div className="text-2xl font-bold text-white mb-1">{profile?.username || 'Unnamed User'}</div>
              <div className="text-blue-200 text-sm">{user?.email}</div>
              <div className="text-xs text-slate-400 mt-1 break-all">User ID: {user?.id}</div>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <Link
              href="/account/edit"
              className="px-5 py-2 rounded-lg bg-blue-900 text-blue-200 font-semibold hover:bg-blue-800 transition text-sm border border-blue-700 text-center"
            >
              Edit Profile
            </Link>
            <Link
              href="/account/settings"
              className="px-5 py-2 rounded-lg bg-[#101a2a] text-blue-200 font-semibold hover:bg-blue-900/60 transition text-sm border border-blue-800 text-center"
            >
              Settings
            </Link>
          </div>
        </div>

        {/* Bio Section (Read Only) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-white font-semibold">Bio</div>
            <Link
              href="/account/edit"
              className="ml-2 text-xs text-blue-400 underline hover:text-blue-300"
            >
              Edit
            </Link>
          </div>
          <div
            className="text-slate-300 text-sm min-h-[40px] prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{
              __html: profile?.bio
                ? profile.bio
                : '<span class="italic text-slate-500">No bio set.</span>',
            }}
          />
        </div>

        <hr className="my-8 border-blue-900/40" />

        {/* Freelancer Dashboard */}
        {profile?.is_freelancer && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-blue-200">Freelancer Dashboard</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                href="/seller/gigs/new"
                className="flex-1 px-6 py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition text-center"
              >
                Post a New Gig
              </Link>
              <Link
                href="/seller/gigs"
                className="flex-1 px-6 py-3 rounded-md bg-blue-950 text-blue-200 font-semibold hover:bg-blue-900 transition text-center"
              >
                Manage My Gigs
              </Link>
              <Link
                href="/seller/orders"
                className="flex-1 px-6 py-3 rounded-md bg-blue-950 text-blue-200 font-semibold hover:bg-blue-900 transition text-center"
              >
                My Orders
              </Link>
            </div>
            {/* My Gigs List */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-blue-100 mb-2">My Gigs</h3>
              {gigs.length === 0 ? (
                <div className="text-blue-300">You have not posted any gigs yet.</div>
              ) : (
                <ul className="space-y-4">
                  {gigs.map(gig => (
                    <li key={gig.id} className="bg-[#10131e] border border-blue-800 rounded-xl p-4 flex items-center gap-4">
                      <img
                        src={gig.cover_image_url || '/default-gig.png'}
                        alt={gig.title}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-200">{gig.title}</div>
                        <div className="text-blue-400 text-sm">{gig.category}</div>
                        <div className="text-blue-300 text-xs">{gig.tags?.join(', ')}</div>
                      </div>
                      <Link
                        href={`/seller/gigs/${gig.slug}`}
                        className="px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
                      >
                        View
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