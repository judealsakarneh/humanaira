'use client'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-gray-900 font-inter">
      <section className="relative max-w-3xl mx-auto px-4 py-20 mt-10">
        {/* Decorative Blur Backgrounds */}
        <div className="absolute -top-16 -left-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 z-0" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-50 rounded-full blur-2xl opacity-40 z-0" />

        <h1 className="relative z-10 text-4xl font-extrabold text-blue-900 mb-6 text-center font-sans">
          Terms of Service
        </h1>
        <div className="relative z-10 bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing or using Zentask AI, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our platform.
          </p>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">2. User Accounts</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>You must provide accurate and complete information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
            <li>You are responsible for all activities that occur under your account.</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">3. Use of Services</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Do not use Zentask AI for any unlawful or prohibited purpose.</li>
            <li>Respect other users and do not engage in harassment, abuse, or fraud.</li>
            <li>All content and services must comply with our community guidelines.</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">4. Payments & Refunds</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Payments are processed securely through our platform.</li>
            <li>Refunds are available if you are not satisfied, subject to our money-back guarantee policy.</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">5. Intellectual Property</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>All content on Zentask AI is protected by copyright and intellectual property laws.</li>
            <li>You may not copy, reproduce, or distribute any content without permission.</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">6. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We may update these Terms at any time. Continued use of Zentask AI means you accept the new terms.
          </p>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">7. Contact</h2>
          <p className="text-gray-700 mb-2">
            If you have any questions about these Terms, please contact us:
          </p>
          <a
            href="mailto:hello@zentask.ai"
            className="inline-block px-6 py-2 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition"
          >
            hello@zentask.ai
          </a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <Link href="/" className="hover:text-blue-700 underline">Back to Home</Link>
        </div>
      </section>
    </main>
  )
}