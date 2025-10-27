'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../../api/lib/supabaseBrowser'

// Theme helpers
const panelClass = 'bg-[#0D1328]/80 border border-slate-700/60 backdrop-blur-sm rounded-2xl shadow-2xl'

// Controls
const inputBase =
  'w-full px-4 py-3 rounded-xl bg-[#0B1024] text-slate-100 placeholder:text-slate-500 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
const selectBase = `${inputBase} appearance-none`
const btnPrimary =
  'inline-flex justify-center items-center px-5 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed'
const btnGhost =
  'inline-flex justify-center items-center px-4 py-2 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-white transition'

// Types
type CategoryRow = {
  key: string
  label: string
  group_name: string | null
  sort: number
}
type SuggestedTagRow = {
  tag: string
}

// Media type (supports images and videos)
type MediaItem = {
  id: number
  url: string
  file?: File
  isCover: boolean
  isVideo: boolean
}

// Media Card component
function MediaCard({
  item,
  index,
  total,
  onAction,
}: {
  item: MediaItem
  index: number
  total: number
  onAction: (id: number, action: 'set-cover' | 'move-up' | 'move-down' | 'delete') => void
}) {
  const isFirst = index === 0
  const isLast = index === total - 1
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-700/60 bg-[#0B1024]">
      {item.isVideo ? (
        <video
          src={item.url}
          controls
          muted
          className="h-40 w-full object-cover bg-black"
          preload="metadata"
        />
      ) : (
        <img
          src={item.url}
          alt={`Gig media ${index + 1}`}
          className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
      <div className="absolute top-2 left-2 flex items-center gap-2">
        {item.isVideo && (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-800/90 text-slate-100 border border-slate-600/60">
            VIDEO
          </span>
        )}
        {!item.isVideo && item.isCover && (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-indigo-600 text-white border border-indigo-400/40 shadow">
            COVER
          </span>
        )}
        {!item.isVideo && !item.isCover && (
          <button
            type="button"
            onClick={() => onAction(item.id, 'set-cover')}
            className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-800/80 text-white hover:bg-slate-700 border border-slate-600/60"
            title="Set as cover (images only)"
          >
            Make Cover
          </button>
        )}
        {item.isVideo && (
          <button
            type="button"
            disabled
            className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-800/50 text-slate-400 border border-slate-700 cursor-not-allowed"
            title="Videos cannot be used as cover"
          >
            Cover (image only)
          </button>
        )}
      </div>
      <div className="absolute bottom-2 right-2 flex gap-2">
        <button
          type="button"
          onClick={() => onAction(item.id, 'move-up')}
          disabled={isFirst}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
            isFirst
              ? 'bg-slate-800/60 text-slate-500 border-slate-700 cursor-not-allowed'
              : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 border-slate-600/80'
          }`}
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, 'move-down')}
          disabled={isLast}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
            isLast
              ? 'bg-slate-800/60 text-slate-500 border-slate-700 cursor-not-allowed'
              : 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 border-slate-600/80'
          }`}
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => onAction(item.id, 'delete')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-400/40"
          title="Remove"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

// Ensure there is always an image cover if any images exist
function ensureImageCover(items: MediaItem[]): MediaItem[] {
  const hasCover = items.some((m) => m.isCover && !m.isVideo)
  if (hasCover) return items
  const firstImageIdx = items.findIndex((m) => !m.isVideo)
  if (firstImageIdx >= 0) {
    return items.map((m, i) => ({ ...m, isCover: i === firstImageIdx }))
  }
  return items
}

// Media Manager (images + videos)
const MediaManager = ({
  media,
  setMedia,
  validationError,
  setValidationError,
}: {
  media: MediaItem[]
  setMedia: (val: MediaItem[]) => void
  validationError: string | null
  setValidationError: (val: string | null) => void
}) => {
  const onUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return
      const files = Array.from(e.target.files)
      let current = [...media]
      for (const file of files) {
        if (current.length >= 5) break
        const isVideo = file.type.startsWith('video/')
        const objectUrl = URL.createObjectURL(file)
        current.push({
          id: Date.now() + Math.floor(Math.random() * 1000),
          url: objectUrl,
          file,
          isCover: current.length === 0 && !isVideo,
          isVideo,
        })
      }
      if (current.length > 5) current = current.slice(0, 5)
      current = ensureImageCover(current)
      setMedia(current)
      setValidationError(null)
      e.target.value = ''
    },
    [media, setMedia, setValidationError]
  )

  const handleAction = useCallback(
    (id: number, action: 'set-cover' | 'move-up' | 'move-down' | 'delete') => {
      const idx = media.findIndex((m) => m.id === id)
      if (idx === -1) return
      let updated = [...media]
      setValidationError(null)

      switch (action) {
        case 'set-cover':
          if (media[idx].isVideo) break // ignore; videos can’t be cover
          updated = media.map((m) => ({ ...m, isCover: m.id === id }))
          break
        case 'move-up':
          if (idx > 0) [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]]
          break
        case 'move-down':
          if (idx < media.length - 1) [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]]
          break
        case 'delete': {
          const removed = updated.splice(idx, 1)[0]
          if (removed.isCover) {
            updated = ensureImageCover(updated)
          }
          break
        }
      }
      updated = ensureImageCover(updated)
      setMedia(updated)
    },
    [media, setMedia, setValidationError]
  )

  return (
    <section className={`${panelClass} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Media</h2>
          <p className="text-sm text-slate-400">
            Upload up to 5 files. Videos are supported (mp4/webm/mov) but the cover must be an image.
          </p>
        </div>
        <label className={btnGhost}>
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            className="hidden"
            onChange={onUpload}
          />
          Upload
        </label>
      </div>

      {validationError && (
        <div className="mb-3 rounded-lg border border-rose-700/60 bg-rose-900/30 p-3 text-rose-200">{validationError}</div>
      )}

      {media.length === 0 ? (
        <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-700/70 bg-[#0B1024] p-10 text-center cursor-pointer hover:bg-[#0B1024]/80 transition">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-200 text-xl">
            ⬆
          </div>
          <div className="text-slate-200 font-semibold">Upload images or videos</div>
          <div className="text-slate-400 text-sm">PNG, JPG, MP4, WEBM, MOV. First image becomes the cover.</div>
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime"
            multiple
            className="hidden"
            onChange={onUpload}
          />
        </label>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((item, idx) => (
            <MediaCard key={item.id} item={item} index={idx} total={media.length} onAction={handleAction} />
          ))}
        </div>
      )}
    </section>
  )
}

// Main page
export default function PostGigPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowser(), [])

  // Access control
  const [checking, setChecking] = useState(true)
  const [accessError, setAccessError] = useState('')

  // Categories + suggested tags
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [suggestedLoading, setSuggestedLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    'gig-title': '',
    description: '',
    category: '', // will be set after categories load
    price: '',
    'delivery-days': '',
    revisions: '3',
  })
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [mediaValidationError, setMediaValidationError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMessage, setSuccessMessage] = useState(false)

  // Check freelancer access
  useEffect(() => {
    async function check() {
      setChecking(true)
      setAccessError('')
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setAccessError('You must be logged in to post a gig.')
        setChecking(false)
        setTimeout(() => router.replace('/account'), 1500)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_freelancer')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        setAccessError('Could not load your profile.')
        setChecking(false)
        setTimeout(() => router.replace('/account'), 1500)
        return
      }
      if (!profile.is_freelancer) {
        setAccessError('Only freelancers can post gigs. Enable freelancer mode in your account settings.')
        setChecking(false)
        setTimeout(() => router.replace('/account/settings'), 1800)
        return
      }
      setChecking(false)
    }
    check()
  }, [router, supabase])

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      setCategoriesLoading(true)
      setCategoriesError(null)
      try {
        const { data, error } = await supabase
          .from('gig_categories')
          .select('key,label,group_name,sort')
          .eq('active', true)
          .order('group_name', { ascending: true, nullsFirst: true })
          .order('sort', { ascending: true })
          .order('label', { ascending: true })

        if (error) throw error
        const list = (data as CategoryRow[]) || []
        setCategories(list)

        // Default category if empty
        if (!formData.category && list.length > 0) {
          setFormData((prev) => ({ ...prev, category: list[0].key }))
        }
      } catch (e: any) {
        setCategoriesError(e?.message || 'Failed to load categories')
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load suggested tags when category changes
  useEffect(() => {
    async function loadTags() {
      const cat = formData.category
      if (!cat) return
      setSuggestedLoading(true)
      try {
        const { data, error } = await supabase
          .from('category_suggested_tags')
          .select('tag')
          .eq('category_key', cat)
          .order('tag', { ascending: true })

        if (error) throw error
        setSuggestedTags(((data as SuggestedTagRow[]) || []).map((r) => r.tag))
      } catch {
        setSuggestedTags([])
      } finally {
        setSuggestedLoading(false)
      }
    }
    loadTags()
  }, [formData.category, supabase])

  // Group categories by group_name
  const groupedCategories = useMemo(() => {
    const map = new Map<string, CategoryRow[]>()
    for (const c of categories) {
      const g = c.group_name || 'Other'
      if (!map.has(g)) map.set(g, [])
      map.get(g)!.push(c)
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [categories])

  // Tag handlers
  const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value), [])
  const handleTagAdd = useCallback(
    (e: any) => {
      if (e.key === 'Enter' || e.type === 'click') {
        e.preventDefault()
        const newTag = tagInput.trim()
        if (newTag && !tags.includes(newTag) && tags.length < 10) {
          setTags((prev) => [...prev, newTag])
          setTagInput('')
        }
      }
    },
    [tagInput, tags]
  )
  const handleTagRemove = useCallback((t: string) => setTags((prev) => prev.filter((x) => x !== t)), [])

  // Suggested tag click
  const addSuggestedTag = useCallback(
    (t: string) => {
      if (!tags.includes(t) && tags.length < 10) {
        setTags((prev) => [...prev, t])
      }
    },
    [tags]
  )

  // Form changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { id, value } = e.target
      setFormData((prev) => ({ ...prev, [id]: value }))
    },
    []
  )

  // Unique slug helper
  const buildSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const ensureUniqueSlug = async (slug: string) => {
    const { data } = await supabase.from('gigs').select('slug').eq('slug', slug).maybeSingle()
    if (!data) return slug
    const unique = `${slug}-${Math.random().toString(36).slice(2, 6)}`
    return unique
  }

  // Submit
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setErrorMsg('')
      setSuccessMessage(false)
      setLoading(true)

      // Basic validation
      if (!formData['gig-title'] || !formData.description || !formData.price || !formData['delivery-days'] || !formData.category) {
        setErrorMsg('Please fill in all required fields.')
        setLoading(false)
        return
      }
      if (formData['gig-title'].length > 80) {
        setErrorMsg('Title must be 80 characters or fewer.')
        setLoading(false)
        return
      }
      if (formData.description.length > 1200) {
        setErrorMsg('Description must be 1200 characters or fewer.')
        setLoading(false)
        return
      }
      if (media.length === 0) {
        setMediaValidationError('Please upload at least one image or video for your gig.')
        setLoading(false)
        return
      }

      // Require an image cover
      const cover = media.find((m) => m.isCover && !m.isVideo) || media.find((m) => !m.isVideo)
      if (!cover) {
        setErrorMsg('Please upload at least one image to use as the cover.')
        setLoading(false)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setErrorMsg('Could not get your user info. Please log in again.')
          setLoading(false)
          return
        }

        // Upload cover first
        let cover_image_url = ''
        if (cover.file) {
          const fileName = `cover_${Date.now()}_${cover.file.name}`
          const { error } = await supabase.storage.from('gig-media').upload(fileName, cover.file, { upsert: true })
          if (error) throw error
          const { data: urlData } = supabase.storage.from('gig-media').getPublicUrl(fileName)
          cover_image_url = urlData.publicUrl
        } else {
          cover_image_url = cover.url
        }

        // Upload the rest (images or videos)
        const media_urls: string[] = []
        for (const item of media) {
          if (item.id === cover.id) continue
          if (item.file) {
            const prefix = item.isVideo ? 'video' : 'media'
            const fileName = `${prefix}_${Date.now()}_${item.file.name}`
            const { error } = await supabase.storage.from('gig-media').upload(fileName, item.file, { upsert: true })
            if (error) throw error
            const { data: urlData } = supabase.storage.from('gig-media').getPublicUrl(fileName)
            media_urls.push(urlData.publicUrl)
          } else {
            media_urls.push(item.url)
          }
        }

        // Insert gig
        const rawSlug = buildSlug(formData['gig-title'])
        const slug = await ensureUniqueSlug(rawSlug)

        const { data: gigData, error: gigError } = await supabase
          .from('gigs')
          .insert([
            {
              title: formData['gig-title'],
              slug,
              category: formData.category, // now from gig_categories.key
              description: formData.description,
              tags,
              cover_image_url, // image only
              media_urls, // can contain images and videos
              price_cents: Math.round(Number(formData.price) * 100),
              delivery_time_days: Number(formData['delivery-days']),
              revisions: formData.revisions,
              seller_id: user.id,
              status: 'active',
            },
          ])
          .select()
          .single()

        if (gigError) throw gigError

        setSuccessMessage(true)
        setTimeout(() => router.push(`/seller/gigs/${gigData.slug}`), 1000)
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to post gig. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [formData, media, tags, router, supabase]
  )

  // Loading and access states
  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070C1A] pt-24 md:pt-28">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/50 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-300 text-sm">Checking access…</div>
        </div>
      </main>
    )
  }
  if (accessError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070C1A] pt-24 md:pt-28">
        <div className={`${panelClass} p-6 text-center`}>
          <div className="text-rose-400 font-semibold mb-2">Access restricted</div>
          <div className="text-slate-300 text-sm">{accessError}</div>
        </div>
      </main>
    )
  }

  // Render
  return (
    <main className="relative min-h-screen bg-[#070C1A] text-slate-100 overflow-x-hidden pt-24 md:pt-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-indigo-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Post a New Gig</h1>
            <p className="text-slate-400 mt-1">Create a professional service page in minutes.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className={btnGhost}>
              ← Back
            </button>
          </div>
        </header>

        {/* Tips */}
        <section className={`${panelClass} p-5 mb-6`}>
          <h2 className="text-lg font-bold text-white mb-2">Quick Tips</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
            {[
              "Write a clear title (e.g., 'I will build a custom AI chatbot for your business').",
              'Describe exactly what the buyer will receive.',
              'Use a high-quality cover image (no watermarks, no text overlays).',
              'Set realistic delivery times and revisions.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-sky-400 mt-0.5">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic details */}
          <section className={`${panelClass} p-5`}>
            <h2 className="text-lg font-bold text-white mb-4">Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label htmlFor="gig-title" className="block text-sm text-slate-300 mb-1">
                  Gig Title <span className="text-rose-400">*</span>
                </label>
                <input
                  id="gig-title"
                  type="text"
                  maxLength={80}
                  required
                  value={formData['gig-title']}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="I will design a modern, responsive website using React and Tailwind"
                />
                <div className="text-xs text-slate-400 mt-1">{formData['gig-title'].length}/80</div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Category <span className="text-rose-400">*</span>
                </label>
                {categoriesLoading ? (
                  <div className="h-[52px] rounded-xl bg-slate-800/50 animate-pulse" />
                ) : categoriesError ? (
                  <div className="text-rose-300 text-sm">{categoriesError}</div>
                ) : (
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className={selectBase}
                  >
                    {groupedCategories.map(([group, items]) => (
                      <optgroup key={group} label={group}>
                        {items.map((cat) => (
                          <option key={cat.key} value={cat.key}>
                            {cat.label}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                )}
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="description" className="block text-sm text-slate-300 mb-1">
                  Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="description"
                  rows={6}
                  maxLength={1200}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="Describe what you offer, what makes it unique, and exactly what buyers will receive."
                />
                <div className="text-xs text-slate-400 mt-1">{formData.description.length}/1200</div>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm text-slate-300 mb-1">
                  Starting Price (USD) <span className="text-rose-400">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  min={5}
                  step="1"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label htmlFor="delivery-days" className="block text-sm text-slate-300 mb-1">
                  Delivery Time (Days) <span className="text-rose-400">*</span>
                </label>
                <input
                  id="delivery-days"
                  type="number"
                  min={1}
                  step={1}
                  required
                  value={formData['delivery-days']}
                  onChange={handleChange}
                  className={inputBase}
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <label htmlFor="revisions" className="block text-sm text-slate-300 mb-1">
                  Revisions
                </label>
                <select id="revisions" value={formData.revisions} onChange={handleChange} className={selectBase}>
                  <option value="1">1 Revision</option>
                  <option value="3">3 Revisions</option>
                  <option value="5">5 Revisions</option>
                  <option value="unlimited">Unlimited Revisions</option>
                </select>
              </div>

              {/* Tags */}
              <div className="lg:col-span-3">
                <label htmlFor="skills-input" className="block text-sm text-slate-300 mb-1">
                  Skills & Tools (press Enter to add)
                </label>
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-700/60 bg-[#0B1024] p-3">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full bg-indigo-600 text-white px-3 py-1 text-sm font-medium"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(t)}
                        className="text-indigo-100 hover:text-white"
                        aria-label={`Remove ${t}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    id="skills-input"
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagAdd}
                    className="flex-1 min-w-[12rem] bg-transparent outline-none text-slate-100 placeholder:text-slate-500"
                    placeholder="e.g., LangChain, RAG, OpenAI, Whisper, SDXL"
                  />
                  <button type="button" onClick={handleTagAdd} className={btnGhost}>
                    Add
                  </button>
                </div>

                {/* Suggested tags */}
                <div className="mt-2">
                  <div className="text-xs text-slate-400 mb-1">Recommended for this category:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedLoading ? (
                      <div className="h-6 w-40 rounded bg-slate-800/50 animate-pulse" />
                    ) : suggestedTags.length === 0 ? (
                      <div className="text-slate-500 text-xs">No suggestions.</div>
                    ) : (
                      suggestedTags.map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => addSuggestedTag(st)}
                          className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60"
                        >
                          + {st}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Media (images + videos) */}
          <MediaManager
            media={media}
            setMedia={setMedia}
            validationError={mediaValidationError}
            setValidationError={setMediaValidationError}
          />

          {/* Actions */}
          <section className="flex items-center justify-between gap-3">
            <div className="text-sm text-slate-400">
              By publishing, you agree to our{' '}
              <a href="/terms" target="_blank" className="text-sky-400 hover:text-sky-300 underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" className="text-sky-400 hover:text-sky-300 underline">
                Privacy Policy
              </a>
              .
            </div>
            <button type="submit" className={btnPrimary} disabled={loading || categoriesLoading || !formData.category}>
              {loading ? 'Publishing…' : 'Publish Gig'}
            </button>
          </section>

          {/* Messages */}
          {errorMsg && (
            <div className="rounded-xl border border-rose-700/60 bg-rose-900/30 p-3 text-rose-200">{errorMsg}</div>
          )}
          {successMessage && (
            <div className="rounded-xl border border-emerald-700/60 bg-emerald-900/30 p-3 text-emerald-200">
              Gig posted successfully! Redirecting…
            </div>
          )}
        </form>
      </div>
    </main>
  )
}