'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from './api/lib/supabaseBrowser'

/**
 * Simple intersection observer hook for reveal-on-scroll
 */
const useInView = (threshold = 0.18) => {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window.IntersectionObserver === 'undefined') return

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => {
      if (el) observer.unobserve(el)
    }
  }, [threshold])

  return { ref, inView }
}

/* ---------------------------------------
   SECTION DIVIDER
--------------------------------------- */
function SectionDivider() {
  return (
    <div className="w-full flex justify-center items-center py-0 relative">
      <div className="w-[76%] h-[1px] bg-gradient-to-r from-transparent via-sky-900 to-transparent opacity-50 my-0" />
    </div>
  )
}

/* ---------------------------------------
   HERO FX LAYERS (clean, performant)
   - Aurora veils
   - Constellation lines
   - Soft particles
   - Orbit grid (from previous version)
   - Rotating Planet + Satellite (refined)
--------------------------------------- */

function AuroraVeil() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-32 w-[38rem] h-[38rem] bg-sky-500/15 rounded-full blur-[120px] animate-aurora-sway" />
      <div className="absolute -bottom-44 -right-24 w-[44rem] h-[44rem] bg-cyan-400/10 rounded-full blur-[140px] animate-aurora-sway2" />
      <style jsx>{`
        @keyframes aurora-sway {
          0% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(-20px) translateX(10px) scale(1.04); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }
        @keyframes aurora-sway2 {
          0% { transform: translateY(0px) translateX(0px) scale(1); }
          50% { transform: translateY(18px) translateX(-12px) scale(1.06); }
          100% { transform: translateY(0px) translateX(0px) scale(1); }
        }
        .animate-aurora-sway { animation: aurora-sway 18s ease-in-out infinite; }
        .animate-aurora-sway2 { animation: aurora-sway2 22s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

function ConstellationLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {[
        { d: 'M 5% 20% C 20% 25%, 40% 15%, 65% 22% S 92% 28%, 98% 18%', delay: 0 },
        { d: 'M 10% 70% C 28% 60%, 46% 80%, 66% 68% S 88% 62%, 98% 68%', delay: 1.2 },
        { d: 'M 0% 45% C 20% 40%, 32% 48%, 52% 42% S 88% 38%, 100% 40%', delay: 2.1 },
      ].map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          className="animate-dash"
          style={{ animationDelay: `${p.delay}s` }}
        />
      ))}
      <style jsx>{`
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }
        .animate-dash {
          stroke-dashoffset: 0;
          animation: dash 30s linear infinite;
          opacity: 0.55;
        }
      `}</style>
    </svg>
  )
}

function ParticlesCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let raf = 0
    let running = true

    const DPR = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * DPR)
      canvas.height = Math.floor(rect.height * DPR)
      ctx.scale(DPR, DPR)
    }
    resize()
    window.addEventListener('resize', resize)

    const COUNT = 56
    const particles = Array.from({ length: COUNT }).map(() => ({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      r: 1 + Math.random() * 1.8,
      a: 0.25 + Math.random() * 0.35,
    }))

    const tick = () => {
      if (!running) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(56,189,248,${p.a})` // sky-400
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      <canvas ref={ref} className="w-full h-full" />
    </div>
  )
}

