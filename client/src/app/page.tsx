'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createSupabaseBrowser } from './api/lib/supabaseBrowser'

const reviews = [
  {
    name: 'Sarah A.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Humanaira made it so easy to find the perfect freelancer for my project. Fast, reliable, and great support!',
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
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    const interval = setInterval(() => setCurrent((c) => (c + 1) % reviews.length), 5000)
    return () => {
      clearInterval(interval)
      listener?.subscription.unsubscribe()
    }
  }, [])

  useScrollReveal()

  return (
    <main className="min-h-screen bg-[#090a10] text-gray-100 font-inter">
      <Header user={user} />
      <Hero />
      <HowItWorks />
      <WhyHumanaira />
      <FAQSection />
      <Reviews current={current} setCurrent={setCurrent} />
      <Footer />
      <GlobalStyles />
    </main>
  )
}

function Header({ user }: { user: any }) {
  return (
    <header className="w-full px-8 py-5 flex items-center justify-between bg-[#090a10] border-b border-[#1e293b] z-30 fixed top-0 left-0 right-0 h-[72px]">
      <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-white select-none">
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
        <Link href="/browse" className="text-blue-200 hover:text-blue-400 font-medium">Browse</Link>
        <Link href="/seller/gigs/new" className="text-blue-200 hover:text-blue-400 font-medium">Start Selling</Link>
        <Link href="/enterprise" className="text-blue-200 hover:text-blue-400 font-medium">Enterprise</Link>
        <Link href="/help" className="text-blue-200 hover:text-blue-400 font-medium">Help</Link>
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
function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize, { passive: true });

    // Static stars
    const stars: { x: number; y: number; r: number; alpha: number }[] = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 0.7 + 0.15,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    // Planet parameters
    const planetRadius = Math.min(w, h) * 0.32;
    const cx = w * 0.62;
    const cy = h * 0.52;

    // Orbiting energy lines parameters
    const energyLines = [
      { color: "#a78bfa", width: 2.5, radius: planetRadius * 0.95, speed: 0.008, phase: 0 },
      { color: "#f472b6", width: 2, radius: planetRadius * 1.05, speed: -0.006, phase: Math.PI / 2 },
      { color: "#38bdf8", width: 2, radius: planetRadius * 1.12, speed: 0.004, phase: Math.PI },
    ];

    let raf = 0;
    function draw(frame = 0) {
      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#0a1020");
      grad.addColorStop(0.5, "#07102a");
      grad.addColorStop(1, "#1a2a55");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Static stars
      for (const s of stars) {
        ctx.globalAlpha = s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "#e0eaff";
        ctx.shadowColor = "#7dd3fc";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // Shiny, glassy planet
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, planetRadius, 0, Math.PI * 2);
      ctx.closePath();
      // More shiny radial gradient
      const planetGrad = ctx.createRadialGradient(cx, cy, planetRadius * 0.05, cx, cy, planetRadius);
      planetGrad.addColorStop(0, "rgba(255,255,255,0.35)");
      planetGrad.addColorStop(0.18, "rgba(56,189,248,0.28)");
      planetGrad.addColorStop(0.35, "rgba(168,139,250,0.38)");
      planetGrad.addColorStop(0.55, "rgba(244,114,182,0.45)");
      planetGrad.addColorStop(0.75, "rgba(168,139,250,0.52)");
      planetGrad.addColorStop(0.9, "rgba(56,189,248,0.65)");
      planetGrad.addColorStop(1, "rgba(56,189,248,0.85)");
      ctx.fillStyle = planetGrad;
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 120;
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.restore();

      // Animated energy lines (orbiting)
      energyLines.forEach((line, idx) => {
        ctx.save();
        ctx.globalAlpha = 0.65;
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.shadowColor = line.color;
        ctx.shadowBlur = 22;
        ctx.beginPath();
        for (let t = 0; t <= 1.001; t += 0.01) {
          const angle = t * 2 * Math.PI + frame * line.speed + line.phase;
          const wave = Math.sin(angle * 2 + frame * 0.02 + idx * 1.2) * (planetRadius * 0.06);
          const r = line.radius + wave;
          const x = cx + r * Math.cos(angle);
          const y = cy + r * Math.sin(angle);
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      });

      // Smooth highlight swirl (glass reflection)
      ctx.save();
      ctx.globalAlpha = 0.38;
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 6 + Math.sin(frame * 0.008) * 0.2);
      ctx.beginPath();
      ctx.ellipse(0, 0, planetRadius * 0.7, planetRadius * 0.22, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.shadowColor = "#f472b6";
      ctx.shadowBlur = 60;
      ctx.fill();
      ctx.restore();

      // Soft edge glow
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(cx, cy, planetRadius + 14, 0, Math.PI * 2);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 7;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 28;
      ctx.stroke();
      ctx.restore();

      // Orbiting orb (blue, smooth)
      const orbitRadius = planetRadius * 1.18;
      const orbitY = planetRadius * 0.92;
      const orbitT = ((frame * 0.003) % 1);
      const angle = orbitT * 2 * Math.PI;
      const orbX = cx + orbitRadius * Math.cos(angle);
      const orbY = cy + orbitY * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(orbX, orbY, 12, 0, Math.PI * 2);
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = "#7dd3fc";
      ctx.shadowColor = "#7dd3fc";
      ctx.shadowBlur = 32;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(() => draw(frame + 1));
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Hero section covers full viewport minus header
  return (
    <section
      className="relative w-full flex items-center justify-center bg-[#090a10] overflow-hidden"
      style={{
        minHeight: 'calc(100vh - 72px)',
        height: 'calc(100vh - 72px)',
        paddingTop: '72px',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-0 w-full"
        style={{
          minHeight: 'calc(100vh - 72px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight font-sans text-white drop-shadow-xl">
          Elevate Your Work.<br />
          <span className="font-semibold text-white bg-none">Hire AI-Powered Talent</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-medium">
          Discover, hire, and collaborate with the next generation of AI freelancers and digital creators.
          <span className="block mt-2 text-blue-200/80 italic">Your ideas, delivered smarter.</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/browse"
            className="btn-future px-7 py-3 rounded-md font-bold text-lg shadow-lg transition border border-blue-700 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none"
          >
            Browse Services
          </Link>
          <Link
            href="/seller/gigs/new"
            className="btn-future px-7 py-3 rounded-md font-bold text-lg shadow-lg transition border border-blue-700 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none"
          >
            Start Selling
          </Link>
        </div>
      </div>
      <style jsx global>{`
        .btn-future {
          position: relative;
          box-shadow: 0 0 18px 0 #38bdf855, 0 2px 8px #0ea5e9cc;
          transition: box-shadow 0.3s, transform 0.3s, background 0.3s;
        }
        .btn-future:hover {
          box-shadow: 0 0 32px 0 #38bdf8cc, 0 2px 16px #2563eb99;
          transform: translateY(-2px) scale(1.04);
        }
      `}</style>
    </section>
  );
}

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
    <section className="w-full py-16 px-4 bg-[#090a10] border-t border-[#1e293b]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-extrabold text-blue-200 mb-8 text-center">How it works</h2>
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
    <section className="relative max-w-6xl mx-auto px-4 py-20 mt-10">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-200">Why choose humanaira</h2>
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

function Footer() {
  return (
    <footer className="w-full bg-[#00060b] mt-20 border-t border-[#0b2a59]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="text-2xl font-extrabold text-white">
            <FooterLogo />
          </div>
          <div className="text-slate-300">AI-powered freelance marketplace</div>
          <div className="flex gap-3 mt-4">
            <a className="text-slate-400 hover:text-blue-300" href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a className="text-slate-400 hover:text-blue-300" href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="text-slate-400 hover:text-blue-300" href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <h5 className="text-sm font-semibold text-slate-200 mb-4">Products</h5>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/browse">Browse</Link></li>
            <li><Link href="/seller/gigs/new">For Sellers</Link></li>
            <li><Link href="/enterprise">Enterprise</Link></li>
            <li><Link href="/api">API</Link></li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <h5 className="text-sm font-semibold text-slate-200 mb-4">Company</h5>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/press">Press</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <h5 className="text-sm font-semibold text-slate-200 mb-4">Support</h5>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/security">Security</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

function FooterLogo() {
  const underlineRef = useRef<SVGPathElement | null>(null)

  useEffect(() => {
    const path = underlineRef.current
    if (!path) return
    const length = path.getTotalLength()
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`
    setTimeout(() => {
      path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.2,.9,.3,1)'
      path.style.strokeDashoffset = '0'
    }, 400)
  }, [])

  return (
    <span
      className="relative flex items-center select-none"
      style={{
        letterSpacing: '-0.04em',
        textShadow: '0 2px 8px #0f172a',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 800,
        fontSize: '2rem',
        lineHeight: 1,
      }}
    >
      <span style={{ color: '#2563eb' }}>hum</span>
      <span style={{ color: '#fff' }}>an</span>
      <span style={{ color: '#fff', position: 'relative', zIndex: 2 }}>
        <span style={{ color: '#fff', fontWeight: 800 }}>a</span>
        <span style={{ color: '#fff', fontWeight: 800, background: 'linear-gradient(90deg,#fff,#38bdf8 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>i</span>
      </span>
      <span style={{ color: '#38bdf8' }}>ra</span>
      <svg
        width={120}
        height={18}
        viewBox="0 0 120 18"
        className="absolute left-0"
        style={{ bottom: -8, zIndex: 1 }}
        aria-hidden
      >
        <path
          ref={underlineRef}
          d="M8 12 Q40 20 80 10 Q110 2 118 14"
          fill="none"
          stroke="#38bdf8"
          strokeWidth={2.2}
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 6px #38bdf8cc)',
            strokeDasharray: undefined,
            strokeDashoffset: undefined,
          }}
        />
        <FooterMovingOrb />
      </svg>
      <span className="inline-block align-middle ml-2 w-2.5 h-2.5 rounded-full bg-blue-700 animate-pulse shadow-lg"></span>
    </span>
  )
}

function FooterMovingOrb() {
  const orbRef = useRef<SVGCircleElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)

  useEffect(() => {
    if (!orbRef.current) return
    const svg = orbRef.current.ownerSVGElement
    if (!svg) return
    const path = svg.querySelector('path')
    if (!path) return
    pathRef.current = path

    let frame = 0
    let raf: number
    function animate() {
      const length = path.getTotalLength()
      const t = (Math.sin(frame * 0.025) * 0.5 + 0.5) * 0.85 + 0.08
      const pt = path.getPointAtLength(length * t)
      orbRef.current!.setAttribute('cx', pt.x.toString())
      orbRef.current!.setAttribute('cy', pt.y.toString())
      raf = requestAnimationFrame(() => {
        frame++
        animate()
      })
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <circle
      ref={orbRef}
      r="4"
      fill="#38bdf8"
      opacity="0.85"
      style={{
        filter: 'drop-shadow(0 0 8px #38bdf8cc)',
        transition: 'cx 0.1s, cy 0.1s',
      }}
    />
  )
}

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