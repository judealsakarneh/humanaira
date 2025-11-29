'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../../../api/lib/supabaseBrowser'

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
type GigRow = {
  id: string
  title: string
  slug: string
  category: string
  description: string
  tags: string[] | null
  cover_image_url: string | null
  media_urls: string[] | null
  price_cents: number
  delivery_time_days: number
  revisions: string | null
}
type CategoryRow = {
  key: string
  label: string
  group_name: string | null
  sort: number
}
type SuggestedTagRow = { tag: string }

// Media type (supports images and videos)
type MediaItem = {
  id: number
  url: string
  file?: File
  isCover: boolean
  isVideo: boolean
}

// Helpers
const isImageUrl = (url: string) => /\.(png|jpe?g|gif|webp|svg)$/i.test((url || '').split('?')[0])
const isVideoUrl = (url: string) => /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test((url || '').split('?')[0])

function ensureImageCover(items: MediaItem[]): MediaItem[] {
  // Keep an image as cover. If none set, pick first image.
  const hasImageCover = items.some((m) => m.isCover && !m.isVideo)
  if (hasImageCover) return items
  const firstImageIdx = items.findIndex((m) => !m.isVideo)
  if (firstImageIdx >= 0) {
    return items.map((m, i) => ({ ...m, isCover: i === firstImageIdx }))
  }
  // No images at all; remove any mistaken cover flags
  return items.map((m) => ({ ...m, isCover: false }))
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
        // eslint-disable-next-line @next/next/no-img-element
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
          isCover: false,
          isVideo,
        })
      }

      // If no image cover yet, set first image as cover
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
          updated = media.map((m) => ({ ...m, isCover: m.id === id && !m.isVideo }))
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
          <p className="text-sm text-slate-400">Upload up to 5 files. Videos are supported (mp4/webm/mov). The cover must be an image.</p>
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

