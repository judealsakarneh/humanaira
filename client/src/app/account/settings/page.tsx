'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
const supabase = createSupabaseBrowser()

const HEADER_HEIGHT = 64

function ToggleSwitch({ checked, onChange, label, disabled }: { checked: boolean, onChange: () => void, label: string, disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`flex items-center gap-3 group focus:outline-none ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      aria-pressed={checked}
    >
      <span
        className={`w-11 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
          ${checked ? 'bg-blue-700' : 'bg-blue-900'} group-hover:ring-2 group-hover:ring-blue-400`}
      >
        <span
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </span>
      <span className="text-blue-100 font-medium">{label}</span>
    </button>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isFreelancer, setIsFreelancer] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  // Password change fields
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')

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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profileError || !profileData) {
        setMessage('Could not load your profile.')
      } else {
        setProfile(profileData)
        setIsFreelancer(!!profileData.is_freelancer)
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  // Toggle freelancer status
  async function handleFreelancerToggle() {
    if (!user) return
    setSaving(true)
    setMessage('')
    const { error } = await supabase
      .from('profiles')
      .update({ is_freelancer: !isFreelancer })
      .eq('id', user.id)
      .select()
    setSaving(false)
    if (error) {
      setMessage('Failed to update freelancer status.')
    } else {
      setIsFreelancer(f => !f)
      setMessage('Freelancer status updated!')
      setTimeout(() => setMessage(''), 2000)
    }
  }

  // Change password with old password verification and confirmation
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg('')
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg('Please fill in all password fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('New passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordMsg('New password must be at least 6 characters.')
      return
    }
    setPasswordSaving(true)
    // Re-authenticate user with old password
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })
    if (signInError) {
      setPasswordMsg('Old password is incorrect.')
      setPasswordSaving(false)
      return
    }
    // Update to new password
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPasswordSaving(false)
    if (error) {
      setPasswordMsg('Failed to change password.')
    } else {
      setPasswordMsg('Password changed!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordMsg(''), 2000)
    }
  }

  // Delete account with confirmation popup
  async function handleDeleteAccount() {
    if (!user) return
    setSaving(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) {
        setMessage('Failed to delete account.')
        setSaving(false)
        return
      }
      setMessage('Account deleted. Logging out...')
      setTimeout(() => {
        supabase.auth.signOut()
        router.push('/')
      }, 1500)
    } catch (err) {
      setMessage('Failed to delete account.')
    }
    setSaving(false)
  }

  function showDeletePopup() {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      setShowDelete(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#0a0d14]">
        <div className="text-blue-400 text-lg font-semibold animate-pulse">Loading settings...</div>
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
        <h1 className="text-2xl font-bold text-white mb-8 text-center">Account Settings</h1>

        {/* Account Preferences */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-200 mb-4">Preferences</h2>
          <div className="flex flex-col gap-4 mb-4">
            <ToggleSwitch
              checked={isFreelancer}
              onChange={handleFreelancerToggle}
              label="Become a Freelancer"
              disabled={saving}
            />
            <div className="text-xs text-slate-400 ml-1 flex flex-col gap-2 mt-2">
              <span>
                {isFreelancer
                  ? 'You are a freelancer. Your gigs and dashboard are enabled.'
                  : 'Enable to start selling your services.'}
              </span>
              <ul className="list-disc list-inside text-blue-200 text-xs mt-2 space-y-1">
                <li>Post and manage your own gigs and services.</li>
                <li>Access the freelancer dashboard and orders page.</li>
                <li>Receive payments directly for completed orders.</li>
                <li>
                  <span className="font-semibold text-blue-300">A 5% commission</span> is deducted from each order you complete.
                </li>
                <li>Withdraw your earnings anytime.</li>
                <li>Turn off freelancer mode anytime to hide your gigs and dashboard.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-200 mb-4">Security</h2>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 items-center mb-2">
            <input
              type="password"
              placeholder="Old Password"
              className="w-full px-4 py-2 rounded-lg border border-blue-800 bg-[#10131e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              minLength={6}
              required
              disabled={passwordSaving}
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 rounded-lg border border-blue-800 bg-[#10131e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              minLength={6}
              required
              disabled={passwordSaving}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 rounded-lg border border-blue-800 bg-[#10131e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              minLength={6}
              required
              disabled={passwordSaving}
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition text-sm"
              disabled={passwordSaving}
            >
              {passwordSaving ? 'Saving...' : 'Change Password'}
            </button>
          </form>
          {passwordMsg && (
            <div className={`text-sm font-semibold ${passwordMsg.includes('Failed') || passwordMsg.includes('incorrect') || passwordMsg.includes('match') ? 'text-red-400' : 'text-green-400'}`}>
              {passwordMsg}
            </div>
          )}
          <div className="mt-4">
            <span className="text-blue-100 font-semibold">Two-Factor Authentication</span>
            <span className="ml-2 text-xs text-slate-400">(Coming soon)</span>
          </div>
          <div className="mt-4 text-xs text-blue-300">
            Last sign-in: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Unknown'}
          </div>
        </div>

        {/* Privacy */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-blue-200 mb-4">Privacy</h2>
          <button
            className="px-6 py-2 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800 transition text-sm"
            onClick={showDeletePopup}
            type="button"
          >
            Delete Account
          </button>
          {showDelete && (
            <div className="mt-4 bg-[#2a1a1a] p-4 rounded-lg border border-red-800">
              <div className="text-red-400 mb-2 font-semibold">
                Are you sure? This action cannot be undone.
              </div>
              <input
                type="text"
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-2 rounded-lg border border-blue-800 bg-[#10131e] text-white mb-2"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                disabled={saving}
              />
              <button
                className="px-6 py-2 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800 transition text-sm"
                onClick={handleDeleteAccount}
                disabled={deleteConfirm !== 'DELETE' || saving}
                type="button"
              >
                Permanently Delete My Account
              </button>
            </div>
          )}
        </div>

        {/* Legal */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-blue-200 mb-4">Legal</h2>
          <ul className="list-disc list-inside text-blue-100 text-sm space-y-1">
            <li>
              <a href="/terms" className="underline hover:text-blue-400" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy" className="underline hover:text-blue-400" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* General message */}
        {message && (
          <div className={`mt-4 text-center text-sm font-semibold ${message.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </div>
        )}
      </section>
    </main>
  )
}