'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

const HeartIcon = () => <span className="text-pink-400">❤️</span>
const LoaderIcon = () => <div className="animate-spin h-6 w-6 border-4 border-t-4 border-sky-500 border-t-transparent rounded-full"></div>
const EmptyIcon = () => <span className="text-4xl">✨</span>

export default function SavedGigsPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [saved, setSaved] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    async function fetchSaved() {
      if (!user) {
        setSaved([])
        setLoading(false)
        return
      }
      setLoading(true)
      const supabase = createSupabaseBrowser()
      const { data } = await supabase
        .from('saved_gigs')
        .select('id, gig_id, created_at, gigs(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setSaved(data || [])
      setLoading(false)
    }
    // Only fetch if user state is loaded (not undefined)
    if (user !== undefined) {
      fetchSaved()
    }
  }, [user])

  // 1. Show loader until user is loaded
  if (user === undefined) {
    return (
      <main className="min-h-screen bg-[#030712] flex items-center justify-center font-inter p-4">
        <div className="flex items-center space-x-3 text-xl font-medium text-sky-400">
          <LoaderIcon />
          <span>Checking session...</span>
        </div>
      </main>
    )
  }

  // 2. Show "Access Restricted" only if session is loaded and user is not signed in
  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#030712] flex items-center justify-center font-inter p-4">
        <div className="bg-[#0f172a] max-w-md w-full p-10 rounded-2xl shadow-2xl border border-sky-800/50 text-center">
          <HeartIcon />
          <h2 className="text-2xl font-bold mt-4 mb-2 text-blue-100">Access Restricted</h2>
          <p className="text-lg text-blue-400">
            Please sign in to your account to view your carefully curated collection of saved AI gigs.
          </p>
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-sky-600 rounded-full text-white font-semibold hover:bg-sky-700 transition shadow-lg shadow-sky-900/40">
            Go to Marketplace
          </Link>
        </div>
      </main>
    )
  }

  // 3. Show saved gigs
  return (
    <main className="min-h-screen bg-[#030712] font-inter">
      <div className="max-w-4xl mx-auto px-4 py-20 md:py-32">
        <div className="flex items-center justify-between mb-10 border-b border-sky-900/50 pb-4">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300">
            Your Saved AI Gigs
          </h1>
          <span className="text-xl font-semibold text-blue-400">{loading ? '...' : `${saved.length} Saved`}</span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <LoaderIcon />
            <div className="text-blue-400 mt-4 text-xl font-medium">Loading your AI wishlist...</div>
          </div>
        ) : saved.length === 0 ? (
          <div className="text-center py-20 bg-[#0f172a] rounded-xl p-10 border border-sky-900/50">
            <EmptyIcon />
            <h2 className="text-3xl font-bold text-blue-200 mt-4 mb-3">Nothing Saved Yet</h2>
            <p className="text-blue-400 text-lg max-w-md mx-auto">
              Browse our marketplace and hit the <HeartIcon /> icon on a service you love to add it here.
            </p>
            <Link href="/" className="mt-8 inline-block px-8 py-3 bg-indigo-600 rounded-full text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/40">
              Explore Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {saved.map((row) => (
              <Link
                key={row.gig_id}
                href={`/services/${row.gigs?.slug || row.gig_id}`}
                className="block bg-[#0f172a] rounded-xl shadow-2xl shadow-black/50 p-6 border border-sky-900 hover:border-sky-500/80 transition duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start md:items-center gap-6">
                  {row.gigs?.cover_image_url && (
                    <img
                      src={row.gigs.cover_image_url}
                      alt={row.gigs.title}
                      className="w-24 h-24 object-cover rounded-xl border border-sky-900 flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = "https://placehold.co/96x96/0f172a/93c5fd?text=AI+Gig" }}
                    />
                  )}
                  <div className="flex-grow">
                    <div className="font-extrabold text-xl text-blue-100 group-hover:text-sky-300 transition duration-300">{row.gigs?.title || 'Gig Title Missing'}</div>
                    <div className="text-sky-400 text-sm font-medium mt-1 uppercase tracking-wider">{row.gigs?.category || 'Uncategorized'}</div>
                    <div className="text-blue-500 text-sm mt-2">
                      Saved: {row.created_at ? new Date(row.created_at).toLocaleDateString() : ''}
                    </div>
                  </div>
                  <span className="text-sky-500 text-2xl ml-4 self-center md:self-auto">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style jsx global>{`
        body {
          background: #030712;
        }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#0ea5e9,#38bdf8); border-radius: 10px; }
        ::-webkit-scrollbar-track { background: #07102a; }
      `}</style>
    </main>
  )
}