function HeroOrbitGrid() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0, perspective: '800px', transformStyle: 'preserve-3d' }}
    >
      <div
        className="absolute top-1/2 left-1/2 w-full h-full opacity-[0.09]"
        style={{
          transform: 'translate(10vw, -50%) rotateX(60deg) rotateZ(45deg)',
        }}
      >
        <div className="orbit-grid w-full h-full" />
      </div>

      <style jsx>{`
        .orbit-grid {
          background-image: linear-gradient(
              to right,
              rgba(56, 189, 248, 0.23) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(56, 189, 248, 0.23) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, white 0%, transparent 70%);
          animation: spin-grid 120s linear infinite;
        }
        @keyframes spin-grid {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function OrbitingSatellite() {
  const SATELLITE_WIDTH = 40
  const SATELLITE_HEIGHT = 24
  const ORBIT_DISTANCE = 250
  const ORBIT_DURATION = 20
  const ORBIT_PERSPECTIVE_ANGLE = 60

  const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`

  return (
    <div
      className="satellite-orbit-container"
      style={{
        position: 'absolute',
        width: 1,
        height: 1,
        top: 0,
        left: 0,
        animation: `satellite-orbit ${ORBIT_DURATION}s linear infinite`,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <div
        className="satellite-body"
        style={{
          width: SATELLITE_WIDTH,
          height: SATELLITE_HEIGHT,
          borderRadius: '50% / 30%',
          background: `#1f2937 ${noiseTexture}`,
          boxShadow: '0 0 12px rgba(167, 183, 201, 0.25)',
          position: 'absolute',
          top: -SATELLITE_HEIGHT / 2,
          left: -SATELLITE_WIDTH / 2,
          transformStyle: 'preserve-3d',
          animation: `satellite-spin ${ORBIT_DURATION / 2}s linear infinite`,
        }}
      />
      <style jsx>{`
        @keyframes satellite-orbit {
          0% { transform: rotateY(0deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg); z-index: 2; }
          25% { transform: rotateY(90deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg); z-index: 2; }
          50% { transform: rotateY(180deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg); z-index: 0; }
          75% { transform: rotateY(270deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg); z-index: 0; }
          100% { transform: rotateY(360deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg); z-index: 2; }
        }
        @keyframes satellite-spin {
          from { transform: rotateZ(0deg); }
          to { transform: rotateZ(360deg); }
        }
      `}</style>
    </div>
  )
}

function RotatingPlanet() {
  const PLANET_SIZE = 480
  const DEEP_BLUE_PLANET = '#020711'
  const DEEPER_BLUE_EDGE = '#000000'

  const gradientColors = [
    'rgba(14, 165, 233, 0.9)',   // sky-500
    'rgba(125, 211, 252, 0.75)', // sky-300
    'rgba(56, 189, 248, 0.8)',   // sky-400
    'rgba(255, 255, 255, 0.85)', // white
  ]

  return (
    <div
      className="absolute top-1/2 left-1/2 hidden md:block"
      style={{
        transform: 'translate(25vw, -50%)',
        zIndex: 1,
        width: PLANET_SIZE,
        height: PLANET_SIZE,
        borderRadius: '50%',
        position: 'absolute',
        top: -PLANET_SIZE / 2,
        left: -PLANET_SIZE / 2,
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        className="main-planet"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          background: `radial-gradient(circle at center, ${DEEP_BLUE_PLANET} 50%, ${DEEPER_BLUE_EDGE} 100%)`,
          boxShadow: '0 0 150px rgba(56, 189, 248, 0.35), inset 0 0 60px rgba(0,0,0,0.9)',
          animation: `spin-planet 90s linear infinite`,
          zIndex: 1,
          position: 'absolute',
        }}
      />
      {gradientColors.map((color, index) => (
        <div
          key={index}
          className="intense-gradient-circle"
          style={{
            position: 'absolute',
            width: `${PLANET_SIZE * (1.2 + index * 0.3)}px`,
            height: `${PLANET_SIZE * (1.2 + index * 0.3)}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle at center, ${color} 0%, transparent 42%)`,
            animation: `float-fade ${20 + index * 8}s linear infinite ${index % 2 === 0 ? 'alternate-reverse' : 'alternate'}`,
            filter: 'blur(48px)',
            opacity: 0.85,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      ))}
      <OrbitingSatellite />
      <style jsx>{`
        @keyframes spin-planet {
          from { transform: rotateZ(0deg); }
          to { transform: rotateZ(360deg); }
        }
        @keyframes float-fade {
          0% { transform: translate(-28%, -28%) scale(0.92); opacity: 0.9; }
          50% { transform: translate(26%, 26%) scale(1.05); opacity: 0.6; }
          100% { transform: translate(-28%, -28%) scale(0.92); opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}

function HeroHaloUnderline() {
  return (
    <div className="relative mt-3 mb-4">
      <div className="mx-auto h-[10px] w-[240px] rounded-full bg-gradient-to-r from-transparent via-sky-500/60 to-transparent blur-md" />
      <div className="mx-auto h-px w-[260px] bg-gradient-to-r from-transparent via-sky-400/60 to-transparent opacity-70" />
    </div>
  )
}

/* ---------------------------------------
   HERO SECTION
--------------------------------------- */
function Hero() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      const query = `/browse?q=${encodeURIComponent(search.trim())}`
      router.push(query)
    }
  }

  return (
    <section
      className="relative w-full flex items-center justify-center bg-[#060a12] overflow-hidden"
      style={{ minHeight: 'calc(100vh - 72px)' }}
    >
      <AuroraVeil />
      <HeroOrbitGrid />
      <ConstellationLines />
      <ParticlesCanvas />
      <RotatingPlanet />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 w-full min-h-[calc(100vh-72px)]">
        <h1
          className="mb-2 leading-tight tracking-tight drop-shadow-xl font-extrabold text-white"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 4.8rem)',
            letterSpacing: '-0.04em',
            lineHeight: 1.08,
            textShadow: '0 4px 32px #38bdf84d, 0 2px 10px #0ea5e9cc',
          }}
        >
          Elevate Your Next Project
          <br />
          <span
            style={{
              fontFamily: "'Pacifico', cursive",
              color: '#38bdf8',
              fontWeight: 500,
              fontSize: '1.08em',
              letterSpacing: '0.01em',
              textShadow: '0 2px 15px rgba(56, 189, 248, 0.55)',
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
          >
            with Humanaira
          </span>
        </h1>

        <HeroHaloUnderline />

        <p
          className="text-lg md:text-xl mb-8 max-w-3xl mx-auto font-medium text-slate-300"
          style={{ letterSpacing: '0.01em', textShadow: '0 2px 12px #00000075' }}
        >
          Discover, hire, and collaborate with the next generation of AI talent and digital creators.
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl mx-auto flex items-center justify-center bg-gray-800/60 backdrop-blur-sm rounded-xl border border-sky-700/70 p-2 shadow-2xl hover:shadow-sky-800/20 transition-shadow"
          style={{ marginBottom: '1.75rem' }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for AI services, gigs, or specialized talent..."
            className="flex-1 bg-transparent border-none outline-none text-white text-base px-3 py-3 placeholder:text-slate-400 placeholder:font-light"
            style={{ minWidth: 0, fontSize: '1rem' }}
          />
          <button
            type="submit"
            className="ml-2 px-6 py-3 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-500 transition text-base shadow-md shadow-sky-700/30"
          >
            Search
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-30">
            <div className="mx-auto h-[50px] w-[280px] rounded-full bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
          </div>
          <div className="flex flex-wrap gap-4 justify-center items-center font-medium">
            <Link
              href="/services"
              className="inline-block px-5 py-2.5 rounded-lg bg-gray-800/80 border border-gray-700 text-sky-300 hover:text-sky-200 hover:border-sky-600 transition"
            >
              Browse Services →
            </Link>
            <Link
              href="/seller/gigs/new"
              className="inline-block px-5 py-2.5 rounded-lg bg-sky-600 border border-sky-700 text-white hover:bg-sky-500 transition shadow-lg shadow-sky-500/20"
            >
              Start Selling AI Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   AI STATS
--------------------------------------- */
function AIStats() {
  const stats = [
    { stat: '+70%', label: 'AI Freelance Job Growth', desc: 'AI-related freelance jobs have grown by 70% since last year.', index: 0 },
    { stat: '82%', label: 'Companies Hiring AI Talent', desc: '82% of companies plan to increase their use of AI freelancers.', index: 1 },
    { stat: '3x', label: 'Faster Delivery', desc: 'AI-powered teams deliver projects 3x faster on average.', index: 2 },
    { stat: '92%', label: 'Buyer Satisfaction', desc: '92% of buyers report improved outcomes with AI freelancers.', index: 3 },
  ]
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-24 bg-gray-900 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-sky-700/50 to-transparent" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-14 text-center tracking-tight">
          The Future of Freelancing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <FactCard key={s.label} {...s} />
          ))}
        </div>
        <div className="text-center text-sky-300 text-xl font-light mt-16 max-w-3xl mx-auto">
          <span className="italic font-normal">
            AI freelancers are transforming how companies innovate, scale, and win.
          </span>
        </div>
      </div>
    </section>
  )
}

function FactCard({ stat, label, desc, index }: { stat: string; label: string; desc: string; index: number }) {
  const { ref, inView } = useInView(0.25)
  return (
    <div
      ref={ref}
      className={`bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl shadow-gray-900/50 transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)] hover:border-sky-600 hover:shadow-sky-900/30
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms', willChange: 'opacity, transform' }}
    >
      <div className="text-5xl font-extrabold text-sky-400 mb-3">{stat}</div>
      <div className="text-lg font-semibold text-white mb-2">{label}</div>
      <div className="text-slate-400 text-base">{desc}</div>
    </div>
  )
}

/* ---------------------------------------
   HOW IT WORKS
--------------------------------------- */
function HowItWorks() {
  const points = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ),
      title: 'Vetted AI Talent',
      desc: 'All sellers are rigorously vetted for expertise and AI-specific skills.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 8v4l3 3m-3 7a9 9 0 110-18 9 9 0 010 18z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ),
      title: '24/7 Support',
      desc: 'Our team is here to help you anytime, day or night.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M8 10h.01M16 10h.01M12 12c-3.1 0-6 2.3-6 5h12c0-2.7-2.9-5-6-5z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ),
      title: 'Instant Collaboration',
      desc: 'Chat instantly with AI freelancers for smooth project execution.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 3v18M4 7h16M4 17h16" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ),
      title: 'Secure Escrow Payments',
      desc: 'Your funds are protected until you approve the final, delivered work.',
    },
  ]
  return (
    <section className="w-full py-24 px-4 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-800/40 to-transparent" />
        <div className="absolute bottom-10 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-800/40 to-transparent" />
      </div>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-14 text-center tracking-tight">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, idx) => (
            <HowItWorksCard key={idx} icon={point.icon} title={point.title} desc={point.desc} index={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  index: number
}) {
  const { ref, inView } = useInView(0.18)
  return (
    <div
      ref={ref}
      className={`bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)] hover:shadow-sky-900/30
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms', willChange: 'opacity, transform' }}
    >
      <div className="mb-4 p-3 rounded-full bg-sky-900/25">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-base">{desc}</p>
    </div>
  )
}

/* ---------------------------------------
   WHY HUMANAIRA
--------------------------------------- */
function WhyHumanaira() {
  const items = [
    { title: 'Curated AI Talent', desc: 'Top performers only. We vet portfolios and delivery history for AI-specific projects.' },
    { title: 'AI-First Workflows', desc: 'Faster iterations with integrated AI tooling while human expertise ensures final quality.' },
    { title: 'Transparent Pricing', desc: 'Clear fees and milestone-based payments. No surprises or hidden costs.' },
    { title: 'Reliable Global Support', desc: 'SLA-backed, multilingual support for your most important AI initiatives.' },
  ]
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-14 text-center text-white tracking-tight">
        Why Choose Humanaira
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((it, idx) => (
          <WhyCard key={it.title} title={it.title} desc={it.desc} index={idx} />
        ))}
      </div>
    </section>
  )
}

function WhyCard({ title, desc, index }: { title: string; desc: string; index: number }) {
  const { ref, inView } = useInView(0.18)
  return (
    <div
      ref={ref}
      className={`p-6 rounded-xl bg-gray-900 border border-sky-900/60 shadow-xl shadow-sky-900/10 hover:-translate-y-[4px] transition-transform duration-300 flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)]
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms', willChange: 'opacity, transform' }}
    >
      <div className="font-semibold text-white text-lg mb-2">{title}</div>
      <div className="text-slate-300 text-sm">{desc}</div>
    </div>
  )
}

