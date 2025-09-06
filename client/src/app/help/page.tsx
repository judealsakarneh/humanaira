'use client'

import Link from 'next/link'

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter">
      <section className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-200 mb-4">
          Help Center
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
          Need assistance? Find answers to common questions or contact our support team.
        </p>
        <div className="w-full bg-[#101a2a]/90 border border-blue-900 rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <ul className="space-y-6 text-left max-w-xl mx-auto">
            <li>
              <div className="font-semibold text-blue-100 mb-1">How do I hire a freelancer?</div>
              <div className="text-blue-200 text-base">
                Browse services, select a freelancer, and place your order. You can chat with sellers before ordering.
              </div>
            </li>
            <li>
              <div className="font-semibold text-blue-100 mb-1">How are payments handled?</div>
              <div className="text-blue-200 text-base">
                Payments are securely processed and held in escrow until you approve the delivery.
              </div>
            </li>
            <li>
              <div className="font-semibold text-blue-100 mb-1">What if I need revisions?</div>
              <div className="text-blue-200 text-base">
                Most services include revisions. You can request changes directly in your order workspace.
              </div>
            </li>
            <li>
              <div className="font-semibold text-blue-100 mb-1">How do I contact support?</div>
              <div className="text-blue-200 text-base">
                Use the contact form below or email us at <a href="mailto:hello@humanaira.com" className="underline hover:text-blue-400">hello@humanaira.com</a>.
              </div>
            </li>
          </ul>
        </div>
        <div className="w-full bg-[#181a23] border border-blue-900 rounded-2xl shadow p-8">
          <h3 className="text-xl font-semibold text-blue-100 mb-3">Contact Support</h3>
          <form
            className="flex flex-col gap-4 max-w-lg mx-auto"
            action="mailto:hello@humanaira.com"
            method="POST"
            encType="text/plain"
          >
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              className="px-4 py-3 rounded-lg bg-[#101a2a] text-gray-100 border border-blue-900 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              className="px-4 py-3 rounded-lg bg-[#101a2a] text-gray-100 border border-blue-900 focus:outline-none"
            />
            <textarea
              name="message"
              required
              placeholder="How can we help you?"
              rows={5}
              className="px-4 py-3 rounded-lg bg-[#101a2a] text-gray-100 border border-blue-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold text-lg shadow hover:from-[#1e40af] hover:to-[#0ea5e9] transition"
            >
              Send Message
            </button>
          </form>
        </div>
        <div className="text-blue-200 mt-8 text-sm">
          For urgent issues, email us directly at <a href="mailto:hello@humanaira.com" className="underline hover:text-blue-400">hello@humanaira.com</a>
        </div>
      </section>
    </main>
  )
}