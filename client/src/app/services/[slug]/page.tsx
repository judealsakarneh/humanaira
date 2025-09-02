'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import { useSession } from '@supabase/auth-helpers-react'

export default function ServiceDetailsPage() {
  const { slug } = useParams()
  const [gig, setGig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [packages, setPackages] = useState<any[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | number | null>(null)
  const session = useSession()

  useEffect(() => {
    async function fetchGig() {
      setLoading(true)
      setError(null)
      const supabase = createSupabaseBrowser()
      // Fetch gig by slug
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('slug', slug)
        .single()
      if (error || !data) {
        setError('service not found')
        setGig(null)
        setLoading(false)
        return
      }
      setGig(data)
      // Fetch packages for this gig
      const { data: pkgs } = await supabase
        .from('gig_packages')
        .select('*')
        .eq('gig_id', data.id)
        .order('tier', { ascending: true })
      setPackages(pkgs || [])
      setLoading(false)
    }
    if (slug) fetchGig()
  }, [slug])

  // Check if gig is already saved
  useEffect(() => {
    async function checkSaved() {
      if (!session?.user || !gig?.id) {
        setIsSaved(false)
        setSavedId(null)
        return
      }
      const supabase = createSupabaseBrowser()
      const { data } = await supabase
        .from('saved_gigs')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('gig_id', gig.id)
        .single()
      if (data && data.id) {
        setIsSaved(true)
        setSavedId(data.id)
      } else {
        setIsSaved(false)
        setSavedId(null)
      }
    }
    checkSaved()
  }, [session, gig])

  async function handleSaveToggle() {
    setSaveMsg(null)
    if (!session?.user) {
      setSaveMsg('Please sign in to save gigs.')
      return
    }
    const supabase = createSupabaseBrowser()
    if (!isSaved) {
      // Save
      const { data, error } = await supabase
        .from('saved_gigs')
        .insert([{ user_id: session.user.id, gig_id: gig.id }])
        .select('id')
        .single()
      if (error) {
        setSaveMsg('Already saved or error occurred.')
      } else {
        setIsSaved(true)
        setSavedId(data.id)
        setSaveMsg('Saved!')
      }
    } else {
      // Unsave
      if (!savedId) return
      const { error } = await supabase
        .from('saved_gigs')
        .delete()
        .eq('id', savedId)
      if (error) {
        setSaveMsg('Could not unsave. Try again.')
      } else {
        setIsSaved(false)
        setSavedId(null)
        setSaveMsg('Removed from saved.')
      }
    }
  }

  if (loading) {
    return (
      <main className="bg-neutral-100 min-h-screen font-inter">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center text-gray-500 text-lg">Loading...</div>
      </main>
    )
  }

  if (error || !gig) {
    return (
      <main className="bg-neutral-100 min-h-screen font-inter">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center text-red-500 text-lg">
          {error || 'service not found'}
        </div>
      </main>
    )
  }

  return (
    <main className="bg-neutral-100 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto px-4 py-12 pt-24 md:pt-28">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-blue-700">Browse</Link>
          <span>/</span>
          <span className="text-gray-700 font-semibold">{gig.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Gig Details */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{gig.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-blue-700 font-semibold">{gig.category}</span>
              {gig.tags && gig.tags.length > 0 && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="flex gap-2 flex-wrap">
                    {gig.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-semibold">#{tag}</span>
                    ))}
                  </span>
                </>
              )}
            </div>
            {/* Cover Image */}
            {gig.cover_image_url && (
              <img
                src={gig.cover_image_url}
                alt={gig.title}
                className="w-full h-80 object-cover rounded-2xl shadow mb-8 border border-blue-100"
              />
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 text-blue-700">Service Description</h2>
              <p className="text-gray-800 text-lg">{gig.description}</p>
            </div>

            {/* Media Gallery */}
            {gig.media_urls && gig.media_urls.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-blue-700">Gallery</h2>
                <div className="flex gap-3 flex-wrap">
                  {gig.media_urls.map((url: string, idx: number) =>
                    url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video key={idx} src={url} className="w-40 h-28 rounded object-cover border" controls />
                    ) : (
                      <img key={idx} src={url} className="w-40 h-28 rounded object-cover border" alt="Media" />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Packages */}
            {packages && packages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2 text-blue-700">Packages</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {packages.map((pkg, idx) => (
                    <div key={pkg.tier} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
                      <div className="font-semibold mb-1">{pkg.tier}</div>
                      <div className="text-blue-700 font-bold text-lg mb-1">${(pkg.price_cents / 100).toFixed(2)}</div>
                      <div className="text-gray-700 text-sm mb-1">{pkg.description}</div>
                      <div className="text-xs text-gray-500 mb-1">Delivery: {pkg.delivery_days} day(s)</div>
                      <div className="text-xs text-gray-500">Revisions: {pkg.revisions}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button className="px-8 py-4 rounded-full bg-blue-700 text-white font-bold text-lg shadow hover:bg-blue-800 transition">
                Order Now
              </button>
              <button className="px-8 py-4 rounded-full bg-white text-blue-700 font-bold text-lg shadow border border-blue-700 hover:bg-blue-50 transition">
                Contact Seller
              </button>
              <button
                className={`px-8 py-4 rounded-full font-semibold text-lg shadow border transition ${
                  isSaved
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
                onClick={handleSaveToggle}
              >
                {isSaved ? 'SAVED' : 'Save for Later'}
              </button>
              {saveMsg && <div className="text-blue-700 mt-2">{saveMsg}</div>}
            </div>
          </div>

          {/* Right: Placeholder for Freelancer Summary */}
          <aside className="w-full lg:w-[350px] flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl text-blue-700 mb-3">
                    <span>👤</span>
                  </div>
                  <div className="font-bold text-lg text-blue-700 mb-1">Freelancer</div>
                  <div className="text-gray-700 font-medium mb-2">Seller info coming soon</div>
                </div>
              </div>
              {/* Order Summary */}
              <div className="bg-blue-50 rounded-2xl shadow border border-blue-100 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-700">Starting at</span>
                  <span className="text-2xl font-bold text-blue-700">
                    {packages && packages.length > 0
                      ? `$${(packages[0].price_cents / 100).toFixed(2)}`
                      : '$0.00'}
                  </span>
                </div>
                <button className="w-full mt-4 px-6 py-3 rounded-full bg-blue-700 text-white font-bold text-lg shadow hover:bg-blue-800 transition">
                  Continue to Order
                </button>
                <button className="w-full mt-3 px-6 py-3 rounded-full bg-white text-blue-700 font-bold text-lg shadow border border-blue-700 hover:bg-blue-50 transition">
                  Ask a Question
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}