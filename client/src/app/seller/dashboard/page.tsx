'use client'
import Link from 'next/link'

export default function SellerDashboard() {
  // Example static data (replace with real data from your backend)
  const stats = {
    earnings: 1240,
    orders: 18,
    activeGigs: 3,
    reviews: 27,
    views: 540,
    rating: 4.8,
  }

  const gigs = [
    {
      id: 1,
      title: 'AI Logo Design',
      status: 'Active',
      orders: 7,
      views: 210,
      earnings: 420,
      rating: 4.9,
    },
    {
      id: 2,
      title: 'Custom Chatbot',
      status: 'Paused',
      orders: 5,
      views: 180,
      earnings: 350,
      rating: 4.7,
    },
    {
      id: 3,
      title: 'Voiceover with AI',
      status: 'Active',
      orders: 6,
      views: 150,
      earnings: 470,
      rating: 4.8,
    },
  ]

  const reviews = [
    {
      id: 1,
      client: 'Sarah A.',
      gig: 'AI Logo Design',
      rating: 5,
      comment: 'Amazing work, super fast delivery!',
      date: '2025-08-20',
    },
    {
      id: 2,
      client: 'Mohammed K.',
      gig: 'Custom Chatbot',
      rating: 4,
      comment: 'Good communication and solid result.',
      date: '2025-08-18',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090a10] via-[#07102a] to-[#123055] text-gray-100 font-inter relative overflow-hidden">
      {/* Vibrant Blur Backgrounds */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 rounded-full blur-[120px] opacity-40" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-40 bg-blue-100 rounded-full blur-[80px] opacity-25" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 pt-28">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-200">Freelancer Dashboard</h1>
          <Link
            href="/seller/gigs/new"
            className="mt-2 md:mt-0 px-6 py-3 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
          >
            + Post New Gig
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">${stats.earnings}</span>
            <span className="text-blue-400 text-sm">Earnings</span>
          </div>
          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{stats.orders}</span>
            <span className="text-blue-400 text-sm">Orders</span>
          </div>
          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{stats.activeGigs}</span>
            <span className="text-blue-400 text-sm">Active Gigs</span>
          </div>
          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{stats.views}</span>
            <span className="text-blue-400 text-sm">Views</span>
          </div>
          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{stats.reviews}</span>
            <span className="text-blue-400 text-sm">Reviews</span>
          </div>
          <div className="bg-[#181a23] rounded-xl shadow p-4 flex flex-col items-center border border-blue-900">
            <span className="text-2xl font-bold text-blue-200">{stats.rating}★</span>
            <span className="text-blue-400 text-sm">Avg. Rating</span>
          </div>
        </div>

        {/* Gigs Table */}
        <div className="bg-[#181a23]/90 rounded-xl shadow-xl border border-blue-900 p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-100">Your Gigs</h2>
            <Link href="/seller/gigs/new" className="text-blue-400 hover:underline font-semibold">
              + Add Gig
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-blue-300 border-b border-blue-800">
                  <th className="py-2 px-2">Title</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Orders</th>
                  <th className="py-2 px-2">Views</th>
                  <th className="py-2 px-2">Earnings</th>
                  <th className="py-2 px-2">Rating</th>
                  <th className="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {gigs.map((gig) => (
                  <tr key={gig.id} className="border-b border-blue-900 hover:bg-blue-950 transition">
                    <td className="py-2 px-2 font-semibold text-blue-200">{gig.title}</td>
                    <td className="py-2 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${gig.status === 'Active' ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                        {gig.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-blue-200">{gig.orders}</td>
                    <td className="py-2 px-2 text-blue-200">{gig.views}</td>
                    <td className="py-2 px-2 text-blue-200">${gig.earnings}</td>
                    <td className="py-2 px-2 text-blue-200">{gig.rating}★</td>
                    <td className="py-2 px-2">
                      <Link href={`/seller/gigs/${gig.id}/edit`} className="text-blue-400 hover:underline">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-[#181a23]/90 rounded-xl shadow-xl border border-blue-900 p-6 mb-10">
          <h2 className="text-xl font-bold text-blue-100 mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-blue-800 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-blue-200">{review.client}</span>
                  <span className="text-xs text-blue-400">on {review.gig}</span>
                  <span className="ml-auto text-yellow-400 font-bold">
                    {'★'.repeat(review.rating)}
                    <span className="text-blue-900">{'★'.repeat(5 - review.rating)}</span>
                  </span>
                </div>
                <div className="text-blue-100 italic mb-1">"{review.comment}"</div>
                <div className="text-xs text-blue-400">{review.date}</div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-blue-400 text-center py-8">No reviews yet.</div>
            )}
          </div>
        </div>

        {/* Earnings Chart Placeholder */}
        <div className="bg-[#181a23]/90 rounded-xl shadow-xl border border-blue-900 p-6 mb-10">
          <h2 className="text-xl font-bold text-blue-100 mb-4">Earnings Overview</h2>
          <div className="h-40 flex items-center justify-center text-blue-400">
            {/* Replace with a chart library like recharts, chart.js, etc. */}
            <span>[Earnings chart coming soon]</span>
          </div>
        </div>
      </div>
    </main>
  )
}