'use client'

import Link from 'next/link'

export default function PressPage() {
  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter">
      <section className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-200 mb-4">
          Press & Media
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
          Welcome to the Humanaira press room. Find our latest news, media resources, and contact details for press inquiries.
        </p>
        <div className="w-full bg-[#101a2a]/90 border border-blue-900 rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Latest News</h2>
          <ul className="space-y-6 text-left max-w-xl mx-auto">
            <li>
              <div className="font-semibold text-blue-100 mb-1">
                <a href="https://blog.humanaira.com/ai-marketplace-launch" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Humanaira Launches Next-Gen AI Talent Marketplace
                </a>
              </div>
              <div className="text-blue-200 text-base">
                <span className="text-xs text-blue-400">June 2025</span> — Our platform opens to the public, connecting businesses with top AI freelancers worldwide.
              </div>
            </li>
            <li>
              <div className="font-semibold text-blue-100 mb-1">
                <a href="https://blog.humanaira.com/seed-funding" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Humanaira Raises $5M in Seed Funding
                </a>
              </div>
              <div className="text-blue-200 text-base">
                <span className="text-xs text-blue-400">April 2025</span> — Backed by leading VCs to accelerate product development and global expansion.
              </div>
            </li>
            <li>
              <div className="font-semibold text-blue-100 mb-1">
                <a href="https://blog.humanaira.com/ai-ethics-commitment" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Commitment to Responsible AI & Ethics
                </a>
              </div>
              <div className="text-blue-200 text-base">
                <span className="text-xs text-blue-400">March 2025</span> — Humanaira publishes its Responsible AI guidelines and transparency pledge.
              </div>
            </li>
          </ul>
        </div>
        <div className="w-full bg-[#181a23] border border-blue-900 rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-100 mb-3">Media Resources</h3>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a
              href="/brand/humanaira-logo.zip"
              className="px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              download
            >
              Download Logo Pack
            </a>
            <a
              href="/brand/humanaira-presskit.pdf"
              className="px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              download
            >
              Download Press Kit
            </a>
            <a
              href="/brand/humanaira-screenshots.zip"
              className="px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              download
            >
              Download Screenshots
            </a>
          </div>
          <div className="text-blue-200 text-sm mt-6">
            For additional assets or custom requests, please <a href="mailto:press@humanaira.com" className="underline hover:text-blue-400">email our team</a>.
          </div>
        </div>
        <div className="w-full bg-[#101a2a]/90 border border-blue-900 rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-blue-100 mb-3">Press Contact</h3>
          <div className="text-blue-200 mb-2">
            <span className="font-semibold text-white">Email:</span>{' '}
            <a href="mailto:press@humanaira.com" className="underline hover:text-blue-400">press@humanaira.com</a>
          </div>
          <div className="text-blue-200 mb-2">
            <span className="font-semibold text-white">Phone:</span>{' '}
            <a href="tel:+1234567890" className="underline hover:text-blue-400">+1 (234) 567-890</a>
          </div>
          <div className="text-blue-200">
            <span className="font-semibold text-white">Address:</span> 123 AI Avenue, Suite 42, San Francisco, CA 94105
          </div>
        </div>
        <div className="text-blue-200 mt-8 text-sm">
          For urgent media inquiries, please use <a href="mailto:press@humanaira.com" className="underline hover:text-blue-400">press@humanaira.com</a>
        </div>
      </section>
    </main>
  )
}