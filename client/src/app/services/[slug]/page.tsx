'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import HumanairaLoader from '../../../components/HumanairaLoader'
import { sendMessage } from '../../../lib/messaging'

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
    'w-24 h-24 rounded-full object-cover border-4 border-[#3B82F6] ring-4 ring-[#0A1022] bg-[#0A1022]'
  const placeholderClasses =
    'w-24 h-24 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-4xl text-[#3B82F6] font-extrabold border-4 border-[#3B82F6]/50 ring-4 ring-[#0A1022] hover:ring-[#3B82F6]'
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
            'https://placehold.co/96x96/0A1022/CBD5E1?text=?'
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

/* ---------------- MediaCarousel (images) ---------------- */
function MediaCarousel({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (index > images.length - 1) setIndex(0)
  }, [images.length, index])

  const prev = useCallback(() => setIndex((i) => (i <= 0 ? images.length - 1 : i - 1)), [images.length])
  const next = useCallback(() => setIndex((i) => (i >= images.length - 1 ? 0 : i + 1)), [images.length])

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [prev, next])

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
        className="relative overflow-hidden rounded-xl bg-black flex items-center justify-center border border-[#0F1A35] aspect-[16/9] md:min-h-[360px] min-h-[220px] w-full touch-pan-y"
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

        <div className="flex w-full h-full items-center justify-center px-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index]}
            alt={`Media ${index + 1}`}
            className="block w-full h-full object-contain select-none"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/1200x800/0A1022/CBD5E1?text=Image+Error'
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
            className={`flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${i === index ? 'ring-2 ring-[#3B82F6] ring-offset-2 ring-offset-[#070D1C]' : 'opacity-70 hover:opacity-100'}`}
            style={{ width: 96, height: 64 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              className="w-full h-full object-cover"
              alt={`Thumb ${i + 1}`}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = 'https://placehold.co/96x64/0A1022/CBD5E1?text=X'
              }}
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- VideoStrip (optional) ---------------- */
function VideoStrip({ videos }: { videos: string[] }) {
  if (!videos?.length) return null
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {videos.map((v, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-[#0F1A35] bg-black">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            src={v}
            controls
            preload="metadata"
            className="w-full h-56 object-cover bg-black"
          />
        </div>
      ))}
    </div>
  )
}

/* ---------------- Utils ---------------- */
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

const buildShareTargets = (url: string, title: string) => {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  }
}

