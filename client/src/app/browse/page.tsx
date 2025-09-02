'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

const FAKE_GIGS = [
  // Design
  {
    id: 1,
    slug: 'ai-logo-design',
    title: 'I will design a modern AI logo',
    description: 'Get a unique, AI-generated logo with 3 variations and full branding colors.',
    cover_image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 52,
    price_cents: 4000,
    category: 'Design',
  },
  {
    id: 2,
    slug: 'ai-website-design',
    title: 'I will create a stunning AI-powered website design',
    description: 'Responsive, modern web design using AI tools. Figma or PSD included.',
    cover_image_url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 28,
    price_cents: 7000,
    category: 'Design',
  },
  // Writing
  {
    id: 3,
    slug: 'ai-blog-writer',
    title: 'I will write SEO blog articles with AI',
    description: 'High-quality, original blog posts (300-1000 words) delivered in 24h.',
    cover_image_url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 33,
    price_cents: 2500,
    category: 'Writing',
  },
  {
    id: 4,
    slug: 'ai-product-descriptions',
    title: 'I will generate product descriptions with AI',
    description: 'Catchy, SEO-friendly product descriptions for your e-commerce store.',
    cover_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 19,
    price_cents: 1800,
    category: 'Writing',
  },
  {
    id: 5,
    slug: 'ai-ebook-writer',
    title: 'I will write an eBook using AI',
    description: 'Get a 10-page eBook on your topic, researched and written with AI.',
    cover_image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 12,
    price_cents: 12000,
    category: 'Writing',
  },
  // Voiceover
  {
    id: 6,
    slug: 'ai-voiceover-female',
    title: 'I will record an AI voiceover (female, US accent)',
    description: 'Professional AI voiceover, up to 60 seconds, delivered in MP3/WAV.',
    cover_image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    reviews: 17,
    price_cents: 1000,
    category: 'Voiceover',
  },
  {
    id: 7,
    slug: 'ai-voiceover-male',
    title: 'I will record an AI voiceover (male, UK accent)',
    description: 'Natural-sounding AI voiceover, up to 90 seconds, any script.',
    cover_image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 14,
    price_cents: 1200,
    category: 'Voiceover',
  },
  // Automation
  {
    id: 8,
    slug: 'ai-chatbot-setup',
    title: 'I will build a custom AI chatbot for your website',
    description: 'Conversational AI chatbot setup and integration for your business.',
    cover_image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 21,
    price_cents: 6000,
    category: 'Automation',
  },
  {
    id: 9,
    slug: 'ai-email-automation',
    title: 'I will automate your email campaigns with AI',
    description: 'Set up smart, personalized email flows using AI tools.',
    cover_image_url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 11,
    price_cents: 3500,
    category: 'Automation',
  },
  // Video
  {
    id: 10,
    slug: 'ai-video-editing',
    title: 'I will edit your video with AI tools',
    description: 'Fast, creative video editing using the latest AI-powered software.',
    cover_image_url: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 40,
    price_cents: 3500,
    category: 'Video',
  },
  {
    id: 11,
    slug: 'ai-video-captions',
    title: 'I will add AI-generated captions to your videos',
    description: 'Accurate, fast captions for YouTube, TikTok, and more.',
    cover_image_url: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 22,
    price_cents: 900,
    category: 'Video',
  },
  {
    id: 12,
    slug: 'ai-video-avatars',
    title: 'I will create AI video avatars for your brand',
    description: 'Custom talking avatars for explainer or promo videos.',
    cover_image_url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 8,
    price_cents: 8000,
    category: 'Video',
  },
  // Development
  {
    id: 13,
    slug: 'ai-code-review',
    title: 'I will review your code with AI tools',
    description: 'Get feedback and suggestions for your codebase using AI.',
    cover_image_url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 16,
    price_cents: 5000,
    category: 'Development',
  },
  {
    id: 14,
    slug: 'ai-api-integration',
    title: 'I will integrate AI APIs into your app',
    description: 'Add OpenAI, Stability, or other AI APIs to your web or mobile app.',
    cover_image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 10,
    price_cents: 9000,
    category: 'Development',
  },
  {
    id: 15,
    slug: 'ai-data-cleaning',
    title: 'I will clean and preprocess your data with AI',
    description: 'Automated data cleaning and formatting for ML projects.',
    cover_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 7,
    price_cents: 3000,
    category: 'Development',
  },
  // Marketing
  {
    id: 16,
    slug: 'ai-social-posts',
    title: 'I will generate social media posts with AI',
    description: 'Engaging posts for Twitter, LinkedIn, and Instagram, tailored to your brand.',
    cover_image_url: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 29,
    price_cents: 1800,
    category: 'Marketing',
  },
  {
    id: 17,
    slug: 'ai-ad-copy',
    title: 'I will write ad copy with AI',
    description: 'High-converting ad copy for Google, Facebook, and more.',
    cover_image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 18,
    price_cents: 2200,
    category: 'Marketing',
  },
  {
    id: 18,
    slug: 'ai-keyword-research',
    title: 'I will do AI-powered keyword research',
    description: 'Find the best keywords for your SEO strategy using AI.',
    cover_image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 13,
    price_cents: 2700,
    category: 'Marketing',
  },
  // Other
  {
    id: 19,
    slug: 'ai-presentation',
    title: 'I will create an AI-generated presentation',
    description: 'Slides, graphics, and content for business or school.',
    cover_image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 15,
    price_cents: 3200,
    category: 'Other',
  },
  {
    id: 20,
    slug: 'ai-photo-enhance',
    title: 'I will enhance your photos with AI',
    description: 'Upscale, restore, and colorize your images using AI.',
    cover_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 20,
    price_cents: 1500,
    category: 'Other',
  },
  {
    id: 21,
    slug: 'ai-voice-clone',
    title: 'I will clone your voice with AI',
    description: 'Create a digital version of your voice for fun or business.',
    cover_image_url: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 6,
    price_cents: 5000,
    category: 'Other',
  },
  {
    id: 22,
    slug: 'ai-language-translation',
    title: 'I will translate documents with AI',
    description: 'Fast, accurate translation for 20+ languages using AI.',
    cover_image_url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 9,
    price_cents: 2500,
    category: 'Other',
  },
]

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
      if (minPrice) {
        req = req.gte('price_cents', Number(minPrice) * 100)
      }
      if (maxPrice) {
        req = req.lte('price_cents', Number(maxPrice) * 100)
      }

      const { data, error } = await req
      if (!error && data) setGigs(data)
      setLoading(false)
    }
    setLoading(true)
    fetchGigs()
    // eslint-disable-next-line
  }, [query, category, minPrice, maxPrice])

  // Filtering for fake gigs if no real gigs
  let displayGigs = gigs
  if (!loading && gigs.length === 0) {
    displayGigs = FAKE_GIGS.filter(gig => {
      const matchesQuery = !query.trim() || gig.title.toLowerCase().includes(query.trim().toLowerCase())
      const matchesCategory = category === 'All' || gig.category === category
      const matchesSub = !selectedSub || gig.title.toLowerCase().includes(selectedSub.toLowerCase())
      const matchesMin = !minPrice || gig.price_cents >= Number(minPrice) * 100
      const matchesMax = !maxPrice || gig.price_cents <= Number(maxPrice) * 100
      return matchesQuery && matchesCategory && matchesSub && matchesMin && matchesMax
    })
  }

  // For a more filled look, use a denser grid and a sidebar for filters
  return (
    <main className="min-h-screen bg-neutral-100 text-gray-900 font-inter">
      <section className="w-full bg-white border-b border-gray-100 pt-16 pb-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
            <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-blue-900 mb-3">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition w-full text-left ${
                        category === cat
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'
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
                  <h3 className="text-sm font-semibold text-blue-800 mb-2">Subcategories</h3>
                  <div className="flex flex-wrap gap-2">
                    {subcategories[category].map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition ${
                          selectedSub === sub
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
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
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Budget</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-20 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-20 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {(minPrice || maxPrice) && (
                    <button
                      type="button"
                      className="px-2 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs"
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
                <h3 className="text-sm font-semibold text-blue-800 mb-2">Search</h3>
                <input
                  type="text"
                  name="q"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search gigs..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </aside>
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 font-sans mb-3 mt-2">
                  {category === 'All' ? 'All AI Services' : `${category} Gigs`}
                </h1>
                <div className="text-gray-500 text-base">
                  {displayGigs.length} results
                  {selectedSub && (
                    <span className="ml-2 text-blue-700 font-semibold">| {selectedSub}</span>
                  )}
                </div>
              </div>
              {/* Sort dropdown (placeholder) */}
              <div>
                <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <option>Best selling</option>
                  <option>Newest</option>
                  <option>Lowest price</option>
                  <option>Highest price</option>
                </select>
              </div>
            </div>
            {/* Gigs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center text-gray-500">Loading...</div>
              ) : displayGigs.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 text-lg">No gigs found.</div>
              ) : (
                displayGigs.map((gig) => (
                  <Link
                    key={gig.id}
                    href={`/services/${gig.slug}`}
                    className="bg-white rounded-2xl shadow hover:shadow-lg transition p-0 flex flex-col group focus:outline-none focus:ring-2 focus:ring-blue-400"
                    tabIndex={0}
                  >
                    <div className="h-40 w-full rounded-t-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
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
                      <div className="text-base font-semibold text-blue-700 mb-1 group-hover:underline font-sans line-clamp-2">
                        {gig.title}
                      </div>
                      <div className="text-xs text-gray-500 mb-2 line-clamp-2">{gig.description}</div>
                      <div className="flex items-center gap-2 text-blue-600 text-xs mb-2">
                        <span>★ {gig.rating ?? 'New'}</span>
                        {gig.reviews && <span className="text-gray-400">({gig.reviews})</span>}
                      </div>
                      <div className="mt-auto text-lg font-bold text-gray-900 font-sans">
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
    </main>
  )
}