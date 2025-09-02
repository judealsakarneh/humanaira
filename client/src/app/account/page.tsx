'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

// Simple rich text editor toolbar actions
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bioRef = useRef<HTMLDivElement>(null)
  const supabase = createSupabaseBrowser()
  const router = useRouter()

  // Fetch user info
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
      }
      setLoading(false)
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

  return (
    <main className="min-h-screen bg-neutral-100 text-gray-900 font-inter">
      <section className="relative max-w-2xl mx-auto px-4 py-20 mt-10">
        {/* Decorative Blur Backgrounds */}
        <div className="absolute -top-16 -left-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 z-0" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-50 rounded-full blur-2xl opacity-40 z-0" />
        <h1 className="relative z-10 text-3xl md:text-4xl font-extrabold mb-8 text-center text-blue-900 tracking-tight">
          Account Settings
        </h1>
        <form
          onSubmit={handleSave}
          className="relative z-10 bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col gap-8"
        >
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-shrink-0">
              <img
                src={avatarUrl || '/avatar-placeholder.png'}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow"
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 text-xs hover:bg-blue-700 shadow"
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
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          {/* Bio (Rich Text Editor) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="bio">
              Summary
            </label>
            <div className="mb-2 flex gap-2 flex-wrap">
              {toolbarActions.map(action => (
                <button
                  key={action.command}
                  type="button"
                  className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 text-sm font-semibold"
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
              className="w-full min-h-[100px] px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-100 prose prose-blue max-w-none"
              contentEditable
              suppressContentEditableWarning
              onInput={handleBioInput}
              spellCheck={true}
              aria-label="Summary"
              style={{ whiteSpace: 'pre-wrap' }}
            />
            <div className="text-xs text-gray-500 mt-1">
              You can highlight, bold, italic, add lists, and links. This will be shown as your summary.
            </div>
          </div>
          {/* Language */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="language">
              Preferred Language
            </label>
            <select
              id="language"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-100"
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
          <div className="relative z-10 mt-12 text-center">
            <button
              className="px-8 py-3 rounded-full bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
              onClick={handleBecomeFreelancer}
              disabled={saving}
            >
              Become a Freelancer
            </button>
          </div>
        ) : (
          <div className="relative z-10 mt-12">
            <h2 className="text-xl font-bold mb-4 text-blue-900">Freelancer Dashboard</h2>
            <div className="flex flex-col gap-4">
              <a
                href="/seller/gigs/new"
                className="px-6 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-center"
              >
                Post a New Gig
              </a>
              <a
                href="/seller/gigs"
                className="px-6 py-3 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition text-center"
              >
                Manage My Gigs
              </a>
              <a
                href="/seller/orders"
                className="px-6 py-3 rounded-md bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition text-center"
              >
                My Orders
              </a>
            </div>
          </div>
        )}
        {/* Danger Zone */}
        <div className="relative z-10 mt-12 bg-white/90 rounded-2xl shadow border border-red-100 p-6">
          <h2 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h2>
          <p className="text-gray-600 mb-4">
            Delete your account and all your data. This action cannot be undone.
          </p>
          <button
            className="px-6 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
            onClick={() => alert('Account deletion is not implemented in this demo.')}
          >
            Delete Account
          </button>
        </div>
      </section>
    </main>
  )
}