export default function EditGigPage() {
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowser(), [])
  const { slug } = useParams<{ slug: string }>()

  // Gig
  const [gig, setGig] = useState<GigRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  // Categories + suggested tags
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string | null>(null)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [suggestedLoading, setSuggestedLoading] = useState(false)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('') // will be set from DB or first loaded category
  const [price, setPrice] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('1')
  const [revisions, setRevisions] = useState<string>('3')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Media
  const [media, setMedia] = useState<MediaItem[]>([])
  const [mediaValidationError, setMediaValidationError] = useState<string | null>(null)

  // Load categories first
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
        setCategories((data as CategoryRow[]) || [])
      } catch (e: any) {
        setCategoriesError(e?.message || 'Failed to load categories')
      } finally {
        setCategoriesLoading(false)
      }
    }
    loadCategories()
  }, [supabase])

  // Load gig
  useEffect(() => {
    async function fetchGig() {
      if (!slug) return
      setLoading(true)
      try {
        const { data, error } = await supabase.from('gigs').select('*').eq('slug', slug).maybeSingle()
        if (error) throw error
        if (!data) {
          setGig(null)
          setLoading(false)
          return
        }

        const row = data as GigRow
        setGig(row)
        setTitle(row.title || '')
        setDescription(row.description || '')
        setPrice(((row.price_cents || 0) / 100).toString())
        setDeliveryTime(row.delivery_time_days?.toString() || '1')
        setRevisions((row.revisions ?? '3').toString())
        setTags(Array.isArray(row.tags) ? row.tags : [])

        // Category: set as-is; after categories load we validate fallback
        setCategory(row.category || '')

        // Build media items from cover + gallery
        const coverUrl = row.cover_image_url || undefined
        const gallery = Array.isArray(row.media_urls) ? row.media_urls : []
        // Include cover if not already in gallery for consistency when reordering
        const allUrls = Array.from(new Set([...(coverUrl ? [coverUrl] : []), ...gallery]))
        const items: MediaItem[] = allUrls.map((url, idx) => ({
          id: Date.now() + idx,
          url,
          isVideo: isVideoUrl(url),
          isCover: coverUrl ? url === coverUrl && isImageUrl(url) : false,
        }))
        setMedia(ensureImageCover(items))
      } catch (e: any) {
        // surface error softly in UI below
      } finally {
        setLoading(false)
      }
    }
    fetchGig()
  }, [slug, supabase])

  // Validate category once both are loaded
  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      const keys = new Set(categories.map((c) => c.key))
      if (!category || !keys.has(category)) {
        setCategory(categories[0].key)
      }
    }
  }, [categoriesLoading, categories, category])

  // Load suggested tags when category changes
  useEffect(() => {
    async function loadTags() {
      if (!category) return
      setSuggestedLoading(true)
      try {
        const { data, error } = await supabase
          .from('category_suggested_tags')
          .select('tag')
          .eq('category_key', category)
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
  }, [category, supabase])

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

  // Tags
  const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value), [])
  const handleTagAdd = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
      const isEnter = (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter'
      const isClick = (e as React.MouseEvent<HTMLButtonElement>).type === 'click'
      if (!isEnter && !isClick) return
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setTags((prev) => [...prev, newTag])
        setTagInput('')
      }
    },
    [tagInput, tags]
  )
  const handleTagRemove = useCallback((t: string) => setTags((prev) => prev.filter((x) => x !== t)), [])
  const addSuggestedTag = useCallback(
    (t: string) => {
      if (!tags.includes(t) && tags.length < 10) setTags((prev) => [...prev, t])
    },
    [tags]
  )

  // Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gig) return
    setSaving(true)
    setMessage('')
    setShowSuccess(false)
    setMediaValidationError(null)

    if (!title || !description || !category || !price || !deliveryTime) {
      setMessage('Please fill in all required fields.')
      setSaving(false)
      return
    }
    if (title.length > 80) {
      setMessage('Title must be 80 characters or fewer.')
      setSaving(false)
      return
    }
    if (description.length > 1200) {
      setMessage('Description must be 1200 characters or fewer.')
      setSaving(false)
      return
    }
    if (media.length === 0) {
      setMediaValidationError('Please upload at least one image or video (with an image as cover).')
      setSaving(false)
      return
    }

    // Require an image cover
    const coverItem = media.find((m) => m.isCover && !m.isVideo) || media.find((m) => !m.isVideo)
    if (!coverItem) {
      setMessage('Please ensure at least one image is uploaded to use as the cover.')
      setSaving(false)
      return
    }

    try {
      // Upload cover if needed
      let cover_image_url = coverItem.url
      if (coverItem.file) {
        const fileName = `cover_${Date.now()}_${coverItem.file.name}`
        const { error } = await supabase.storage.from('gig-media').upload(fileName, coverItem.file, { upsert: true })
        if (error) throw error
        const { data: urlData } = supabase.storage.from('gig-media').getPublicUrl(fileName)
        cover_image_url = urlData.publicUrl
      }

      // Upload remaining media (skip cover)
      const media_urls: string[] = []
      for (const item of media) {
        if (item.id === coverItem.id) continue
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

      const { error } = await supabase
        .from('gigs')
        .update({
          title,
          description,
          category,
          price_cents: Math.round(Number(price) * 100),
          delivery_time_days: Number(deliveryTime),
          revisions, // keep string to match creation
          tags,
          cover_image_url,
          media_urls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', gig.id)

      if (error) throw error

      setShowSuccess(true)
      setMessage('Gig updated successfully!')
      setTimeout(() => router.push('/seller/gigs'), 1200)
    } catch (err: any) {
      setMessage('Failed to update gig: ' + (err?.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!gig) return
    if (!confirm('Are you sure you want to delete this gig?')) return
    setDeleting(true)
    setMessage('')

    const { error } = await supabase.from('gigs').delete().eq('id', gig.id)

    setDeleting(false)
    if (error) {
      setMessage('Failed to delete gig. Please try again.')
      console.error(error)
    } else {
      setShowSuccess(true)
      setMessage('Gig deleted successfully!')
      setTimeout(() => router.push('/seller/gigs'), 1000)
    }
  }

  // Loading states
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070C1A] pt-24 md:pt-28">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/50 border-t-transparent rounded-full animate-spin" />
          <div className="text-slate-300 text-sm">Loading gig…</div>
        </div>
      </main>
    )
  }

  if (!gig) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#070C1A] pt-24 md:pt-28">
        <div className={`${panelClass} p-6 text-center`}>
          <div className="text-rose-400 font-semibold mb-2">Gig not found</div>
          <Link href="/seller/gigs" className="text-sky-400 hover:text-sky-300 underline">
            Back to gigs
          </Link>
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

      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Edit Gig</h1>
            <p className="text-slate-400 mt-1">Update your gig details, media, and category.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/seller/gigs" className={btnGhost}>
              ← Back to Gigs
            </Link>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Details */}
          <section className={`${panelClass} p-5`}>
            <h2 className="text-lg font-bold text-white mb-4">Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm text-slate-300 mb-1">Title <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  className={inputBase}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={80}
                  placeholder="I will design a modern, responsive website using React and Tailwind"
                />
                <div className="text-xs text-slate-400 mt-1">{title.length}/80</div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Category <span className="text-rose-400">*</span></label>
                {categoriesLoading ? (
                  <div className="h-[52px] rounded-xl bg-slate-800/50 animate-pulse" />
                ) : categoriesError ? (
                  <div className="text-rose-300 text-sm">{categoriesError}</div>
                ) : (
                  <select
                    className={selectBase}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
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
                <label className="block text-sm text-slate-300 mb-1">Description <span className="text-rose-400">*</span></label>
                <textarea
                  className={inputBase}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={6}
                  maxLength={1200}
                  placeholder="Describe what you offer, what makes it unique, and exactly what buyers will receive."
                />
                <div className="text-xs text-slate-400 mt-1">{description.length}/1200</div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Starting Price (USD) <span className="text-rose-400">*</span></label>
                <input
                  type="number"
                  min={5}
                  step={1}
                  className={inputBase}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Delivery Time (Days) <span className="text-rose-400">*</span></label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  className={inputBase}
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  required
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Revisions</label>
                <select className={selectBase} value={revisions} onChange={(e) => setRevisions(e.target.value)}>
                  <option value="1">1 Revision</option>
                  <option value="3">3 Revisions</option>
                  <option value="5">5 Revisions</option>
                  <option value="unlimited">Unlimited Revisions</option>
                </select>
              </div>

              {/* Tags */}
              <div className="lg:col-span-3">
                <label className="block text-sm text-slate-300 mb-1">Skills & Tools (press Enter to add)</label>
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
          <section className="flex flex-col md:flex-row gap-4">
            <button type="submit" className={`${btnPrimary} flex-1`} disabled={saving || categoriesLoading || !category}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 inline-flex justify-center items-center px-5 py-3 rounded-xl font-semibold bg-slate-700 text-white hover:bg-rose-600 transition disabled:opacity-60"
            >
              {deleting ? 'Deleting…' : 'Delete Gig'}
            </button>
          </section>

          {/* Messages */}
          {message && (
            <div
              className={`text-center font-medium mt-2 ${
                showSuccess ? 'text-emerald-400' : 'text-slate-300'
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </main>
  )
}