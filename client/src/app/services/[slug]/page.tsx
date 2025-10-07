'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
// NOTE: Ensure these imports are correct in your project structure
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser' 
import { useSession } from '@supabase/auth-helpers-react' 

// --- Component to render an Avatar based on email hash ---
// NOTE: You would need to install 'blueimp-md5' or similar for MD5 hashing
function Avatar({ email, name }: { email: string | undefined, name: string | undefined }) {
  // Placeholder for gravatar hashing logic (assuming 'md5' is available or use a simple placeholder)
  const hash = email ? (email.length % 100) : '' // Simple placeholder hash
  const url = email
    ? `https://www.gravatar.com/avatar/${hash}?d=identicon&s=96`
    : null
    
  if (url) {
    return (
      <img
        src={url}
        alt={name || 'Seller'}
        className="w-24 h-24 rounded-full object-cover border-4 border-sky-600 ring-4 ring-sky-900/50 bg-[#1e293b]"
        style={{ minWidth: 96, minHeight: 96 }}
      />
    )
  }
  
  return (
    <div className="w-24 h-24 rounded-full bg-sky-900 flex items-center justify-center text-4xl text-sky-300 font-bold border-4 border-sky-600 ring-4 ring-sky-900/50">
      {name ? name[0].toUpperCase() : 'U'}
    </div>
  )
}

