'use client'
import { useEffect, useState } from 'react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'
import Link from 'next/link'
import { useSession } from '@supabase/auth-helpers-react'

export default function SavedGigsPage() {
  const session = useSession()
  const [saved, setSaved] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSaved() {
      if (!session?.user) {
        setSaved([])
        setLoading(false)
        return
      }
      const supabase = createSupabaseBrowser()
      const { data, error } = await supabase
        .from('saved_gigs')
        .select('id, gig_id, gigs(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
      setSaved(data || [])
      setLoading(false)
    }
    fetchSaved()
  }, [session])

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Please sign in to view your saved gigs.</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-neutral-100 font-inter">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Saved Gigs</h1>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : saved.length === 0 ? (
          <div className="text-gray-500">No gigs saved yet.</div>
        ) : (
          <div className="grid gap-6">
            {saved.map((row) => (
              <Link
                key={row.gig_id}
                href={`/services/${row.gigs.slug}`}
                className="block bg-white rounded-xl shadow p-6 border border-gray-100 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  {row.gigs.cover_image_url && (
                    <img
                      src={row.gigs.cover_image_url}
                      alt={row.gigs.title}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  )}
                  <div>
                    <div className="font-bold text-lg text-blue-800">{row.gigs.title}</div>
                    <div className="text-gray-600">{row.gigs.category}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}