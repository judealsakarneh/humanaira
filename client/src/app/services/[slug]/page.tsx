'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

/* ---------------- Avatar ---------------- */
function Avatar({
  email,
  name,
  avatarUrl,
}: {
  email?: string | null
  name?: string | null
  avatarUrl?: string | null
}) {
  const baseClasses =
    'w-24 h-24 rounded-full object-cover border-4 border-[#3B82F6] ring-4 ring-[#151C30] bg-[#151C30]'
  const placeholderClasses =
    'w-24 h-24 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-4xl text-[#3B82F6] font-extrabold border-4 border-[#3B82F6]/50 ring-4 ring-[#151C30] hover:ring-[#3B82F6]'
  const hash = email ? String(email.length % 100) : ''
  const fallbackGravatar = email ? `https://www.gravatar.com/avatar/${hash}?d=identicon&s=96` : null
  const src = avatarUrl || fallbackGravatar

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name || 'Seller'}
        className={baseClasses}
        style={{ minWidth: 96, minHeight: 96 }}
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).src =
            'https://placehold.co/96x96/151C30/94a3b8?text=?'
        }}
      />
    )
  }

  return (
    <div className={placeholderClasses} style={{ minWidth: 96, minHeight: 96 }}>
      {name ? name[0].toUpperCase() : 'U'}
    </div>
  )
}

