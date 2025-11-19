'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

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
  status?: string | null
  created_at?: string
  updated_at?: string
}

type CategoryRow = {
  key: string
  label: string
  group_name: string | null
}

const panelClass = 'bg-[#0D1328]/80 border border-slate-700/60 backdrop-blur-sm rounded-2xl shadow-2xl'

const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test((url || '').split('?')[0])
const isVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v|avi|mkv|ogg)$/i.test((url || '').split('?')[0])

export default function GigsListPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowser(), [])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFreelancer, setIsFreelancer] = useState<boolean | null>(null)

  const [userId, setUserId] = useState<string | null>(null)
  const [gigs, setGigs] = useState<GigRow[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])

  // UI filters
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all')
  const [sort, setSort] = useState<'updated_desc' | 'created_desc' | 'price_asc' | 'price_desc'>('updated_desc')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)

      // Auth
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to view this page.')
        setLoading(false)
        return
      }
      setUserId(user.id)

      // Profile check
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_freelancer')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        setError('Could not load your profile.')
        setLoading(false)
        return
      }
      if (!profile.is_freelancer) {
        setIsFreelancer(false)
        setLoading(false)
        return
      }
      setIsFreelancer(true)

      // Load categories for labels
      const { data: cats } = await supabase
        .from('gig_categories')
        .select('key,label,group_name')
        .eq('active', true)
        .order('group_name', { ascending: true, nullsFirst: true })
        .order('label', { ascending: true })

      setCategories((cats as CategoryRow[]) || [])

      // Load gigs
      const { data: gigsData, error: gigsError } = await supabase
        .from('gigs')
        .select('id,slug,title,category,description,cover_image_url,media_urls,price_cents,delivery_time_days,status,created_at,updated_at')
        .eq('seller_id', user.id)
        .order('updated_at', { ascending: false })
        .order('created_at', { ascending: false })

      if (gigsError) {
        setError('Could not load your gigs.')
        setLoading(false)
        return
      }
      setGigs((gigsData as GigRow[]) || [])
      setLoading(false)
    }
    load()
  }, [supabase])

  const categoryLabelByKey = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of categories) map.set(c.key, c.label)
    return map
  }, [categories])

  const filteredSorted = useMemo(() => {
    const k = (s: string) => s.toLowerCase()
    const qx = q.trim().toLowerCase()

    let list = gigs.filter((g) => {
      if (status !== 'all') {
        const gs = (g.status || '').toLowerCase()
        if (gs !== status) return false
      }
      if (!qx) return true
      const hay = [
        g.title || '',
        g.description || '',
        g.category || '',
        categoryLabelByKey.get(g.category || '') || '',
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(qx)
    })

    switch (sort) {
      case 'price_asc':
        list = list.sort((a, b) => (a.price_cents || 0) - (b.price_cents || 0))
        break
      case 'price_desc':
        list = list.sort((a, b) => (b.price_cents || 0) - (a.price_cents || 0))
        break
      case 'created_desc':
        list = list.sort(
          (a, b) =>
            new Date(b.created_at || b.updated_at || 0).getTime() -
            new Date(a.created_at || a.updated_at || 0).getTime()
        )
        break
      default:
        // updated_desc
        list = list.sort(
          (a, b) =>
            new Date(b.updated_at || b.created_at || 0).getTime() -
            new Date(a.updated_at || a.created_at || 0).getTime()
        )
    }
    return list
  }, [gigs, q, status, sort, categoryLabelByKey])

  const fmtPrice = (cents?: number | null) => `$${(((cents || 0) / 100) as number).toFixed(2)}`
  const coverFor = (g: GigRow): { type: 'image' | 'video' | 'none'; url?: string } => {
    if (g.cover_image_url && isImageUrl(g.cover_image_url)) return { type: 'image', url: g.cover_image_url }
    const first = (g.media_urls || [])[0]
    if (!first) return { type: 'none' }
    if (isImageUrl(first)) return { type: 'image', url: first }
    if (isVideoUrl(first)) return { type: 'video', url: first }
    return { type: 'none' }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070C1A] pt-24 md:pt-28">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/50 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-300 text-sm">Loading your gigs…</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070C1A] pt-24 md:pt-28">
        <div className={`${panelClass} p-6 text-center`}>
          <div className="text-rose-400 font-semibold mb-2">Error</div>
          <div className="text-slate-300 text-sm">{error}</div>
        </div>
      </main>
    )
  }

  if (isFreelancer === false) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070C1A] pt-24 md:pt-28 px-4">
        <div className={`${panelClass} p-6 text-center max-w-md w-full`}>
          <div className="text-slate-200 font-semibold mb-2">Become a Freelancer</div>
          <div className="text-slate-400 text-sm mb-4">Enable freelancer mode in Settings to manage your gigs.</div>
          <div className="flex justify-center">
            <Link href="/account/settings" className="px-5 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition">
              Open Settings
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen bg-[#070C1A] text-slate-100 overflow-x-hidden pt-24 md:pt-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-indigo-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">My Gigs</h1>
            <p className="text-slate-400">Manage, edit, and monitor your services.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/seller/gigs/new"
              className="px-5 py-2.5 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
            >
              + Post a New Gig
            </Link>
          </div>
        </header>

        {/* Filters */}
        <section className={`${panelClass} p-4 mb-6`}>
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, description, or category…"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0B1024] text-slate-100 placeholder:text-slate-500 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 sm:flex gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-[#0B1024] text-slate-100 border border-slate-700/60 focus:outline-none"
                title="Status"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-[#0B1024] text-slate-100 border border-slate-700/60 focus:outline-none"
                title="Sort"
              >
                <option value="updated_desc">Last updated</option>
                <option value="created_desc">Newest created</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* Empty state */}
        {filteredSorted.length === 0 ? (
          <section className={`${panelClass} p-8 text-center`}>
            <div className="text-slate-300 mb-2">No gigs found.</div>
            <div className="text-slate-500 text-sm mb-4">Try adjusting filters or create your first gig.</div>
            <Link
              href="/seller/gigs/new"
              className="inline-flex items-center px-5 py-2.5 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition"
            >
              + Post a New Gig
            </Link>
          </section>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSorted.map((gig) => {
              const cover = coverFor(gig)
              const catLabel = categoryLabelByKey.get(gig.category || '') || gig.category || 'Uncategorized'
              const statusText = (gig.status || 'active').toLowerCase()
              const statusStyle =
                statusText === 'active'
                  ? 'bg-emerald-900/40 text-emerald-200 border border-emerald-800/60'
                  : statusText === 'paused'
                  ? 'bg-amber-900/30 text-amber-200 border border-amber-800/60'
                  : 'bg-slate-800/60 text-slate-200 border border-slate-700/60'

              return (
                <article
                  key={gig.id}
                  className="group overflow-hidden rounded-2xl bg-[#0D1328]/80 border border-slate-700/60 shadow-xl hover:shadow-2xl hover:border-slate-600/60 transition"
                >
                  {/* Media */}
                  <div className="relative">
                    {cover.type === 'image' && cover.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.url}
                        alt={gig.title}
                        className="h-44 w-full object-cover"
                      />
                    ) : cover.type === 'video' && cover.url ? (
                      <div className="h-44 w-full bg-black flex items-center justify-center relative">
                        <video src={cover.url} muted className="h-full max-w-full object-cover opacity-70" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-900/70 text-slate-100 border border-slate-700">
                            VIDEO
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-44 w-full bg-[#0B1024] flex items-center justify-center">
                        <span className="text-slate-500 text-sm">No media</span>
                      </div>
                    )}

                    {/* Top-left chips */}
                    <div className="absolute top-2 left-2 flex gap-2">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/70 text-slate-100 border border-slate-700">
                        {catLabel}
                      </span>
                    </div>

                    {/* Top-right status */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle}`}>{statusText}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-white line-clamp-2 group-hover:text-slate-100">{gig.title}</h2>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">{gig.description || ''}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <div className="text-slate-300 text-sm">Starting at</div>
                        <div className="text-xl font-extrabold text-sky-400">{fmtPrice(gig.price_cents)}</div>
                      </div>
                      <div className="text-xs text-slate-400">
                        Delivery: {gig.delivery_time_days || 1} {Number(gig.delivery_time_days) === 1 ? 'day' : 'days'}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/services/${gig.slug}`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg font-semibold bg-slate-800 text-white hover:bg-slate-700 transition text-sm"
                      >
                        View
                      </Link>
                      <Link
                        href={`/seller/gigs/${gig.slug}/edit`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}