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
    <main className="min-h-screen bg-neutral-100 text-gray-900 font-inter">
      {/* Add top margin to push content below the header */}
      <div className="max-w-6xl mx-auto px-4 py-16 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-blue-700">Freelancer Dashboard</h1>
          <Link
            href="/seller/gigs/new"
            className="mt-2 md:mt-0 px-6 py-3 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
          >
            + Post New Gig
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-700">${stats.earnings}</span>
            <span className="text-gray-500 text-sm">Earnings</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-700">{stats.orders}</span>
            <span className="text-gray-500 text-sm">Orders</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-700">{stats.activeGigs}</span>
            <span className="text-gray-500 text-sm">Active Gigs</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-700">{stats.views}</span>
            <span className="text-gray-500 text-sm">Views</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-700">{stats.reviews}</span>
            <span className="text-gray-500 text-sm">Reviews</span>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-blue-700">{stats.rating}★</span>
            <span className="text-gray-500 text-sm">Avg. Rating</span>
          </div>
        </div>

        {/* Gigs Table */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Gigs</h2>
            <Link href="/seller/gigs/new" className="text-blue-700 hover:underline font-semibold">
              + Add Gig
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
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
                  <tr key={gig.id} className="border-b hover:bg-blue-50 transition">
                    <td className="py-2 px-2 font-semibold">{gig.title}</td>
                    <td className="py-2 px-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${gig.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {gig.status}
                      </span>
                    </td>
                    <td className="py-2 px-2">{gig.orders}</td>
                    <td className="py-2 px-2">{gig.views}</td>
                    <td className="py-2 px-2">${gig.earnings}</td>
                    <td className="py-2 px-2">{gig.rating}★</td>
                    <td className="py-2 px-2">
                      <Link href={`/seller/gigs/${gig.id}/edit`} className="text-blue-700 hover:underline">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-blue-700">{review.client}</span>
                  <span className="text-xs text-gray-500">on {review.gig}</span>
                  <span className="ml-auto text-yellow-500 font-bold">{'★'.repeat(review.rating)}<span className="text-gray-400">{'★'.repeat(5 - review.rating)}</span></span>
                </div>
                <div className="text-gray-700 italic mb-1">"{review.comment}"</div>
                <div className="text-xs text-gray-400">{review.date}</div>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="text-gray-500 text-center py-8">No reviews yet.</div>
            )}
          </div>
        </div>

        {/* Earnings Chart Placeholder */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Earnings Overview</h2>
          <div className="h-40 flex items-center justify-center text-gray-400">
            {/* Replace with a chart library like recharts, chart.js, etc. */}
            <span>[Earnings chart coming soon]</span>
          </div>
        </div>
      </div>
    </main>
  )
}