// --- Main Service Details Page Component ---
export default function ServiceDetailsPage() {
  const { slug } = useParams()
  const [gig, setGig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [packages, setPackages] = useState<any[]>([])
  const [isSaved, setIsSaved] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | number | null>(null)
  const [seller, setSeller] = useState<any>(null)
  const [activePackage, setActivePackage] = useState<any>(null)
  const session = useSession()

  // 1. Fetch Gig and Packages
  useEffect(() => {
    async function fetchGig() {
      setLoading(true)
      setError(null)
      const supabase = createSupabaseBrowser()

      // Fetch Gig
      const { data: gigData, error: gigError } = await supabase
        .from('gigs')
        .select('*')
        .eq('slug', slug)
        .single()
      
      if (gigError || !gigData) {
        setError('Service not found or an error occurred.')
        setGig(null)
        setLoading(false)
        return
      }
      setGig(gigData)

      // Fetch Packages
      const { data: pkgs } = await supabase
        .from('gig_packages')
        .select('*')
        .eq('gig_id', gigData.id)
        .order('tier', { ascending: true })
      
      const sortedPkgs = pkgs || []
      setPackages(sortedPkgs)
      
      // Set the first package as active by default
      if (sortedPkgs.length > 0) {
        setActivePackage(sortedPkgs[0])
      }

      setLoading(false)
    }
    if (slug) fetchGig()
  }, [slug])

  // 2. Fetch Seller Details
  useEffect(() => {
    async function fetchSeller() {
      if (!gig?.seller_id) {
        setSeller(null)
        return
      }
      const supabase = createSupabaseBrowser()
      const { data } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, bio, email')
        .eq('id', gig.seller_id)
        .single()
      setSeller(data)
    }
    if (gig?.seller_id) fetchSeller()
  }, [gig])

  // 3. Check Saved Status
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

  // 4. Handle Save Toggle Action
  const handleSaveToggle = useCallback(async () => {
    setSaveMsg(null)
    if (!session?.user) {
      setSaveMsg('Please sign in to save services.')
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
        setSaveMsg('Error saving service.')
      } else {
        setIsSaved(true)
        setSavedId(data.id)
        setSaveMsg('Service saved successfully!')
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
        setSaveMsg('Service removed from saved list.')
      }
    }
  }, [session, isSaved, gig, savedId])
  
  // Memoize currency conversion
  const formatPrice = useCallback((cents: number) => {
      return `$${(cents / 100).toFixed(2)}`;
  }, []);
  
  // Determine starting price for sidebar
  const startingPrice = useMemo(() => {
      return packages.length > 0
        ? formatPrice(packages[0].price_cents)
        : 'N/A';
  }, [packages, formatPrice]);

  // --- Render States ---
  if (loading) {
    return (
      <main className="bg-[#030712] min-h-screen font-sans flex items-center justify-center pt-20">
        <div className="text-sky-400 text-xl font-medium animate-spin rounded-full h-8 w-8 border-4 border-t-4 border-t-sky-600 border-gray-700"></div>
        <div className="ml-3 text-sky-300">Loading service details...</div>
      </main>
    )
  }

  if (error || !gig) {
    return (
      <main className="bg-[#030712] min-h-screen font-sans flex items-center justify-center pt-20">
        <div className="text-red-500 text-xl font-semibold p-10 bg-[#0f172a] rounded-xl border border-red-800/50 shadow-lg">
          {error || 'Service not found'}
        </div>
      </main>
    )
  }
  
  // --- Main Service Page UI ---
  return (
    <main className="bg-[#030712] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 py-12 pt-28">
        
        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-sky-400 transition">Home</Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-sky-400 transition">Browse Services</Link>
          <span>/</span>
          <span className="text-sky-400 font-semibold truncate max-w-[200px] sm:max-w-none">{gig.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left: Gig Details & Description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">{gig.title}</h1>
            
            {/* Metadata & Tags */}
            <div className="flex items-center gap-4 mb-6 text-sm">
              <span className="text-sky-400 font-semibold px-3 py-1 rounded-full bg-sky-900/40 border border-sky-700/50">{gig.category}</span>
              {gig.tags && gig.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {gig.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-slate-400">| #{tag}</span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cover Image */}
            <div className="w-full mb-10 overflow-hidden rounded-2xl shadow-2xl border border-[#1e293b]">
              {gig.cover_image_url && (
                <img
                  src={gig.cover_image_url}
                  alt={gig.title}
                  className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                />
              )}
            </div>

            {/* Packages Section (Tabbed View) */}
            {packages && packages.length > 0 && (
              <div className="mb-10 p-6 bg-[#0f172a] rounded-2xl shadow-xl border border-[#1e293b]">
                <h2 className="text-3xl font-bold mb-5 text-sky-300">Select a Package</h2>
                
                {/* Package Tabs */}
                <div className="flex border-b border-[#1e293b] mb-6 overflow-x-auto">
                  {packages.map((pkg, idx) => (
                    <button
                      key={pkg.tier}
                      onClick={() => setActivePackage(pkg)}
                      className={`px-6 py-3 text-lg font-semibold transition border-b-4 ${
                        activePackage?.tier === pkg.tier
                          ? 'text-sky-400 border-sky-500 bg-sky-900/20'
                          : 'text-slate-400 border-transparent hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      {pkg.tier}
                    </button>
                  ))}
                </div>
                
                {/* Active Package Details */}
                {activePackage && (
                  <div className="flex flex-col md:flex-row md:items-start gap-6 bg-[#1e293b] rounded-xl p-6 border border-sky-900/50">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{activePackage.tier} - {formatPrice(activePackage.price_cents)}</h3>
                      <p className="text-slate-300 text-base leading-relaxed mb-4">{activePackage.description}</p>
                      
                      {/* Key Features (Assumes features array on package object) */}
                      {activePackage.features && activePackage.features.length > 0 && (
                          <ul className='space-y-2 text-slate-300 text-sm'>
                              {activePackage.features.map((feature: string, idx: number) => (
                                  <li key={idx} className='flex items-start gap-3'>
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                      {feature}
                                  </li>
                              ))}
                          </ul>
                      )}
                      
                    </div>
                    <div className="w-full md:w-auto md:min-w-[200px] md:border-l md:border-[#334155] md:pl-6 pt-4 md:pt-0">
                      <div className="text-sm font-medium text-slate-400 mb-2">Delivery Time</div>
                      <div className="text-xl font-bold text-sky-400 mb-4">{activePackage.delivery_days} day{activePackage.delivery_days > 1 ? 's' : ''}</div>
                      <div className="text-sm font-medium text-slate-400 mb-2">Revisions</div>
                      <div className="text-xl font-bold text-sky-400">{activePackage.revisions}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Main Service Description */}
            <div className="mb-10 p-6 bg-[#0f172a] rounded-2xl shadow-xl border border-[#1e293b]">
              <h2 className="text-3xl font-bold mb-4 text-sky-300">Service Overview</h2>
              <p className="text-slate-300 text-lg leading-relaxed">{gig.description}</p>
            </div>
            
            {/* Media Gallery */}
            {gig.media_urls && gig.media_urls.length > 0 && (
              <div className="mb-10 p-6 bg-[#0f172a] rounded-2xl shadow-xl border border-[#1e293b]">
                <h2 className="text-3xl font-bold mb-4 text-sky-300">Portfolio & Examples</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gig.media_urls.slice(0, 6).map((url: string, idx: number) =>
                    url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video key={idx} src={url} className="w-full h-36 rounded-lg object-cover border-2 border-sky-900/50 shadow-md" controls muted autoPlay={idx === 0} />
                    ) : (
                      <img key={idx} src={url} className="w-full h-36 rounded-lg object-cover border-2 border-sky-900/50 shadow-md" alt={`Media ${idx + 1}`} />
                    )
                  )}
                </div>
              </div>
            )}
            
            {/* Action Buttons (Full Width) */}
            <div className="flex flex-wrap gap-4 mb-12 p-6 bg-[#0f172a] rounded-2xl shadow-xl border border-[#1e293b]">
                <h2 className="text-2xl font-bold text-white w-full mb-3">Ready to start?</h2>
                <button 
                    className="flex-1 min-w-[150px] px-8 py-4 rounded-xl bg-sky-600 text-white font-bold text-lg shadow-xl shadow-sky-900/50 hover:bg-sky-700 transition transform hover:scale-[1.01]"
                >
                    Order Now ({activePackage?.tier || 'Base'})
                </button>
                <button 
                    className="flex-1 min-w-[150px] px-8 py-4 rounded-xl bg-[#1e293b] text-sky-300 font-bold text-lg shadow border border-sky-700 hover:bg-[#334155] transition"
                >
                    Contact Seller
                </button>
                <button
                    className={`px-8 py-4 rounded-xl font-semibold text-lg shadow border transition ${
                        isSaved
                            ? 'bg-emerald-900 text-emerald-300 border-emerald-700/50'
                            : 'bg-[#1e293b] text-slate-300 border-slate-700 hover:bg-[#334155]'
                    }`}
                    onClick={handleSaveToggle}
                >
                    {isSaved ? '★ SAVED' : '★ Save for Later'}
                </button>
                {saveMsg && <div className="text-sm font-medium text-sky-400 mt-3">{saveMsg}</div>}
            </div>
          </div>

          {/* Right: Freelancer Summary & Sticky Order Box */}
          <aside className="w-full lg:w-[320px] flex-shrink-0">
            <div className="sticky top-24">
              
              {/* Freelancer Profile Card */}
              <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-sky-900/50 p-6 mb-8 text-center">
                <Avatar email={seller?.email} name={seller?.full_name} />
                <Link 
                    href={`/profile/${seller?.id || '#'}`} 
                    className="font-bold text-xl text-sky-300 hover:text-sky-400 transition mt-3 block"
                >
                    {seller?.full_name || 'Freelancer'}
                </Link>
                {seller?.bio && (
                  <p className="text-slate-400 text-sm mt-1">{seller.bio}</p>
                )}
                <div className='mt-4 pt-4 border-t border-[#1e293b] text-xs text-slate-500'>
                    {/* Placeholder for real stats */}
                    <div className='flex justify-between font-medium'>
                        <span>Avg. Response:</span>
                        <span className='text-sky-300'>1 hour</span>
                    </div>
                    <div className='flex justify-between font-medium mt-1'>
                        <span>Completed Gigs:</span>
                        <span className='text-sky-300'>{gig.sales || 0}</span>
                    </div>
                </div>
              </div>
              
              {/* Sticky Order Box */}
              <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-sky-600/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-slate-200 text-lg">Starting Price</span>
                  <span className="text-3xl font-extrabold text-sky-400">{startingPrice}</span>
                </div>
                
                <p className='text-slate-400 text-sm mb-5'>Based on the **{packages[0]?.tier || 'Base'}** package.</p>

                <button 
                    className="w-full mt-2 px-6 py-3 rounded-xl bg-sky-600 text-white font-bold text-lg shadow-xl shadow-sky-900/50 hover:bg-sky-700 transition transform hover:scale-[1.01]"
                >
                  Start Order with {activePackage?.tier || 'Base'}
                </button>
              </div>
              
            </div>
          </aside>
        </div>
      </div>
      
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
          border: 2px solid #030712; 
        }
        ::-webkit-scrollbar-track { background: #1f2937; }
      `}</style>
    </main>
  )
}