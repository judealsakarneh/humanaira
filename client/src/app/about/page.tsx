'use client'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-gray-900 font-inter">
      <section className="relative max-w-3xl mx-auto px-4 py-20 mt-10">
        {/* Decorative Blur Backgrounds */}
        <div className="absolute -top-16 -left-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 z-0" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-50 rounded-full blur-2xl opacity-40 z-0" />

        <h1 className="relative z-10 text-4xl font-extrabold text-blue-900 mb-6 text-center font-sans">
          About Zentask AI
        </h1>
        <p className="relative z-10 text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
          Zentask AI is a next-generation freelance marketplace, connecting you with top AI-powered talent and digital creators. Our mission is to make hiring and working with AI experts simple, fast, and secure for everyone.
        </p>

        <div className="relative z-10 bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-8 mb-10">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded by a team of tech enthusiasts and freelancers, Zentask AI was born from the need for a smarter, more transparent, and AI-driven freelance platform. We believe in empowering both clients and freelancers with the latest technology, seamless collaboration, and fair opportunities.
          </p>
          <p className="text-gray-700">
            Whether you need content, design, automation, or development, Zentask AI brings together the best of human creativity and artificial intelligence.
          </p>
        </div>

        <div className="relative z-10 bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-8 mb-10">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">What Makes Us Different?</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Curated, high-quality AI freelancers and digital creators</li>
            <li>Fast, secure, and transparent hiring process</li>
            <li>Arabic & English support for a global audience</li>
            <li>100% money-back guarantee on all orders</li>
            <li>Personalized support and a friendly community</li>
          </ul>
        </div>

        <div className="relative z-10 bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Contact Us</h2>
          <p className="text-gray-700 mb-2">
            Have questions, feedback, or want to partner with us? We’d love to hear from you!
          </p>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <a
              href="mailto:hello@zentask.ai"
              className="px-6 py-3 rounded-full bg-blue-700 text-white font-semibold shadow hover:bg-blue-800 transition text-center"
            >
              Email: hello@zentask.ai
            </a>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-white text-blue-700 font-semibold shadow border border-blue-700 hover:bg-blue-50 transition text-center"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}