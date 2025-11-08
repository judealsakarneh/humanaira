'use client'

import Link from 'next/link'
import { CheckCircle2, TrendingUp, Shield, DollarSign } from 'lucide-react'

export default function BecomeSellerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0A0F1F] to-[#050B16] text-white">
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Become a <span className="text-[#35BFFF]">Seller</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join thousands of professionals earning on Humanaira. Share your skills, build your brand, and grow your business with our global marketplace.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <DollarSign className="w-12 h-12 text-[#35BFFF] mb-4" />
            <h3 className="text-2xl font-bold mb-3">Low Commission</h3>
            <p className="text-slate-300 mb-4">
              Keep more of what you earn with our industry-leading <span className="text-[#35BFFF] font-bold">5% commission rate</span>. That's significantly lower than most platforms.
            </p>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <TrendingUp className="w-12 h-12 text-[#35BFFF] mb-4" />
            <h3 className="text-2xl font-bold mb-3">Grow Your Business</h3>
            <p className="text-slate-300 mb-4">
              Access a global audience of clients looking for AI services, digital expertise, and creative solutions.
            </p>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <Shield className="w-12 h-12 text-[#35BFFF] mb-4" />
            <h3 className="text-2xl font-bold mb-3">Secure Payments</h3>
            <p className="text-slate-300 mb-4">
              Get paid safely with Stripe-powered transactions. Funds are held securely and released upon project completion.
            </p>
          </div>

          <div className="bg-[#0D1328]/60 border border-[#35BFFF]/20 rounded-2xl p-8">
            <CheckCircle2 className="w-12 h-12 text-[#35BFFF] mb-4" />
            <h3 className="text-2xl font-bold mb-3">Professional Tools</h3>
            <p className="text-slate-300 mb-4">
              Manage orders, track earnings, communicate with clients, and build your portfolio—all in one platform.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#35BFFF] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
              <p className="text-slate-300">Set up your seller account and showcase your expertise</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#35BFFF] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">List Your Services</h3>
              <p className="text-slate-300">Create gigs for the services you offer with pricing and details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#35BFFF] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Start Earning</h3>
              <p className="text-slate-300">Receive orders, deliver great work, and build your reputation</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-[#35BFFF]/10 to-[#2BA3E0]/10 border border-[#35BFFF]/30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
          <p className="text-slate-300 mb-8">Join our community of successful freelancers and start earning today</p>
          <Link 
            href="/account/settings"
            className="inline-block bg-[#35BFFF] hover:bg-[#2BA3E0] text-white font-bold px-8 py-4 rounded-xl text-lg transition-all transform hover:scale-105"
          >
            Activate Seller Account
          </Link>
        </div>
      </div>
    </div>
  )
}
