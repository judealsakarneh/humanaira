'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

export default function GigsListPage() {
  const [gigs, setGigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGigs() {
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setGigs(data || [])
      setLoading(false)
    }
    fetchGigs()
  }, [])

  if (loading) return <div className="pt-24 text-center text-blue-600">Loading gigs...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 py-20 px-2">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-blue-900 text-center tracking-tight drop-shadow">
          My Gigs
        </h1>
        {gigs.length === 0 && (
          <div className="text-center text-gray-500">No gigs posted yet.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {gigs.map(gig => (
            <div
              key={gig.id}
              className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 p-6 flex flex-col gap-4 transition hover:scale-[1.025] hover:shadow-blue-200"
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
                  <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center text-blue-200">No media</div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-1">{gig.title}</h2>
                <p className="text-blue-500 text-sm mb-1">{gig.category}</p>
                <p className="text-gray-700 mb-2 line-clamp-2">{gig.description}</p>
                <div className="font-bold text-blue-700 text-lg mb-1">${(gig.price_cents / 100).toFixed(2)}</div>
                <div className="text-xs text-gray-400 mb-2">Delivery: {gig.delivery_time_days} day(s)</div>
                <Link
                  href={`/seller/gigs/${gig.slug}`}
                  className="inline-block mt-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white text-sm font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}