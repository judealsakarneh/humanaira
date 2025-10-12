'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

// --- SVG Icons for Modern UI (Lucide style) ---
const UserIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const LockIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
const ShieldIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
const BookOpenIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const ArrowLeftIcon = (props: any) => (<svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>);

const HEADER_HEIGHT = 64

// --- Custom Toggle Switch Component (Sleek, Apple-style) ---
function ToggleSwitch({ checked, onChange, label, description, disabled = false }: { 
    checked: boolean, 
    onChange: () => void, 
    label: string, 
    description: string,
    disabled?: boolean 
}) {
  return (
    <div className={`flex items-start justify-between p-4 rounded-xl transition duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-800/50'}`}>
        <div className='flex flex-col'>
            <span className="text-white font-medium text-base">{label}</span>
            <span className="text-slate-400 text-sm mt-1">{description}</span>
        </div>
        
        <button
          type="button"
          onClick={onChange}
          disabled={disabled}
          className={`flex items-center group focus:outline-none`}
          aria-pressed={checked}
        >
          <span
            className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ease-in-out
              ${checked ? 'bg-indigo-500' : 'bg-slate-700'}`}
          >
            <span
              className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition duration-200 ease-in-out
                ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </span>
        </button>
    </div>
  )
}

// --- Main Settings Page Component ---
export default function SettingsPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isFreelancer, setIsFreelancer] = useState(false)
  
  // Account Delete State
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  
  // Password change fields
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session?.user) {
        setLoading(false)
        setUser(null)
        setMessage('You must be logged in to access settings.')
        return
      }
      
      const user = session.user
      setUser(user)
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_freelancer')
        .eq('id', user.id)
        .single()
        
      if (profileData) {
        setIsFreelancer(!!profileData.is_freelancer)
      }
      setLoading(false)
    }
    fetchUser()
    // eslint-disable-next-line
  }, [])

  // --- Handler: Toggle Freelancer Status ---
  async function handleFreelancerToggle() {
    if (!user) return
    setSaving(true)
    setMessage('Updating preferences...')
    
    const newValue = !isFreelancer;
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_freelancer: newValue })
      .eq('id', user.id)
      .select();

    setSaving(false)
    
    if (error) {
      setMessage('Failed to update freelancer status.')
    } else {
      setIsFreelancer(newValue)
      setMessage(`Freelancer mode ${newValue ? 'enabled' : 'disabled'}!`)
      setTimeout(() => setMessage(''), 2000)
    }
  }

  // --- Handler: Change Password ---
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg('')
    
    if (newPassword.length < 6) {
      setPasswordMsg('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.')
      return
    }
    
    setPasswordSaving(true)
    
    // 1. Re-authenticate user with old password (real check)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })
    
    if (signInError) {
      setPasswordMsg('Old password is incorrect.')
      setPasswordSaving(false)
      return
    }
    
    // 2. Update to new password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    
    setPasswordSaving(false)
    
    if (updateError) {
      setPasswordMsg('Failed to change password. Please try again.')
    } else {
      setPasswordMsg('Password successfully changed!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordMsg(''), 2000)
    }
  }

  // --- Handler: Delete Account ---
  async function handleDeleteAccount() {
    if (!user || deleteConfirm !== 'DELETE') return
    
    setSaving(true)
    setMessage('Attempting to delete account...')
    
    try {
      // You may want to call a backend function to delete the user from auth and all tables.
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) {
          setMessage('Account deletion failed to log out.')
      } else {
          setMessage('Account successfully deleted. Goodbye!')
      }
      
      setTimeout(() => {
        router.push('/')
      }, 2000)
      
    } catch (err) {
      setMessage('An error occurred during account deletion.')
    }
    setSaving(false)
  }

  // --- UI: Loading State ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent border-solid rounded-full animate-spin mb-4"></div>
        <div className="text-xl font-medium text-indigo-400">Loading settings...</div>
      </div>
    )
  }

  // --- UI: Auth Required ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl shadow-xl text-center">
          <div className="text-xl font-bold text-white mb-3">Access Denied</div>
          <div className="text-slate-400 text-sm">{message || 'Please log in to view your settings.'}</div>
        </div>
      </div>
    )
  }

  // --- Helper Component for Section Headers ---
  const SettingsHeader = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
    <h2 className="flex items-center text-xl font-semibold text-white mb-4 border-b border-slate-700 pb-2">
      <Icon className="w-5 h-5 mr-3 text-indigo-400" />
      {title}
    </h2>
  );

  // --- Main Settings UI ---
  return (
    <main
      className="min-h-screen w-full bg-slate-950 flex flex-col items-center pb-16 px-4 font-sans"
      style={{ paddingTop: HEADER_HEIGHT + 32 }}
    >
      {/* Subtle Gradient background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-15">
        <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-700 rounded-full blur-[150px]" />
      </div>

      <section className="relative z-10 w-full max-w-3xl bg-slate-900/90 backdrop-blur-sm rounded-2xl shadow-2xl shadow-black/50 border border-slate-800 p-6 sm:p-10">
        
        {/* Header with Back Button */}
        <div className="flex items-center mb-10">
          <a
            href="/account"
            className="flex items-center text-slate-400 hover:text-white transition"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">Account</span>
          </a>
          <h1 className="flex-1 text-3xl font-extrabold text-white text-center">Settings</h1>
          <div className="w-[140px] hidden sm:block"></div> {/* Spacer */}
        </div>

        {/* --- 1. Preferences Section --- */}
        <div className="mb-8 p-4 rounded-xl border border-slate-800 bg-slate-800/30">
          <SettingsHeader icon={UserIcon} title="Account Preferences" />
          
          <ToggleSwitch
            checked={isFreelancer}
            onChange={handleFreelancerToggle}
            label="Enable Freelancer Mode"
            description={isFreelancer ? 
                'You are currently visible as a service provider.' : 
                'Turn on to start offering gigs and access your dashboard.'}
            disabled={saving}
          />

          <div className='mt-4 pt-4 border-t border-slate-700/50 text-xs text-slate-400'>
              <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><span className="font-semibold text-indigo-300">A 5% commission</span> is applied to all completed freelancer orders.</li>
                  <li>Your profile will be discoverable on the Gigs marketplace.</li>
              </ul>
          </div>
        </div>
        
        {/* --- 2. Security Section --- */}
        <div className="mb-8 p-4 rounded-xl border border-slate-800 bg-slate-800/30">
          <SettingsHeader icon={LockIcon} title="Security & Sign-in" />
          
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 mb-2">
            
            <h3 className="text-slate-300 font-medium text-base mt-2">Change Password</h3>
            
            <input
              type="password"
              placeholder="Old Password"
              className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 placeholder:text-slate-500"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              minLength={6}
              required
              disabled={passwordSaving}
            />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <input
                  type="password"
                  placeholder="New Password (min 6 chars)"
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 placeholder:text-slate-500"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                  disabled={passwordSaving}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 placeholder:text-slate-500"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                  disabled={passwordSaving}
                />
            </div>
            
            <div className='flex justify-between items-center pt-2'>
                {passwordMsg && (
                    <div 
                        className={`text-sm font-medium ${
                            passwordMsg.includes('success') ? 'text-green-400' : 'text-red-400'
                        }`}
                    >
                      {passwordMsg}
                    </div>
                )}
                <button
                    type="submit"
                    className="px-6 py-2 ml-auto rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition text-sm disabled:opacity-50"
                    disabled={passwordSaving}
                >
                    {passwordSaving ? 'Verifying...' : 'Update Password'}
                </button>
            </div>
          </form>
          
          <div className="mt-6 text-xs text-slate-400 border-t border-slate-700/50 pt-4">
            <span className="text-white font-semibold">Last Sign-in:</span> {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Unknown'}
          </div>
        </div>

        {/* --- 3. Privacy & Danger Zone --- */}
        <div className="mb-8 p-4 rounded-xl border border-red-900/50 bg-red-950/20">
          <SettingsHeader icon={ShieldIcon} title="Privacy & Danger Zone" />
          
          <div className="flex flex-col gap-4">
            <div className='flex justify-between items-center'>
                <div className='flex flex-col'>
                    <span className="text-red-400 font-medium">Delete Account Permanently</span>
                    <span className="text-sm text-red-500/70">This action is irreversible and will erase all data.</span>
                </div>
                <button
                    className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm disabled:opacity-50"
                    onClick={() => setShowDelete(s => !s)}
                    type="button"
                    disabled={saving}
                >
                    {showDelete ? 'Cancel' : 'Delete Account'}
                </button>
            </div>
            
            {/* Inline Confirmation UI */}
            {showDelete && (
              <div className="p-4 rounded-lg border border-red-800 bg-red-900/30 transition duration-300 mt-2">
                <div className="text-red-300 mb-3 font-semibold text-sm">
                  To confirm permanent deletion, type the word <code className='bg-red-900/50 p-1 rounded'>DELETE</code> below.
                </div>
                <input
                  type="text"
                  placeholder="Type DELETE to confirm"
                  className="w-full px-4 py-3 rounded-lg border border-red-700 bg-red-900/50 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 placeholder:text-red-500"
                  value={deleteConfirm}
                  onChange={e => setDeleteConfirm(e.target.value)}
                  disabled={saving}
                />
                <button
                  className="w-full px-6 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || saving}
                  type="button"
                >
                  {saving ? 'Deleting...' : 'Confirm Permanent Deletion'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- 4. Legal Section --- */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-800/30">
          <SettingsHeader icon={BookOpenIcon} title="Legal" />
          <ul className="text-sm text-slate-300 space-y-2">
            <li className='transition duration-200 hover:text-indigo-400'>
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service <span className='text-xs text-slate-500 ml-1'>(Opens in new tab)</span>
              </a>
            </li>
            <li className='transition duration-200 hover:text-indigo-400'>
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy <span className='text-xs text-slate-500 ml-1'>(Opens in new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        {/* General message (for freelancer toggle/general saving) */}
        {message && (
            <div 
                className={`mt-6 text-center text-sm font-medium w-full p-3 rounded-xl ${
                    message.includes('Failed') ? 'bg-red-900/40 text-red-300 border border-red-700' 
                    : message.includes('enabled') || message.includes('disabled') || message.includes('deleted') ? 'bg-green-900/40 text-green-300 border border-green-700'
                    : 'bg-indigo-900/40 text-indigo-300 border border-indigo-700'
                }`}
            >
              {message}
            </div>
        )}
      </section>
    </main>
  )
}