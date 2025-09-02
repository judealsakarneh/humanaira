'use client'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-gray-900 font-inter">
      <section className="relative max-w-3xl mx-auto px-4 py-20 mt-10">
        {/* Decorative Blur Backgrounds */}
        <div className="absolute -top-16 -left-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 z-0" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-50 rounded-full blur-2xl opacity-40 z-0" />

        <h1 className="relative z-10 text-4xl font-extrabold text-blue-900 mb-6 text-center font-sans">
          Privacy Policy
        </h1>
        <div className="relative z-10 bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Zentask AI is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">2. Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>Account information (name, email, etc.)</li>
            <li>Profile details and content you provide</li>
            <li>Usage data and analytics</li>
            <li>Payment and transaction information</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>To provide and improve our services</li>
            <li>To communicate with you about your account or orders</li>
            <li>To ensure platform security and prevent fraud</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">4. Sharing Your Information</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>We do not sell your personal information.</li>
            <li>We may share information with trusted service providers to operate our platform.</li>
            <li>We may disclose information if required by law or to protect our rights.</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">5. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We use industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">6. Your Choices</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
            <li>You can update your account information at any time.</li>
            <li>You may request deletion of your account and data.</li>
            <li>You can opt out of marketing communications.</li>
          </ul>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">7. Changes to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify you of any significant changes.
          </p>

          <h2 className="text-2xl font-bold text-blue-800 mb-4 mt-8">8. Contact Us</h2>
          <p className="text-gray-700 mb-2">
            If you have any questions about this Privacy Policy, please contact us:
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