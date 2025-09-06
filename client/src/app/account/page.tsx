'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

// Rich text editor toolbar actions
const toolbarActions = [
  { label: 'Bold', command: 'bold', icon: <b>B</b> },
  { label: 'Italic', command: 'italic', icon: <i>I</i> },
  { label: 'Underline', command: 'underline', icon: <u>U</u> },
  { label: 'Bullet List', command: 'insertUnorderedList', icon: <span>&bull; List</span> },
  { label: 'Numbered List', command: 'insertOrderedList', icon: <span>1. List</span> },
  { label: 'Link', command: 'createLink', icon: <span>🔗</span> },
]

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [isFreelancer, setIsFreelancer] = useState(false)
  const [bio, setBio] = useState('')
  const [language, setLanguage] = useState('en')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [gigs, setGigs] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bioRef = useRef<HTMLDivElement>(null)
  const supabase = createSupabaseBrowser()
  const router = useRouter()

  // Fetch user info and gigs
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setName(user.user_metadata?.name || '')
        setEmail(user.email || '')
        setAvatarUrl(user.user_metadata?.avatar_url || '')
        setIsFreelancer(user.user_metadata?.isFreelancer || false)
        setBio(user.user_metadata?.bio || '')
        setLanguage(user.user_metadata?.language || 'en')
        fetchGigs(user.id)
      }
      setLoading(false)
    }
    async function fetchGigs(userId: string) {
      const { data, error } = await supabase
        .from('gigs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (!error && data) setGigs(data)
    }
    fetchUser()
    // eslint-disable-next-line
  }, [])

  // Handle avatar upload
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSaving(true)
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}.${fileExt}`
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (error) {
      setMessage('Failed to upload avatar.')
      setSaving(false)
      return
    }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    setAvatarUrl(urlData.publicUrl)
    setSaving(false)
  }

  // Handle profile update
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const updates: any = {
      name,
      avatar_url: avatarUrl,
      isFreelancer,
      bio,
      language,
    }
    const { error } = await supabase.auth.updateUser({
      data: updates,
      email,
    })
    setSaving(false)
    if (error) {
      setMessage('Failed to update profile.')
    } else {
      setMessage('Profile updated!')
      router.refresh()
    }
  }

  // Handle freelancer toggle
  async function handleBecomeFreelancer() {
    setSaving(true)
    setMessage('')
    const { error } = await supabase.auth.updateUser({
      data: { ...user.user_metadata, isFreelancer: true },
    })
    setSaving(false)
    if (error) {
      setMessage('Failed to update status.')
    } else {
      setIsFreelancer(true)
      setMessage('You are now a freelancer!')
      router.refresh()
    }
  }

  // Rich text editor actions
  function handleToolbarAction(command: string) {
    if (command === 'createLink') {
      const url = prompt('Enter the link URL:')
      if (url) document.execCommand(command, false, url)
    } else {
      document.execCommand(command)
    }
  }

  // Keep bio state in sync with contentEditable
  function handleBioInput() {
    setBio(bioRef.current?.innerHTML || '')
  }

  useEffect(() => {
    if (bioRef.current && bioRef.current.innerHTML !== bio) {
      bioRef.current.innerHTML = bio
    }
    // eslint-disable-next-line
  }, [bio])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg text-gray-500">Loading...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <span className="text-lg text-gray-500 mb-4">You must be signed in to view your account.</span>
        <button
          className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          onClick={() => router.push('/login')}
        >
          Sign In
        </button>
      </div>
    )
  }

  // The main background and blur elements are now fixed and vibrant, with correct stacking and overflow.
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090a10] via-[#07102a] to-[#123055] text-gray-100 font-inter relative overflow-hidden">
      {/* Vibrant Blur Backgrounds - fixed position, full screen, behind everything */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 rounded-full blur-[120px] opacity-40" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 bg-blue-100 rounded-full blur-[80px] opacity-25" />
      </div>
      <section className="relative z-10 max-w-2xl mx-auto px-4 py-20 pt-28">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-blue-200 tracking-tight">
          Account Settings
        </h1>
        <form
          onSubmit={handleSave}
          className="bg-[#181a23]/90 rounded-2xl shadow-xl border border-blue-900 p-8 flex flex-col gap-8"
        >
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-shrink-0">
              <img
                src={avatarUrl || '/avatar-placeholder.png'}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-900 shadow"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-700 text-white rounded-full p-2 text-xs hover:bg-blue-800 shadow"
                onClick={() => fileInputRef.current?.click()}
                title="Change avatar"
              >
                ✏️
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-blue-100 font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#07102a] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-blue-100 font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#07102a] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          {/* Bio (Rich Text Editor) */}
          <div>
            <label className="block text-blue-100 font-semibold mb-1" htmlFor="bio">
              Summary
            </label>
            <div className="mb-2 flex gap-2 flex-wrap">
              {toolbarActions.map(action => (
                <button
                  key={action.command}
                  type="button"
                  className="px-2 py-1 rounded bg-blue-950 text-blue-200 hover:bg-blue-900 border border-blue-800 text-sm font-semibold"
                  title={action.label}
                  tabIndex={-1}
                  onMouseDown={e => {
                    e.preventDefault()
                    handleToolbarAction(action.command)
                  }}
                >
                  {action.icon}
                </button>
              ))}
            </div>
            <div
              id="bio"
              ref={bioRef}
              className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-blue-800 bg-[#07102a] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 prose prose-blue max-w-none"
              contentEditable
              suppressContentEditableWarning
              onInput={handleBioInput}
              spellCheck={true}
              aria-label="Summary"
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <div className="text-xs text-blue-300 mt-1">
              You can highlight, bold, italic, add lists, and links. This will be shown as your summary.
            </div>
          </div>
          {/* Language */}
          <div>
            <label className="block text-blue-100 font-semibold mb-1" htmlFor="language">
              Preferred Language
            </label>
            <select
              id="language"
              className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#07102a] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-blue-700 text-white font-bold text-lg shadow hover:bg-blue-800 transition disabled:opacity-60"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {/* Success/Error Message */}
          {message && (
            <div className={`absolute left-1/2 -top-8 -translate-x-1/2 px-6 py-2 rounded-full shadow font-semibold text-center ${
              message.includes('Failed') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {message}
            </div>
          )}
        </form>
        {/* Freelancer Section */}
        {!isFreelancer ? (
          <div className="mt-12 text-center">
            <button
              className="px-8 py-3 rounded-full bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
              onClick={handleBecomeFreelancer}
              disabled={saving}
            >
              Become a Freelancer
            </button>
          </div>
        ) : (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 text-blue-200">Freelancer Dashboard</h2>
            <div className="flex flex-col gap-4">
              <a
                href="/seller/gigs/new"
                className="px-6 py-3 rounded-md bg-blue-700 text-white font-semibold hover:bg-blue-800 transition text-center"
              >
                Post a New Gig
              </a>
              <a
                href="/seller/gigs"
                className="px-6 py-3 rounded-md bg-blue-950 text-blue-200 font-semibold hover:bg-blue-900 transition text-center"
              >
                Manage My Gigs
              </a>
              <a
                href="/seller/orders"
                className="px-6 py-3 rounded-md bg-blue-950 text-blue-200 font-semibold hover:bg-blue-900 transition text-center"
              >
                My Orders
              </a>
            </div>
            {/* My Gigs List */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-blue-100 mb-2">My Gigs</h3>
              {gigs.length === 0 ? (
                <div className="text-blue-300">You have not posted any gigs yet.</div>
              ) : (
                <ul className="space-y-4">
                  {gigs.map(gig => (
                    <li key={gig.id} className="bg-[#10131e] border border-blue-800 rounded-xl p-4 flex items-center gap-4">
                      <img
                        src={gig.cover_image_url || '/default-gig.png'}
                        alt={gig.title}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-200">{gig.title}</div>
                        <div className="text-blue-400 text-sm">{gig.category}</div>
                        <div className="text-blue-300 text-xs">{gig.tags?.join(', ')}</div>
                      </div>
                      <a
                        href={`/seller/gigs/${gig.slug}`}
                        className="px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
                      >
                        View
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {/* Danger Zone */}
        <div className="mt-12 bg-[#181a23]/90 rounded-2xl shadow border border-red-900 p-6 mb-0">
          <h2 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h2>
          <p className="text-blue-200 mb-4">
            Delete your account and all your data. This action cannot be undone.
          </p>
          <button
            className="px-6 py-2 rounded-full bg-red-700 text-white font-semibold shadow hover:bg-red-800 transition"
            onClick={() => alert('Account deletion is not implemented in this demo.')}
          >
            Delete Account
          </button>
        </div>
      </section>
    </main>
  )
}