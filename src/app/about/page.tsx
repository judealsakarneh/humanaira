'use client'

// About Humanaira — Dark theme with brand blue accents only (#35BFFF)
export default function AboutPage() {
  const BRAND = '#35BFFF'

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 font-sans relative overflow-hidden">
      {/* Brand glow accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-20 -left-28 w-[26rem] h-[26rem] rounded-full blur-[150px]"
          style={{ background: 'rgba(53,191,255,0.22)' }}
        />
        <div
          className="absolute -bottom-28 -right-28 w-[28rem] h-[28rem] rounded-full blur-[160px]"
          style={{ background: 'rgba(53,191,255,0.18)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[10rem] rounded-full blur-[120px]"
          style={{ background: 'rgba(53,191,255,0.10)' }}
        />
      </div>

      {/* Content */}
      <section className="relative max-w-3xl mx-auto px-4 pt-28 pb-16">
        <h1
          className="relative z-10 text-4xl font-extrabold mb-6 text-center tracking-tight"
          style={{ color: BRAND }}
        >
          About Humanaira
        </h1>

        <p className="relative z-10 text-lg text-slate-300 mb-8 text-center max-w-2xl mx-auto">
          Humanaira Ltd is a next-generation freelance marketplace, connecting you with top AI-powered talent and digital
          creators. Our mission is to make hiring and working with AI experts simple, fast, and secure for everyone.
        </p>

        {/* Panel 1: Our Story */}
        <div
          className="relative z-10 rounded-2xl shadow-2xl p-8 mb-10 bg-slate-900/80 backdrop-blur-sm border"
          style={{ borderColor: 'rgba(53,191,255,0.35)', boxShadow: '0 24px 64px rgba(3,6,16,0.6)' }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND }}>
            Our Story
          </h2>
          <p className="text-slate-300 mb-4">
            Founded by a team of tech enthusiasts and freelancers, Humanaira Ltd was born from the need for a smarter,
            more transparent, and AI-driven freelance platform. We believe in empowering both clients and freelancers
            with the latest technology, seamless collaboration, and fair opportunities.
          </p>
          <p className="text-slate-300">
            Whether you need content, design, automation, or development, Humanaira Ltd brings together the best of human
            creativity and artificial intelligence.
          </p>
        </div>

        {/* Panel 2: Differentiators */}
        <div
          className="relative z-10 rounded-2xl shadow-2xl p-8 mb-10 bg-slate-900/80 backdrop-blur-sm border"
          style={{ borderColor: 'rgba(53,191,255,0.35)', boxShadow: '0 24px 64px rgba(3,6,16,0.6)' }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND }}>
            What Makes Us Different?
          </h2>
          <ul className="list-disc pl-6 text-slate-300 space-y-2">
            <li>Curated, high-quality AI freelancers and digital creators</li>
            <li>Fast, secure, and transparent hiring process</li>
            <li>Arabic & English support for a global audience</li>
            <li>100% money-back guarantee on all orders</li>
            <li>Personalized support and a friendly community</li>
          </ul>
        </div>

        {/* Panel 3: Contact */}
        <div
          className="relative z-10 rounded-2xl shadow-2xl p-8 bg-slate-900/80 backdrop-blur-sm border"
          style={{ borderColor: 'rgba(53,191,255,0.35)', boxShadow: '0 24px 64px rgba(3,6,16,0.6)' }}
        >
          <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND }}>
            Contact Us
          </h2>
          <p className="text-slate-300 mb-2">
            Have questions, feedback, or want to partner with us? We’d love to hear from you!
          </p>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <a
              href="mailto:hello@humanaira.com"
              className="px-6 py-3 rounded-full font-semibold text-center shadow-lg transition"
              style={{
                background: BRAND,
                color: '#06121f',
                boxShadow: '0 12px 26px rgba(53,191,255,0.25)',
              }}
            >
              Email: hello@humanaira.com
            </a>
            <a
              href="/contact"
              className="px-6 py-3 rounded-full font-semibold text-center bg-slate-800 hover:bg-slate-700 transition border"
              style={{ color: BRAND, borderColor: 'rgba(53,191,255,0.35)' }}
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
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji',
            'Segoe UI Emoji';
        }
        /* Refined Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: #35bfff;
          border-radius: 4px;
          border: 2px solid #030712;
        }
        ::-webkit-scrollbar-track {
          background: #1f2937;
        }
      `}</style>
    </main>
  )
}