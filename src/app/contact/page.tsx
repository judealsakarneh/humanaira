'use client'
import { useState } from 'react'
// Note: Icon imports commented out as they are external libraries

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSent(false);
    
    // Simulating API call delay
    setTimeout(() => {
      setSent(true)
      setLoading(false)
      // Clears the form after successful simulation
      setForm({ name: '', email: '', message: '' }) 
    }, 1500)
  }

  return (
    // Main container uses flexbox for perfect centering. Added back py-8 for mobile padding safety.
    <main className="flex flex-col justify-center items-center min-h-screen bg-[#030712] text-slate-200 font-inter py-8"> 
      <section className="relative max-w-xl mx-auto px-4 w-full"> 
        
        {/* Decorative Blur Backgrounds (Dark Theme) */}
        <div className="absolute -top-16 -left-24 w-72 h-72 bg-sky-900/30 rounded-full blur-[100px] opacity-15 z-0" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-fuchsia-900/40 rounded-full blur-[120px] opacity-15 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-indigo-900/20 rounded-full blur-[80px] opacity-10 z-0" />

        <h1 className="relative z-10 text-5xl font-extrabold text-sky-500 mb-4 text-center font-sans tracking-tight">
          Get in Touch
        </h1>
        <p className="relative z-10 text-lg text-slate-400 mb-12 text-center max-w-2xl mx-auto">
          We're here to help you connect with the best AI-powered talent. Fill out the form below or email us directly at{' '}
          <a 
            href="mailto:hello@humanaira.com" 
            className="text-sky-500 hover:text-sky-400 transition duration-300 font-semibold"
          >
            hello@humanaira.com
          </a>.
        </p>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-[#0f172a] rounded-3xl shadow-2xl shadow-black/60 border border-[#1e293b] p-8 md:p-10 flex flex-col gap-6"
        >
          {/* Name Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-5 py-3 rounded-xl border border-[#1e293b] bg-[#111827] text-slate-200 placeholder-slate-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Full Name"
              autoComplete="name"
            />
          </div>
          
          {/* Email Input */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-5 py-3 rounded-xl border border-[#1e293b] bg-[#111827] text-slate-200 placeholder-slate-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>
          
          {/* Message Textarea */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2 flex items-center gap-2" htmlFor="message">
              Message for Humanaira
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-5 py-3 rounded-xl border border-[#1e293b] bg-[#111827] text-slate-200 placeholder-slate-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 resize-none"
              value={form.message}
              onChange={handleChange}
              placeholder="I'm interested in..."
            />
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-sky-600 text-white font-bold text-lg shadow-xl shadow-sky-900/50 hover:bg-sky-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || sent}
          >
            {loading ? 'Sending...' : sent ? 'Message Sent!' : 'Send Message'}
          </button>
          
          {/* Success Message */}
          {sent && (
            <div className="text-green-400 bg-green-900/50 rounded-xl px-4 py-3 text-center font-semibold mt-4 border border-green-700">
              Thank you for contacting Humanaira Ltd! We will respond shortly.
            </div>
          )}
        </form>
      </section>
      
      {/* Global styles with aggressive reset and overflow suppression */}
      <style jsx global>{`
        /* CRITICAL FIX: Aggressive CSS Reset and Overflow Suppression 
        This prevents any default browser margin/padding from causing scroll and eliminates the gap.
        */
        html, body {
            height: 100%;
            margin: 0 !important; 
            padding: 0 !important;
            width: 100%;
            overflow-x: hidden; /* Prevent horizontal scroll */
            overflow-y: hidden; /* <-- THIS suppresses the phantom vertical scrollbar/gap */
        }
        
        body {
            background-color: #030712;
            color: #f1f5f9;
            font-family: 'Inter', sans-serif;
        }
      `}</style>
    </main>
  )
}
