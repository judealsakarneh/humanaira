import Link from 'next/link'

export default function SellerResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0A0F1F] to-[#050B16] text-white px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-center">Seller Resources</h1>
        <p className="text-xl text-slate-300 mb-16 text-center max-w-3xl mx-auto">
          Tools and guides to help you succeed as a Humanaira seller
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Link href="/seller/dashboard" className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8 hover:border-[#35BFFF]/50 transition">
            <h2 className="text-2xl font-bold mb-3 text-[#35BFFF]">Seller Dashboard</h2>
            <p className="text-slate-300">Manage your gigs, track orders, and monitor your earnings all in one place.</p>
          </Link>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-3 text-[#35BFFF]">Best Practices</h2>
            <ul className="space-y-2 text-slate-300">
              <li>• Write clear, detailed service descriptions</li>
              <li>• Upload high-quality portfolio images</li>
              <li>• Respond to inquiries within 24 hours</li>
              <li>• Deliver on time, every time</li>
              <li>• Communicate clearly with clients</li>
            </ul>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-3 text-[#35BFFF]">Pricing Guide</h2>
            <p className="text-slate-300 mb-4">
              Research competitor pricing and value your time appropriately. Remember, Humanaira only charges 5% commission - you keep 95% of your earnings.
            </p>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-3 text-[#35BFFF]">Building Your Reputation</h2>
            <p className="text-slate-300 mb-4">
              Consistently deliver quality work, maintain professional communication, and ask satisfied clients for reviews to build your seller rating.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#35BFFF]/10 to-[#2BA3E0]/10 border border-[#35BFFF]/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-slate-300 mb-6">Our support team is here to assist you</p>
          <Link href="/help" className="inline-block bg-[#35BFFF] hover:bg-[#2BA3E0] text-white font-bold px-6 py-3 rounded-xl transition">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
