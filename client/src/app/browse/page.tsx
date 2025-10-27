'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

type GigRow = {
  id: string
  slug: string
  title: string
  category: string | null
  description: string | null
  cover_image_url: string | null
  media_urls: string[] | null
  price_cents: number | null
  delivery_time_days: number | null
  rating?: number | null
  reviews?: number | null
  sales?: number | null
  created_at?: string
}

type CategoryRow = {
  key: string
  label: string
  group_name: string | null
  active: boolean
  sort: number
}

type SuggestedTagRow = { tag: string }

const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test((url || '').split('?')[0])
const isVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v|avi|mkv|ogg)$/i.test((url || '').split('?')[0])

function GigCard({ gig }: { gig: GigRow }) {
  const price = gig.price_cents ? (gig.price_cents / 100).toFixed(2) : 'N/A'
  const rating = typeof gig.rating === 'number' ? gig.rating.toFixed(1) : 'New'
  const hasReviews = typeof gig.reviews === 'number' && gig.reviews > 0

  // Choose best media: prefer image cover, else first media (image/video)
  let mediaType: 'image' | 'video' | 'none' = 'none'
  let mediaUrl: string | undefined

  if (gig.cover_image_url && isImageUrl(gig.cover_image_url)) {
    mediaType = 'image'
    mediaUrl = gig.cover_image_url
  } else if (gig.media_urls && gig.media_urls.length > 0) {
    const first = gig.media_urls[0]
    if (isImageUrl(first)) {
      mediaType = 'image'
      mediaUrl = first
    } else if (isVideoUrl(first)) {
      mediaType = 'video'
      mediaUrl = first
    }
  }

  return (
    <Link
      href={`/services/${gig.slug}`}
      className="bg-[#0f172a] rounded-xl shadow-lg hover:shadow-2xl transition duration-300 flex flex-col group focus:outline-none focus:ring-4 focus:ring-sky-500/30 border border-[#1e293b] hover:border-sky-500/50 backdrop-blur-sm"
    >
      <div className="h-44 w-full rounded-t-xl bg-[#111827] overflow-hidden relative">
        {mediaType === 'image' && mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl}
            alt={gig.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/800x400/0B1024/CBD5E1?text=Humanaira+Service'
            }}
          />
        ) : mediaType === 'video' && mediaUrl ? (
          <div className="h-full w-full bg-black flex items-center justify-center relative">
            <video src={mediaUrl} muted className="h-full max-w-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/70 text-slate-100 border border-slate-700">
                VIDEO
              </span>
            </div>
          </div>
        ) : (
          <div className="h-full w-full bg-[#0B1024] flex items-center justify-center">
            <span className="text-slate-500 text-sm">No media</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="text-lg font-semibold text-white mb-2 group-hover:text-sky-400 transition line-clamp-2">
          {gig.title}
        </div>
        <div className="text-sm text-slate-400 mb-3 line-clamp-2 min-h-[2.5rem]">{gig.description}</div>

        <div className="flex items-center gap-4 text-sky-400 text-xs mt-auto pt-3 border-t border-[#1e293b] justify-between">
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27l6.18 3.73-1.64-7.03 5.46-4.73-7.19-.61L12 2.11 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z" />
            </svg>
            <span className="font-bold text-sm">{rating}</span>
            {hasReviews && <span className="text-slate-500 text-xs">({gig.reviews} reviews)</span>}
          </div>

        <div className="text-xl font-extrabold text-white">${price}</div>
        </div>
      </div>
    </Link>
  )
}

