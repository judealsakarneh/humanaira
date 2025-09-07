import { createSupabaseServer } from '../../api/lib/supabaseServer'
import Link from 'next/link'

// Correct prop type for Next.js App Router
interface GigPageProps {
  params: {
    slug: string
  }
}

export default async function GigPage({ params }: GigPageProps) {
  const supabase = createSupabaseServer()
  const { data: gig } = await supabase
    .from('gigs')
    .select('id,title,description,cover_image_url,media_urls,seller_id,category')
    .eq('slug', params.slug)
    .single()

  if (!gig) return <div className="p-10">Gig not found</div>

  const { data: pkgs } = await supabase
    .from('gig_packages')
    .select('*')
    .eq('gig_id', gig.id)

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-2">
      <main className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Media Section */}
        <div className="md:w-1/2 w-full bg-gray-100 flex flex-col items-center justify-center p-8">
          {gig.media_urls && gig.media_urls.length > 0 ? (
            <div className="flex flex-col gap-4 w-full">
              {gig.media_urls.map((url: string, idx: number) =>
                url.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video key={idx} src={url} controls className="w-full h-72 rounded-xl object-cover border" />
                ) : (
                  <img key={idx} src={url} alt="Gig Media" className="w-full h-72 rounded-xl object-cover border" />
                )
              )}
            </div>
          ) : gig.cover_image_url ? (
            <img src={gig.cover_image_url} alt="" className="w-full h-72 object-cover rounded-xl border" />
          ) : (
            <div className="w-full h-72 bg-blue-50 rounded-xl flex items-center justify-center text-blue-200 text-lg">
              No media
            </div>
          )}
        </div>
        {/* Details Section */}
        <div className="md:w-1/2 w-full p-8 flex flex-col">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">{gig.title}</h1>
            <div className="text-sm text-blue-700 mb-4">{gig.category}</div>
            <p className="text-gray-700 whitespace-pre-line mb-6">{gig.description}</p>
            <h2 className="text-xl font-semibold mb-4">Packages</h2>
            <div className="grid md:grid-cols-1 gap-4">
              {(pkgs || []).map((p: any) => (
                <div key={p.id} className="border border-gray-200 rounded-lg p-4 mb-2 bg-gray-50">
                  <div className="font-semibold mb-1">{p.tier}</div>
                  <div className="text-2xl font-bold mb-1 text-blue-800">${(p.price_cents / 100).toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Delivery: {p.delivery_days} days</div>
                  <div className="text-sm text-gray-600 mb-3">Revisions: {p.revisions}</div>
                  <form action="/checkout" method="GET">
                    <input type="hidden" name="gigId" value={gig.id} />
                    <input type="hidden" name="tier" value={p.tier} />
                    <button className="mt-2 w-full bg-blue-700 text-white rounded py-2 font-semibold hover:bg-blue-800 transition">
                      Continue
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Link href="/browse" className="text-sm text-blue-700 underline hover:text-blue-900">
              ← Back to Browse
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}