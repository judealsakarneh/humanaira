'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../../api/lib/supabaseBrowser'

const categories = [
  'AI Art & Design',
  'Copywriting',
  'Chatbot Development',
  'Automation',
  'Data Analysis',
  'Voice & Audio',
  'Video & Animation',
  'Web & App',
  'Other',
]

const tips = [
  "Write a clear, compelling gig title (e.g. 'I will build a custom AI chatbot for your business').",
  "Describe exactly what you offer and what the client will get.",
  "Add relevant tags so your gig is easy to find.",
  "Use a high-quality cover image (no watermarks, no text overlays).",
  "Set realistic delivery times and revision limits.",
  "Offer multiple packages for more flexibility.",
  "Be honest about your skills and experience.",
  "Respond quickly to client messages for better ratings.",
]

export default function PostGigPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [packages, setPackages] = useState([
    { tier: 'Basic', price: '', delivery_days: '', revisions: '', desc: '' },
    { tier: 'Standard', price: '', delivery_days: '', revisions: '', desc: '' },
    { tier: 'Premium', price: '', delivery_days: '', revisions: '', desc: '' },
  ])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const coverInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  async function handleImageUpload(file: File) {
    const supabase = createSupabaseBrowser()
    const fileName = `cover_${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage
      .from('gig-media')
      .upload(fileName, file, { upsert: true })
    if (error) throw error
    const { data: urlData } = supabase.storage.from('gig-media').getPublicUrl(fileName)
    return urlData.publicUrl
  }

  async function handleMediaUpload(files: File[]) {
    const supabase = createSupabaseBrowser()
    const urls: string[] = []
    for (const file of files) {
      const fileName = `media_${Date.now()}_${file.name}`
      const { error } = await supabase.storage
        .from('gig-media')
        .upload(fileName, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('gig-media').getPublicUrl(fileName)
      urls.push(urlData.publicUrl)
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    try {
      if (!title || !description || !coverImage) {
        setErrorMsg('Please fill in all required fields and upload a cover image.')
        setLoading(false)
        return
      }
      // Upload cover image
      let uploadedCoverUrl = coverImageUrl
      if (coverImage && !coverImageUrl) {
        uploadedCoverUrl = await handleImageUpload(coverImage)
        setCoverImageUrl(uploadedCoverUrl)
      }
      // Upload media files
      let uploadedMediaUrls = mediaUrls
      if (mediaFiles.length > 0 && mediaUrls.length !== mediaFiles.length) {
        uploadedMediaUrls = await handleMediaUpload(mediaFiles)
        setMediaUrls(uploadedMediaUrls)
      }
      // Insert gig
      const supabase = createSupabaseBrowser()
      const { data: gigData, error: gigError } = await supabase
        .from('gigs')
        .insert([{
          title,
          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          category,
          description,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          cover_image_url: uploadedCoverUrl,
          media_urls: uploadedMediaUrls,
        }])
        .select()
        .single()
      if (gigError) throw gigError
      // Insert packages
      for (const pkg of packages) {
        if (pkg.price && pkg.delivery_days) {
          await supabase.from('gig_packages').insert([{
            gig_id: gigData.id,
            tier: pkg.tier,
            price_cents: Math.round(Number(pkg.price) * 100),
            delivery_days: Number(pkg.delivery_days),
            revisions: Number(pkg.revisions) || 0,
            description: pkg.desc,
          }])
        }
      }
      setSuccessMsg('Gig posted successfully!')
      setTimeout(() => router.push(`/seller/gigs/${gigData.slug}`), 1200)
    } catch (err: any) {
      console.error('Full error:', err)
      setErrorMsg(err.message || 'Failed to post gig. Please try again.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090a10] via-[#07102a] to-[#123055] text-gray-100 font-inter flex flex-col items-center pt-24 px-4">
      <section className="max-w-3xl w-full bg-[#181a23] border border-blue-900 rounded-2xl shadow-2xl p-10 mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-blue-200 mb-6 text-center tracking-tight font-sans">
          Post a New Gig
        </h1>
        <p className="text-blue-200 mb-8 text-center">
          Create your gig and reach clients looking for AI-powered services.
        </p>
        <ul className="mb-8 bg-blue-950/40 border border-blue-900 rounded-xl p-4 text-sm text-blue-200 grid grid-cols-1 md:grid-cols-2 gap-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="bg-[#10131e] rounded-2xl shadow p-6 flex flex-col gap-6 border border-blue-900">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-1 text-blue-100" htmlFor="title">
              Gig Title <span className="text-blue-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={80}
              required
              className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#07102a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg transition"
              placeholder="e.g. I will build a custom AI chatbot for your business"
            />
            <div className="text-xs text-blue-300 mt-1">{title.length}/80 characters</div>
          </div>
          {/* Category */}
          <div>
            <label className="block font-semibold mb-1 text-blue-100" htmlFor="category">
              Category <span className="text-blue-400">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#07102a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg transition"
              required
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          {/* Tags */}
          <div>
            <label className="block font-semibold mb-1 text-blue-100" htmlFor="tags">Tags</label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#07102a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg transition"
              placeholder="e.g. ai, chatbot, automation, design"
            />
            <div className="text-xs text-blue-300 mt-1">Comma separated (max 5 recommended)</div>
          </div>
          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 text-blue-100" htmlFor="description">
              Description <span className="text-blue-400">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={6}
              required
              className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#07102a] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg transition"
              placeholder="Describe your service, what you offer, and what the client will get."
            />
            <div className="text-xs text-blue-300 mt-1">{description.length}/1200 characters</div>
          </div>
          {/* Cover Image */}
          <div>
            <label className="block font-semibold mb-1 text-blue-100">
              Cover Image <span className="text-blue-400">*</span>
            </label>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="block mb-2"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setCoverImage(e.target.files[0])
                  setCoverImageUrl('')
                }
              }}
              required
            />
            {coverImage && (
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Cover Preview"
                className="w-full max-w-xs h-40 object-cover rounded-lg border mt-2"
              />
            )}
          </div>
          {/* Media Gallery */}
          <div>
            <label className="block font-semibold mb-1 text-blue-100">Gallery (images/videos, optional)</label>
            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="block mb-2"
              onChange={e => {
                if (e.target.files) {
                  setMediaFiles(Array.from(e.target.files))
                  setMediaUrls([])
                }
              }}
            />
            {mediaFiles.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {mediaFiles.map((file, idx) =>
                  file.type.startsWith('video') ? (
                    <video key={idx} src={URL.createObjectURL(file)} className="w-28 h-20 rounded object-cover border" controls />
                  ) : (
                    <img key={idx} src={URL.createObjectURL(file)} className="w-28 h-20 rounded object-cover border" alt="Media preview" />
                  )
                )}
              </div>
            )}
          </div>
          {/* Packages */}
          <div>
            <label className="block font-semibold mb-2 text-blue-100">
              Packages <span className="text-blue-300">(at least one required)</span>
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {packages.map((pkg, idx) => (
                <div key={pkg.tier} className="bg-[#181a23] border border-blue-800 rounded-lg p-4 flex flex-col gap-2">
                  <div className="font-semibold mb-1 text-blue-200">{pkg.tier}</div>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Price ($)"
                    value={pkg.price}
                    onChange={e => {
                      const val = e.target.value
                      setPackages(pkgs => pkgs.map((p, i) => i === idx ? { ...p, price: val } : p))
                    }}
                    className="w-full px-2 py-1 rounded border border-blue-800 bg-[#07102a] text-white"
                  />
                  <input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Delivery days"
                    value={pkg.delivery_days}
                    onChange={e => {
                      const val = e.target.value
                      setPackages(pkgs => pkgs.map((p, i) => i === idx ? { ...p, delivery_days: val } : p))
                    }}
                    className="w-full px-2 py-1 rounded border border-blue-800 bg-[#07102a] text-white"
                  />
                  <input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Revisions"
                    value={pkg.revisions}
                    onChange={e => {
                      const val = e.target.value
                      setPackages(pkgs => pkgs.map((p, i) => i === idx ? { ...p, revisions: val } : p))
                    }}
                    className="w-full px-2 py-1 rounded border border-blue-800 bg-[#07102a] text-white"
                  />
                  <textarea
                    placeholder="Package description"
                    value={pkg.desc}
                    onChange={e => {
                      const val = e.target.value
                      setPackages(pkgs => pkgs.map((p, i) => i === idx ? { ...p, desc: val } : p))
                    }}
                    className="w-full px-2 py-1 rounded border border-blue-800 bg-[#07102a] text-white"
                    rows={2}
                  />
                </div>
              ))}
            </div>
            <div className="text-xs text-blue-300 mt-1">
              Set price, delivery, and revisions for each package. You can leave unused packages blank.
            </div>
          </div>
          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg py-3 font-semibold hover:from-blue-800 hover:to-blue-600 transition"
            >
              {loading ? 'Posting...' : 'Post Gig'}
            </button>
            {errorMsg && <div className="text-red-400 mt-2">{errorMsg}</div>}
            {successMsg && <div className="text-green-400 mt-2">{successMsg}</div>}
          </div>
        </form>
      </section>
      <div className="max-w-3xl w-full text-center text-blue-200 text-sm opacity-80 mb-10">
        <span className="font-semibold">Tips:</span> Write a clear, compelling title and description. Use relevant tags and choose a fair price. AI gigs get featured!
      </div>
    </main>
  )
}