'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

// Define the full list of categories
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

// Define the mapping of subcategories to their parent
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

// --- Component to render an individual Gig Card ---
function GigCard({ gig }: { gig: any }) {
  const price = gig.price_cents ? (gig.price_cents / 100).toFixed(2) : 'N/A'
  const rating = gig.rating ? parseFloat(gig.rating).toFixed(1) : 'New'
  
  return (
    <Link
      key={gig.id}
      href={`/services/${gig.slug}`}
      className="bg-[#0f172a] rounded-xl shadow-lg hover:shadow-2xl transition duration-300 p-0 flex flex-col group focus:outline-none focus:ring-4 focus:ring-sky-500/50 border border-[#1e293b] hover:border-sky-500/50 backdrop-blur-sm"
      tabIndex={0}
    >
      {/* Image with subtle hover effect */}
      <div className="h-44 w-full rounded-t-xl bg-[#1e293b] overflow-hidden flex items-center justify-center">
        <img
          src={gig.cover_image_url || 'https://via.placeholder.com/400x200?text=AI+Service'}
          alt={gig.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={e => {
            e.currentTarget.src = 'https://via.placeholder.com/400x200?text=AI+Service'
          }}
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        {/* Title and Description */}
        <div className="text-lg font-semibold text-white mb-2 group-hover:text-sky-400 transition line-clamp-2">
          {gig.title}
        </div>
        <div className="text-sm text-slate-400 mb-3 line-clamp-2 min-h-[2.5rem]">{gig.description}</div>
        
        {/* Rating and Reviews */}
        <div className="flex items-center gap-4 text-sky-400 text-xs mb-3 mt-auto pt-2 border-t border-[#1e293b] justify-between">
          <div className='flex items-center gap-1'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27l6.18 3.73-1.64-7.03 5.46-4.73-7.19-.61L12 2.11 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z"/></svg>
              <span className='font-bold text-sm'>{rating}</span>
              {gig.reviews > 0 && <span className="text-slate-500 text-xs">({gig.reviews} reviews)</span>}
          </div>
          
          {/* Price */}
          <div className="text-xl font-extrabold text-white">
            ${price}
          </div>
        </div>
      </div>
    </Link>
  )
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
  
  // Custom hook to fetch gigs whenever filters change
  useEffect(() => {
    const supabase = createSupabaseBrowser()
    
    async function fetchGigs() {
      setLoading(true)
      
      // Base query: Select all fields from 'gigs'
      let req = supabase.from('gigs').select('*')

      // 1. Search Query Filter (Title)
      if (query.trim()) {
        req = req.ilike('title', `%${query}%`)
      }
      
      // 2. Category Filter
      if (category !== 'All') {
        req = req.eq('category', category)
      }
      
      // 3. Subcategory Filter
      // NOTE: Subcategory is filtered by checking if the title includes the subcategory keyword.
      if (selectedSub) {
        req = req.ilike('title', `%${selectedSub}%`)
      }
      
      // 4. Price Filters (Min/Max)
      if (minPrice && !isNaN(Number(minPrice))) {
        req = req.gte('price_cents', Math.floor(Number(minPrice) * 100))
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        req = req.lte('price_cents', Math.floor(Number(maxPrice) * 100))
      }

      // 5. Sorting
      if (sort === 'price_low') {
        req = req.order('price_cents', { ascending: true })
      } else if (sort === 'price_high') {
        req = req.order('price_cents', { ascending: false })
      } else if (sort === 'newest') {
        req = req.order('created_at', { ascending: false })
      } else if (sort === 'best') {
        // Compound sort: Order by sales (desc) then by rating (desc)
        req = req.order('sales', { ascending: false, nullsFirst: false })
        req = req.order('rating', { ascending: false, nullsFirst: false })
      }

      const { data, error } = await req.limit(100) // Limit to 100 for performance
      
            if (!error && data) {
          setGigs(data)
      } else {
          console.error("Error fetching gigs:", JSON.stringify(error))
          setGigs([])
      }
      setLoading(false)
    }
    
    fetchGigs()
    // eslint-disable-next-line
  }, [query, category, minPrice, maxPrice, selectedSub, sort])

  // Function to handle category change and clear subcategory
  const handleCategoryChange = (cat: string) => {
    setCategory(cat)
    setSelectedSub('')
  }

  // Function to handle price input cleanup
  const handleClearPrice = () => {
    setMinPrice('')
    setMaxPrice('')
  }


  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 font-sans">
      <section className="w-full pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
          
          {/* --- Sidebar Filters --- */}
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-[#0f172a]/70 rounded-2xl shadow-xl border border-[#1e293b]/80 p-6 sticky top-24 backdrop-blur-md">
              
              {/* Category Filter */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-sky-400 mb-4 tracking-tight">Browse Categories</h2>
                <div className="flex flex-col gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition w-full text-left flex items-center justify-between ${
                        category === cat
                          ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-900/40'
                          : 'bg-transparent text-slate-300 border-[#1e293b] hover:bg-sky-900/20'
                      }`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      {cat}
                      {category === cat && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Subcategories Filter (Only shows when a main category is selected) */}
              {category !== 'All' && subcategories[category as keyof typeof subcategories] && (
                <div className="mb-6 border-t border-[#1e293b] pt-4">
                  <h3 className="text-sm font-semibold text-sky-300 mb-3 tracking-wide uppercase">Refine by {category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {subcategories[category as keyof typeof subcategories].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition whitespace-nowrap ${
                          selectedSub === sub
                            ? 'bg-sky-500 text-white border-sky-500'
                            : 'bg-transparent text-slate-300 border-sky-900/50 hover:bg-sky-900/40'
                        }`}
                        onClick={() => setSelectedSub(selectedSub === sub ? '' : sub)}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Budget Filter */}
              <div className="mb-6 border-t border-[#1e293b] pt-4">
                <h3 className="text-sm font-semibold text-sky-300 mb-3 tracking-wide uppercase">Budget (USD)</h3>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-medium">$</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-20 px-3 py-2 rounded-lg border border-[#334155] bg-[#1e293b] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  <span className="text-slate-400 font-medium">to</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-20 px-3 py-2 rounded-lg border border-[#334155] bg-[#1e293b] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  />
                  {(minPrice || maxPrice) && (
                    <button
                      type="button"
                      className="text-slate-400 hover:text-red-400 transition"
                      onClick={handleClearPrice}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search Box */}
              <div className='border-t border-[#1e293b] pt-4'>
                <h3 className="text-sm font-semibold text-sky-300 mb-3 tracking-wide uppercase">Keyword Search</h3>
                <input
                  type="text"
                  name="q"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search titles, skills..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#334155] bg-[#1e293b] text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                />
              </div>
            </div>
          </aside>
          
          {/* --- Main Content Area --- */}
          <div className="flex-1">
            {/* Header and Sort */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 border-b border-[#1e293b] pb-4">
              <div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1">
                  {category === 'All' ? 'All AI Services' : `${category} Services`}
                </h1>
                <div className="text-slate-400 text-sm font-medium">
                  {loading ? 'Fetching results...' : `${gigs.length} high-quality gigs found.`}
                  {selectedSub && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-sky-900/50 text-sky-300 font-semibold text-xs border border-sky-700/50">
                      {selectedSub}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Sort dropdown */}
              <div>
                <select
                  className="px-4 py-2.5 rounded-xl border border-[#334155] bg-[#0f172a] text-sm text-slate-100 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 transition cursor-pointer"
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  style={{ backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2394a3b8'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg>\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center' }}
                >
                  <option value="best">Best Selling (Default)</option>
                  <option value="newest">Newest Listings</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>
            
            {/* Gigs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loading ? (
                // Modernized Loading State
                Array(8).fill(0).map((_, i) => (
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
                  <p className='font-semibold mb-2'>🔍 No services match your current filters.</p>
                  <p className='text-sm text-slate-500'>Try adjusting your search query, category, or budget.</p>
                </div>
              ) : (
                gigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Global styles for dark theme look */}
      <style jsx global>{`
        body {
          background-color: #030712;
          color: #f1f5f9;
        }
        /* Refined Scrollbar Styles */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { 
          background: #0ea5e9; 
          border-radius: 4px;
          border: 2px solid #030712; /* Border matches body color for floating effect */
        }
        ::-webkit-scrollbar-track { background: #1f2937; }
      `}</style>
    </main>
  )
}