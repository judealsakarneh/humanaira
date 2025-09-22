'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createSupabaseBrowser } from './api/lib/supabaseBrowser'

// --- Main Home Page ---
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

  useScrollReveal()

  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter relative overflow-x-hidden">
      <Hero />
      <SectionDivider />
      <AIStats />
      <SectionDivider />
      <HowItWorks />
      <SectionDivider />
      <WhyHumanaira />
      <SectionDivider />
      <FAQSection />
      <Footer />
      <GlobalStyles />
      <BackgroundBrand />
    </main>
  )
}

// --- Header ---
function Header({ user }: { user: any }) {
  return (
    <header className="w-full px-8 py-5 flex items-center justify-between bg-[#090a10]/90 border-b border-[#1e293b] z-30 fixed top-0 left-0 right-0 h-[72px] backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-white select-none tracking-tight" style={{ letterSpacing: '-0.04em' }}>
        <span style={{ color: '#2563eb' }}>hum</span>
        <span style={{ color: '#fff' }}>an</span>
        <span style={{ color: '#fff', fontWeight: 800 }}>a</span>
        <span style={{
          color: '#fff',
          fontWeight: 800,
          background: 'linear-gradient(90deg,#fff,#38bdf8 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>i</span>
        <span style={{ color: '#38bdf8' }}>ra</span>
      </Link>
      <nav className="flex items-center gap-6">
        <Link href="/browse" className="text-blue-200 hover:text-blue-400 font-medium transition">Browse</Link>
        <Link href="/seller/gigs/new" className="text-blue-200 hover:text-blue-400 font-medium transition">Start Selling</Link>
        <Link href="/enterprise" className="text-blue-200 hover:text-blue-400 font-medium transition">Enterprise</Link>
        <Link href="/help" className="text-blue-200 hover:text-blue-400 font-medium transition">Help</Link>
        {user ? (
          <Link href="/account" className="ml-4">
            <Avatar email={user.email} />
          </Link>
        ) : (
          <>
            <Link href="/signin" className="ml-4 px-5 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">Sign In</Link>
            <Link href="/signup" className="ml-2 px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  )
}

function Avatar({ email }: { email: string }) {
  const hash = typeof window !== 'undefined' && email
    ? md5(email.trim().toLowerCase())
    : ''
  const url = email
    ? `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`
    : 'https://www.gravatar.com/avatar/?d=mp&s=40'
  return (
    <img
      src={url}
      alt="Account"
      className="w-10 h-10 rounded-full border-2 border-blue-700 bg-[#181a23] object-cover"
      style={{ minWidth: 40, minHeight: 40 }}
    />
  )
}

function md5(str: string) {
  function rhex(n: number) {
    const s = '0123456789abcdef'
    let j, str = ''
    for (j = 0; j < 4; j++)
      str += s.charAt((n >> (j * 8 + 4)) & 0x0F) + s.charAt((n >> (j * 8)) & 0x0F)
    return str
  }
  function str2blks_MD5(str: string) {
    let nblk = ((str.length + 8) >> 6) + 1, blks = new Array(nblk * 16).fill(0), i
    for (i = 0; i < str.length; i++)
      blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8)
    blks[i >> 2] |= 0x80 << ((i % 4) * 8)
    blks[nblk * 16 - 2] = str.length * 8
    return blks
  }
  function add(x: number, y: number) {
    return (((x & 0xFFFF) + (y & 0xFFFF)) ^ ((((x >> 16) + (y >> 16)) & 0xFFFF) << 16)) >>> 0
  }
  function rol(num: number, cnt: number) {
    return ((num << cnt) | (num >>> (32 - cnt))) >>> 0
  }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    return add(rol(add(add(a, q), add(x, t)), s), b)
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t)
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t)
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t)
  }
  let x = str2blks_MD5(str), a = 1732584193, b = -271733879, c = -1732584194, d = 271733878
  for (let i = 0; i < x.length; i += 16) {
    let olda = a, oldb = b, oldc = c, oldd = d
    a = ff(a, b, c, d, x[i + 0], 7, -680876936)
    d = ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = ff(c, d, a, b, x[i + 10], 17, -42063)
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329)
    a = gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = gg(b, c, d, a, x[i + 0], 20, -373897302)
    a = gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734)
    a = hh(a, b, c, d, x[i + 5], 4, -378558)
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = ii(a, b, c, d, x[i + 0], 6, 681279174)
    d = ii(d, a, b, c, x[i + 7], 10, -358537222)
    c = ii(c, d, a, b, x[i + 14], 15, -722521979)
    b = ii(b, c, d, a, x[i + 5], 21, 76029189)
    a = ii(a, b, c, d, x[i + 12], 6, -640364487)
    d = ii(d, a, b, c, x[i + 3], 10, -421815835)
    c = ii(c, d, a, b, x[i + 10], 15, 530742520)
    b = ii(b, c, d, a, x[i + 1], 21, -995338651)
    a = ii(a, b, c, d, x[i + 8], 6, -198630844)
    d = ii(d, a, b, c, x[i + 15], 10, 1126891415)
    c = ii(c, d, a, b, x[i + 6], 15, -1416354905)
    b = ii(b, c, d, a, x[i + 13], 21, -57434055)
    a = ii(a, b, c, d, x[i + 4], 6, 1700485571)
    d = ii(d, a, b, c, x[i + 11], 10, -1894986606)
    c = ii(c, d, a, b, x[i + 2], 15, -1051523)
    b = ii(b, c, d, a, x[i + 9], 21, -2054922799)
    a = add(a, olda)
    b = add(b, oldb)
    c = add(c, oldc)
    d = add(d, oldd)
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d)
}