/* ---------------------------------------
   CTA
--------------------------------------- */
function ReadyToMakeTheChangeCTA() {
  const { ref, inView } = useInView(0.3)
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <div
        ref={ref}
        className={`bg-gray-900 border border-sky-700/50 rounded-3xl p-10 md:p-20 text-center shadow-2xl shadow-sky-900/20 transition-all duration-1000 ease-out
        ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
          style={{ textShadow: '0 2px 10px rgba(56, 189, 248, 0.4)' }}
        >
          Elevate Your Ambition
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
          Join the platform where tomorrow&apos;s AI innovations are built today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/services"
            className="px-10 py-4 text-lg font-bold rounded-xl bg-sky-600 text-white hover:bg-sky-500 transition shadow-lg shadow-sky-500/30 transform hover:scale-[1.03]"
          >
            Explore AI Services
          </Link>
          <Link
            href="/seller/gigs/new"
            className="px-10 py-4 text-lg font-bold rounded-xl bg-gray-700 text-slate-200 border border-gray-600 hover:bg-gray-600 transition transform hover:scale-[1.03]"
          >
            Start Selling Today
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   FAQ
--------------------------------------- */
function FAQSection() {
  const faqs = [
    {
      q: 'How do payments work?',
      a: 'You pay securely via our gateway. Funds are held in escrow until you formally accept the delivered work. This protects both the buyer and the seller.',
    },
    {
      q: 'What if I need revisions on AI-generated content?',
      a: 'Most AI freelancers include 1-3 rounds of revisions to fine-tune the output. You can request changes directly via the order workspace for better tracking.',
    },
    {
      q: 'Is there a money-back guarantee?',
      a: 'We have a strong satisfaction policy. If the delivered work does not meet the agreed-upon standards or specifications, contact support within 7 days and we will review your case for a full refund.',
    },
  ]
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative max-w-5xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-12 text-center text-white tracking-tight">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div key={f.q} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              className="w-full text-left px-6 py-4 flex justify-between items-center transition hover:bg-gray-800/80"
            >
              <div className="font-medium text-white text-lg">{f.q}</div>
              <div
                className="text-sky-400 text-3xl transition-transform duration-300"
                style={{ transform: open === idx ? 'rotate(45deg)' : 'rotate(0deg)' }}
                aria-hidden
              >
                +
              </div>
            </button>
            <div
              className="px-6 pb-6 text-slate-300 faq-answer text-base"
              style={{ maxHeight: open === idx ? 240 : 0, opacity: open === idx ? 1 : 0 }}
            >
              <div>{f.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------
   FOOTER
--------------------------------------- */
function Footer() {
  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-12">
        <div className="flex flex-col items-start gap-3">
          <div className="text-4xl font-extrabold select-none" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.04em' }}>
            <span className="text-sky-500">human</span>
            <span className="text-gray-50">ai</span>
            <span className="text-sky-500">ra</span>
          </div>
          <div className="text-slate-400 text-sm max-w-xs mt-2">
            The premium AI-powered freelance marketplace. Built for professionals, by professionals.
          </div>
          <div className="text-slate-400 text-sm mt-3">
            Humanaira Ltd
            <br />
            167-169 Great Portland Street, 5th Floor
            <br />
            London, W1W 5PF
            <br />
            United Kingdom
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6">
          <FooterSection title="Explore">
            <Link href="/blog" className="footer-link">Blog</Link>
            <Link href="/services" className="footer-link">Browse Gigs</Link>
            <Link href="/help" className="footer-link">Help Center</Link>
          </FooterSection>
          <FooterSection title="Company">
            <Link href="/about" className="footer-link">About Us</Link>
          </FooterSection>
          <FooterSection title="Legal">
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/refund-policy" className="footer-link">Refund Policy</Link>
          </FooterSection>
        </div>
      </div>
      <div className="text-center text-slate-500 text-xs mt-12 pt-8 border-t border-gray-900 opacity-70">
        &copy; {new Date().getFullYear()} Humanaira. All rights reserved.
      </div>
      <style jsx global>{`
        .footer-link {
          color: #9fb0c3;
          font-size: 0.95rem;
          padding: 0.35rem 0;
          text-decoration: none;
          transition: color 0.2s;
          display: block;
          font-weight: 400;
        }
        .footer-link:hover { color: #38bdf8; }
      `}</style>
    </footer>
  )
}

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sky-400 font-semibold mb-2 text-base uppercase tracking-wider">
        {title}
      </div>
      {children}
    </div>
  )
}

/* ---------------------------------------
   BACKGROUND BRAND WATERMARK
--------------------------------------- */
function BackgroundBrand() {
  return (
    <span
      className="fixed left-[-10vw] top-[60vh] text-[18vw] font-extrabold uppercase pointer-events-none select-none opacity-[0.05] z-0"
      style={{
        fontFamily: "'Inter', Arial, sans-serif",
        color: '#38bdf8',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        letterSpacing: '-0.06em',
        lineHeight: 1,
      }}
      aria-hidden
    >
      HUMANAIRA
    </span>
  )
}

/* ---------------------------------------
   GLOBAL STYLES
--------------------------------------- */
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Pacifico&display=swap');

      :root {
        --accent: #38bdf8;
        --soft: #0c1a2c;
      }
      html, body { overflow-x: hidden; }
      body {
        margin: 0;
        padding: 0;
        background: #080911;
        font-family: 'Inter', sans-serif;
      }
      .faq-answer { transition: max-height 420ms ease, opacity 300ms ease; overflow: hidden; }

      /* Professional Scrollbar (Dark Theme) */
      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 10px; border: 3px solid #080911; }
      ::-webkit-scrollbar-track { background: #1f2937; }
    `}</style>
  )
}

/* ---------------------------------------
   MAIN HOME PAGE
--------------------------------------- */
export default function HomePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-slate-100 font-sans relative overflow-x-hidden">
      <div className="pt-[72px]">
        <Hero />
        <SectionDivider />
        <AIStats />
        <SectionDivider />
        <HowItWorks />
        <SectionDivider />
        <WhyHumanaira />
        <SectionDivider />
        <ReadyToMakeTheChangeCTA />
        <SectionDivider />
        <FAQSection />
        <Footer />
        <GlobalStyles />
        <BackgroundBrand />
      </div>
    </main>
  )
}