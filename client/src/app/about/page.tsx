'use client'
// import Link from 'next/link' // Using standard <a> tags for standalone React component

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 font-inter">
      {/* Adjusted padding: changed py-20 to pt-28 pb-16 to reduce bottom space and eliminate unnecessary scrolling/whitespace */}
      <section className="relative max-w-3xl mx-auto px-4 pt-28 pb-16">
        
        {/* Decorative Blur Backgrounds (Dark Theme) */}
        <div className="absolute -top-16 -left-24 w-72 h-72 bg-fuchsia-900/30 rounded-full blur-[100px] opacity-15 z-0" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-900/40 rounded-full blur-[120px] opacity-15 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-indigo-900/20 rounded-full blur-[80px] opacity-10 z-0" />

        <h1 className="relative z-10 text-4xl font-extrabold text-sky-400 mb-6 text-center font-sans tracking-tight">
          About Humanaira Ltd
        </h1>
        <p className="relative z-10 text-lg text-slate-400 mb-8 text-center max-w-2xl mx-auto">
          Humanaira Ltd is a next-generation freelance marketplace, connecting you with top AI-powered talent and digital creators. Our mission is to make hiring and working with AI experts simple, fast, and secure for everyone.
        </p>

        {/* Panel 1 */}
        <div className="relative z-10 bg-[#0f172a] rounded-2xl shadow-2xl shadow-black/50 border border-[#1e293b] p-8 mb-10">
          <h2 className="text-2xl font-bold text-sky-500 mb-4">Our Story</h2>
          <p className="text-slate-400 mb-4">
            Founded by a team of tech enthusiasts and freelancers, Humanaira Ltd was born from the need for a smarter, more transparent, and AI-driven freelance platform. We believe in empowering both clients and freelancers with the latest technology, seamless collaboration, and fair opportunities.
          </p>
          <p className="text-slate-400">
            Whether you need content, design, automation, or development, Humanaira Ltd brings together the best of human creativity and artificial intelligence.
          </p>
        </div>

        {/* Panel 2 */}
        <div className="relative z-10 bg-[#0f172a] rounded-2xl shadow-2xl shadow-black/50 border border-[#1e293b] p-8 mb-10">
          <h2 className="text-2xl font-bold text-sky-500 mb-4">What Makes Us Different?</h2>
          <ul className="list-disc pl-6 text-slate-400 space-y-2">
            <li>Curated, high-quality AI freelancers and digital creators</li>
            <li>Fast, secure, and transparent hiring process</li>
            <li>Arabic & English support for a global audience</li>
            <li>100% money-back guarantee on all orders</li>
            <li>Personalized support and a friendly community</li>
          </ul>
        </div>

        {/* Panel 3 */}
        <div className="relative z-10 bg-[#0f172a] rounded-2xl shadow-2xl shadow-black/50 border border-[#1e293b] p-8">
          <h2 className="text-2xl font-bold text-sky-500 mb-4">Contact Us</h2>
          <p className="text-slate-400 mb-2">
            Have questions, feedback, or want to partner with us? We’d love to hear from you!
          </p>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <a
              href="mailto:hello@humanaira.com"
              className="px-6 py-3 rounded-full bg-sky-700 text-white font-semibold shadow-lg shadow-sky-900/50 hover:bg-sky-600 transition text-center"
            >
              Email: hello@humanaira.com
            </a>
            <a
              href="/contact"
              className="px-6 py-3 rounded-full bg-[#1e293b] text-sky-400 font-semibold shadow border border-sky-700 hover:bg-[#2c3d59] transition text-center"
            >
              Contact Form
            </a>
          </div>
        </div>
      </section>
      
      {/* Global styles for dark theme look */}
      <style jsx global>{`
        body {
            background-color: #030712;
            color: #f1f5f9;
            font-family: 'Inter', sans-serif;
        }
        /* Refined Scrollbar Styles */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { 
            background: linear-gradient(180deg,#0ea5e9,#38bdf8); 
            border-radius: 4px;
            border: 2px solid #030712; 
        }
        ::-webkit-scrollbar-track { background: #1f2937; }
      `}</style>
    </main>
  )
}
