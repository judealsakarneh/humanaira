'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../../../api/lib/supabaseBrowser'

const categories = [
  'Writing',
  'Design',
  'Voiceover',
  'Automations',
  'Videos',
  'Other',
]

export default function EditGigPage() {
  const { slug } = useParams<{ slug: string }>()
  const [gig, setGig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [price, setPrice] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('1')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [existingMedia, setExistingMedia] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchGig() {
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('slug', slug)
        .single()
      if (!error && data) {
        setGig(data)
        setTitle(data.title)
        setDescription(data.description)
        setCategory(data.category)
        setPrice((data.price_cents / 100).toString())
        setDeliveryTime(data.delivery_time_days.toString())
        setExistingMedia(data.media_urls || [])
      }
      setLoading(false)
    }
    if (slug) fetchGig()
  }, [slug])

  function handleMediaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    const fileArr = Array.from(files)
    setMediaFiles(fileArr)
    setMediaPreviews(fileArr.map(file => URL.createObjectURL(file)))
  }

  function handleRemoveExistingMedia(idx: number) {
    setExistingMedia(existingMedia.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setShowSuccess(false)

    if (!title || !description || !category || !price || !deliveryTime) {
      setMessage('Please fill in all fields.')
      setSaving(false)
      return
    }

    // Upload new media files if present
    let uploadedMediaUrls: string[] = []
    if (mediaFiles.length > 0) {
      const supabase = createSupabaseBrowser()
      for (const file of mediaFiles) {
        const ext = file.name.split('.').pop()
        const filePath = `gigs/${gig.seller_id}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('gigs')
          .upload(filePath, file, { upsert: true })
        if (uploadError) {
          setMessage('Media upload failed.')
          setSaving(false)
          console.error(uploadError)
          return
        }
        const { data: urlData } = supabase.storage.from('gigs').getPublicUrl(filePath)
        uploadedMediaUrls.push(urlData.publicUrl)
      }
    }

    // Combine existing and new media
    const allMedia = [...existingMedia, ...uploadedMediaUrls]

    // Update gig in DB
    const supabase = createSupabaseBrowser()
    const { error } = await supabase.from('gigs').update({
      title,
      description,
      category,
      price_cents: Math.round(Number(price) * 100),
      delivery_time_days: Number(deliveryTime),
      cover_image_url: allMedia[0] || '',
      media_urls: allMedia,
      updated_at: new Date().toISOString(),
    }).eq('id', gig.id)

    setSaving(false)
    if (error) {
      setMessage('Failed to update gig: ' + (error.message || 'Unknown error'))
    } else {
      setShowSuccess(true)
      setMessage('Gig updated successfully!')
      setTimeout(() => router.push(`/seller/gigs/${gig.slug}`), 1400)
    }
  }

  if (loading) return <div className="pt-24 text-center text-blue-600">Loading gig...</div>
  if (!gig) return <div className="pt-24 text-center text-gray-500">Gig not found.</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 flex items-center justify-center pt-40 pb-12 px-2">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Animated Accent bar and icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <div className="animate-pulse bg-gradient-to-r from-blue-500 to-blue-300 w-28 h-2 rounded-full mb-2" />
          <div className="bg-blue-100 p-3 rounded-full shadow-lg">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="20" fill="#3B82F6" fillOpacity="0.15"/>
              <path d="M14 28v-2a6 6 0 016-6h0a6 6 0 016 6v2" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="20" cy="17" r="5" stroke="#2563EB" strokeWidth="2"/>
            </svg>
          </div>
        </div>
        <main className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-100 px-8 py-12 pt-32">
          <Link href={`/seller/gigs/${gig.slug}`} className="text-blue-600 hover:underline mb-4 inline-block text-sm">&larr; Back to Gig</Link>
          <h1 className="text-4xl font-extrabold text-blue-900 mb-2 text-center tracking-tight drop-shadow">Edit Gig</h1>
          <p className="text-center text-blue-500 mb-8 text-lg font-medium">Update your gig details and media</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Title</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 text-gray-900 text-lg transition"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={80}
                placeholder="e.g. I will design a modern logo"
              />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Description</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 text-gray-900 text-lg transition"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows={4}
                maxLength={1000}
                placeholder="Describe your gig in detail..."
              />
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Category</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 text-gray-900 text-lg transition"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-blue-900 font-semibold mb-1">Price (USD)</label>
                <input
                  type="number"
                  min={1}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 text-gray-900 text-lg transition"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                  placeholder="e.g. 25"
                />
              </div>
              <div className="flex-1">
                <label className="block text-blue-900 font-semibold mb-1">Delivery Time (days)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/90 text-gray-900 text-lg transition"
                  value={deliveryTime}
                  onChange={e => setDeliveryTime(e.target.value)}
                  required
                  placeholder="e.g. 2"
                />
              </div>
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Existing Media</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {existingMedia.length === 0 && <div className="text-gray-400">No media</div>}
                {existingMedia.map((url, idx) => {
                  const isVideo = url.match(/\.(mp4|webm|ogg)$/i)
                  return (
                    <div key={idx} className="relative group">
                      {isVideo ? (
                        <video src={url} controls className="w-24 h-24 rounded-xl object-cover border border-blue-200 shadow" />
                      ) : (
                        <img src={url} alt="Gig Media" className="w-24 h-24 rounded-xl object-cover border border-blue-200 shadow" />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingMedia(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition"
                        title="Remove"
                      >×</button>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-blue-900 font-semibold mb-1">Add New Media (Images & Videos)</label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                className="block"
                ref={fileInputRef}
                onChange={handleMediaChange}
              />
              <div className="flex flex-wrap gap-4 mt-2">
                {mediaPreviews.map((url, idx) => {
                  const isVideo = mediaFiles[idx]?.type.startsWith('video')
                  return isVideo ? (
                    <video key={idx} src={url} controls className="w-24 h-24 rounded-xl object-cover border border-blue-200 shadow" />
                  ) : (
                    <img key={idx} src={url} alt="Preview" className="w-24 h-24 rounded-xl object-cover border border-blue-200 shadow" />
                  )
                })}
              </div>
            </div>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition-all duration-200"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {message && (
              <div className={`text-center font-medium mt-2 transition-all duration-300 ${showSuccess ? 'text-green-600 text-xl animate-bounce' : 'text-blue-600'}`}>
                {message}
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  )
}