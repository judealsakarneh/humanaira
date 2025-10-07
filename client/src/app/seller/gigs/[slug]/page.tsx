'use client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../../../api/lib/supabaseBrowser'

export default function GigDetailsPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [gig, setGig] = useState<any>(null)
  const [pkgs, setPkgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [seller, setSeller] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    async function fetchGig() {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('slug', slug)
        .single()
      if (!error && data) {
        setGig(data)
        setSelectedImage(data.cover_image_url || (data.media_urls && data.media_urls[0]) || null)
        const { data: pkgsData } = await supabase
          .from('gig_packages')
          .select('*')
          .eq('gig_id', data.id)
          .order('tier', { ascending: true })
        setPkgs(pkgsData || [])
        // Fetch seller info
        if (data.seller_id) {
          const { data: sellerData } = await supabase
            .from('users')
            .select('id, full_name, avatar_url, bio, email')
            .eq('id', data.seller_id)
            .single()
          setSeller(sellerData)
        }
      } else {
        setErrorMsg('Gig not found')
      }
      setLoading(false)
    }
    if (slug) fetchGig()
  }, [slug])

  // Get minimum price from packages or fallback to gig.price_cents
  const minPrice = pkgs.length > 0
    ? Math.min(...pkgs.map(pkg => pkg.price_cents))
    : gig?.price_cents || 0

  if (loading) {
    return (
      <main className="bg-[#090a10] min-h-screen flex items-center justify-center font-inter">
        <div className="text-blue-300 text-xl font-semibold animate-pulse">Loading gig details...</div>
      </main>
    )
  }

  if (!gig) {
    return (
      <main className="bg-[#090a10] min-h-screen flex items-center justify-center font-inter">
        <div className="text-red-400 text-xl font-semibold">{errorMsg || 'Gig not found'}</div>
      </main>
    )
  }

  return (
    <main className="bg-[#090a10] min-h-screen font-inter">
      <div className="max-w-7xl mx-auto px-4 py-12 pt-24 md:pt-28">
        {/* Breadcrumbs */}
        <nav className="text-sm text-blue-200 mb-8 flex items-center gap-2">
          <Link href="/seller/gigs" className="hover:text-blue-400 transition">My Gigs</Link>
          <span>/</span>
          <span className="text-blue-400 font-semibold">{gig.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Gig Details */}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">{gig.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-blue-400 font-semibold">{gig.category}</span>
              {gig.tags && gig.tags.length > 0 && (
                <>
                  <span className="text-blue-700">|</span>
                  <span className="flex gap-2 flex-wrap">
                    {gig.tags.map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-900 text-blue-200 text-xs font-semibold">#{tag}</span>
                    ))}
                  </span>
                </>
              )}
            </div>

            {/* Image Gallery */}
            {(gig.cover_image_url || (gig.media_urls && gig.media_urls.length > 0)) && (
              <div className="mb-8">
                <div className="w-full flex flex-col items-center">
                  {selectedImage && (
                    selectedImage.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        src={selectedImage}
                        controls
                        className="w-full max-w-2xl h-80 object-cover rounded-2xl shadow-lg border border-blue-900 mb-4"
                      />
                    ) : (
                      <img
                        src={selectedImage}
                        alt={gig.title}
                        className="w-full max-w-2xl h-80 object-cover rounded-2xl shadow-lg border border-blue-900 mb-4"
                      />
                    )
                  )}
                  {/* Thumbnails */}
                  <div className="flex gap-2 flex-wrap justify-center">
                    {gig.media_urls && gig.media_urls.map((url: string, idx: number) => (
                      url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video
                          key={idx}
                          src={url}
                          className={`w-20 h-16 object-cover rounded border cursor-pointer ${selectedImage === url ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => setSelectedImage(url)}
                        />
                      ) : (
                        <img
                          key={idx}
                          src={url}
                          alt={`Thumbnail ${idx + 1}`}
                          className={`w-20 h-16 object-cover rounded border cursor-pointer ${selectedImage === url ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => setSelectedImage(url)}
                        />
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-2 text-blue-300">Service Description</h2>
              <p className="text-blue-100 text-lg leading-relaxed">{gig.description}</p>
            </div>

            {/* Packages */}
            {pkgs && pkgs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2 text-blue-300">Packages</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {pkgs.map((pkg, idx) => (
                    <div key={pkg.tier} className="bg-[#181a23] border border-blue-900 rounded-xl p-5 flex flex-col gap-2 shadow">
                      <div className="font-semibold mb-1 text-blue-200">{pkg.tier}</div>
                      <div className="text-blue-400 font-bold text-xl mb-1">${(pkg.price_cents / 100).toFixed(2)}</div>
                      <div className="text-blue-100 text-sm mb-1">{pkg.description}</div>
                      <div className="text-xs text-blue-300 mb-1">Delivery: {pkg.delivery_days} day(s)</div>
                      <div className="text-xs text-blue-300">Revisions: {pkg.revisions}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-8">
              <Link href="/seller/gigs" className="text-blue-400 hover:text-blue-600 text-lg font-semibold underline">
                ← Back to My Gigs
              </Link>
            </div>
          </div>

          {/* Right: Seller Info */}
          <aside className="w-full lg:w-[350px] flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-[#181a23] rounded-2xl shadow-xl border border-blue-900 p-8 mb-8">
                <div className="flex flex-col items-center">
                  {seller?.avatar_url ? (
                    <img
                      src={seller.avatar_url}
                      alt={seller.full_name}
                      className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-blue-900"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-blue-900 flex items-center justify-center text-3xl text-blue-200 mb-3">
                      <span>👤</span>
                    </div>
                  )}
                  <div className="font-bold text-lg text-blue-300 mb-1">{seller?.full_name || 'Freelancer'}</div>
                  {seller?.bio && (
                    <div className="text-blue-100 font-medium mb-2 text-center">{seller.bio}</div>
                  )}
                  {seller?.email && (
                    <div className="text-blue-200 text-sm">{seller.email}</div>
                  )}
                </div>
              </div>
              {/* Order Summary */}
              <div className="bg-[#101a2a] rounded-2xl shadow border border-blue-900 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-200">Starting at</span>
                  <span className="text-2xl font-bold text-blue-400">
                    ${minPrice ? (minPrice / 100).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}