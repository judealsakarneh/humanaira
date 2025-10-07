'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

export default function GigsListPage() {
  const router = useRouter()
  const [gigs, setGigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkFreelancerAndFetchGigs() {
      const supabase = createSupabaseBrowser()
      // Get current session
      const { data: { user }, error: sessionError } = await supabase.auth.getUser()
      if (sessionError || !user) {
        setError('You must be logged in to view this page.')
        setLoading(false)
        return
      }
      setUserId(user.id)
      // Check freelancer status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_freelancer')
        .eq('id', user.id)
        .single()
      if (profileError || !profileData) {
        setError('Could not load your profile.')
        setLoading(false)
        return
      }
      if (!profileData.is_freelancer) {
        setError('Only freelancers can access this page.')
        setLoading(false)
        setTimeout(() => router.replace('/account'), 2000)
        return
      }
      setProfile(profileData)
      // Fetch gigs for this seller
      const { data: gigsData, error: gigsError } = await supabase
        .from('gigs')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
      if (gigsError) {
        setError('Could not load your gigs.')
        setLoading(false)
        return
      }
      setGigs(gigsData || [])
      setLoading(false)
    }
    checkFreelancerAndFetchGigs()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a10]">
        <div className="text-blue-400 text-lg font-semibold animate-pulse">Loading your gigs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a10]">
        <div className="text-red-400 text-lg font-semibold">{error}</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#090a10] py-20 px-2 overflow-hidden">
      {/* Dreamy gradients background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400 rounded-full blur-[120px] opacity-20" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-700 rounded-full blur-[120px] opacity-20" />
      </div>
      <main className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <h1 className="text-4xl font-extrabold text-blue-100 tracking-tight drop-shadow text-center md:text-left">
            My Gigs
          </h1>
          <Link
            href="/seller/gigs/new"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-500 text-white font-bold shadow-lg hover:from-blue-800 hover:to-blue-600 transition text-lg"
          >
            + Post a New Gig
          </Link>
        </div>
        {gigs.length === 0 && (
          <div className="text-center text-blue-300 text-lg mt-16">You have not posted any gigs yet.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {gigs.map(gig => (
            <div
              key={gig.id}
              className="bg-[#181a23] rounded-3xl shadow-2xl border border-blue-900/60 p-6 flex flex-col gap-4 transition hover:scale-[1.025] hover:shadow-blue-700/40"
            >
              <div className="flex gap-2 overflow-x-auto pb-2">
                {gig.media_urls && gig.media_urls.length > 0 ? (
                  gig.media_urls.map((url: string, idx: number) =>
                    url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video key={idx} src={url} controls className="w-24 h-24 rounded-xl object-cover border" />
                    ) : (
                      <img key={idx} src={url} alt="Gig Media" className="w-24 h-24 rounded-xl object-cover border" />
                    )
                  )
                ) : (
                  <div className="w-24 h-24 bg-blue-950 rounded-xl flex items-center justify-center text-blue-400 border border-blue-900/60">
                    No media
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-100 mb-1">{gig.title}</h2>
                <p className="text-blue-400 text-sm mb-1">{gig.category}</p>
                <p className="text-blue-200 mb-2 line-clamp-2">{gig.description}</p>
                <div className="font-bold text-blue-400 text-lg mb-1">${(gig.price_cents / 100).toFixed(2)}</div>
                <div className="text-xs text-blue-500 mb-2">Delivery: {gig.delivery_time_days} day(s)</div>
                <div className="flex gap-2">
                  <Link
                    href={`/seller/gigs/${gig.slug}`}
                    className="px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition text-sm"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/seller/gigs/${gig.slug}/edit`}
                    className="px-4 py-2 rounded-lg bg-blue-950 text-blue-200 font-semibold hover:bg-blue-900 transition text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}