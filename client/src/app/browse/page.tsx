'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

const categories = [
  'All',
  'Writing',
  'Design',
  'Voiceover',
  'Automation',
  'Video',
  'Development',
  'Marketing',
  'Other',
]

const subcategories = {
  Writing: ['SEO Writing', 'Educational', 'Lifestyle Blogs', 'Promotional', 'Bulk Articles'],
  Design: ['Logo', 'Web', 'Branding', 'UI/UX'],
  Voiceover: ['Female', 'Male', 'Narration', 'Ads'],
  Automation: ['Chatbot', 'Email', 'Workflow'],
  Video: ['Editing', 'Captions', 'Avatars'],
  Development: ['Code Review', 'API', 'Data'],
  Marketing: ['Social', 'Ad Copy', 'Keyword'],
  Other: ['Presentation', 'Photo Enhance', 'Voice Clone', 'Translation'],
}

export default function BrowsePage() {
  const [gigs, setGigs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedSub, setSelectedSub] = useState('')
  const [sort, setSort] = useState('best')

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    async function fetchGigs() {
      let req = supabase.from('gigs').select('*').order('created_at', { ascending: false })

      if (query.trim()) {
        req = req.ilike('title', `%${query}%`)
      }
      if (category !== 'All') {
        req = req.eq('category', category)
      }
      if (selectedSub) {
        req = req.ilike('title', `%${selectedSub}%`)
      }
      if (minPrice) {
        req = req.gte('price_cents', Number(minPrice) * 100)
      }
      if (maxPrice) {
        req = req.lte('price_cents', Number(maxPrice) * 100)
      }
      if (sort === 'price_low') {
        req = req.order('price_cents', { ascending: true })
      } else if (sort === 'price_high') {
        req = req.order('price_cents', { ascending: false })
      } else if (sort === 'newest') {
        req = req.order('created_at', { ascending: false })
      } else {
        req = req.order('rating', { ascending: false })
      }

      const { data, error } = await req
      if (!error && data) setGigs(data)
      setLoading(false)
    }
    setLoading(true)
    fetchGigs()
    // eslint-disable-next-line
  }, [query, category, minPrice, maxPrice, selectedSub, sort])

  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter">
      <section className="w-full bg-[#090a10] border-b border-[#101a2a] pt-16 pb-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
            <div className="bg-[#101a2a] rounded-2xl shadow border border-[#1e293b] p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-blue-200 mb-3">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition w-full text-left ${
                        category === cat
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-[#101a2a] text-blue-100 border-[#1e293b] hover:bg-blue-900/40'
                      }`}
                      onClick={() => {
                        setCategory(cat)
                        setSelectedSub('')
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              {category !== 'All' && subcategories[category] && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-blue-300 mb-2">Subcategories</h3>
                  <div className="flex flex-wrap gap-2">
                    {subcategories[category].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition ${
                          selectedSub === sub
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-[#101a2a] text-blue-200 border-blue-900 hover:bg-blue-900/40'
                        }`}
                        onClick={() => setSelectedSub(selectedSub === sub ? '' : sub)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-blue-300 mb-2">Budget</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-20 px-2 py-1 rounded border border-[#1e293b] bg-[#181a23] text-sm text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-20 px-2 py-1 rounded border border-[#1e293b] bg-[#181a23] text-sm text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  {(minPrice || maxPrice) && (
                    <button
                      type="button"
                      className="px-2 py-1 rounded bg-blue-900 text-blue-100 hover:bg-blue-800 text-xs"
                      onClick={() => {
                        setMinPrice('')
                        setMaxPrice('')
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-300 mb-2">Search</h3>
                <input
                  type="text"
                  name="q"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search gigs..."
                  className="w-full px-3 py-2 rounded-lg border border-[#1e293b] bg-[#181a23] text-sm text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>
          </aside>
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-200 font-sans mb-3 mt-2">
                  {category === 'All' ? 'All AI Services' : `${category} Gigs`}
                </h1>
                <div className="text-blue-300 text-base">
                  {loading ? 'Loading...' : `${gigs.length} results`}
                  {selectedSub && (
                    <span className="ml-2 text-blue-400 font-semibold">| {selectedSub}</span>
                  )}
                </div>
              </div>
              {/* Sort dropdown */}
              <div>
                <select
                  className="px-4 py-2 rounded-lg border border-[#1e293b] bg-[#101a2a] text-sm text-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                >
                  <option value="best">Best selling</option>
                  <option value="newest">Newest</option>
                  <option value="price_low">Lowest price</option>
                  <option value="price_high">Highest price</option>
                </select>
              </div>
            </div>
            {/* Gigs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center text-blue-300">Loading...</div>
              ) : gigs.length === 0 ? (
                <div className="col-span-full text-center text-blue-200 text-lg">No gigs found.</div>
              ) : (
                gigs.map((gig) => (
                  <Link
                    key={gig.id}
                    href={`/services/${gig.slug}`}
                    className="bg-[#181a23] rounded-2xl shadow hover:shadow-lg transition p-0 flex flex-col group focus:outline-none focus:ring-2 focus:ring-blue-400 border border-[#1e293b]"
                    tabIndex={0}
                  >
                    <div className="h-40 w-full rounded-t-2xl bg-[#101a2a] overflow-hidden flex items-center justify-center">
                      <img
                        src={gig.cover_image_url || 'https://via.placeholder.com/400x200?text=No+Image'}
                        alt={gig.title}
                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                        onError={e => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x200?text=No+Image'
                        }}
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-base font-semibold text-blue-300 mb-1 group-hover:underline font-sans line-clamp-2">
                        {gig.title}
                      </div>
                      <div className="text-xs text-blue-200 mb-2 line-clamp-2">{gig.description}</div>
                      <div className="flex items-center gap-2 text-blue-400 text-xs mb-2">
                        <span>★ {gig.rating ?? 'New'}</span>
                        {gig.reviews && <span className="text-blue-300">({gig.reviews})</span>}
                      </div>
                      <div className="mt-auto text-lg font-bold text-blue-100 font-sans">
                        ${gig.price_cents ? (gig.price_cents / 100).toFixed(2) : 'N/A'}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <style jsx global>{`
        body {
          background: #090a10;
        }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#2563eb,#38bdf8); border-radius: 10px; }
        ::-webkit-scrollbar-track { background: #07102a; }
      `}</style>
    </main>
  )
}