export default function BrowsePage() {
  const supabase = useMemo(() => createSupabaseBrowser(), [])
  const [gigs, setGigs] = useState<GigRow[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState<'best' | 'newest' | 'price_low' | 'price_high'>('best')

  // Dynamic categories and suggested tags
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagsLoading, setTagsLoading] = useState(false)

  // Freelancer check to show/hide "+ Post a Gig"
  const [isFreelancer, setIsFreelancer] = useState<boolean>(false)
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          if (mounted) setIsFreelancer(false)
          return
        }
        const { data: prof } = await supabase
          .from('profiles')
          .select('is_freelancer')
          .eq('id', user.id)
          .maybeSingle()
        if (mounted) setIsFreelancer(Boolean(prof?.is_freelancer))
      } catch {
        if (mounted) setIsFreelancer(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [supabase])

  // Load categories once
  useEffect(() => {
    async function loadCategories() {
      setCategoriesLoading(true)
      setCategoriesError(null)
      try {
        const { data, error } = await supabase
          .from('gig_categories')
          .select('key,label,group_name,active,sort')
          .eq('active', true)
          .order('group_name', { ascending: true, nullsFirst: true })
          .order('sort', { ascending: true })
          .order('label', { ascending: true })

        if (error) throw error
        setCategories((data as CategoryRow[]) || [])
      } catch (e: any) {
        setCategoriesError(e?.message || 'Failed to load categories')
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [supabase])

  // Load suggested tags when category changes
  useEffect(() => {
    async function loadTags() {
      if (!selectedCategory || selectedCategory === 'all') {
        setSuggestedTags([])
        setSelectedTags([])
        return
      }
      setTagsLoading(true)
      try {
        const { data, error } = await supabase
          .from('category_suggested_tags')
          .select('tag')
          .eq('category_key', selectedCategory)
          .order('tag', { ascending: true })

        if (error) throw error
        setSuggestedTags(((data as SuggestedTagRow[]) || []).map((r) => r.tag))
      } catch {
        setSuggestedTags([])
      } finally {
        setTagsLoading(false)
      }
    }
    loadTags()
  }, [selectedCategory, supabase])

  // Fetch gigs whenever filters change
  useEffect(() => {
    async function fetchGigs() {
      setLoading(true)
      try {
        let req = supabase.from('gigs').select('*')

        // Search across title and description
        const q = query.trim()
        if (q) {
          req = req.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        }

        // Category
        if (selectedCategory !== 'all') {
          req = req.eq('category', selectedCategory)
        }

        // Tags filter (OR behavior): show gigs that have ANY of the selected tags
        if (selectedTags.length > 0) {
          req = req.overlaps('tags', selectedTags)
        }

        // Price filters
        if (minPrice && !isNaN(Number(minPrice))) {
          req = req.gte('price_cents', Math.floor(Number(minPrice) * 100))
        }
        if (maxPrice && !isNaN(Number(maxPrice))) {
          req = req.lte('price_cents', Math.floor(Number(maxPrice) * 100))
        }

        // Sorting
        if (sort === 'price_low') {
          req = req.order('price_cents', { ascending: true, nullsFirst: true })
        } else if (sort === 'price_high') {
          req = req.order('price_cents', { ascending: false, nullsFirst: true })
        } else if (sort === 'newest') {
          req = req.order('created_at', { ascending: false, nullsFirst: true })
        } else if (sort === 'best') {
          req = req
            .order('sales', { ascending: false, nullsFirst: true })
            .order('rating', { ascending: false, nullsFirst: true })
            .order('created_at', { ascending: false, nullsFirst: true })
        }

        const { data, error } = await req.limit(100)
        if (error) throw error
        setGigs((data as GigRow[]) || [])
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching gigs:', e)
        setGigs([])
      } finally {
        setLoading(false)
      }
    }
    fetchGigs()
  }, [supabase, query, selectedCategory, selectedTags, minPrice, maxPrice, sort])

  const groupedCategories = useMemo(() => {
    const map = new Map<string, CategoryRow[]>()
    for (const c of categories) {
      const g = c.group_name || 'Other'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(c)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [categories])

  const categoryLabelByKey = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of categories) map.set(c.key, c.label)
    return map
  }, [categories])

  const currentCategoryLabel =
    selectedCategory === 'all' ? 'All AI Services' : categoryLabelByKey.get(selectedCategory) || 'Services'

  const handleClearBudget = useCallback(() => {
    setMinPrice('')
    setMaxPrice('')
  }, [])

  const toggleTag = useCallback(
    (t: string) => {
      setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
    },
    [setSelectedTags]
  )

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans">
      <section className="w-full pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-[#0f172a]/70 rounded-2xl shadow-xl border border-[#1e293b]/80 p-6 sticky top-24 backdrop-blur-md">
              {/* Categories */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-sky-400 mb-4 tracking-tight">Browse Categories</h2>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition w-full text-left flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-900/40'
                        : 'bg-transparent text-slate-300 border-[#1e293b] hover:bg-sky-900/20'
                    }`}
                    onClick={() => {
                      setSelectedCategory('all')
                      setSelectedTags([])
                    }}
                  >
                    All
                    {selectedCategory === 'all' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                      </svg>
                    )}
                  </button>

                  {categoriesLoading ? (
                    <div className="h-10 rounded-xl bg-[#111827] animate-pulse" />
                  ) : categoriesError ? (
                    <div className="text-rose-300 text-sm">{categoriesError}</div>
                  ) : (
                    groupedCategories.map(([group, items]) => (
                      <div key={group} className="mt-2">
                        <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">{group}</div>
                        <div className="flex flex-col gap-2">
                          {items.map((cat) => (
                            <button
                              key={cat.key}
                              type="button"
                              className={`px-4 py-2 rounded-xl border text-sm font-medium transition w-full text-left flex items-center justify-between ${
                                selectedCategory === cat.key
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-900/40'
                                  : 'bg-transparent text-slate-300 border-[#1e293b] hover:bg-sky-900/20'
                              }`}
                              onClick={() => {
                                setSelectedCategory(cat.key)
                                setSelectedTags([])
                              }}
                            >
                              {cat.label}
                              {selectedCategory === cat.key && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recommended tags */}
              {selectedCategory !== 'all' && (
                <div className="mb-6 border-t border-[#1e293b] pt-4">
                  <h3 className="text-sm font-semibold text-sky-300 mb-3 tracking-wide uppercase">Recommended tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tagsLoading ? (
                      <div className="h-6 w-40 rounded bg-[#111827] animate-pulse" />
                    ) : suggestedTags.length === 0 ? (
                      <div className="text-slate-500 text-xs">No suggestions.</div>
                    ) : (
                      suggestedTags.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`px-3 py-1 rounded-full border text-xs font-medium transition whitespace-nowrap ${
                            selectedTags.includes(t)
                              ? 'bg-sky-500 text-white border-sky-500'
                              : 'bg-transparent text-slate-300 border-sky-900/50 hover:bg-sky-900/40'
                          }`}
                          onClick={() => toggleTag(t)}
                          title="Filter by tag"
                        >
                          {selectedTags.includes(t) ? '✓ ' : '+ '}
                          {t}
                        </button>
                      ))
                    )}
                  </div>

                  {selectedTags.length > 0 && (
                    <button
                      type="button"
                      className="mt-3 text-xs text-slate-400 hover:text-rose-300 transition underline underline-offset-2"
                      onClick={() => setSelectedTags([])}
                    >
                      Clear tag filters
                    </button>
                  )}
                </div>
              )}

              {/* Budget */}
              <div className="mb-6 border-t border-[#1e293b] pt-4">
                <h3 className="text-sm font-semibold text-sky-300 mb-3 tracking-wide uppercase">Budget (USD)</h3>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-medium">$</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-20 px-3 py-2 rounded-lg border border-[#334155] bg-[#1e293b] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <span className="text-slate-400 font-medium">to</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-20 px-3 py-2 rounded-lg border border-[#334155] bg-[#1e293b] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  {(minPrice || maxPrice) && (
                    <button type="button" className="text-slate-400 hover:text-rose-400 transition" onClick={handleClearBudget} title="Clear budget">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="border-t border-[#1e293b] pt-4">
                <h3 className="text-sm font-semibold text-sky-300 mb-3 tracking-wide uppercase">Keyword Search</h3>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search titles, descriptions…"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Header and Sort */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 border-b border-[#1e293b] pb-4">
              <div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1">
                  {currentCategoryLabel}
                </h1>
                <div className="text-slate-400 text-sm font-medium">
                  {loading ? 'Fetching results…' : `${gigs.length} services found.`}
                  {selectedTags.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-sky-900/50 text-sky-300 font-semibold text-xs border border-sky-700/50">
                      {selectedTags.join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  className="px-4 py-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-sm text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 transition cursor-pointer"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg>%0A\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                  }}
                >
                  <option value="best">Best Selling (Default)</option>
                  <option value="newest">Newest Listings</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>

                {isFreelancer && (
                  <Link
                    href="/seller/gigs/new"
                    className="hidden md:inline-flex px-5 py-2.5 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
                  >
                    + Post a Gig
                  </Link>
                )}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loading ? (
                Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-[#0f172a] rounded-xl shadow border border-[#1e293b] animate-pulse">
                      <div className="h-44 w-full rounded-t-xl bg-[#1e293b]/50"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-[#1e293b]/70 rounded w-3/4"></div>
                        <div className="h-3 bg-[#1e293b]/50 rounded w-full"></div>
                        <div className="h-3 bg-[#1e293b]/50 rounded w-5/6"></div>
                        <div className="h-4 bg-sky-600/50 rounded w-1/4 pt-2 mt-4"></div>
                      </div>
                    </div>
                  ))
              ) : gigs.length === 0 ? (
                <div className="col-span-full text-center py-16 text-slate-300 text-xl border-2 border-dashed border-sky-900/50 rounded-xl bg-[#0f172a]/50">
                  <p className="font-semibold mb-2">🔍 No services match your current filters.</p>
                  <p className="text-sm text-slate-500">Try adjusting your search query, category, tags, or budget.</p>
                </div>
              ) : (
                gigs.map((gig) => <GigCard key={gig.id} gig={gig} />)
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Global styles */}
      <style jsx global>{`
        body {
          background-color: #030712;
          color: #f1f5f9;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #0ea5e9;
          border-radius: 4px;
          border: 2px solid #030712;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
      `}</style>
    </main>
  )
}