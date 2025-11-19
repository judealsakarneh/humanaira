'use client'

import Link from 'next/link'

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter">
      <section className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-200 mb-4">Join Our Team</h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
          Help us build the future of AI-powered freelance work. We’re looking for passionate, creative people to join our mission.
        </p>
        <div className="bg-[#101a2a]/90 border border-blue-900 rounded-2xl shadow-xl p-8 w-full mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Why Work With Us?</h2>
          <ul className="space-y-3 text-blue-200 text-left mx-auto max-w-lg">
            <li>• Remote-first, flexible hours</li>
            <li>• Work with cutting-edge AI and web tech</li>
            <li>• Diverse, supportive team culture</li>
            <li>• Competitive compensation & benefits</li>
            <li>• Opportunity to shape the future of work</li>
          </ul>
        </div>
        <div className="w-full bg-[#181a23] border border-blue-900 rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-100 mb-3">Open Positions</h3>
          <ul className="space-y-4">
            <li className="bg-[#071124] border border-[#123055] rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-bold text-white">Full Stack Engineer</div>
                <div className="text-blue-200 text-sm">Remote · TypeScript, Next.js, Node.js</div>
              </div>
              <Link
                href="mailto:hello@humanaira.com?subject=Application%20for%20Full%20Stack%20Engineer"
                className="mt-3 md:mt-0 px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              >
                Apply
              </Link>
            </li>
            <li className="bg-[#071124] border border-[#123055] rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-bold text-white">Product Designer</div>
                <div className="text-blue-200 text-sm">Remote · Figma, UX/UI, Branding</div>
              </div>
              <Link
                href="mailto:hello@humanaira.com?subject=Application%20for%20Product%20Designer"
                className="mt-3 md:mt-0 px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              >
                Apply
              </Link>
            </li>
            <li className="bg-[#071124] border border-[#123055] rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-bold text-white">Community Manager</div>
                <div className="text-blue-200 text-sm">Remote · Social, Support, Growth</div>
              </div>
              <Link
                href="mailto:hello@humanaira.com?subject=Application%20for%20Community%20Manager"
                className="mt-3 md:mt-0 px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              >
                Apply
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-blue-200 mt-8">
          Don’t see your role? <a href="mailto:hello@humanaira.com" className="underline hover:text-blue-400">Email us</a> and tell us how you can help!
        </div>
      </section>
    </main>
  )
}