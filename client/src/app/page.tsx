'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const reviews = [
  {
    name: 'Sarah A.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Humanae made it so easy to find the perfect freelancer for my project. Fast, reliable, and great support!',
    rating: 5,
    role: 'Startup Founder',
  },
  {
    name: 'Mohammed K.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'I love how simple and transparent the platform is. The AI tools really help me deliver better gigs.',
    rating: 5,
    role: 'AI Freelancer',
  },
  {
    name: 'Lina S.',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    text: 'Best freelance experience I’ve had. The money-back guarantee gave me peace of mind.',
    rating: 4,
    role: 'Business Owner',
  },
  {
    name: 'James T.',
    avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
    text: 'Great community and support. I got my logo delivered in less than 24 hours!',
    rating: 5,
    role: 'Entrepreneur',
  },
]

export default function HomePage() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % reviews.length), 5000)
    return () => clearInterval(interval)
  }, [])

  useScrollReveal()

  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter">
      <Hero />
      <HowItWorks />
      <WhyHumanae />
      <FAQSection />
      <Reviews current={current} setCurrent={setCurrent} />
      <Footer />
      <GlobalStyles />
    </main>
  )
}

/* HERO: Dots assemble directly to a rotating earth, with orbiting dot (no rocket phase) */
function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = canvas.offsetWidth)
    let h = (canvas.height = canvas.offsetHeight)

    function resize() {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize, { passive: true })

    // Parameters
    const DOTS = 1200
    const earthRadius = Math.min(w, h) * 0.32
    const cx = w * 0.62
    const cy = h * 0.52

    // --- EARTH SHAPE (sphere, with continents coloring, rotating) ---
    function earthShapePoints(rotation: number) {
      function isContinent(lat: number, lon: number) {
        // Africa
        if (lat > -10 && lat < 30 && lon > -20 && lon < 40) return true
        // Eurasia
        if (lat > 20 && lat < 70 && lon > -10 && lon < 120) return true
        // Americas
        if (lat > -60 && lat < 60 && lon > -110 && lon < -30) return true
        // Australia
        if (lat > -45 && lat < -10 && lon > 110 && lon < 160) return true
        return false
      }
      const points: { x: number; y: number; color: string }[] = []
      for (let i = 0; i < DOTS; i++) {
        // Fibonacci sphere for even distribution
        const phi = Math.acos(1 - 2 * (i + 0.5) / DOTS)
        let theta = Math.PI * (1 + Math.sqrt(5)) * i
        theta += rotation // rotate earth

        // Convert to lat/lon for coloring
        const lat = 90 - (phi * 180) / Math.PI
        let lon = ((theta * 180) / Math.PI) % 360 - 180

        // Spherical to 2D (orthographic, for a perfect circle)
        const x3d = Math.sin(phi) * Math.cos(theta)
        const y3d = Math.cos(phi)
        const z3d = Math.sin(phi) * Math.sin(theta)
        // No perspective, just a circle
        const x = cx + earthRadius * z3d
        const y = cy + earthRadius * y3d

        // Color: blue for ocean, green/yellow for continents, white for poles
        let color = '#38bdf8'
        if (Math.abs(lat) > 70) color = '#e0f2fe'
        else if (isContinent(lat, lon)) {
          if (lat > 20) color = '#bef264'
          else if (lat < -10) color = '#facc15'
          else color = '#4ade80'
        }
        points.push({ x, y, color })
      }
      return points
    }

    // --- ORBIT PATH (for satellite dot) ---
    function getOrbitPath(t: number) {
      // Elliptical orbit around earth
      const a = earthRadius * 1.18
      const b = earthRadius * 0.92
      const angle = t * 2 * Math.PI
      return {
        x: cx + a * Math.cos(angle),
        y: cy + b * Math.sin(angle),
      }
    }

    // Stars
    const stars: { x: number; y: number; r: number; alpha: number }[] = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 0.7 + 0.15,
      alpha: Math.random() * 0.5 + 0.2,
    }))

    // Dots state: animate from random positions to their earth positions, then rotate
    let earthRotation = 0
    let raf = 0
    let dots: {
      x: number
      y: number
      vx: number
      vy: number
      phase: number
      delay: number
      color: string
      earth: { x: number; y: number; color: string }
    }[] = []

    function initDots() {
      const earthPoints = earthShapePoints(0)
      dots = []
      for (let i = 0; i < DOTS; i++) {
        const ep = earthPoints[i]
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          phase: Math.random() * Math.PI * 2,
          delay: Math.random() * 80 + (i % 40) * 2,
          color: ep.color,
          earth: {
            x: ep.x,
            y: ep.y,
            color: ep.color,
          },
        })
      }
    }
    initDots()

    let morphDone = false
    let morphFrame = 0

    function draw(frame = 0) {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#090a10'
      ctx.fillRect(0, 0, w, h)

      // Stars
      for (const s of stars) {
        ctx.globalAlpha = s.alpha + Math.sin(frame * 0.01 + s.x * 0.01 + s.y * 0.01) * 0.12
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = '#e0eaff'
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Morph dots to earth positions
      if (!morphDone) {
        morphFrame++
        let allArrived = true
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i]
          const tx = d.earth.x
          const ty = d.earth.y
          if (frame > d.delay) {
            const dx = tx - d.x
            const dy = ty - d.y
            d.vx += dx * 0.012
            d.vy += dy * 0.012
            d.vx *= 0.82
            d.vy *= 0.82
            d.x += d.vx
            d.y += d.vy
            if (Math.abs(dx) > 0.8 || Math.abs(dy) > 0.8) allArrived = false
          } else {
            allArrived = false
          }
        }
        if (allArrived || morphFrame > 220) {
          morphDone = true
        }
      } else {
        // Animate earth rotation
        earthRotation += 0.012
        const earthPoints = earthShapePoints(earthRotation)
        for (let i = 0; i < dots.length; i++) {
          dots[i].earth.x = earthPoints[i].x
          dots[i].earth.y = earthPoints[i].y
          dots[i].earth.color = earthPoints[i].color
          // Smoothly follow new earth position
          dots[i].x += (dots[i].earth.x - dots[i].x) * 0.16
          dots[i].y += (dots[i].earth.y - dots[i].y) * 0.16
          dots[i].color = dots[i].earth.color
        }
      }

      // Draw dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]
        const pulse = 0.7 + 0.3 * Math.sin(frame * 0.09 + d.phase + i * 0.2)
        ctx.beginPath()
        ctx.arc(d.x, d.y, 1.3 + 0.7 * pulse, 0, Math.PI * 2)
        ctx.globalAlpha = 0.7 * (0.7 + 0.4 * pulse)
        ctx.fillStyle = d.color
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 7 * pulse
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.shadowBlur = 0
      }

      // Earth outline & orbit
      ctx.save()
      ctx.globalAlpha = 0.18
      ctx.beginPath()
      ctx.arc(cx, cy, earthRadius + 8, 0, Math.PI * 2)
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 4
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 18
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.globalAlpha = 0.13
      ctx.beginPath()
      for (let t = 0; t <= 1.001; t += 0.01) {
        const { x, y } = getOrbitPath(t)
        if (t === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 2
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.restore()

      // Orbiting satellite dot
      const orbitT = ((frame * 0.003) % 1)
      const { x: ox, y: oy } = getOrbitPath(orbitT)
      ctx.beginPath()
      ctx.arc(ox, oy, 7, 0, Math.PI * 2)
      ctx.globalAlpha = 0.85
      ctx.fillStyle = '#7dd3fc'
      ctx.shadowColor = '#7dd3fc'
      ctx.shadowBlur = 18
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      raf = requestAnimationFrame(() => draw(frame + 1))
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <section className="relative w-full flex items-center justify-center min-h-[100vh] h-[100dvh] overflow-hidden bg-[#090a10]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-32 w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight font-sans text-white drop-shadow-xl">
          Elevate Your Work.<br />
          <span className="font-semibold text-white bg-none">Hire AI-Powered Talent</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium">
          Discover, hire, and collaborate with the next generation of AI freelancers and digital creators.
          <span className="block mt-2 text-blue-200/80 italic">Your ideas, delivered smarter.</span>
        </p>
        <form
          className="flex justify-center w-full max-w-xl mx-auto mb-10 bg-[#181a23]/80 rounded-lg shadow backdrop-blur pointer-events-auto border border-blue-900"
          action="/browse"
          method="GET"
        >
          <input
            type="text"
            name="q"
            placeholder="Search for services (e.g. logo, chatbot, voiceover)..."
            className="w-full px-4 py-3 rounded-l-lg bg-transparent text-gray-100 placeholder-gray-400 border-none focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-r-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
          >
            Search
          </button>
        </form>
        <div className="flex gap-4 justify-center">
          <Link
            href="/browse"
            className="px-8 py-4 rounded-full font-bold text-xl shadow transition relative overflow-hidden border-0 focus:outline-none group animate-gradient-move-btn"
            style={{ background: 'linear-gradient(90deg, #2563eb, #38bdf8, #2563eb)', backgroundSize: '200% 200%' }}
          >
            <span className="relative z-10 text-white">Browse Services</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            href="/seller/gigs/new"
            className="px-8 py-4 rounded-full font-bold text-xl shadow transition relative overflow-hidden border-0 focus:outline-none group animate-gradient-move-btn"
            style={{ background: 'linear-gradient(90deg, #38bdf8, #2563eb, #38bdf8)', backgroundSize: '200% 200%' }}
          >
            <span className="relative z-10 text-white">Start Selling</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* HOW IT WORKS - smooth, thin, hand-drawn animated line, more natural */
function HowItWorks() {
  const pathRef = useRef<SVGPathElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            path.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.2,.9,.3,1)'
            path.style.strokeDashoffset = '0'
            setDrawn(true)
          }
        })
      },
      { threshold: 0.3 }
    )
    if (containerRef.current) io.observe(containerRef.current)
    return () => io.disconnect()
  }, [])

  const steps = [
    { n: 1, title: 'Find your service', desc: 'Search curated gigs across design, AI, and media.' },
    { n: 2, title: 'Order & pay', desc: 'Clear scopes, secure payments, and milestone tracking.' },
    { n: 3, title: 'Collaborate', desc: 'Built-in workspace for files, chat and feedback.' },
    { n: 4, title: 'Receive & review', desc: 'Approve delivery or request revisions quickly.' },
  ]

  return (
    <section ref={containerRef} className="relative max-w-6xl mx-auto px-4 py-20 mt-10">
      <h2 className="text-3xl font-bold mb-10 text-center text-blue-200">How it works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="col-span-1 flex flex-col gap-8">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                  drawn ? 'bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white shadow-lg' : 'bg-[#07102a] border-2 border-[#1e3a8a] text-blue-200'
                } transition-all duration-500`}
                aria-hidden
              >
                {s.n}
              </div>
              <div>
                <div className="font-semibold text-white">{s.title}</div>
                <div className="text-slate-300">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <svg viewBox="0 0 360 360" className="w-full max-w-[420px]" aria-hidden>
            <path
              ref={pathRef}
              d="M40 120 Q120 40 180 120 Q240 200 320 120 Q340 100 320 180 Q300 260 180 240 Q60 220 120 320 Q180 360 320 320"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 4px #38bdf8bb)',
                strokeDasharray: undefined,
                strokeDashoffset: undefined,
              }}
            />
            {drawn && <AnimatedDot pathRef={pathRef} />}
          </svg>
        </div>
        <div className="col-span-1">
          <div className="rounded-2xl bg-gradient-to-br from-blue-900 via-[#0b1220] to-[#07102a] border border-blue-900 shadow-lg p-8">
            <div className="text-xl font-semibold text-blue-200 mb-2">Simple, Fast, Secure</div>
            <div className="text-slate-300">Humanae guides you from brief to delivery with clear milestones and quality checks.</div>
            <div className="mt-6 grid gap-3">
              <div className="p-3 rounded-lg bg-[#08182f] border border-[#123055]">Verified sellers</div>
              <div className="p-3 rounded-lg bg-[#08182f] border border-[#123055]">24/7 support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Animated dot that moves smoothly along the SVG path
function AnimatedDot({ pathRef }: { pathRef: React.RefObject<SVGPathElement> }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let frame = 0
    let raf: number
    function animate() {
      const path = pathRef.current
      if (!path) return
      const length = path.getTotalLength()
      const t = (frame % 400) / 400
      const point = path.getPointAtLength(length * t)
      setPos({ x: point.x, y: point.y })
      raf = requestAnimationFrame(() => {
        frame++
        animate()
      })
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [pathRef])

  return (
    <circle
      cx={pos.x}
      cy={pos.y}
      r="6"
      fill="#38bdf8"
      opacity="0.85"
      style={{
        filter: 'drop-shadow(0 0 8px #38bdf8cc)',
        transition: 'cx 0.1s, cy 0.1s',
      }}
    />
  )
}

/* WHY HUMANAE — refined card grid */
function WhyHumanae() {
  const items = [
    {
      title: 'Curated Talent',
      desc: 'Top performers only. We vet portfolios, reviews and delivery history.',
    },
    {
      title: 'AI-assisted Workflows',
      desc: 'Faster iterations with AI tooling while humans ensure quality.',
    },
    {
      title: 'Transparent Pricing',
      desc: 'Clear fees and milestone-based payments. No surprises.',
    },
    {
      title: 'Global, Reliable Support',
      desc: 'Multilingual team and SLA-backed support for important projects.',
    },
  ]
  return (
    <section className="relative max-w-6xl mx-auto px-4 py-20 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-200">Why choose humanae</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it) => (
          <div key={it.title} className="p-6 rounded-2xl bg-[#071124] border border-[#123055] shadow hover:translate-y-[-4px] transition-transform">
            <div className="text-blue-300 text-2xl mb-3">✓</div>
            <div className="font-semibold text-white">{it.title}</div>
            <div className="text-slate-300 mt-2">{it.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* FAQ — answers hidden until click; default closed */
function FAQSection() {
  const faqs = [
    { q: 'How do payments work?', a: 'You pay securely via our gateway. Funds are held until you accept delivery.' },
    { q: 'What if I need revisions?', a: 'Most sellers include revisions; you can request changes via the order workspace.' },
    { q: 'Do you offer refunds?', a: 'We have a satisfaction policy. Contact support and we will review your case.' },
    { q: 'Can I hire a team?', a: 'Yes. Post a brief or work with multiple sellers to assemble a team.' },
  ]
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative max-w-5xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8 text-center text-white">Frequently asked questions</h2>
      <div className="space-y-4">
        {faqs.map((f, idx) => (
          <div key={f.q} className="bg-[#07102a] border border-[#102948] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              className="w-full text-left px-6 py-4 flex justify-between items-center"
            >
              <div className="font-medium text-white">{f.q}</div>
              <div className="text-blue-300 text-2xl" aria-hidden>
                {open === idx ? '−' : '+'}
              </div>
            </button>
            <div
              className="px-6 pb-4 text-slate-300 faq-answer"
              style={{
                maxHeight: open === idx ? 240 : 0,
                opacity: open === idx ? 1 : 0,
              }}
            >
              <div>{f.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* Reviews */
function Reviews({ current, setCurrent }: { current: number; setCurrent: (n: number) => void }) {
  return (
    <section className="relative max-w-2xl mx-auto px-4 py-20 mt-10">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-blue-200 tracking-tight">What People Are Saying</h2>
      <div className="relative bg-[#181a23] rounded-2xl shadow-xl border border-blue-900 p-8 flex flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <img src={reviews[current].avatar} alt={reviews[current].name} className="w-20 h-20 rounded-full object-cover border-4 border-blue-900 mb-4" />
          <div className="flex gap-1 mb-2 justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < reviews[current].rating ? 'text-yellow-400 text-xl' : 'text-gray-700 text-xl'}>★</span>
            ))}
          </div>
          <p className="text-lg text-gray-200 mb-4 font-medium">&ldquo;{reviews[current].text}&rdquo;</p>
          <div className="font-semibold text-blue-400">{reviews[current].name}</div>
          <div className="text-gray-400 text-sm">{reviews[current].role}</div>
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={() => setCurrent((current - 1 + reviews.length) % reviews.length)} aria-label="Previous review" className="w-10 h-10 rounded-full bg-blue-900 text-blue-200 hover:bg-blue-800 flex items-center justify-center text-2xl font-bold transition">‹</button>
          <button onClick={() => setCurrent((current + 1) % reviews.length)} aria-label="Next review" className="w-10 h-10 rounded-full bg-blue-900 text-blue-200 hover:bg-blue-800 flex items-center justify-center text-2xl font-bold transition">›</button>
        </div>
        <div className="flex gap-2 mt-4">
          {reviews.map((_, idx) => (
            <button key={idx} onClick={() => setCurrent(idx)} className={`w-3 h-3 rounded-full ${idx === current ? 'bg-blue-400' : 'bg-blue-900'} transition`} aria-label={`Go to review ${idx + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* Footer with big name and animated hover effect */
function Footer() {
  return (
    <footer className="relative bg-[#00060b] mt-20 border-t border-[#0b2a59]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="text-2xl font-extrabold text-white">humanae</div>
          <div className="text-slate-300">AI-powered freelance marketplace</div>
          <div className="flex gap-3 mt-4">
            <a className="text-slate-400 hover:text-blue-300" href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a className="text-slate-400 hover:text-blue-300" href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="text-slate-400 hover:text-blue-300" href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-200 mb-4">Products</h5>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/browse">Browse</Link></li>
            <li><Link href="/seller/gigs/new">For Sellers</Link></li>
            <li><Link href="/enterprise">Enterprise</Link></li>
            <li><Link href="/api">API</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-200 mb-4">Company</h5>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/press">Press</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-sm font-semibold text-slate-200 mb-4">Support</h5>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/security">Security</Link></li>
          </ul>
        </div>
      </div>
      <div className="bg-[#02030a] border-t border-[#07204a] py-12 flex items-center justify-center">
        <div className="relative">
          <div className="footer-word relative group cursor-pointer select-none">
            <span className="text-4xl md:text-5xl font-extrabold tracking-tight text-white block z-10 relative">humanae</span>
            <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
              <span className="w-56 h-16 rounded-full bg-gradient-to-r from-[#122a66] via-[#1e3a8a] to-[#0769d6] opacity-30 blur-3xl transform transition-all duration-500 group-hover:scale-105 group-hover:translate-y-[-6px]"></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* Global styles for animations and small helpers */
function GlobalStyles() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view')
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
  return (
    <style jsx global>{`
      :root { --accent: #2563eb; --soft: #07102a; }
      html, body { height: 100%; }
      @keyframes gradient-move-btn {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient-move-btn { animation: gradient-move-btn 3s ease-in-out infinite; }
      .footer-word { transition: transform 360ms cubic-bezier(.2,.9,.3,1); }
      .footer-word:hover { transform: translateY(-6px) scale(1.01); }
      .footer-word span { transition: filter 0.4s, opacity 0.4s; }
      .reveal { opacity: 0; transform: translateY(12px); transition: opacity 600ms cubic-bezier(.2,.9,.3,1), transform 600ms cubic-bezier(.2,.9,.3,1); }
      .reveal.in-view { opacity: 1; transform: translateY(0); }
      .faq-answer { transition: max-height 420ms ease, opacity 300ms ease; overflow: hidden; }
      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,var(--accent),#0ea5e9); border-radius: 10px; }
      ::-webkit-scrollbar-track { background: #07102a; }
      img { display: block; }
    `}</style>
  )
}

/* Scroll reveal hook */
function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'))
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('in-view')
        })
      },
      { threshold: 0.12 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}