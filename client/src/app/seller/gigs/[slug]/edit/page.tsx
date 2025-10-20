'use client'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../../../api/lib/supabaseBrowser'

// Match the "Post a Gig" categories/options
const categories = [
  { value: 'web_dev', label: 'Web Development' },
  { value: 'graphic_design', label: 'Graphic Design' },
  { value: 'writing_translation', label: 'Writing & Translation' },
  { value: 'video_animation', label: 'Video & Animation' },
  { value: 'music_audio', label: 'Music & Audio' },
  { value: 'ai_services', label: 'AI Services' },
]

// Dark theme UI helpers (muted blues, slate foregrounds)
const inputClasses =
  'w-full px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-[#171822] text-slate-200 text-lg transition'
const tagBaseClasses =
  'inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-full text-sm font-medium bg-sky-700 text-white'
const tagRemoveClasses =
  'ml-2 cursor-pointer font-bold text-sky-200 hover:text-white'

// Utility: detect image URLs by extension
const isImageUrl = (url: string) =>
  /\.(png|jpe?g|gif|webp|svg)$/i.test(url.split('?')[0] || '')

// Image Manager Component (reorder, set cover, remove, add)
type ManagedImage = { id: number; url: string; file?: File; isCover: boolean }

function ImageManager({
  images,
  setImages,
  validationError,
  setValidationError,
}: {
  images: ManagedImage[]
  setImages: React.Dispatch<React.SetStateAction<ManagedImage[]>>
  validationError: string | null
  setValidationError: (v: string | null) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (images.length >= 5) {
        setValidationError('Maximum 5 images allowed.')
        return
      }
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.type.startsWith('image/')) {
        setValidationError('Only image files are allowed.')
        return
      }

      setValidationError(null)
      const url = URL.createObjectURL(file)
      const newImage: ManagedImage = {
        id: Date.now(),
        url,
        file,
        isCover: images.length === 0, // first image becomes cover
      }

      // Ensure there is exactly one cover
      const hasCover = images.some(i => i.isCover) || newImage.isCover
      const updated = hasCover
        ? [...images, newImage]
        : images.map((img, idx) => ({ ...img, isCover: idx === 0 })).concat(newImage)
      setImages(updated)
      e.target.value = ''
    },
    [images, setImages, setValidationError]
  )

  const handleAction = useCallback(
    (id: number, action: 'set-cover' | 'move-up' | 'move-down' | 'delete') => {
      const index = images.findIndex(img => img.id === id)
      if (index === -1) return
      let updated = [...images]

      switch (action) {
        case 'set-cover':
          updated = updated.map(img => ({ ...img, isCover: img.id === id }))
          break
        case 'move-up':
          if (index > 0) {
            ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
          }
          break
        case 'move-down':
          if (index < images.length - 1) {
            ;[updated[index + 1], updated[index]] = [updated[index], updated[index + 1]]
          }
          break
        case 'delete': {
          const wasCover = updated[index].isCover
          updated.splice(index, 1)
          if (wasCover && updated.length > 0) {
            // promote first image to cover if cover removed
            updated[0].isCover = true
          }
          break
        }
      }
      setImages(updated)
    },
    [images, setImages]
  )

  return (
    <div className="border-t border-slate-700 pt-6 mt-2">
      <h2 className="text-xl font-semibold text-slate-100 mb-3">Gig Image Gallery</h2>
      <p className="text-sm text-slate-400 mb-4">
        Upload up to 5 images. The one marked as Cover will be the main image on your gig.
      </p>

      {validationError && (
        <div className="p-3 mb-4 bg-red-900/40 text-red-200 rounded-lg border border-red-800">
          {validationError}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="image-upload" className="block text-sm font-medium text-slate-300 mb-1">
          Upload New Image
        </label>
        <input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="w-full text-sm text-slate-300"
        />
      </div>

      <div className="space-y-3">
        {images.length === 0 ? (
          <p className="text-slate-500 text-center py-4">No images yet. Upload to get started.</p>
        ) : (
          images.map((img, index) => {
            const isCover = img.isCover
            const isFirst = index === 0
            const isLast = index === images.length - 1
            return (
              <div
                key={img.id}
                className="flex flex-col sm:flex-row items-center p-4 bg-[#181a23] rounded-xl border border-slate-700 shadow"
              >
                <div className="flex-shrink-0 relative mb-4 sm:mb-0 sm:mr-6">
                  <img
                    src={img.url}
                    alt={`Gig Image ${index + 1}`}
                    className="w-40 h-24 object-cover rounded-lg border border-slate-600"
                  />
                  {isCover && (
                    <span className="absolute top-0 right-0 -mt-2 -mr-2 px-2 py-0.5 text-xs font-bold bg-sky-700 text-white rounded-full shadow">
                      COVER
                    </span>
                  )}
                </div>

                <div className="flex-grow text-sm text-slate-300 w-full sm:w-auto">
                  <p className="font-medium">Image {index + 1}</p>
                </div>

                <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-auto flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={() => handleAction(img.id, 'set-cover')}
                    className={`py-2 px-3 text-xs font-medium rounded-lg transition ${
                      isCover ? 'bg-sky-700 text-white cursor-default' : 'bg-sky-600 hover:bg-sky-500 text-white'
                    }`}
                  >
                    {isCover ? 'Is Cover' : 'Set as Cover'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(img.id, 'move-up')}
                    disabled={isFirst}
                    className={`py-2 px-3 text-xs font-medium rounded-lg transition ${
                      isFirst ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-500 text-white'
                    }`}
                  >
                    Move Up
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(img.id, 'move-down')}
                    disabled={isLast}
                    className={`py-2 px-3 text-xs font-medium rounded-lg transition ${
                      isLast ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-600 hover:bg-slate-500 text-white'
                    }`}
                  >
                    Move Down
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(img.id, 'delete')}
                    className="py-2 px-3 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default function EditGigPage() {
  const { slug } = useParams<{ slug: string }>()
  const [gig, setGig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0].value)
  const [price, setPrice] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('1')

  // New fields to match "Post a Gig"
  const [revisions, setRevisions] = useState<string>('3')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // Images manager (only images, videos preserved separately)
  const [images, setImages] = useState<ManagedImage[]>([])
  const [otherMediaUrls, setOtherMediaUrls] = useState<string[]>([]) // non-image media (e.g., videos) preserved as-is
  const [imageValidationError, setImageValidationError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    async function fetchGig() {
      setLoading(true)
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase.from('gigs').select('*').eq('slug', slug).single()

      if (!error && data) {
        setGig(data)
        setTitle(data.title || '')
        setDescription(data.description || '')

        // Category: if stored value isn't in our list, default to first
        const catValues = new Set(categories.map(c => c.value))
        setCategory(catValues.has(data.category) ? data.category : categories[0].value)

        setPrice(((data.price_cents || 0) / 100).toString())
        setDeliveryTime(data.delivery_time_days?.toString() || '1')

        setRevisions((data.revisions ?? '3').toString())
        setTags(Array.isArray(data.tags) ? data.tags : [])

        const mediaUrls: string[] = Array.isArray(data.media_urls) ? data.media_urls : []
        const coverUrl: string | undefined = data.cover_image_url || undefined

        const imageUrls = mediaUrls.filter(isImageUrl)
        const nonImageUrls = mediaUrls.filter(u => !isImageUrl(u))
        setOtherMediaUrls(nonImageUrls)

        // Build unique list of image URLs, ensuring cover is present and first
        const allImageSet = new Set<string>(imageUrls)
        if (coverUrl && isImageUrl(coverUrl)) allImageSet.add(coverUrl)

        let ordered = Array.from(allImageSet)
        if (coverUrl && isImageUrl(coverUrl)) {
          ordered = [coverUrl, ...ordered.filter(u => u !== coverUrl)]
        }

        const initialImages: ManagedImage[] = ordered.map((url, idx) => ({
          id: Date.now() + idx,
          url,
          isCover: coverUrl ? url === coverUrl : idx === 0,
        }))

        setImages(initialImages)
      }

      setLoading(false)
    }

    if (slug) fetchGig()
  }, [slug])

  // --- Tags handlers (match "Post a Gig") ---
  const handleTagInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value)
  }, [])

  const handleTagAdd = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
      const isEnter = (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter'
      const isClick = (e as React.MouseEvent<HTMLButtonElement>).type === 'click'
      if (!isEnter && !isClick) return
      e.preventDefault()
      const newTag = tagInput.trim()
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setTags(prev => [...prev, newTag])
        setTagInput('')
      }
    },
    [tagInput, tags]
  )

  const handleTagRemove = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setShowSuccess(false)
    setImageValidationError(null)

    if (!title || !description || !category || !price || !deliveryTime) {
      setMessage('Please fill in all required fields.')
      setSaving(false)
      return
    }

    if (images.length === 0) {
      setImageValidationError('Please upload at least one image for your gig.')
      setSaving(false)
      return
    }

    try {
      // Resolve and upload images in their current order
      const supabase = createSupabaseBrowser()
      const resolvedUrls: string[] = []
      for (const img of images) {
        if (img.file) {
          const fileName = `media_${Date.now()}_${img.file.name}`
          const { error: upErr } = await supabase.storage.from('gig-media').upload(fileName, img.file, {
            upsert: true,
          })
          if (upErr) throw upErr
          const { data: urlData } = supabase.storage.from('gig-media').getPublicUrl(fileName)
          resolvedUrls.push(urlData.publicUrl)
        } else {
          resolvedUrls.push(img.url)
        }
      }

      // Determine cover and gallery (exclude cover from media_urls to match Post flow)
      let coverIndex = images.findIndex(i => i.isCover)
      if (coverIndex < 0) coverIndex = 0
      const cover_image_url = resolvedUrls[coverIndex]
      const galleryUrls = resolvedUrls.filter((_, idx) => idx !== coverIndex)

      // Preserve any non-image media (e.g., videos), appended after images
      const media_urls = [...galleryUrls, ...otherMediaUrls]

      const { error } = await supabase
        .from('gigs')
        .update({
          title,
          description,
          category,
          price_cents: Math.round(Number(price) * 100),
          delivery_time_days: Number(deliveryTime),
          revisions, // keep as string to match creation
          tags,
          cover_image_url,
          media_urls,
          updated_at: new Date().toISOString(),
        })
        .eq('id', gig.id)

      if (error) throw error

      setShowSuccess(true)
      setMessage('Gig updated successfully!')
      setTimeout(() => router.push(`/seller/gigs/${gig.slug}`), 1400)
    } catch (err: any) {
      setMessage('Failed to update gig: ' + (err?.message || 'Unknown error'))
    }

    setSaving(false)
  }

  async function handleDelete() {
    if (!gig) return
    if (!confirm('Are you sure you want to delete this gig?')) return
    setDeleting(true)
    setMessage('')

    const supabase = createSupabaseBrowser()
    const { error } = await supabase.from('gigs').delete().eq('id', gig.id)

    setDeleting(false)
    if (error) {
      setMessage('Failed to delete gig. Please try again.')
      console.error(error)
    } else {
      setShowSuccess(true)
      setMessage('Gig deleted successfully!')
      setTimeout(() => router.push('/seller/gigs'), 1200)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a10]">
        <div className="text-slate-300 text-lg font-semibold animate-pulse">Loading gig...</div>
      </div>
    )

  if (!gig)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a10]">
        <div className="text-red-400 text-lg font-semibold">Gig not found.</div>
      </div>
    )

  return (
    <div className="min-h-screen bg-[#090a10] flex items-center justify-center pt-32 pb-12 px-2 font-inter">
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Accent bar and icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <div className="animate-pulse bg-gradient-to-r from-slate-600 to-slate-400 w-28 h-2 rounded-full mb-2" />
          <div className="bg-slate-800 p-3 rounded-full shadow-lg">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="20" fill="#334155" fillOpacity="0.25" />
              <path d="M14 28v-2a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v2" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <circle cx="20" cy="17" r="5" stroke="#94a3b8" strokeWidth="2" />
            </svg>
          </div>
        </div>

        <main className="bg-[#171822] rounded-3xl shadow-2xl border border-slate-700 px-8 py-12 pt-32">
          <Link href={`/seller/gigs/${gig.slug}`} className="text-slate-300 hover:text-slate-200 mb-4 inline-block text-sm">
            &larr; Back to Gig
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-100 mb-2 text-center tracking-tight drop-shadow">
            Edit Gig
          </h1>
          <p className="text-center text-slate-400 mb-8 text-lg font-medium">Update your gig details and media</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <label className="block text-slate-200 font-semibold mb-1">Title</label>
              <input
                type="text"
                className={inputClasses}
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={80}
                placeholder="e.g. I will design a modern logo"
              />
              <div className="text-xs text-slate-500 mt-1">{title.length}/80 characters</div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-200 font-semibold mb-1">Description</label>
              <textarea
                className={inputClasses}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows={5}
                maxLength={1200}
                placeholder="Provide a detailed description of what your gig offers, what makes it unique, and what the buyer will receive."
              />
              <div className="text-xs text-slate-500 mt-1">{description.length}/1200 characters</div>
            </div>

            {/* Category + Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-200 font-semibold mb-1">Category</label>
                <select
                  className={`${inputClasses} appearance-none`}
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-200 font-semibold mb-1">Starting Price (USD)</label>
                <input
                  type="number"
                  min={1}
                  className={inputClasses}
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            {/* Delivery + Revisions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex-1">
                <label className="block text-slate-200 font-semibold mb-1">Delivery Time (days)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  className={inputClasses}
                  value={deliveryTime}
                  onChange={e => setDeliveryTime(e.target.value)}
                  required
                  placeholder="e.g. 3"
                />
              </div>
              <div className="flex-1">
                <label className="block text-slate-200 font-semibold mb-1">Revisions Offered</label>
                <select
                  className={`${inputClasses} appearance-none`}
                  value={revisions}
                  onChange={e => setRevisions(e.target.value)}
                >
                  <option value="1">1 Revision</option>
                  <option value="3">3 Revisions</option>
                  <option value="5">5 Revisions</option>
                  <option value="unlimited">Unlimited Revisions</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-slate-200 font-semibold mb-1">
                Skills & Tools (Press Enter to add tags)
              </label>
              <div className="flex flex-wrap items-center min-h-12 p-3 rounded-xl bg-[#181a23] border border-slate-700 mb-2">
                {tags.map(tag => (
                  <div key={tag} className={tagBaseClasses}>
                    <span>{tag}</span>
                    <span onClick={() => handleTagRemove(tag)} className={tagRemoveClasses}>
                      &times;
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagAdd}
                  className={inputClasses}
                  placeholder="e.g., React, Figma, Python, SEO"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 rounded-xl bg-slate-700 text-slate-100 font-semibold hover:bg-slate-600 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Image gallery manager (reorder like "Post a Gig") */}
            <ImageManager
              images={images}
              setImages={setImages}
              validationError={imageValidationError}
              setValidationError={setImageValidationError}
            />

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 px-8 py-3 rounded-xl bg-sky-600 text-white font-bold text-lg shadow hover:bg-sky-500 transition-all duration-200 disabled:opacity-70"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-8 py-3 rounded-xl bg-slate-700 text-white font-bold text-lg shadow hover:bg-red-700 transition-all duration-200 disabled:opacity-70"
              >
                {deleting ? 'Deleting...' : 'Delete Gig'}
              </button>
            </div>

            {message && (
              <div
                className={`text-center font-medium mt-3 transition-all duration-300 ${
                  showSuccess ? 'text-green-400 text-lg' : 'text-slate-300'
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  )
}