'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'

// Initialize Supabase instance
const supabase = createSupabaseBrowser()

const HEADER_HEIGHT = 64

// --- Inline SVG Icons (Lucide-style) ---
const BoldIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 12H6"/><path d="M15.4 4c-3.1 0-5.4 1.4-5.4 4.5s2.3 4.5 5.4 4.5c.8 0 1.5-.2 2-.5"/><path d="M15.4 12c-3.1 0-5.4 1.4-5.4 4.5s2.3 4.5 5.4 4.5c.8 0 1.5-.2 2-.5"/></svg>);
const ItalicIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg>);
const UnderlineIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" x2="20" y1="21" y2="21"/></svg>);
const ListIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>);
const ListOrderedIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1a2 2 0 0 0 0-4H4v4zm1 6h1a2 2 0 0 0 0-4H4v4zm-1 6h1a2 2 0 0 0 0-4H4v4z"/></svg>);
const LinkIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
const CameraIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 10L4 8L16 8L18 10Z"/><circle cx="12" cy="13" r="3"/><path d="M22 17c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h3l2-2h6l2 2h3c1.1 0 2 .9 2 2v10z"/></svg>);
const SaveIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>);
const ArrowLeftIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);


const toolbarActions = [
  { label: 'Bold', command: 'bold', icon: <BoldIcon /> },
  { label: 'Italic', command: 'italic', icon: <ItalicIcon /> },
  { label: 'Underline', command: 'underline', icon: <UnderlineIcon /> },
  { label: 'Bullet List', command: 'insertUnorderedList', icon: <ListIcon /> },
  { label: 'Numbered List', command: 'insertOrderedList', icon: <ListOrderedIcon /> },
  { label: 'Link', command: 'createLink', icon: <LinkIcon /> },
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

  // --- Fetch User and Profile Data ---
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

  // --- Rich Text Editor Logic ---
  function handleToolbarAction(command: string) {
    if (command === 'createLink') {
      // Use a custom modal replacement instead of browser prompt (best practice, but using prompt for simplicity here)
      const url = prompt('Enter the link URL:')
      if (url) document.execCommand(command, false, url)
    } else {
      document.execCommand(command, false, undefined)
    }
    // Restore focus to the editor after action
    bioRef.current?.focus();
  }

  function handleBioInput() {
    setBio(bioRef.current?.innerHTML || '')
  }

  // Sync bio state with contentEditable div's innerHTML on initial load
  useEffect(() => {
    if (bioRef.current && bioRef.current.innerHTML !== bio) {
      bioRef.current.innerHTML = bio
    }
  }, [bio])

  // --- Avatar Upload and Update ---
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    // Simple file size check (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be less than 5MB.')
      return;
    }
    
    setSaving(true)
    setMessage('Uploading avatar...')
    
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${fileExt}`
    
    // Upload/Upsert file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true, cacheControl: '3600' })
      
    if (uploadError) {
      setMessage('Failed to upload avatar: ' + uploadError.message)
      setSaving(false)
      return
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    
    setAvatarUrl(urlData.publicUrl)
    setMessage('Avatar uploaded. Click "Save Changes" to update your profile.')
    setSaving(false)
  }

  // --- Handle Form Submission ---
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user || saving) return
    
    setSaving(true)
    setMessage('Saving profile...')
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        username,
        avatar_url: avatarUrl,
        bio, // bio contains the HTML content from the rich text editor
      })
      .eq('id', user.id)
      
    setSaving(false)
    
    if (updateError) {
      setMessage('Failed to update profile: ' + updateError.message)
    } else {
      setMessage('Profile successfully updated!')
      // Redirect back to account page after a short delay
      setTimeout(() => {
        setMessage('')
        router.push('/account')
      }, 1200)
    }
  }

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-medium text-indigo-400">Fetching profile data...</div>
      </div>
    )
  }

  // --- Auth Required UI ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="bg-red-900/30 border border-red-700 p-8 rounded-xl shadow-xl text-center">
          <div className="text-xl font-bold text-red-400 mb-3">Authentication Required</div>
          <div className="text-red-300 text-sm">{message}</div>
        </div>
      </div>
    )
  }

  // --- Main Edit Form UI ---
  return (
    <main
      className="min-h-screen w-full bg-slate-950 flex flex-col items-center pb-16 px-4 font-sans"
      style={{ paddingTop: HEADER_HEIGHT + 32 }}
    >
      {/* Subtle Gradient background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-700 rounded-full blur-[150px]" />
      </div>

      <section className="relative z-10 w-full max-w-3xl bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 p-6 sm:p-10">
        
        {/* Header with Back Button */}
        <div className="flex items-center mb-10">
          <Link
            href="/account"
            className="flex items-center text-indigo-400 hover:text-indigo-300 transition"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">Back to Account</span>
          </Link>
          <h1 className="flex-1 text-3xl font-extrabold text-white text-center">Edit Profile</h1>
          <div className="w-[140px] hidden sm:block"></div> {/* Spacer */}
        </div>
        
        <form onSubmit={handleSave} className="flex flex-col gap-8">
          
          {/* --- Avatar Section --- */}
          <div className="flex flex-col items-center gap-4 border border-slate-800 p-6 rounded-xl bg-slate-800/30">
            <h2 className="text-xl font-semibold text-white">Profile Photo</h2>
            <div className="relative group">
              <img
                src={avatarUrl || 'https://placehold.co/96x96/1e293b/94a3b8?text=AI'}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover bg-slate-800 transition duration-300 group-hover:opacity-70"
              />
              <button
                type="button"
                className="absolute inset-0 w-full h-full rounded-full flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition duration-300"
                onClick={() => fileInputRef.current?.click()}
                title="Change avatar"
              >
                <CameraIcon className="w-6 h-6" />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                disabled={saving}
              />
            </div>
            <p className="text-xs text-slate-400">Max file size 5MB. JPEG or PNG recommended.</p>
          </div>

          {/* --- Details Section (Username & Email) --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Username */}
            <div>
              <label className="block text-slate-300 font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
                disabled={saving}
              />
            </div>
            
            {/* Email (read-only) */}
            <div>
              <label className="block text-slate-300 font-medium mb-1" htmlFor="email">
                Email (Cannot be changed here)
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 text-base cursor-not-allowed opacity-75"
                value={email}
                readOnly
                disabled
              />
            </div>
          </div>
          
          {/* --- Bio (Rich Text Editor) --- */}
          <div>
            <label className="block text-slate-300 font-medium mb-2" htmlFor="bio-editor">
              Professional Bio
            </label>
            <div className="p-1 rounded-t-lg border-x border-t border-slate-700 bg-slate-800/80 flex gap-1 flex-wrap">
              {toolbarActions.map(action => (
                <button
                  key={action.command}
                  type="button"
                  className="p-2 rounded-md text-slate-300 hover:bg-slate-700 transition disabled:opacity-50"
                  title={action.label}
                  tabIndex={-1}
                  onMouseDown={e => {
                    e.preventDefault() // Prevents focus loss from contentEditable
                    handleToolbarAction(action.command)
                  }}
                  disabled={saving}
                >
                  {action.icon}
                </button>
              ))}
            </div>
            
            <div
              id="bio-editor"
              ref={bioRef}
              className="w-full min-h-[150px] px-4 py-3 rounded-b-lg border-x border-b border-slate-700 bg-slate-800 text-white text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 prose prose-invert max-w-none"
              contentEditable
              suppressContentEditableWarning
              onInput={handleBioInput}
              spellCheck={true}
              aria-label="Bio editor"
              style={{ listStylePosition: 'inside', lineHeight: '1.6' }}
              data-placeholder="Describe your skills and experience here..."
            />
            <style jsx global>{`
              [contenteditable]:empty:before {
                content: attr(data-placeholder);
                color: #64748b; /* slate-500 */
                pointer-events: none;
                display: block;
              }
              .prose-invert > ul, .prose-invert > ol {
                margin-left: 1rem;
              }
            `}</style>
          </div>
          
          {/* --- Message and Save Button --- */}
          <div className="flex flex-col items-end gap-4 mt-4">
            {message && (
              <div 
                className={`text-sm font-medium w-full text-center p-3 rounded-xl ${
                  message.includes('Failed') ? 'bg-red-900/40 text-red-300 border border-red-700' 
                  : message.includes('updated') ? 'bg-green-900/40 text-green-300 border border-green-700'
                  : 'bg-indigo-900/40 text-indigo-300 border border-indigo-700'
                }`}
              >
                {message}
              </div>
            )}
            
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg shadow-indigo-900/50 hover:bg-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving || !username.trim()}
            >
              <SaveIcon className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
