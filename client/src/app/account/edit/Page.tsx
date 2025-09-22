'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
const supabase = createSupabaseBrowser()

const HEADER_HEIGHT = 64

const toolbarActions = [
  { label: 'Bold', command: 'bold', icon: <b>B</b> },
  { label: 'Italic', command: 'italic', icon: <i>I</i> },
  { label: 'Underline', command: 'underline', icon: <u>U</u> },
  { label: 'Bullet List', command: 'insertUnorderedList', icon: <span>&bull; List</span> },
  { label: 'Numbered List', command: 'insertOrderedList', icon: <span>1. List</span> },
  { label: 'Link', command: 'createLink', icon: <span>🔗</span> },
]

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const bioRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        setLoading(false)
        setMessage('You must be logged in to edit your profile.')
        return
      }
      setUser(user)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profileError || !profileData) {
        setMessage('Could not load your profile.')
      } else {
        setProfile(profileData)
        setUsername(profileData.username || '')
        setEmail(user.email || '')
        setAvatarUrl(profileData.avatar_url || '')
        setBio(profileData.bio || '')
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  function handleToolbarAction(command: string) {
    if (command === 'createLink') {
      const url = prompt('Enter the link URL:')
      if (url) document.execCommand(command, false, url)
    } else {
      document.execCommand(command, false, undefined)
    }
  }

  function handleBioInput() {
    setBio(bioRef.current?.innerHTML || '')
  }

  useEffect(() => {
    if (bioRef.current && bioRef.current.innerHTML !== bio) {
      bioRef.current.innerHTML = bio
    }
  }, [bio])

  // Handle avatar upload (fixed for policy and public URL)
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setSaving(true)
    setMessage('')
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${fileExt}` // folder is user.id, matches policy
    // Remove previous avatar if needed (optional, upsert will overwrite)
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (uploadError) {
      setMessage('Failed to upload avatar.')
      setSaving(false)
      return
    }
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    setAvatarUrl(urlData.publicUrl)
    setSaving(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setMessage('')
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username,
        avatar_url: avatarUrl,
        bio,
      })
      .eq('id', user.id)
    setSaving(false)
    if (updateError) {
      setMessage('Failed to update profile.')
    } else {
      setMessage('Profile updated!')
      setTimeout(() => {
        setMessage('')
        router.push('/account')
      }, 1200)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#0a0d14]">
        <div className="text-blue-400 text-lg font-semibold animate-pulse">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#0a0d14]">
        <div className="text-red-400 text-lg font-semibold mb-4">{message || 'You must be logged in.'}</div>
      </div>
    )
  }

  return (
    <main
      className="min-h-screen w-full bg-[#090a10] flex flex-col items-center pb-12 px-2 md:px-0"
      style={{ paddingTop: HEADER_HEIGHT + 24 }}
    >
      <section className="relative z-10 w-full max-w-2xl bg-[#181a23] rounded-2xl shadow-2xl border border-blue-900/60 p-8 mt-0">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">Edit Profile</h1>
        <form onSubmit={handleSave} className="flex flex-col gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={avatarUrl || '/default-avatar.png'}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-2 border-blue-700 object-cover bg-[#10131e]"
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
          </div>
          {/* Username */}
          <div>
            <label className="block text-blue-100 font-semibold mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#10131e] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          {/* Email (read-only) */}
          <div>
            <label className="block text-blue-100 font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg border border-blue-800 bg-[#10131e] text-white text-base opacity-70"
              value={email}
              readOnly
              disabled
            />
          </div>
          {/* Bio (Rich Text Editor) */}
          <div>
            <label className="block text-blue-100 font-semibold mb-1" htmlFor="bio">
              Bio
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
              ref={bioRef}
              className="w-full min-h-[80px] px-4 py-3 rounded-lg border border-blue-800 bg-[#10131e] text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 prose prose-blue max-w-none"
              contentEditable
              suppressContentEditableWarning
              onInput={handleBioInput}
              spellCheck={true}
              aria-label="Bio"
              style={{ whiteSpace: 'pre-wrap', outline: 'none', listStylePosition: 'inside' }}
            />
            <div className="text-xs text-blue-300 mt-1">
              Highlight text to format. Supports bold, italic, underline, lists, and links.
            </div>
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
            <div className={`text-center text-sm font-semibold ${message.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
              {message}
            </div>
          )}
        </form>
      </section>
    </main>
  )
}