// --- Hero Section ---
 function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [search, setSearch] = useState('')
  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter?.() : null

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

    const stars: { x: number; y: number; r: number; alpha: number }[] = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 0.7 + 0.15,
      alpha: Math.random() * 0.5 + 0.2,
    }))

    const planetRadius = Math.min(w, h) * 0.32
    const cx = w * 0.62
    const cy = h * 0.52

    const energyLines = [
      { color: "#38bdf8", width: 2.5, radius: planetRadius * 0.95, speed: 0.008, phase: 0 },
      { color: "#60a5fa", width: 2, radius: planetRadius * 1.05, speed: -0.006, phase: Math.PI / 2 },
      { color: "#38bdf8", width: 2, radius: planetRadius * 1.12, speed: 0.004, phase: Math.PI },
    ]

    let raf = 0
    function draw(frame = 0) {
      ctx.clearRect(0, 0, w, h)

      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, "#0a1020")
      grad.addColorStop(0.5, "#07102a")
      grad.addColorStop(1, "#1a2a55")
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      for (const s of stars) {
        ctx.globalAlpha = s.alpha
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = "#e0eaff"
        ctx.shadowColor = "#7dd3fc"
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.globalAlpha = 1

      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, planetRadius, 0, Math.PI * 2)
      ctx.closePath()
      const planetGrad = ctx.createRadialGradient(cx, cy, planetRadius * 0.05, cx, cy, planetRadius)
      planetGrad.addColorStop(0, "rgba(255,255,255,0.35)")
      planetGrad.addColorStop(0.18, "rgba(56,189,248,0.28)")
      planetGrad.addColorStop(0.35, "rgba(96,165,250,0.38)")
      planetGrad.addColorStop(0.55, "rgba(56,189,248,0.45)")
      planetGrad.addColorStop(0.75, "rgba(96,165,250,0.52)")
      planetGrad.addColorStop(0.9, "rgba(56,189,248,0.65)")
      planetGrad.addColorStop(1, "rgba(56,189,248,0.85)")
      ctx.fillStyle = planetGrad
      ctx.shadowColor = "#fff"
      ctx.shadowBlur = 120
      ctx.globalAlpha = 1
      ctx.fill()
      ctx.restore()

      energyLines.forEach((line, idx) => {
        ctx.save()
        ctx.globalAlpha = 0.65
        ctx.strokeStyle = line.color
        ctx.lineWidth = line.width
        ctx.shadowColor = line.color
        ctx.shadowBlur = 22
        ctx.beginPath()
        for (let t = 0; t <= 1.001; t += 0.01) {
          const angle = t * 2 * Math.PI + frame * line.speed + line.phase
          const wave = Math.sin(angle * 2 + frame * 0.02 + idx * 1.2) * (planetRadius * 0.06)
          const r = line.radius + wave
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          if (t === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.restore()
      })

      ctx.save()
      ctx.globalAlpha = 0.38
      ctx.translate(cx, cy)
      ctx.rotate(Math.PI / 6 + Math.sin(frame * 0.008) * 0.2)
      ctx.beginPath()
      ctx.ellipse(0, 0, planetRadius * 0.7, planetRadius * 0.22, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.shadowColor = "#38bdf8"
      ctx.shadowBlur = 60
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.globalAlpha = 0.18
      ctx.beginPath()
      ctx.arc(cx, cy, planetRadius + 14, 0, Math.PI * 2)
      ctx.strokeStyle = "#38bdf8"
      ctx.lineWidth = 7
      ctx.shadowColor = "#38bdf8"
      ctx.shadowBlur = 28
      ctx.stroke()
      ctx.restore()

      const orbitRadius = planetRadius * 1.18
      const orbitY = planetRadius * 0.92
      const orbitT = ((frame * 0.003) % 1)
      const angle = orbitT * 2 * Math.PI
      const orbX = cx + orbitRadius * Math.cos(angle)
      const orbY = cy + orbitY * Math.sin(angle)
      ctx.beginPath()
      ctx.arc(orbX, orbY, 12, 0, Math.PI * 2)
      ctx.globalAlpha = 0.95
      ctx.fillStyle = "#7dd3fc"
      ctx.shadowColor = "#7dd3fc"
      ctx.shadowBlur = 32
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
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      if (router && typeof router.push === 'function') {
        router.push(`/browse?q=${encodeURIComponent(search.trim())}`)
      } else {
        window.location.href = `/browse?q=${encodeURIComponent(search.trim())}`
      }
    }
  }

  return (
    <section
      className="relative w-full flex items-center justify-center bg-[#090a10] overflow-hidden"
      style={{
        minHeight: 'calc(100vh - 80px)',
        height: 'calc(100vh - 80px)',
        paddingTop: '80px',
      }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=Manrope:wght@800&family=DM+Sans:wght@700&family=Pacifico:wght@400&display=swap');
      `}</style>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-0 w-full"
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1
          className="mb-5 leading-tight tracking-tight drop-shadow-xl"
          style={{
            fontFamily: "'Inter', 'Manrope', 'DM Sans', Arial, sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 7vw, 4.2rem)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: '#fff',
            marginBottom: '0.5rem',
            textShadow: '0 4px 32px #38bdf855, 0 2px 8px #0ea5e9cc',
          }}
        >
          Elevate Your Next Project <br />
          <span
            style={{
              fontFamily: "'Pacifico', cursive",
              color: '#38bdf8',
              fontWeight: 400,
              fontSize: '1.1em',
              letterSpacing: '0.01em',
              background: 'none',
              WebkitBackgroundClip: 'unset',
              WebkitTextFillColor: 'unset',
              filter: 'none',
              verticalAlign: 'middle',
              padding: '0 0.1em',
              display: 'inline-block',
            }}
          >
            with Humanaira
          </span>
        </h1>
        <p
          className="text-base md:text-xl mb-3 max-w-2xl mx-auto font-medium"
          style={{
            fontFamily: "'Inter', 'Manrope', 'DM Sans', Arial, sans-serif",
            color: '#e0eaff',
            fontWeight: 600,
            letterSpacing: '0.01em',
            fontSize: '1.25rem',
            textShadow: '0 2px 12px #10131e99',
          }}
        >
          Discover, hire, and collaborate with the next generation of AI freelancers and digital creators.
        </p>
<div
  className="mb-8 italic text-blue-200 text-xl"
  style={{ opacity: 0.85 }}
>
  Your ideas, delivered smarter.
</div>
        <form
          onSubmit={handleSearch}
          className="w-full max-w-md mx-auto flex items-center justify-center bg-[#181a23] rounded-xl shadow border border-blue-800 px-3 py-2"
          style={{ marginBottom: '1.5rem' }}
        >
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for services, gigs, or talent..."
            className="flex-1 bg-transparent border-none outline-none text-white text-base px-2 py-2 placeholder:text-blue-200 placeholder:font-normal placeholder:text-opacity-60"
            style={{ minWidth: 0, fontWeight: 400, fontSize: '0.98rem' }}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition text-sm"
            style={{ fontSize: '0.98rem' }}
          >
            Search
          </button>
        </form>
        <div className="mt-3">
          <Link
            href="/browse"
            className="inline-block px-6 py-2 rounded-lg bg-[#101a2a] border border-blue-800 text-blue-200 font-semibold text-base shadow hover:bg-blue-900/60 hover:text-white transition-all duration-200"
            style={{
              boxShadow: '0 2px 12px #2563eb22',
              letterSpacing: '0.01em',
              fontSize: '0.98rem',
            }}
          >
            Browse All Services
          </Link>
        </div>
      </div>
    </section>
  )
}

// --- Section Divider ---
function SectionDivider() {
  return (
    <div className="w-full flex justify-center items-center py-0 relative">
      <div className="w-2/3 h-[1.5px] bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-60 my-0" />
    </div>
  )
}

// --- AI Stats Section ---
function AIStats() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-24 bg-[#0b1220] overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center tracking-tight">
          The Rise of AI Freelancers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <FactCard
            stat="+70%"
            label="AI Freelance Job Growth"
            desc="AI-related freelance jobs have grown by 70% since 2023. (Upwork, 2024)"
          />
          <FactCard
            stat="82%"
            label="Companies Hiring AI Talent"
            desc="82% of companies plan to increase their use of AI freelancers. (Gartner, 2025)"
          />
          <FactCard
            stat="3x"
            label="Faster Delivery"
            desc="AI-powered teams deliver projects 3x faster on average. (McKinsey, 2024)"
          />
          <FactCard
            stat="92%"
            label="Buyer Satisfaction"
            desc="92% of buyers report improved outcomes with AI freelancers. (Freelancer.com, 2024)"
          />
        </div>
        <div className="text-center text-blue-200 text-xl font-medium mt-8 max-w-2xl mx-auto">
          <span className="italic">AI freelancers are transforming how companies innovate, scale, and win.</span>
        </div>
      </div>
      <span
        className="absolute left-0 bottom-[-120px] text-[12vw] font-extrabold uppercase pointer-events-none select-none opacity-10"
        style={{
          fontFamily: "'Manrope', 'Inter', Arial, sans-serif",
          color: '#38bdf8',
          whiteSpace: 'nowrap',
          zIndex: 1,
          userSelect: 'none',
          letterSpacing: '-0.06em',
        }}
      >
        HUMANAIRA
      </span>
    </section>
  )
}

function FactCard({ stat, label, desc }: { stat: string; label: string; desc: string }) {
  return (
    <div className="bg-[#181a23] border border-blue-900 rounded-2xl p-8 flex flex-col items-center text-center shadow min-w-[220px] max-w-xs mx-auto">
      <div className="text-4xl md:text-5xl font-extrabold text-blue-400 mb-2">{stat}</div>
      <div className="text-lg font-semibold text-white mb-1">{label}</div>
      <div className="text-blue-200 text-base">{desc}</div>
    </div>
  )
}

// --- How It Works Section ---
function HowItWorks() {
  const points = [
    {
      icon: (
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#2563eb" opacity="0.15" />
          <path d="M11 19l5 5 9-12" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Verified Sellers",
      desc: "All sellers are vetted for quality and expertise, so you get the best results.",
    },
    {
      icon: (
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#2563eb" opacity="0.15" />
          <path d="M18 10v8l6 3" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "24/7 Support",
      desc: "Our team is here to help you anytime, day or night.",
    },
    {
      icon: (
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#2563eb" opacity="0.15" />
          <path d="M12 18h12" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      title: "Instant Messaging",
      desc: "Chat instantly with freelancers and clients for smooth collaboration.",
    },
    {
      icon: (
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#2563eb" opacity="0.15" />
          <path d="M18 10a8 8 0 100 16 8 8 0 000-16z" stroke="#38bdf8" strokeWidth="2.5" />
        </svg>
      ),
      title: "Secure Payments",
      desc: "Your funds are protected until you approve the work delivered.",
    },
    {
      icon: (
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#2563eb" opacity="0.15" />
          <path d="M14 22l8-8M14 14h8v8" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Easy Revisions",
      desc: "Request changes easily and track progress with built-in tools.",
    },
    {
      icon: (
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#2563eb" opacity="0.15" />
          <path d="M18 10v16M10 18h16" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      title: "AI-Powered Tools",
      desc: "Boost productivity with integrated AI features for both buyers and sellers.",
    },
    {
      icon: (
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#2563eb" opacity="0.15" />
          <path d="M18 12v6h6" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Milestone Tracking",
      desc: "Track project milestones and progress with clear dashboards.",
    },
    {
      icon: (
        <svg width="36" height="36" fill="none" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="18" fill="#2563eb" opacity="0.15" />
          <path d="M12 24l12-12" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
      title: "Money-Back Guarantee",
      desc: "If you're not satisfied, we offer a money-back guarantee.",
    },
  ]
  return (
    <section className="w-full py-24 px-4 bg-[#090a10] border-t border-[#1e293b]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-blue-200 mb-12 text-center tracking-tight">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, idx) => (
            <div key={idx} className="flex-1 bg-[#181a23] border border-blue-900 rounded-2xl p-8 flex flex-col items-center text-center shadow">
              <div className="mb-4">{point.icon}</div>
              <h3 className="text-xl font-bold text-blue-100 mb-2">{point.title}</h3>
              <p className="text-blue-200 text-base">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- Why Humanaira Section ---
function WhyHumanaira() {
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
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-12 text-center text-blue-200 tracking-tight">Why choose humanaira</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((it) => (
          <div key={it.title} className="p-8 rounded-2xl bg-[#071124] border border-[#123055] shadow hover:translate-y-[-4px] transition-transform flex flex-col items-center text-center">
            <div className="text-blue-300 text-3xl mb-3">✓</div>
            <div className="font-semibold text-white text-lg">{it.title}</div>
            <div className="text-slate-300 mt-2">{it.desc}</div>
          </div>
        ))}
      </div>
      <span
        className="absolute right-[-10vw] top-1/2 -translate-y-1/2 text-[12vw] font-extrabold uppercase pointer-events-none select-none opacity-10"
        style={{
          fontFamily: "'Manrope', 'Inter', Arial, sans-serif",
          color: '#2563eb',
          whiteSpace: 'nowrap',
          zIndex: 1,
          userSelect: 'none',
          letterSpacing: '-0.06em',
        }}
      >
        HUMANAIRA
      </span>
    </section>
  )
}

// --- FAQ Section ---
function FAQSection() {
  const faqs = [
    { q: 'How do payments work?', a: 'You pay securely via our gateway. Funds are held until you accept delivery.' },
    { q: 'What if I need revisions?', a: 'Most sellers include revisions; you can request changes via the order workspace.' },
    { q: 'Do you offer refunds?', a: 'We have a satisfaction policy. Contact support and we will review your case.' },
    { q: 'Can I hire a team?', a: 'Yes. Post a brief or work with multiple sellers to assemble a team.' },
  ]
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative max-w-5xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-12 text-center text-white tracking-tight">Frequently asked questions</h2>
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

// --- Footer ---
function Footer() {
  return (
    <footer className="w-full bg-[#00060b] border-t border-[#0b2a59] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-12">
        {/* Logo and description */}
        <div className="flex flex-col items-start gap-3">
          <div className="text-4xl font-extrabold select-none" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.04em' }}>
            <span style={{ color: '#2563eb' }}>hum</span>
            <span style={{ color: '#fff' }}>an</span>
            <span style={{ color: '#fff', fontWeight: 800 }}>a</span>
            <span style={{ color: '#fff', fontWeight: 800 }}>i</span>
            <span style={{ color: '#2563eb' }}>ra</span>
          </div>
          <div className="text-slate-300 text-base max-w-xs mt-2">
            The next-generation AI-powered freelance marketplace. Built for professionals, by professionals.
          </div>
        </div>
        {/* Essential Links */}
        <div className="flex flex-col gap-4">
          <div className="text-blue-200 font-semibold mb-2 text-lg">Explore</div>
          <Link href="/blog" className="footer-link">Blog</Link>
          <Link href="/browse" className="footer-link">Browse</Link>
          <Link href="/help" className="footer-link">Help Center</Link>
        </div>
        {/* Social & Policy */}
        <div className="flex flex-col gap-4">
          <div className="text-blue-200 font-semibold mb-2 text-lg">Connect</div>
          <a className="footer-link" href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="footer-link" href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <Link href="/terms" className="footer-link">Terms</Link>
          <Link href="/privacy" className="footer-link">Privacy</Link>
        </div>
      </div>
      <div className="text-center text-slate-500 text-xs mt-12 opacity-70">
        &copy; {new Date().getFullYear()} Humanaira. All rights reserved.
      </div>
    </footer>
  )
}

// --- Transparent Brand Background for sections ---
function BackgroundBrand() {
  return (
    <>
      <span
        className="fixed left-[-10vw] top-[60vh] text-[18vw] font-extrabold uppercase pointer-events-none select-none opacity-5 z-0"
        style={{
          fontFamily: "'Manrope', 'Inter', Arial, sans-serif",
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
    </>
  )
}

// --- Global Styles ---
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
      body { margin: 0; padding: 0; }
      main { padding-top: 72px; }
      .footer-link {
        color: #b6d0f7;
        font-size: 1rem;
        font-weight: 500;
        padding: 0.25rem 0;
        text-decoration: none;
        transition: color 0.2s;
        display: block;
      }
      .footer-link:hover {
        color: #38bdf8;
      }
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

// --- Scroll Reveal Hook ---
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