'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Here you would send the form data to your backend or email service
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      setForm({ name: '', email: '', message: '' })
    }, 1200)
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-gray-900 font-inter">
      <section className="relative max-w-xl mx-auto px-4 py-20 mt-10">
        {/* Decorative Blur Backgrounds */}
        <div className="absolute -top-16 -left-24 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-60 z-0" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-50 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-50 rounded-full blur-2xl opacity-40 z-0" />

        <h1 className="relative z-10 text-4xl font-extrabold text-blue-900 mb-6 text-center font-sans">
          Contact Us
        </h1>
        <p className="relative z-10 text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
          Have a question, feedback, or partnership idea? Fill out the form below or email us at{' '}
          <a href="mailto:hello@zentask.ai" className="text-blue-700 underline">hello@zentask.ai</a>
        </p>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white/90 rounded-2xl shadow-xl border border-blue-100 p-8 flex flex-col gap-6"
        >
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-100"
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-blue-700 text-white font-bold text-lg shadow hover:bg-blue-800 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {sent && (
            <div className="text-green-700 bg-green-100 rounded-lg px-4 py-2 text-center font-semibold mt-2">
              Thank you! Your message has been sent.
            </div>
          )}
        </form>
      </section>
    </main>
  )
}