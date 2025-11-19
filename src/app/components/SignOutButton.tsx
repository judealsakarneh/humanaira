'use client'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')         // Redirect to home page
    window.location.reload() // Ensure NavBar updates
  }

  return (
    <button
      onClick={handleSignOut}
      className="ml-2 px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
    >
      Sign Out
    </button>
  )
}