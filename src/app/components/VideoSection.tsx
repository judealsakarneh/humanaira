'use client'

export default function VideoSection() {
  return (
    <section className="relative w-full flex flex-col md:flex-row items-center justify-between px-8 py-28 min-h-[70vh] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{ filter: 'brightness(0.55)' }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        {/* Optionally add a webm source for better browser support */}
        {/* <source src="/hero-video.webm" type="video/webm" /> */}
        Your browser does not support the video tag.
      </video>
      {/* Overlay Content */}
      <div className="flex-1 flex flex-col justify-center items-start z-10 max-w-xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
          AI-Powered Freelance Services.<br />
          <span className="text-blue-300">Delivered in 24 Hours.</span>
        </h1>
        <p className="text-lg md:text-2xl text-blue-100 mb-10 font-medium">
          Logos, voiceovers, blog posts, and more – created with AI, polished by real freelancers.
        </p>
        <div className="flex gap-4">
          <a
            href="/browse"
            className="px-8 py-4 rounded-lg bg-blue-600 text-white text-lg font-bold shadow hover:bg-blue-700 transition"
          >
            Browse Services
          </a>
          <a
            href="/seller/gigs/new"
            className="px-8 py-4 rounded-lg bg-white/10 text-blue-200 text-lg font-bold shadow border border-blue-400 hover:bg-blue-900 transition"
          >
            Start Selling
          </a>
        </div>
      </div>
      {/* Right: Powerful Quote */}
      <div className="flex-1 flex justify-center items-center z-10 mt-12 md:mt-0">
        <div className="relative max-w-xl w-full">
          {/* Decorative quote icon */}
          <svg
            className="absolute -top-8 left-1/2 -translate-x-1/2 text-blue-200 opacity-40 w-16 h-16"
            fill="none"
            viewBox="0 0 64 64"
            aria-hidden="true"
          >
            <text x="0" y="48" fontSize="64" fontFamily="serif" fontWeight="bold" fill="currentColor">“</text>
          </svg>
          <blockquote className="relative bg-gradient-to-br from-blue-900/80 to-blue-700/80 border-l-8 border-blue-400 p-10 rounded-3xl shadow-xl text-white text-2xl md:text-3xl font-semibold italic text-center backdrop-blur-md">
            "Unlock your potential. Whether you need talent or are ready to share yours, Zentask AI empowers you to create, connect, and succeed."
          </blockquote>
        </div>
      </div>
      {/* Optional: Decorative circles */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-blue-900 opacity-30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-56 h-56 bg-blue-700 opacity-20 rounded-full blur-2xl pointer-events-none" />
    </section>
  )
}