/* ---------------- Page ---------------- */
export default function ServiceDetailsPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) as string | undefined

  const [gig, setGig] = useState<any>(null)
  const [packages, setPackages] = useState<any[]>([])
  const [seller, setSeller] = useState<any>(null)
  const [activePackage, setActivePackage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryLabel, setCategoryLabel] = useState<string | null>(null)

  // Modals
  const [shareOpen, setShareOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('Inappropriate content')
  const [reportDetails, setReportDetails] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [reportSuccess, setReportSuccess] = useState<string | null>(null)
  const [reportError, setReportError] = useState<string | null>(null)
  const [shareCopied, setShareCopied] = useState(false)
  const [startingChat, setStartingChat] = useState(false)

  const videoRegex = useMemo(() => /\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i, [])
  const formatPrice = useCallback((cents: number) => `$${(cents / 100).toFixed(2)}`, [])

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

        if (gigData.category) {
          const { data: cat } = await supabase
            .from('gig_categories')
            .select('label')
            .eq('key', gigData.category)
            .maybeSingle()
          setCategoryLabel(cat?.label ?? null)
        } else {
          setCategoryLabel(null)
        }

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

  // View tracking
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

  // Seller
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

  // Derived values
  const imageUrls = useMemo(() => {
    if (!gig) return []
    const imgs: string[] = []
    if (gig.cover_image_url && !videoRegex.test(gig.cover_image_url)) imgs.push(gig.cover_image_url)
    const media = Array.isArray(gig.media_urls) ? gig.media_urls : []
    media.forEach((u: string) => {
      if (!videoRegex.test(u) && !imgs.includes(u)) imgs.push(u)
    })
    return imgs
  }, [gig, videoRegex])

  const videoUrls = useMemo(() => {
    if (!gig) return []
    const vids: string[] = []
    const media = Array.isArray(gig.media_urls) ? gig.media_urls : []
    media.forEach((u: string) => {
      if (videoRegex.test(u) && !vids.includes(u)) vids.push(u)
    })
    return vids
  }, [gig, videoRegex])

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

  const selectedPkg = useMemo(
    () => activePackage ?? cheapestPackage ?? (packages.length ? packages[0] : null),
    [activePackage, cheapestPackage, packages]
  )

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

  // Share handlers
  const onShareClick = useCallback(async () => {
    try {
      const shareData = {
        title: gig?.title || 'Humanaira Service',
        text: 'Check out this service on Humanaira',
        url: typeof window !== 'undefined' ? window.location.href : '',
      }
      if (navigator?.share) {
        await navigator.share(shareData as any)
        return
      }
      setShareOpen(true)
    } catch {
      setShareOpen(true)
    }
  }, [gig?.title])

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 1500)
    } catch {
      // ignore
    }
  }, [])

  // Report handlers
  const mailtoReportHref = useMemo(() => {
    const subj = encodeURIComponent(`Report Service: ${gig?.title || ''}`)
    const body = encodeURIComponent(
      `Service: ${gig?.title || ''}\nSlug: ${gig?.slug || ''}\nURL: ${typeof window !== 'undefined' ? window.location.href : ''}\n\nReason: ${reportReason}\nDetails:\n${reportDetails}`
    )
    return `mailto:hello@humanaira.com?subject=${subj}&body=${body}`
  }, [gig?.title, gig?.slug, reportReason, reportDetails])

  const submitReport = useCallback(async () => {
    try {
      setReportSubmitting(true)
      setReportError(null)
      setReportSuccess(null)

      const payload = {
        slug: gig?.slug,
        gig_id: gig?.id,
        reason: reportReason,
        details: reportDetails,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        title: gig?.title || '',
      }

      // Try API route (will send email if SMTP envs are set; safe to call even if not)
      await fetch('/api/report-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {})

      // Always open a mailto as a reliable fallback for now
      window.open(mailtoReportHref, '_blank', 'noopener,noreferrer')

      setReportSuccess('Report submitted. Thank you for helping keep Humanaira safe.')
      setTimeout(() => {
        setReportOpen(false)
        setReportDetails('')
        setReportReason('Inappropriate content')
      }, 1000)
    } catch (e: any) {
      setReportError('Could not submit the report. Please try again.')
    } finally {
      setReportSubmitting(false)
    }
  }, [gig?.slug, gig?.id, gig?.title, reportDetails, reportReason, mailtoReportHref])

  /* ---------------- New: Start Chat Handler ---------------- */
  const startChat = useCallback(async () => {
    // This will:
    // 1) Ensure the user is logged in via Supabase auth
    // 2) Call our server API to get or create a conversation
    // 3) Redirect to /messages/[conversationId]
    if (!seller || !gig) return

    try {
      setStartingChat(true)
      const supabase = createSupabaseBrowser()
      const { data: authRes } = await supabase.auth.getUser()
      const buyerId = authRes?.user?.id

      if (!buyerId) {
        // not logged in — redirect to login with return URL
        const returnTo = typeof window !== 'undefined' ? window.location.pathname : '/'
        router.push(`/login?redirect=${encodeURIComponent(returnTo)}`)
        return
      }

      // Call server API to create-or-get conversation
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: buyerId,
          seller_id: seller.id,
          gig_id: gig.id ?? null,
        }),
      })

      if (!res.ok) {
        // fallback: go to seller profile
        router.push(profileHref)
        return
      }

      const body = await res.json()
      const conversationId = body?.id as string | undefined
      const wasCreated = Boolean(body?.created)
      if (conversationId) {
        if (wasCreated && gig?.title) {
          try {
            const nameForGreeting =
              displayName && displayName !== 'Freelancer' ? displayName : 'there'
            const origin = typeof window !== 'undefined' ? window.location.origin : ''
            const serviceUrl = gig.slug ? `${origin}/services/${gig.slug}` : ''
            const introLines = [
              `Hi ${nameForGreeting},`,
              '',
              `I'm interested in your service "${gig.title}" and would love to discuss the details.`,
            ]
            if (serviceUrl) {
              introLines.push('', `Service link: ${serviceUrl}`)
            }
            await sendMessage({
              conversationId,
              text: introLines.join('\n'),
              attachments: [],
            })
          } catch (messageErr) {
            console.error('Failed to send intro message', messageErr)
          }
        }
        router.push(`/messages?conv=${encodeURIComponent(conversationId)}`)
      } else {
        router.push(profileHref)
      }
    } catch (err) {
      console.error('startChat error', err)
      router.push(profileHref)
    } finally {
      setStartingChat(false)
    }
  }, [seller, gig, router, profileHref, displayName])

  /* ---------------- Render States ---------------- */
  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-[#070D1C] overflow-x-hidden pt-24 md:pt-28">
        <HumanairaLoader subtitle="Loading service…" />
      </main>
    )
  }

  if (error || !gig) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070D1C] overflow-x-hidden pt-24 md:pt-28 px-4">
        <div className="text-rose-400 text-lg font-semibold p-6 bg-[#0D1328] rounded-2xl border border-rose-800/40 shadow-xl">
          {error || 'Service not found'}
        </div>
      </main>
    )
  }

  /* ---------------- Main UI ---------------- */
  return (
    <main className="relative min-h-screen bg-[#070D1C] text-slate-100 overflow-x-hidden pt-24 md:pt-28">
      {/* Background accents wrapped to avoid horizontal scroll */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-indigo-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Breadcrumbs + actions (always under header now due to pt-*) */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <nav className="text-sm text-slate-400 flex items-center gap-2 overflow-hidden">
            <Link href="/" className="hover:text-[#93C5FD] transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#93C5FD] transition">
              Browse Services
            </Link>
            <span>/</span>
            <span className="text-[#93C5FD] font-semibold truncate max-w-[50vw] sm:max-w-none">
              {gig.title}
            </span>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onShareClick}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm border border-slate-700/60"
              title="Share"
            >
              Share
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm border border-slate-700/60"
              title="Report this service"
            >
              Report
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Gig Details */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight leading-tight">
              {gig.title}
            </h1>

            {/* Seller line */}
            <div className="mb-5 text-sm text-slate-400">
              By{' '}
              <Link href={profileHref} className="text-[#93C5FD] hover:underline font-semibold">
                {handle || (seller?.display_name ?? 'Freelancer')}
              </Link>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-8 text-sm flex-wrap">
              <span className="text-white font-semibold px-3 py-1.5 rounded-full bg-[#0D1328] border border-slate-700/60 shadow">
                {categoryLabel ?? gig.category ?? 'Service'}
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

            {/* Media */}
            <div className="w-full mb-8">
              {imageUrls.length > 0 ? (
                <MediaCarousel images={imageUrls} />
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-[#0B1024] rounded-xl border border-[#0F1A35] text-slate-500">
                  No images available.
                </div>
              )}
              <VideoStrip videos={videoUrls} />
            </div>

            {/* Packages */}
            {packages && packages.length > 0 && (
              <div className="mb-10 p-6 bg-[#0D1328] rounded-2xl shadow-2xl border border-slate-700/60">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Select a Tier</h2>
                  <div className="text-sm text-slate-400">
                    Delivery:{' '}
                    <span className="font-semibold text-slate-200">
                      {activePackage?.delivery_days ?? gig.delivery_time_days ?? 1} day
                      {(activePackage?.delivery_days ?? gig.delivery_time_days ?? 1) > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="flex bg-[#070D1C] p-1.5 rounded-xl border border-slate-700/60 mb-6 overflow-x-auto">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.tier}
                      onClick={() => setActivePackage(pkg)}
                      className={`flex-1 min-w-[110px] text-center px-4 py-2.5 text-sm md:text-base font-semibold transition rounded-lg ${
                        activePackage?.tier === pkg.tier
                          ? 'bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/30'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {pkg.tier}
                    </button>
                  ))}
                </div>

                {activePackage && (
                  <div className="p-5 bg-[#070D1C] rounded-xl border border-[#3B82F6]/30 shadow-inner">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-700/60 mb-4">
                      <h3 className="text-xl font-bold text-white">{activePackage.tier} Package</h3>
                      <span className="text-3xl font-extrabold text-[#93C5FD] mt-2 sm:mt-0">
                        {formatPrice(activePackage.price_cents)}
                      </span>
                    </div>

                    {activePackage.description && (
                      <p className="text-slate-300 text-base leading-relaxed mb-4">
                        {activePackage.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl bg-[#0B1024] border border-slate-700/60 p-3">
                        <div className="text-xs text-slate-400">Delivery</div>
                        <div className="text-lg font-bold text-white">
                          {activePackage.delivery_days} day{activePackage.delivery_days > 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="rounded-xl bg-[#0B1024] border border-slate-700/60 p-3">
                        <div className="text-xs text-slate-400">Revisions</div>
                        <div className="text-lg font-bold text-white">{activePackage.revisions}</div>
                      </div>
                    </div>

                    {Array.isArray(activePackage.features) && activePackage.features.length > 0 && (
                      <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-200 text-sm">
                        {activePackage.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#3B82F6] flex-shrink-0 mt-0.5" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
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

            {/* Overview */}
            <div className="mb-10 p-6 bg-[#0D1328] rounded-2xl shadow-2xl border border-slate-700/60">
              <h2 className="text-2xl font-bold mb-3 text-white tracking-tight">Service Overview</h2>
              <div className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">
                {gig.description}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-12 p-6 bg-[#0D1328] rounded-2xl shadow-2xl border border-slate-700/60">
              <Link
                href={checkoutHref}
                prefetch
                className={`flex-1 min-w-[200px] px-8 py-4 rounded-xl text-center font-bold text-lg shadow-xl transition transform hover:scale-[1.01] active:scale-[0.99] ${
                  gig ? 'bg-[#3B82F6] text-white shadow-[#3B82F6]/40 hover:bg-sky-500' : 'bg-gray-600 cursor-not-allowed'
                }`}
                role="button"
                aria-disabled={!gig}
              >
                Order Now ({activePackage?.tier ?? 'Base'})
              </Link>

              {/* CONTACT SELLER now triggers startChat */}
              <button
                onClick={startChat}
                disabled={startingChat}
                className="flex-1 min-w-[200px] px-8 py-4 rounded-xl bg-[#070D1C] text-[#93C5FD] font-bold text-lg shadow border border-slate-700/60 hover:bg-[#0B1024] transition text-center"
                title="Contact Seller"
              >
                {startingChat ? 'Opening chat…' : 'Contact Seller'}
              </button>
            </div>
          </div>

          {/* Right: Freelancer Summary & Sticky Order Box */}
          <aside className="w-full lg:w-[360px] flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Freelancer Profile Card (no completed gigs count) */}
              <Link href={profileHref} className="group block">
                <div className="bg-[#0D1328] rounded-2xl shadow-2xl border border-slate-700/60 p-6 hover:border-[#3B82F6]/50 transition duration-300">
                  <div className="flex flex-col items-center text-center">
                    <Avatar email={seller?.email} name={displayName} avatarUrl={seller?.avatar_url} />
                    <div className="font-bold text-xl text-white mt-3 group-hover:text-[#93C5FD] transition">
                      {displayName}
                    </div>

                    {seller?.username && seller.username !== displayName && (
                      <div className="text-[#93C5FD] text-sm font-medium mt-0.5">@{seller.username}</div>
                    )}

                    {seller?.bio && (
                      <p className="text-slate-300 text-sm mt-3 leading-relaxed whitespace-pre-line">
                        {seller.bio}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 pt-5 border-t border-slate-700/60 text-xs text-slate-400 space-y-2">
                    <div className="flex justify-between font-medium">
                      <span>Avg. Response</span>
                      <span className="text-slate-200">~1 hour</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Sticky Order Summary Box */}
              <div className="bg-[#0D1328] rounded-2xl shadow-2xl border border-[#3B82F6]/50 p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
                  <span className="font-semibold text-white text-lg">Starting From</span>
                  <span className="text-3xl font-extrabold text-[#93C5FD]">{startingPrice}</span>
                </div>

                <p className="text-slate-400 text-sm mb-6">
                  Based on the <b>{(packages[0]?.tier) ?? 'Base'}</b> package. Select a higher tier for more features.
                </p>

                <Link
                  href={checkoutHref}
                  prefetch
                  className={`w-full block text-center px-6 py-3.5 rounded-xl font-bold text-lg transition transform hover:scale-[1.01] active:scale-[0.99] ${
                    gig ? 'bg-[#3B82F6] text-white shadow-xl shadow-[#3B82F6]/40 hover:bg-sky-500' : 'bg-gray-600 cursor-not-allowed text-white'
                  }`}
                  role="button"
                  aria-disabled={!gig}
                >
                  Confirm Order ({activePackage?.tier ?? 'Base'})
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Share Modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-[#0D1328] border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">Share this service</h3>
              <button className="text-slate-400 hover:text-white" onClick={() => setShareOpen(false)}>✕</button>
            </div>
            <div className="space-y-3">
              <button
                onClick={copyLink}
                className="w-full px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition"
              >
                {shareCopied ? 'Copied!' : 'Copy link'}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={buildShareTargets(window.location.href, gig.title).twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#1DA1F2]/20 text-[#1DA1F2] border border-[#1DA1F2]/40 hover:bg-[#1DA1F2]/30 text-center"
                >
                  Share on X
                </a>
                <a
                  href={buildShareTargets(window.location.href, gig.title).linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#0A66C2]/20 text-[#0A66C2] border border-[#0A66C2]/40 hover:bg-[#0A66C2]/30 text-center"
                >
                  Share on LinkedIn
                </a>
                <a
                  href={buildShareTargets(window.location.href, gig.title).facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#1778F2]/20 text-[#1778F2] border border-[#1778F2]/40 hover:bg-[#1778F2]/30 text-center"
                >
                  Share on Facebook
                </a>
                <a
                  href={buildShareTargets(window.location.href, gig.title).email}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-center"
                >
                  Share via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg bg-[#0D1328] border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white">Report this service</h3>
              <button className="text-slate-400 hover:text-white" onClick={() => setReportOpen(false)}>✕</button>
            </div>

            {reportError && <div className="mb-3 text-rose-400 text-sm">{reportError}</div>}
            {reportSuccess && <div className="mb-3 text-emerald-400 text-sm">{reportSuccess}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1024] text-white border border-slate-700/60"
                >
                  <option>Inappropriate content</option>
                  <option>Misleading or fraudulent</option>
                  <option>Spam</option>
                  <option>Copyright/Trademark violation</option>
                  <option>Payment or pricing issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Details</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg bg-[#0B1024] text-white border border-slate-700/60"
                  placeholder="Provide details or links that help us review this report."
                />
                <div className="text-xs text-slate-500 mt-1">
                  Your browser will open an email to hello@humanaira.com as a backup after submission.
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <a
                href={mailtoReportHref}
                className="text-sky-400 hover:text-sky-300 text-sm underline underline-offset-2"
                target="_blank"
                rel="noreferrer"
                title="Open email client now"
              >
                Email instead
              </a>
              <div className="flex gap-3">
                <button
                  onClick={() => setReportOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={reportSubmitting}
                  className="px-5 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-60"
                >
                  {reportSubmitting ? 'Submitting…' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}