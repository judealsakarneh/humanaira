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
      <main className="min-h-screen bg-[#090a10] flex items-center justify-center font-inter">
        <div className="bg-[#181a23] px-8 py-10 rounded-2xl shadow border border-blue-900 text-blue-200 text-lg font-semibold">
          Please sign in to view your saved gigs.
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#090a10] font-inter">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6 text-blue-200">Saved Gigs</h1>
        {loading ? (
          <div className="text-blue-400">Loading...</div>
        ) : saved.length === 0 ? (
          <div className="text-blue-400">No gigs saved yet.</div>
        ) : (
          <div className="grid gap-6">
            {saved.map((row) => (
              <Link
                key={row.gig_id}
                href={`/services/${row.gigs.slug}`}
                className="block bg-[#181a23] rounded-xl shadow p-6 border border-blue-900 hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  {row.gigs.cover_image_url && (
                    <img
                      src={row.gigs.cover_image_url}
                      alt={row.gigs.title}
                      className="w-20 h-20 object-cover rounded-lg border border-blue-900"
                    />
                  )}
                  <div>
                    <div className="font-bold text-lg text-blue-100">{row.gigs.title}</div>
                    <div className="text-blue-400">{row.gigs.category}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <style jsx global>{`
        body {
          background: #090a10;
        }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#2563eb,#38bdf8); border-radius: 10px; }
        ::-webkit-scrollbar-track { background: #07102a; }
      `}</style>
    </main>
  )
}