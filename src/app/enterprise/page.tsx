'use client'

import Link from 'next/link'

export default function EnterprisePage() {
  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter">
      <section className="max-w-4xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-200 mb-4">
          Humanaira for Enterprise
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl">
          Unlock the power of vetted AI talent and managed freelance teams for your business. 
          Scale projects, accelerate innovation, and get dedicated support with Humanaira Enterprise.
        </p>
        <div className="bg-[#101a2a]/90 border border-blue-900 rounded-2xl shadow-xl p-8 w-full mb-10">
          <h2 className="text-2xl font-bold text-white mb-4">Enterprise Features</h2>
          <ul className="space-y-3 text-blue-200 text-left mx-auto max-w-lg">
            <li>• Dedicated account manager & onboarding</li>
            <li>• Custom team assembly & project scoping</li>
            <li>• SLA-backed support & priority delivery</li>
            <li>• Flexible billing & consolidated invoicing</li>
            <li>• Security, compliance, and NDA options</li>
            <li>• API access & integrations</li>
          </ul>
        </div>
        <div className="w-full bg-[#181a23] border border-blue-900 rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-blue-100 mb-3">How It Works</h3>
          <ol className="list-decimal list-inside text-blue-200 text-left mx-auto max-w-lg space-y-2">
            <li>Contact our enterprise team to discuss your needs.</li>
            <li>We match you with top AI freelancers or assemble a custom team.</li>
            <li>Manage projects, milestones, and payments in one place.</li>
            <li>Get ongoing support and reporting from our team.</li>
          </ol>
        </div>
        <div className="mt-8">
          <Link
            href="mailto:hello@humanaira.com?subject=Enterprise%20Inquiry"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#38bdf8] text-white font-bold text-lg shadow hover:from-[#1e40af] hover:to-[#0ea5e9] transition"
          >
            Contact Enterprise Team
          </Link>
        </div>
        <div className="text-blue-200 mt-8 text-sm">
          Have questions? <a href="mailto:hello@humanaira.com" className="underline hover:text-blue-400">Email us</a> for a custom solution.
        </div>
      </section>
    </main>
  )
}