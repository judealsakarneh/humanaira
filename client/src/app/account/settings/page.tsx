'use client'

import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'

// --- SVG Icons (Lucide-like) ---
const UserIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const LockIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const ShieldIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const BookOpenIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)
const ArrowLeftIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const HEADER_HEIGHT = 64

// --- Toggle Switch (sleek) ---
function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: {
  checked: boolean
  onChange: () => void
  label: string
  description: string
  disabled?: boolean
}) {
  return (
    <div
      className={`flex items-start justify-between p-4 rounded-xl transition ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-800/50'
      }`}
    >
      <div className="flex flex-col">
        <span className="text-white font-medium text-base">{label}</span>
        <span className="text-slate-400 text-sm mt-1">{description}</span>
      </div>

      <button
        type="button"
        onClick={onChange}
        disabled={disabled}
        className="flex items-center group focus:outline-none"
        aria-pressed={checked}
      >
        <span
          className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
            checked ? 'bg-indigo-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition ${
              checked ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </span>
      </button>
    </div>
  )
}

// --- Main Settings Page ---
export default function SettingsPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  // Auth/user
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // Freelancer mode
  const [isFreelancer, setIsFreelancer] = useState(false)
  const [savingFreelancer, setSavingFreelancer] = useState(false)

  // Password change
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')

  // Danger zone
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Payout method + fields
  type PayoutMethod = 'paypal' | 'bank' | null
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>(null)

  // PayPal
  const [paypalEmail, setPaypalEmail] = useState('')

  // Bank (manual via Wise)
  const [country, setCountry] = useState('') // user country (ISO-2)
  const [currency, setCurrency] = useState('USD') // preferred payout currency
  const [bankHolderName, setBankHolderName] = useState('')
  const [bankCountry, setBankCountry] = useState('') // bank country (ISO-2)
  const [iban, setIban] = useState('')
  const [acctNumber, setAcctNumber] = useState('')
  const [swiftBic, setSwiftBic] = useState('')
  const [bankName, setBankName] = useState('')
  const [bankCity, setBankCity] = useState('')
  const [bankInfo, setBankInfo] = useState('')

  const [savingPayout, setSavingPayout] = useState(false)
  const [payoutMsg, setPayoutMsg] = useState('')

  // Load user + profile
  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setMessage('')
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        setUser(null)
        setLoading(false)
        setMessage('You must be logged in to access settings.')
        return
      }

      const me = session.user
      setUser(me)

      const { data: profile } = await supabase
        .from('profiles')
        .select(
          'is_freelancer, payout_method, paypal_email, country, wise_currency, bank_holder_name, bank_country, iban, bank_account_number, bank_swift_bic, bank_name, bank_city, bank_additional_info'
        )
        .eq('id', me.id)
        .maybeSingle()

      if (profile) {
        setIsFreelancer(!!profile.is_freelancer)
        setPayoutMethod((profile.payout_method as PayoutMethod) || null)
        setPaypalEmail(profile.paypal_email || '')

        setCountry((profile.country || '').toUpperCase())
        setCurrency((profile.wise_currency || 'USD').toUpperCase())
        setBankHolderName(profile.bank_holder_name || '')
        setBankCountry((profile.bank_country || '').toUpperCase())
        setIban(profile.iban || '')
        setAcctNumber(profile.bank_account_number || '')
        setSwiftBic(profile.bank_swift_bic || '')
        setBankName(profile.bank_name || '')
        setBankCity(profile.bank_city || '')
        setBankInfo(profile.bank_additional_info || '')
      }

      setLoading(false)
    }
    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handlers
  async function handleFreelancerToggle() {
    if (!user) return
    setSavingFreelancer(true)
    setMessage('Updating preferences...')

    const nextVal = !isFreelancer
    const { error } = await supabase
      .from('profiles')
      .update({ is_freelancer: nextVal })
      .eq('id', user.id)

    setSavingFreelancer(false)
    if (error) {
      setMessage('Failed to update freelancer status.')
    } else {
      setIsFreelancer(nextVal)
      setMessage(`Freelancer mode ${nextVal ? 'enabled' : 'disabled'}!`)
      setTimeout(() => setMessage(''), 2000)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordMsg('')

    if (newPassword.length < 6) return setPasswordMsg('New password must be at least 6 characters.')
    if (newPassword !== confirmPassword) return setPasswordMsg('New passwords do not match.')

    setPasswordSaving(true)

    // Re-authenticate
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })
    if (signInError) {
      setPasswordMsg('Old password is incorrect.')
      setPasswordSaving(false)
      return
    }

    // Update password
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

  async function handleDeleteAccount() {
    if (!user || deleteConfirm !== 'DELETE') return
    setDeleting(true)
    setMessage('Attempting to delete account...')

    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) {
        setMessage('Account deletion failed to log out.')
      } else {
        setMessage('Account successfully deleted. Goodbye!')
      }
      setTimeout(() => router.push('/'), 1500)
    } catch {
      setMessage('An error occurred during account deletion.')
    }
    setDeleting(false)
  }

  function validatePayoutInputs(): string | null {
    if (!payoutMethod) return 'Please select a payout method.'
    if (payoutMethod === 'paypal') {
      if (!paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paypalEmail)) {
        return 'Enter a valid PayPal email.'
      }
      return null
    }
    // Bank
    if (!country) return 'Enter your country (ISO-2).'
    if (!bankHolderName) return 'Enter account holder name.'
    if (!bankCountry) return 'Enter bank country (ISO-2).'

    const hasIban = !!iban.trim()
    const hasLocal = !!acctNumber.trim() && !!swiftBic.trim()
    if (!hasIban && !hasLocal) {
      return 'Enter IBAN, or Account Number + SWIFT/BIC.'
    }
    return null
  }

  async function savePayoutSettings() {
    setPayoutMsg('')
    const errorText = validatePayoutInputs()
    if (errorText) {
      setPayoutMsg(errorText)
      return
    }

    setSavingPayout(true)
    try {
      const payload: any = { payout_method: payoutMethod }

      if (payoutMethod === 'paypal') {
        payload.paypal_email = paypalEmail.trim()
        // Optional: clear bank fields server-side if switching methods, but not required
      } else if (payoutMethod === 'bank') {
        payload.country = country.trim().toUpperCase()
        payload.wise_currency = currency.trim().toUpperCase()
        payload.bank_holder_name = bankHolderName.trim()
        payload.bank_country = bankCountry.trim().toUpperCase()
        payload.iban = iban.trim()
        payload.bank_account_number = acctNumber.trim()
        payload.bank_swift_bic = swiftBic.trim()
        payload.bank_name = bankName.trim()
        payload.bank_city = bankCity.trim()
        payload.bank_additional_info = bankInfo.trim()
      }

      const res = await fetch('/api/profile/payout-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to save payout settings')

      setPayoutMsg('Saved successfully.')
      setTimeout(() => setPayoutMsg(''), 2000)
    } catch (e: any) {
      setPayoutMsg(e?.message || 'Failed to save payout settings.')
    } finally {
      setSavingPayout(false)
    }
  }

  // --- UI States ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-xl font-medium text-indigo-400">Loading settings...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
          <div className="text-xl font-bold text-white mb-3">Access Denied</div>
          <div className="text-slate-400 text-sm">{message || 'Please log in to view your settings.'}</div>
        </div>
      </div>
    )
  }

  // Section header helper
  const SettingsHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <h2 className="flex items-center text-xl font-semibold text-white mb-4 border-b border-slate-700/50 pb-2">
      <Icon className="w-5 h-5 mr-3 text-indigo-400" />
      {title}
    </h2>
  )

  return (
    <main
      className="min-h-screen w-full bg-slate-950 flex flex-col items-center pb-16 px-4 font-sans overflow-x-hidden"
      style={{ paddingTop: HEADER_HEIGHT + 32 }}
    >
      {/* Background accents */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-6rem] left-[-6rem] w-[26rem] h-[26rem] bg-indigo-700/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-8rem] right-[-6rem] w-[28rem] h-[28rem] bg-sky-700/20 rounded-full blur-[140px]" />
      </div>

      <section className="relative z-10 w-full max-w-4xl bg-[#0D1324]/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-10">
        {/* Header with Back */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center mb-10">
          <a href="/account" className="flex items-center text-slate-400 hover:text-white transition">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">Account</span>
          </a>
          <h1 className="justify-self-center text-3xl font-extrabold text-white">Settings</h1>
          <div className="flex items-center opacity-0 select-none" aria-hidden="true">
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span className="text-sm font-semibold">Account</span>
          </div>
        </div>

        {/* 1. Preferences */}
        <div className="mb-8 p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <SettingsHeader icon={UserIcon} title="Account Preferences" />

          <ToggleSwitch
            checked={isFreelancer}
            onChange={handleFreelancerToggle}
            label="Enable Freelancer Mode"
            description={
              isFreelancer
                ? 'You are currently visible as a service provider.'
                : 'Turn on to start offering gigs and access your seller dashboard.'
            }
            disabled={savingFreelancer}
          />

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Your profile can appear in the marketplace when enabled.</li>
            </ul>
          </div>
        </div>

        {/* 2. Payout Method (NEW) */}
        <div className="mb-8 p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <SettingsHeader icon={UserIcon} title="Payout Method" />

          {/* Method selector */}
          <div className="inline-flex items-center rounded-xl bg-slate-800/60 p-1 border border-slate-700/60 mb-5">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                payoutMethod === 'paypal'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setPayoutMethod('paypal')}
            >
              PayPal
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                payoutMethod === 'bank'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
              onClick={() => setPayoutMethod('bank')}
            >
              Bank transfer
            </button>
          </div>

          {/* Method forms */}
          {payoutMethod === 'paypal' && (
            <div className="space-y-4">
              <div className="text-slate-300 text-sm">
                Enter the PayPal email where you want to receive payouts.
              </div>
              <input
                type="email"
                placeholder="your-email@paypal.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-600 placeholder:text-slate-500"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
              />
            </div>
          )}

          {payoutMethod === 'bank' && (
            <div className="space-y-4">
              <div className="text-slate-300 text-sm">
                Provide your bank details (IBAN or Account Number + SWIFT/BIC). We will process payouts manually via
                bank transfer.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Your Country (ISO‑2)</label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value.toUpperCase())}
                    placeholder="US, DE, AE..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Currency</label>
                  <input
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                    placeholder="USD, EUR..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Account Holder Name</label>
                  <input
                    value={bankHolderName}
                    onChange={(e) => setBankHolderName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                    placeholder="Full legal name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bank Country (ISO‑2)</label>
                  <input
                    value={bankCountry}
                    onChange={(e) => setBankCountry(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                    placeholder="US, DE, AE..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">IBAN (if applicable)</label>
                  <input
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="IBAN"
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">SWIFT/BIC</label>
                  <input
                    value={swiftBic}
                    onChange={(e) => setSwiftBic(e.target.value)}
                    placeholder="Required if no IBAN (with Account Number)"
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Account Number</label>
                  <input
                    value={acctNumber}
                    onChange={(e) => setAcctNumber(e.target.value)}
                    placeholder="If no IBAN"
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bank Name</label>
                  <input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bank City</label>
                  <input
                    value={bankCity}
                    onChange={(e) => setBankCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Additional Info</label>
                  <input
                    value={bankInfo}
                    onChange={(e) => setBankInfo(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                    placeholder="Reference, branch, etc. (Optional)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save payout settings */}
          <div className="flex items-center justify-between mt-6">
            <div
              className={`text-sm font-medium ${
                payoutMsg
                  ? payoutMsg.includes('Saved')
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {payoutMsg || 'Choose a method and save.'}
            </div>
            <button
              onClick={savePayoutSettings}
              disabled={savingPayout}
              className={`px-6 py-2 rounded-xl font-semibold text-white transition ${
                savingPayout ? 'bg-slate-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {savingPayout ? 'Saving…' : 'Save Payout Settings'}
            </button>
          </div>
        </div>

        {/* 3. Security */}
        <div className="mb-8 p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <SettingsHeader icon={LockIcon} title="Security & Sign-in" />

          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 mb-2">
            <h3 className="text-slate-300 font-medium text-base mt-1">Change Password</h3>

            <input
              type="password"
              placeholder="Old Password"
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder:text-slate-500"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              minLength={6}
              required
              disabled={passwordSaving}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="New Password (min 6 chars)"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder:text-slate-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                disabled={passwordSaving}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 placeholder:text-slate-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
                disabled={passwordSaving}
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              {passwordMsg && (
                <div
                  className={`text-sm font-medium ${
                    passwordMsg.toLowerCase().includes('success') ? 'text-emerald-400' : 'text-rose-400'
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
                {passwordSaving ? 'Verifying…' : 'Update Password'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-xs text-slate-400 border-t border-slate-800 pt-4">
            <span className="text-white font-semibold">Last Sign-in:</span>{' '}
            {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Unknown'}
          </div>
        </div>

        {/* 4. Privacy & Danger Zone */}
        <div className="mb-8 p-5 rounded-2xl border border-red-900/40 bg-red-950/20">
          <SettingsHeader icon={ShieldIcon} title="Privacy & Danger Zone" />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-red-400 font-medium">Delete Account Permanently</span>
                <span className="text-sm text-red-500/70">This action is irreversible and will erase all data.</span>
              </div>
              <button
                className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm disabled:opacity-50"
                onClick={() => setShowDelete((s) => !s)}
                type="button"
                disabled={deleting}
              >
                {showDelete ? 'Cancel' : 'Delete Account'}
              </button>
            </div>

            {showDelete && (
              <div className="p-4 rounded-xl border border-red-800/70 bg-red-900/30">
                <div className="text-red-300 mb-3 font-semibold text-sm">
                  To confirm permanent deletion, type{' '}
                  <code className="bg-red-900/50 p-1 rounded">DELETE</code> below.
                </div>
                <input
                  type="text"
                  placeholder="Type DELETE to confirm"
                  className="w-full px-4 py-3 rounded-xl border border-red-700 bg-red-900/50 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-red-500"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  disabled={deleting}
                />
                <button
                  className="w-full px-6 py-3 rounded-xl bg-red-700 text-white font-bold hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== 'DELETE' || deleting}
                  type="button"
                >
                  {deleting ? 'Deleting…' : 'Confirm Permanent Deletion'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 5. Legal */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40">
          <SettingsHeader icon={BookOpenIcon} title="Legal" />
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="transition hover:text-indigo-400">
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service <span className="text-xs text-slate-500 ml-1">(opens in new tab)</span>
              </a>
            </li>
            <li className="transition hover:text-indigo-400">
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy <span className="text-xs text-slate-500 ml-1">(opens in new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Global message (top-level) */}
        {message && (
          <div
            className={`mt-6 text-center text-sm font-medium w-full p-3 rounded-xl ${
              message.includes('Failed')
                ? 'bg-rose-900/40 text-rose-300 border border-rose-800/70'
                : message.includes('enabled') ||
                  message.includes('disabled') ||
                  message.toLowerCase().includes('success')
                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-800/70'
                : 'bg-indigo-900/40 text-indigo-300 border border-indigo-800/70'
            }`}
          >
            {message}
          </div>
        )}
      </section>
    </main>
  )
}