/* ---------------- MediaCarousel (mobile-safe) ---------------- */
function MediaCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Guard against index > images.length when data changes
  useEffect(() => {
    if (index > images.length - 1) setIndex(0)
  }, [images.length, index])

  const prev = useCallback(() => setIndex((i) => (i <= 0 ? images.length - 1 : i - 1)), [images.length])
  const next = useCallback(() => setIndex((i) => (i >= images.length - 1 ? 0 : i + 1)), [images.length])

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return
    const endX = e.changedTouches[0].clientX
    const delta = endX - startX.current
    if (Math.abs(delta) > 40) {
      if (delta < 0) next()
      else prev()
    }
    startX.current = null
  }

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [prev, next])

  // Mouse drag support
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let mouseStart: number | null = null
    let dragging = false
    const onMouseDown = (ev: MouseEvent) => {
      mouseStart = ev.clientX
      dragging = true
    }
    const onMouseUp = (ev: MouseEvent) => {
      if (!dragging || mouseStart == null) {
        dragging = false
        mouseStart = null
        return
      }
      const delta = ev.clientX - mouseStart
      if (Math.abs(delta) > 40) {
        if (delta < 0) next()
        else prev()
      }
      dragging = false
      mouseStart = null
    }
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [next, prev])

  if (!images || images.length === 0) return null

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl bg-black flex items-center justify-center border border-[#151C30] aspect-[16/9] md:min-h-[360px] min-h-[220px] w-full touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-2.5 z-10 text-xl transition-all shadow-lg"
              style={{ minWidth: 40, minHeight: 40 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full p-2.5 z-10 text-xl transition-all shadow-lg"
              style={{ minWidth: 40, minHeight: 40 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Ensure the image never overflows: fill container and contain */}
        <div className="flex w-full h-full items-center justify-center px-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt={`Media ${index + 1}`}
            className="block w-full h-full object-contain select-none"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/1200x800/151C30/94a3b8?text=Image+Load+Error'
            }}
            draggable={false}
          />
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition ${i === index ? 'bg-white shadow-md' : 'bg-white/40'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto justify-start">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${i === index ? 'ring-2 ring-[#3B82F6] ring-offset-2 ring-offset-[#080E1B]' : 'opacity-70 hover:opacity-100'}`}
            style={{ width: 96, height: 64 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              className="w-full h-full object-cover"
              alt={`Thumb ${i + 1}`}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = 'https://placehold.co/96x64/151C30/94a3b8?text=X'
              }}
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- View tracking helper ---------------- */
const getOrCreateSessionId = () => {
  try {
    const key = 'humanaira_sid'
    const exist = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null
    if (exist) return exist
    const sid =
      (globalThis.crypto?.randomUUID?.() as string | undefined) ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`
    if (typeof window !== 'undefined') window.localStorage.setItem(key, sid)
    return sid
  } catch {
    return 'anon'
  }
}

/* ---------------- ServiceDetailsPage ---------------- */
export default function ServiceDetailsPage() {
  const params = useParams<{ slug: string }>()
  const slug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) as string | undefined

  const [gig, setGig] = useState<any>(null)
  const [packages, setPackages] = useState<any[]>([])
  const [seller, setSeller] = useState<any>(null)
  const [activePackage, setActivePackage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch Gig and Packages
  useEffect(() => {
    async function fetchGig() {
      setLoading(true)
      setError(null)
      try {
        const supabase = createSupabaseBrowser()
        const { data: gigData, error: gigError } = await supabase
          .from('gigs')
          .select('*')
          .eq('slug', slug)
          .limit(1)
          .maybeSingle()

        if (gigError || !gigData) {
          setError('Service not found or an error occurred.')
          setGig(null)
          setLoading(false)
          return
        }

        setGig(gigData)

        const { data: pkgs } = await supabase
          .from('gig_packages')
          .select('*')
          .eq('gig_id', gigData.id)

        const sortedPkgs = (pkgs || []).sort(
          (a: any, b: any) => (a.price_cents ?? 0) - (b.price_cents ?? 0)
        )
        setPackages(sortedPkgs)
        if (sortedPkgs.length > 0) setActivePackage(sortedPkgs[0])
      } catch (e) {
        setError('Failed to load service.')
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchGig()
  }, [slug])

  // Record a unique view after the gig is loaded
  useEffect(() => {
    if (!gig?.id) return
    ;(async () => {
      const supabase = createSupabaseBrowser()
      const { data: authRes } = await supabase.auth.getUser()
      const viewerId = authRes?.user?.id ?? null
      const sessionId = getOrCreateSessionId()
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null

      await supabase.rpc('record_gig_view', {
        p_gig_id: gig.id,
        p_viewer_id: viewerId,
        p_session_id: sessionId,
        p_user_agent: userAgent,
      })
    })()
  }, [gig?.id])

  // Fetch Seller
  useEffect(() => {
    async function fetchSeller() {
      if (!gig?.seller_id) {
        setSeller(null)
        return
      }

      try {
        const supabase = createSupabaseBrowser()
        const sellerKey = String(gig.seller_id).trim()

        const selectCols =
          'id, username, display_name, full_name, avatar_url, bio, email, created_at, user_id, auth_user_id'

        const { data: profile } = await supabase
          .from('profiles')
          .select(selectCols)
          .or(
            [
              `id.eq.${sellerKey}`,
              `username.eq.${sellerKey}`,
              `user_id.eq.${sellerKey}`,
              `auth_user_id.eq.${sellerKey}`,
            ].join(',')
          )
          .limit(1)
          .maybeSingle()

        if (profile) {
          const normalized = {
            id: String(profile.id ?? profile.user_id ?? profile.auth_user_id ?? sellerKey),
            display_name: profile.display_name ?? null,
            username: profile.username ?? null,
            full_name: profile.full_name ?? null,
            avatar_url: profile.avatar_url ?? null,
            bio: profile.bio ?? null,
            email: profile.email ?? null,
            created_at: profile.created_at ?? null,
            user_id: (profile as any).user_id ?? null,
            auth_user_id: (profile as any).auth_user_id ?? null,
          }
          setSeller(normalized)
          return
        }

        const { data: viewRows } = await supabase
          .from('profiles_view')
          .select('id, display_name, username, full_name, avatar_url, email, created_at')
          .in('id', [sellerKey])
          .limit(1)

        if (viewRows && viewRows.length) {
          const a = viewRows[0] as any
          setSeller({
            id: String(a.id),
            display_name: a.display_name ?? null,
            username: a.username ?? null,
            full_name: a.full_name ?? null,
            avatar_url: a.avatar_url ?? null,
            bio: null,
            email: a.email ?? null,
            created_at: a.created_at ?? null,
          })
          return
        }

        setSeller(null)
      } catch {
        setSeller(null)
      }
    }

    if (gig?.seller_id) fetchSeller()
  }, [gig?.seller_id])

  // Helpers and derived values
  const formatPrice = useCallback((cents: number) => `$${(cents / 100).toFixed(2)}`, [])
  const cheapestPackage = useMemo(() => {
    if (!packages || packages.length === 0) return null
    return packages.reduce((min, p) => (p.price_cents < min.price_cents ? p : min), packages[0])
  }, [packages])
  const startingCents = useMemo(() => {
    if (cheapestPackage) return cheapestPackage.price_cents
    return gig?.price_cents ?? 0
  }, [cheapestPackage, gig])
  const startingPrice = useMemo(() => formatPrice(startingCents), [startingCents, formatPrice])

  const displayName = useMemo(() => {
    if (!seller) return 'Freelancer'
    return (
      seller.display_name ??
      seller.username ??
      seller.full_name ??
      (seller.email ? String(seller.email).split('@')[0] : undefined) ??
      'Freelancer'
    )
  }, [seller])

  const profileHref = useMemo(() => {
    const id = seller?.id ?? gig?.seller_id
    return id ? `/profile/${encodeURIComponent(String(id))}` : '#'
  }, [seller?.id, gig?.seller_id])

  const handle = useMemo(() => (seller?.username ? `@${seller.username}` : null), [seller])

  const videoRegex = useMemo(() => /\.(mp4|webm|ogg)$/i, [])
  const combinedImageUrls = useMemo(() => {
    if (!gig) return []
    const images: string[] = []
    if (gig.cover_image_url && !videoRegex.test(gig.cover_image_url)) images.push(gig.cover_image_url)
    const media = Array.isArray(gig.media_urls) ? gig.media_urls : []
    media.forEach((u: string) => {
      if (!videoRegex.test(u) && !images.includes(u)) images.push(u)
    })
    return images
  }, [gig, videoRegex])

  // Selected package (fallback to base gig price if no packages)
  const selectedPkg = useMemo(
    () => activePackage ?? cheapestPackage ?? (packages.length ? packages[0] : null),
    [activePackage, cheapestPackage, packages]
  )

  // Build checkout href (enable when gig exists; price falls back to gig.price_cents)
  const checkoutHref = useMemo(() => {
    if (!gig) return '#'
    const tier = selectedPkg?.tier ?? 'Base'
    const priceCents = selectedPkg?.price_cents ?? gig.price_cents ?? 0
    const search = new URLSearchParams({
      gig: String(gig.id),
      slug: String(gig.slug || ''),
      title: String(gig.title || ''),
      tier: String(tier),
      price_cents: String(priceCents),
    })
    return `/checkout?${search.toString()}`
  }, [gig, selectedPkg])

  /* ---------------- Render States ---------------- */
  if (loading) {
    return (
      <main className="bg-[#080E1B] min-h-screen font-sans flex items-center justify-center p-8">
        <div className="text-[#3B82F6] text-xl font-medium animate-spin rounded-full h-10 w-10 border-4 border-t-4 border-t-[#3B82F6] border-[#151C30]"></div>
        <div className="ml-4 text-white">Loading service details...</div>
      </main>
    )
  }

  if (error || !gig) {
    return (
      <main className="bg-[#080E1B] min-h-screen font-sans flex items-center justify-center p-8">
        <div className="text-red-400 text-xl font-semibold p-10 bg-[#141A30] rounded-2xl border border-red-800/50 shadow-lg">
          {error || 'Service not found'}
        </div>
      </main>
    )
  }

  /* ---------------- Main UI ---------------- */
  return (
    <main className="bg-[#080E1B] min-h-screen font-sans text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#3B82F6] transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-[#3B82F6] transition">
            Browse Services
          </Link>
          <span>/</span>
          <span className="text-[#3B82F6] font-semibold truncate max-w-[200px] sm:max-w-none">{gig.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Gig Details & Description */}
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight leading-tight">{gig.title}</h1>

            {/* Seller line with clickable username */}
            <div className="mb-6 text-sm text-slate-400">
              By{' '}
              <Link href={profileHref} className="text-[#3B82F6] hover:underline font-semibold">
                {handle || displayName}
              </Link>
            </div>

            {/* Metadata & Tags */}
            <div className="flex items-center gap-4 mb-8 text-sm flex-wrap">
              <span className="text-white font-medium px-4 py-1.5 rounded-full bg-[#3B82F6] shadow-lg shadow-[#3B82F6]/30">
                {gig.category}
              </span>
              {gig.tags && gig.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {gig.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-slate-400 font-light">
                      <span className="text-slate-600">#</span> {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Carousel */}
            <div className="w-full mb-10">
              {combinedImageUrls.length > 0 ? (
                <MediaCarousel images={combinedImageUrls} />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-[#151C30] rounded-xl border border-[#334155] text-slate-500">
                  No media available.
                </div>
              )}
            </div>

            {/* Packages Section (Segmented Control Style) */}
            {packages && packages.length > 0 && (
              <div className="mb-10 p-6 bg-[#141A30] rounded-2xl shadow-2xl border border-[#334155]">
                <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Select a Tier</h2>

                {/* Segmented Control Tabs */}
                <div className="flex bg-[#080E1B] p-1.5 rounded-xl border border-[#334155] mb-6 overflow-x-auto">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.tier}
                      onClick={() => setActivePackage(pkg)}
                      className={`flex-1 min-w-[100px] text-center px-4 py-2.5 text-sm md:text-base font-semibold transition rounded-lg ${
                        activePackage?.tier === pkg.tier ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/40' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {pkg.tier}
                    </button>
                  ))}
                </div>

                {/* Active Package Details */}
                {activePackage && (
                  <div className="p-6 bg-[#080E1B] rounded-xl border border-[#3B82F6]/30 shadow-inner shadow-black/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#334155] mb-4">
                      <h3 className="text-2xl font-bold text-white">{activePackage.tier} Package</h3>
                      <span className="text-4xl font-extrabold text-[#3B82F6] mt-2 sm:mt-0">
                        {formatPrice(activePackage.price_cents)}
                      </span>
                    </div>

                    <p className="text-slate-300 text-base leading-relaxed mb-5">
                      {activePackage.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 border-b border-[#334155] pb-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Delivery</div>
                        <div className="text-xl font-bold text-white">
                          {activePackage.delivery_days} day{activePackage.delivery_days > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Revisions</div>
                        <div className="text-xl font-bold text-white">{activePackage.revisions}</div>
                      </div>
                    </div>

                    {Array.isArray(activePackage.features) && activePackage.features.length > 0 && (
                      <ul className="space-y-3 text-slate-200 text-sm">
                        {activePackage.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B82F6] flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Main Service Description */}
            <div className="mb-10 p-6 bg-[#141A30] rounded-2xl shadow-2xl border border-[#334155]">
              <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">Service Overview</h2>
              <div className="text-slate-300 text-base leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {gig.description}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-12 p-6 bg-[#141A30] rounded-2xl shadow-2xl border border-[#334155]">
              <Link
                href={checkoutHref}
                prefetch
                className={`flex-1 min-w-[200px] px-8 py-4 rounded-xl text-center font-bold text-lg shadow-xl transition transform hover:scale-[1.01] active:scale-[0.99] ${
                  gig ? 'bg-[#3B82F6] text-white shadow-[#3B82F6]/50 hover:bg-sky-500' : 'bg-gray-600 cursor-not-allowed'
                }`}
                role="button"
                aria-disabled={!gig}
              >
                Order Now ({selectedPkg?.tier ?? 'Base'})
              </Link>
              <button
                onClick={() => console.log('Contact clicked')}
                className="flex-1 min-w-[200px] px-8 py-4 rounded-xl bg-[#080E1B] text-[#3B82F6] font-bold text-lg shadow border border-[#334155] hover:bg-[#151C30] transition"
              >
                Contact Seller
              </button>
            </div>
          </div>

          {/* Right: Freelancer Summary & Sticky Order Box */}
          <aside className="w-full lg:w-[360px] flex-shrink-0">
            <div className="sticky top-12 space-y-8">
              {/* Freelancer Profile Card */}
              <Link href={profileHref} className="group block">
                <div className="bg-[#141A30] rounded-2xl shadow-2xl border border-[#334155] p-6 text-center hover:border-[#3B82F6]/50 transition duration-300">
                  <div className="flex flex-col items-center">
                    <Avatar email={seller?.email} name={displayName} avatarUrl={seller?.avatar_url} />
                    <div className="font-bold text-xl text-white mt-3 group-hover:text-[#3B82F6] transition">
                      {displayName}
                    </div>

                    {seller?.username && seller.username !== displayName && (
                      <div className="text-[#3B82F6] text-sm font-medium mt-0.5">@{seller.username}</div>
                    )}

                    {seller?.bio && <p className="text-slate-400 text-sm mt-2 line-clamp-3">{seller.bio}</p>}
                  </div>

                  <div className="mt-5 pt-5 border-t border-[#334155] text-xs text-slate-500 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Avg. Response:</span>
                      <span className="text-white font-semibold">1 hour</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Completed Gigs:</span>
                      <span className="text-white font-semibold">{gig.sales || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Sticky Order Summary Box */}
              <div className="bg-[#141A30] rounded-2xl shadow-2xl border border-[#3B82F6]/50 p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#334155]">
                  <span className="font-semibold text-white text-lg">Starting From</span>
                  <span className="text-4xl font-extrabold text-[#3B82F6]">{startingPrice}</span>
                </div>

                <p className="text-slate-400 text-sm mb-6">
                  Based on the <b>{(packages[0]?.tier) ?? 'Base'}</b> package. Select a higher tier for more features.
                </p>

                <Link
                  href={checkoutHref}
                  prefetch
                  className={`w-full block text-center px-6 py-3.5 rounded-xl font-bold text-lg transition transform hover:scale-[1.01] active:scale-[0.99] ${
                    gig ? 'bg-[#3B82F6] text-white shadow-xl shadow-[#3B82F6]/50 hover:bg-sky-500' : 'bg-gray-600 cursor-not-allowed text-white'
                  }`}
                  role="button"
                  aria-disabled={!gig}
                >
                  Confirm Order ({selectedPkg?.tier ?? 'Base'})
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}