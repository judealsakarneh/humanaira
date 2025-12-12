'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  CSSProperties,
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createSupabaseBrowser } from './api/lib/supabaseBrowser'

/* ---------------------------------------
   Simple intersection observer hook
--------------------------------------- */
const useInView = (threshold = 0.18) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return

    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

/* ---------------------------------------
   Parallax motion hook (glass float + drift)
--------------------------------------- */
function useParallaxMotion(strengthY = 24, strengthX = 12) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [style, setStyle] = useState<CSSProperties>({})

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = ref.current
    if (!el) return

    const handleScroll = () => {
      const rect = el.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1

      // Center of element relative to viewport center
      const centerDelta =
        rect.top + rect.height / 2 - viewportHeight / 2

      let progress = centerDelta / viewportHeight // roughly -1 to 1
      if (progress > 1) progress = 1
      if (progress < -1) progress = -1

      const translateY = -progress * strengthY
      const translateX = -progress * strengthX
      const scale = 1 + Math.abs(progress) * 0.04
      const opacity = 1 - Math.abs(progress) * 0.18

      setStyle({
        transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
        opacity,
        willChange: 'transform, opacity',
      })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [strengthY, strengthX])

  return { ref, style }
}

/* ---------------------------------------
   SECTION DIVIDER – subtle glowing line
--------------------------------------- */
function SectionDivider() {
  return (
    <div className="w-full flex justify-center items-center py-6 md:py-8 lg:py-10 relative">
      <div className="w-[72%] h-[1px] bg-gradient-to-r from-transparent via-[#35BFFF] to-transparent opacity-40" />
    </div>
  )
}

/* ---------------------------------------
   GlassyWater – ambient blur background
--------------------------------------- */
function GlassyWater() {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
          transformOrigin: 'center',
          mixBlendMode: 'screen',
          opacity: 0.45,
        }}
        className="glassy-water-layer"
      />
      <style jsx>{`
        .glassy-water-layer {
          background:
            radial-gradient(40% 30% at 10% 20%, rgba(53,191,255,0.06), transparent 12%),
            radial-gradient(30% 20% at 80% 80%, rgba(53,191,255,0.04), transparent 10%),
            linear-gradient(180deg, rgba(255,255,255,0.02), rgba(2,6,23,0.03));
          filter: blur(18px) saturate(120%);
          animation: waterFlow 14s linear infinite;
        }
        @keyframes waterFlow {
          0% { transform: translateY(0px) scale(1); opacity: 0.5; }
          50% { transform: translateY(-6px) scale(1.01); opacity: 0.42; }
          100% { transform: translateY(0px) scale(1); opacity: 0.5; }
        }
        @media (max-width: 640px) {
          .glassy-water-layer { filter: blur(10px) saturate(110%); animation-duration: 18s; }
        }
      `}</style>
    </>
  )
}

/* ---------------------------------------
   ScribbleLines – animated line orb
--------------------------------------- */
function ScribbleLines() {
  const paths = useMemo(() => {
    const seed = 7
    let s = seed
    const rand = () => (s = (s * 9301 + 49297) % 233280) / 233280
    const loops = 12
    const cx = 150
    const cy = 150

    const makePath = (i: number) => {
      const turns = 2.2 + (i % 3) * 0.2
      const rx = 50 + i * 3.6
      const ry = 30 + i * 2.4
      const jitter = 6 + i * 0.65
      const steps = 360
      let d = ''
      for (let k = 0; k <= steps; k++) {
        const t = (k / steps) * Math.PI * 2 * turns
        const n1 = (rand() - 0.5) * jitter
        const n2 = (rand() - 0.5) * jitter
        const x =
          cx +
          (rx + 3 * Math.sin(t * 3.1 + i)) * Math.cos(t) +
          n1 * 0.35
        const y =
          cy +
          (ry + 3 * Math.cos(t * 2.7 + i)) * Math.sin(t) +
          n2 * 0.35
        d +=
          k === 0
            ? `M ${x.toFixed(2)} ${y.toFixed(2)}`
            : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
      }
      return d
    }

    return Array.from({ length: loops }).map((_, i) => makePath(i))
  }, [])

  return (
    <div className="scribble-wrap" aria-hidden>
      <svg
        viewBox="0 0 300 300"
        className="scribble-svg"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Scribble lines"
      >
        <defs>
          <filter id="glowScribble" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="scribGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e9fbff" />
            <stop offset="55%" stopColor="#35BFFF" />
            <stop offset="100%" stopColor="#91e6ff" />
          </linearGradient>
        </defs>

        <g className="scribble-group" filter="url(#glowScribble)">
          {paths.map((d, idx) => (
            <path
              key={idx}
              d={d}
              fill="none"
              stroke={idx % 2 ? 'url(#scribGrad)' : 'rgba(53,191,255,0.65)'}
              strokeOpacity={0.85 - idx * 0.05}
              strokeWidth={idx < 2 ? 1.25 : 1}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="scribble-stroke"
              style={{ animationDelay: `${idx * 0.12}s` }}
            />
          ))}
        </g>
      </svg>

      <style jsx>{`
        .scribble-wrap {
          width: 340px;
          height: 340px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          background: radial-gradient(
            60% 60% at 50% 45%,
            rgba(53,191,255,0.08),
            rgba(3,6,16,0)
          );
          border-radius: 22px;
        }
        .scribble-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .scribble-group {
          animation: scribbleRotate 28s linear infinite;
          transform-origin: 150px 150px;
        }
        @keyframes scribbleRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .scribble-stroke {
          stroke-dasharray: 2.8 7;
          animation: dashDrift 10s linear infinite;
        }
        @keyframes dashDrift {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -220;
          }
        }
        @media (max-width: 640px) {
          .scribble-wrap {
            width: 280px;
            height: 280px;
          }
        }
      `}</style>
    </div>
  )
}

/* ---------------------------------------
   HERO — clean, premium, center
--------------------------------------- */
function Hero() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      const query = `/browse?q=${encodeURIComponent(search.trim())}`
      router.push(query)
    }
  }

  return (
    <section
      className="relative w-full flex items-center justify-center bg-gray-950"
      style={{ minHeight: 'calc(100vh - 72px)' }}
    >
      {/* subtle halo behind hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-260px] flex justify-center"
      >
        <div
          className="h-[380px] w-[520px] rounded-full blur-[110px]"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(53,191,255,0.42), transparent 65%)',
          }}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center relative">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-slate-300/80 shadow-sm mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          AI Freelancers · Automations · Agents · Analytics
        </p>

        <h1
          className="mb-3 leading-tight tracking-tight hero-headline"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 4.8rem)',
            lineHeight: 1.02,
          }}
        >
          Elevate Your Next Project
          <br />
          <span className="handwritten">with Humanaira</span>
        </h1>

        <div className="relative mt-3 mb-5">
          <div
            className="mx-auto h-[10px] w-[240px] rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(53,191,255,0.6), transparent)',
              filter: 'blur(8px)',
            }}
          />
          <div
            className="mx-auto h-px w-[260px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(53,191,255,0.45), transparent)',
            }}
          />
        </div>

        <p
          className="text-lg md:text-xl mb-8 max-w-3xl mx-auto font-medium text-slate-300"
          style={{ letterSpacing: '0.01em' }}
        >
          Discover, hire, and collaborate with the next generation of AI talent
          and digital creators — on a marketplace that looks and feels as sharp
          as the work you ship.
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl mx-auto flex items-center justify-center bg-gray-800/60 backdrop-blur-sm rounded-xl border border-[rgba(53,191,255,0.28)] p-2 mb-4"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for services, gigs, or talent..."
            className="flex-1 bg-transparent border-none outline-none text-white text-base px-3 py-3 placeholder:text-slate-400 placeholder:font-light"
            style={{
              minWidth: 0,
              fontSize: '1rem',
              fontFamily: 'Inter, system-ui',
            }}
          />
          <button
            type="submit"
            className="ml-2 px-6 py-3 rounded-lg bg-[#35BFFF] text-white font-semibold hover:bg-[#2fb2ff] transition text-base"
          >
            Search
          </button>
        </form>

        {/* quick tags under search */}
        <div className="flex flex-wrap gap-2 justify-center items-center text-[0.7rem] text-slate-400 mb-7">
          <span className="text-slate-400/90">Popular now:</span>
          <QuickTag label="AI customer support agents" setSearch={setSearch} />
          <QuickTag
            label="Notion + Zapier automations"
            setSearch={setSearch}
          />
          <QuickTag label="AI pitch deck design" setSearch={setSearch} />
        </div>

        {/* Main hero CTAs using persona language */}
        <div className="flex flex-wrap gap-4 justify-center items-center font-medium relative z-10">
          <Link
            href="/browse"
            className="inline-block px-5 py-2.5 rounded-lg bg-gray-800/80 border border-gray-700 text-[#35BFFF] hover:text-[#2fb2ff] hover:border-[rgba(53,191,255,0.28)] transition text-sm"
          >
            I need AI work done →
          </Link>
          <Link
            href="/seller/gigs/new"
            className="inline-block px-5 py-2.5 rounded-lg bg-[#35BFFF] border border-[#35BFFF]/30 text-white hover:bg-[#2fb2ff] transition text-sm"
          >
            I&apos;m an AI freelancer →
          </Link>
        </div>
      </div>
    </section>
  )
}

function QuickTag({
  label,
  setSearch,
}: {
  label: string
  setSearch: (val: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => setSearch(label)}
      className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[0.68rem] text-slate-300 hover:border-[#35BFFF]/70 hover:text-[#35BFFF] transition"
    >
      {label}
    </button>
  )
}

/* ---------------------------------------
   TrustedRow – simple credibility band
--------------------------------------- */
function TrustedRow() {
  const logos = ['Studios', 'Consultancies', 'Startups', 'E-commerce teams']

  return (
    <section className="mx-auto mt-6 w-full max-w-6xl px-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-[0.7rem] text-slate-400 md:px-6 md:py-4 md:text-xs">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          <span className="font-medium text-slate-200">
            Used by teams that care about craft.
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-slate-400/80">
          {logos.map((name) => (
            <span
              key={name}
              className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   PersonasStrip – I need AI work done / I am an AI freelancer
--------------------------------------- */
function PersonasStrip() {
  const { ref, inView } = useInView(0.25)
  return (
    <section
      ref={ref}
      className={`mx-auto mt-14 w-full max-w-6xl px-4 md:px-6 transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <PersonaCard
          title="I need AI work done"
          subtitle="Founders, operators, marketers, product teams."
          bullets={[
            'Ship agents & automations without hiring full-time.',
            'Brief freelancers clearly, track milestones, stay in control.',
            'Pay only for what ships — with escrow protection.',
          ]}
          primaryHref="/browse"
          primaryLabel="Browse AI services"
        />
        <PersonaCard
          title="I am an AI freelancer"
          subtitle="Engineers, analysts, designers, prompt experts."
          bullets={[
            'Package your skills into clear, bookable services.',
            'Showcase portfolio, reviews, and delivery speed.',
            'Withdraw earnings via Stripe to bank or PayPal (where supported).',
          ]}
          primaryHref="/seller/gigs/new"
          primaryLabel="Start selling today"
          accent
        />
      </div>
    </section>
  )
}

function PersonaCard(props: {
  title: string
  subtitle: string
  bullets: string[]
  primaryHref: string
  primaryLabel: string
  accent?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br px-5 py-5 md:px-6 md:py-6 ${
        props.accent
          ? 'border-[#35BFFF]/60 from-slate-950 via-slate-950 to-slate-900'
          : 'border-slate-800 from-slate-950 via-slate-950 to-slate-900/80'
      }`}
    >
      {props.accent && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#35BFFF]/15 blur-3xl"
        />
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-50 md:text-xl">
          {props.title}
        </h2>
        <p className="text-xs text-slate-400 md:text-sm">{props.subtitle}</p>
        <ul className="space-y-1.5 text-xs text-slate-300 md:text-sm">
          {props.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-[0.3rem] h-1.5 w-1.5 rounded-full bg-[#35BFFF]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="pt-3">
          <Link
            href={props.primaryHref}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium md:text-sm ${
              props.accent
                ? 'bg-[#35BFFF] text-slate-950 shadow-[0_0_25px_rgba(53,191,255,0.8)] hover:bg-sky-300'
                : 'border border-slate-600 text-slate-100 hover:border-[#35BFFF] hover:text-[#35BFFF]'
            } transition`}
          >
            {props.primaryLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------
   PlatformSignal – moved stats card with parallax
--------------------------------------- */
function PlatformSignalSection() {
  const { ref, style } = useParallaxMotion(26, 16)

  const data = [
    { label: 'Average response time', value: '2h' },
    { label: 'Projects completed', value: '1,200+' },
    { label: 'On-time delivery rate', value: '96%' },
    { label: 'Buyer satisfaction', value: '4.9 / 5' },
  ]

  return (
    <section className="mx-auto mt-14 w-full max-w-6xl px-4 md:px-6">
      <div
        ref={ref}
        style={style}
        className="relative mx-auto max-w-3xl rounded-3xl border border-white/8 bg-[radial-gradient(circle_at_top,rgba(53,191,255,0.18),rgba(15,23,42,1))] px-5 py-5 shadow-[0_26px_80px_rgba(15,23,42,1)]"
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <div className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Platform signal
            </div>
            <div className="text-xs text-slate-400">
              Snapshot from active AI projects
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1 border border-slate-700/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            <span className="text-[0.65rem] text-slate-300">
              Live projects in progress
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {data.map((d) => (
            <div
              key={d.label}
              className="rounded-2xl border border-slate-700/80 bg-slate-950/70 px-3 py-3"
            >
              <div className="text-[0.63rem] text-slate-400">{d.label}</div>
              <div className="text-sm font-semibold text-slate-50">
                {d.value}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-[#35BFFF]/35 bg-slate-950/80 px-3.5 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[0.7rem] text-slate-300">
              Teams use Humanaira for{' '}
              <span className="font-semibold text-slate-50">
                agents, automation, workflows &amp; AI content
              </span>
              .
            </div>
            <span className="rounded-full bg-[#35BFFF]/15 px-2.5 py-1 text-[0.6rem] font-medium text-[#35BFFF] border border-[#35BFFF]/40">
              Humans + AI
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   ServiceShowcase – scribble orb section
--------------------------------------- */
function ServiceShowcase() {
  const advantages = [
    {
      title: 'Faster Delivery',
      desc: 'Automate repetitive tasks and iterate faster to hit deadlines.',
    },
    {
      title: 'Lower Cost',
      desc: 'Reduce manual hours and optimize resource allocation.',
    },
    {
      title: 'Scale Effortlessly',
      desc: 'Spin up campaigns, media, and experiments at scale.',
    },
    {
      title: 'Consistent Output',
      desc: 'Maintain brand tone and quality across deliverables.',
    },
  ]

  const disadvantages = [
    {
      title: 'Slower Time-to-Market',
      desc: 'Manual workflows are more error-prone and slower.',
    },
    {
      title: 'Higher Operational Cost',
      desc: 'More human hours required for the same output.',
    },
    {
      title: 'Limited Scalability',
      desc: 'Harder to run multiple experiments or versions.',
    },
    {
      title: 'Inconsistent Quality',
      desc: 'Human variation and fatigue introduce inconsistencies.',
    },
  ]

  return (
    <section className="relative w-full py-20 md:py-24 bg-gradient-to-b from-[#030712] via-[#040816] to-[#02020a] overflow-hidden">
      <GlassyWater />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left">
            <h2
              className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight"
              style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
            >
              Services delivered — visible, fast, reliable.
            </h2>

            <p className="text-sm md:text-base text-slate-300 mb-4 max-w-md">
              Your projects don&apos;t disappear into a black box. You see
              progress, decisions, and next steps — every step of the way.
            </p>

            <div className="p-6 rounded-2xl border border-[rgba(53,191,255,0.06)] shadow-lg bg-gradient-to-r from-[rgba(53,191,255,0.02)] to-[rgba(53,191,255,0.02)]">
              <ScribbleLines />
            </div>
          </div>

          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#061026] to-[#001022] border border-[rgba(53,191,255,0.06)]">
              <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                Advantages
              </div>
              <div className="space-y-3">
                {advantages.map((a) => (
                  <div key={a.title} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[linear-gradient(135deg,#35BFFF,#35BFFF)] shadow-md">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="#021226"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {a.title}
                      </div>
                      <div className="text-sm text-slate-400">{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#06101a] to-[#050618] border border-[rgba(53,191,255,0.04)]">
              <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                Without these services
              </div>
              <div className="space-y-3">
                {disadvantages.map((d) => (
                  <div key={d.title} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[rgba(255,255,255,0.03)]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          stroke="#6b7280"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {d.title}
                      </div>
                      <div className="text-sm text-slate-400">{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#021124] to-[#00121a] border border-[rgba(53,191,255,0.03)] col-span-1 sm:col-span-2">
              <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                How teams use these services
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                <li>• Rapid A/B testing for marketing creatives</li>
                <li>• Automated short-form video production</li>
                <li>• Consistent brand imaging across campaigns</li>
                <li>• Scalable chat &amp; support automations</li>
                <li>• Data-driven creative decisions</li>
                <li>• Faster prototype-to-deploy cycles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   AIStats – stats band with motion
--------------------------------------- */
function FactCard({
  stat,
  label,
  desc,
  index,
}: {
  stat: string
  label: string
  desc: string
  index: number
}) {
  const { ref, inView } = useInView(0.25)
  return (
    <div
      ref={ref}
      className={`bg-gray-800/90 border border-gray-700/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)] hover:border-[rgba(53,191,255,0.28)] hover:shadow-[0_20px_40px_rgba(53,191,255,0.06)]
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
    >
      <div className="text-5xl font-extrabold text-[#35BFFF] mb-3">
        {stat}
      </div>
      <div className="text-lg font-semibold text-white mb-2">{label}</div>
      <div className="text-slate-300 text-base">{desc}</div>
    </div>
  )
}

function AIStats() {
  const stats = [
    {
      stat: '+70%',
      label: 'AI Freelance Job Growth',
      desc: 'AI-related freelance jobs have grown by 70% since last year.',
      index: 0,
    },
    {
      stat: '82%',
      label: 'Companies Hiring AI Talent',
      desc: '82% of companies plan to increase their use of AI freelancers.',
      index: 1,
    },
    {
      stat: '3x',
      label: 'Faster Delivery',
      desc: 'AI-powered teams deliver projects 3x faster on average.',
      index: 2,
    },
    {
      stat: '92%',
      label: 'Buyer Satisfaction',
      desc: '92% of buyers report improved outcomes with AI freelancers.',
      index: 3,
    },
  ]
  const { ref, style } = useParallaxMotion(22, 10)

  return (
    <section className="relative w-full flex flex-col items-center justify-center py-24 bg-transparent overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[70%] h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(53,191,255,0.45), transparent)',
          }}
        />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-14 text-center tracking-tight"
          style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
        >
          The Future of Freelancing
        </h2>
        <div
          ref={ref}
          style={style}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((s) => (
            <FactCard key={s.label} {...s} />
          ))}
        </div>
        <div className="text-center text-[#35BFFF] text-xl font-light mt-16 max-w-3xl mx-auto">
          <span className="italic font-normal">
            AI freelancers are transforming how companies innovate, scale, and
            win.
          </span>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   How it works
--------------------------------------- */
function HowItWorksCard({
  icon,
  title,
  desc,
  index,
}: {
  icon: ReactNode
  title: string
  desc: string
  index: number
}) {
  const { ref, inView } = useInView(0.18)
  return (
    <div
      ref={ref}
      className={`bg-gray-800/90 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)] hover:shadow-[0_24px_40px_rgba(53,191,255,0.06)]
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
    >
      <div className="mb-4 p-3 rounded-full bg-[#071329]">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-base">{desc}</p>
    </div>
  )
}

function HowItWorks() {
  const points = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="#35BFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: 'Vetted Talent',
      desc: 'Sellers are vetted for expertise and delivery history.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 8v4l3 3m-3 7a9 9 0 110-18 9 9 0 010 18z"
            stroke="#35BFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: '24/7 Support',
      desc: 'Help whenever you need it.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M8 10h.01M16 10h.01M12 12c-3.1 0-6 2.3-6 5h12c0-2.7-2.9-5-6-5z"
            stroke="#35BFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: 'Collaboration',
      desc: 'Seamless communication and delivery tracking.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 3v18M4 7h16M4 17h16"
            stroke="#35BFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: 'Escrow Payments',
      desc: 'Funds protected until you accept the work.',
    },
  ]
  return (
    <section className="w-full py-24 px-4 bg-gray-950/70 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-10 left-0 w-full h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(53,191,255,0.4), transparent)',
          }}
        />
        <div
          className="absolute bottom-10 left-0 w-full h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(53,191,255,0.4), transparent)',
          }}
        />
      </div>
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-14 text-center tracking-tight"
          style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
        >
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {points.map((point, idx) => (
            <HowItWorksCard
              key={idx}
              icon={point.icon}
              title={point.title}
              desc={point.desc}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   WhyHumanaira
--------------------------------------- */
function WhyHumanaira() {
  const items = [
    {
      title: 'Curated Talent',
      desc: 'Top performers only. We vet portfolios and delivery history.',
    },
    {
      title: 'AI-First Workflows',
      desc: 'Faster iterations with integrated tooling.',
    },
    {
      title: 'Transparent Pricing',
      desc: 'Clear fees, milestone-based payments.',
    },
    {
      title: 'Reliable Support',
      desc: 'SLA-backed, multilingual support.',
    },
  ]
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <h2
        className="text-4xl font-bold mb-14 text-center text-white tracking-tight"
        style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
      >
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

function WhyCard({
  title,
  desc,
  index,
}: {
  title: string
  desc: string
  index: number
}) {
  const { ref, inView } = useInView(0.18)
  return (
    <div
      ref={ref}
      className={`p-6 rounded-xl bg-gray-900/90 border border-[rgba(53,191,255,0.12)] shadow-xl hover:-translate-y-[4px] transition-transform duration-300 flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)]
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
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
  const { ref: motionRef, style } = useParallaxMotion(18, 10)

  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <div
        ref={(node) => {
          // tie both refs together
          if (node) {
            ;(ref as any).current = node
            ;(motionRef as any).current = node
          }
        }}
        style={style}
        className={`bg-gray-900/90 border border-[rgba(53,191,255,0.18)] rounded-3xl p-10 md:p-20 text-center shadow-2xl transition-all duration-1000 ease-out
        ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
          style={{
            textShadow: '0 2px 10px rgba(53,191,255,0.18)',
            fontFamily: 'Poppins, Inter, sans-serif',
          }}
        >
          Build the work you want to be known for.
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
          Whether you&apos;re a founder shipping the next release or a
          freelancer building your portfolio, Humanaira is where serious AI
          work lives.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/browse"
            className="px-10 py-4 text-lg font-bold rounded-xl bg-[#35BFFF] text-white hover:bg-[#2fb2ff] transition shadow-lg transform hover:scale-[1.03]"
          >
            Find AI freelancers
          </Link>
          <Link
            href="/auth/sign-up?role=freelancer"
            className="px-10 py-4 text-lg font-bold rounded-xl bg-gray-700 text-slate-200 border border-gray-600 hover:bg-gray-600 transition transform hover:scale-[1.03]"
          >
            Join as an AI freelancer
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   FAQ – upgraded layout
--------------------------------------- */
function FAQSection() {
  const faqs = [
    {
      q: 'How do payments work?',
      a: 'Payments are processed securely via our payment gateway. Funds are held in escrow until you accept the work, so both sides stay protected.',
    },
    {
      q: 'What if I need revisions?',
      a: 'Most services include one or more revision rounds. You can track feedback and versions directly in the project workspace before releasing funds.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'If something feels off, you can contact support within 7 days of delivery. Our team will review the work and mediate a fair outcome.',
    },
    {
      q: 'Is Humanaira only for technical work?',
      a: 'No. While many projects are technical, we also support AI-driven content, design, strategy, and operations work.',
    },
  ]
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="relative max-w-6xl mx-auto px-4 py-24">
      <div className="grid gap-10 md:grid-cols-[1.1fr,1.4fr] items-start">
        <div className="space-y-4">
          <h2
            className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-md">
            The short version: we built Humanaira to feel as safe and clear as
            working with a great studio. Here are answers to what most teams ask
            before they start.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-700/70 bg-slate-950/80 px-4 py-3 text-xs text-slate-400 md:text-sm">
            Still not sure?{' '}
            <Link
              href="/support"
              className="text-[#35BFFF] hover:text-sky-300 font-medium"
            >
              Talk to support
            </Link>{' '}
            and we&apos;ll help you scope your first project.
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((f, idx) => (
            <div
              key={f.q}
              className="bg-gray-900/90 border border-gray-800 rounded-2xl overflow-hidden shadow-xl"
            >
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                className="w-full text-left px-6 py-4 flex justify-between items-center transition hover:bg-gray-800/80"
              >
                <div className="font-medium text-white text-sm md:text-base">
                  {f.q}
                </div>
                <div
                  className="text-[#35BFFF] text-2xl md:text-3xl transition-transform duration-300"
                  style={{
                    transform: open === idx ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}
                  aria-hidden
                >
                  +
                </div>
              </button>
              <div
                className="px-6 pb-5 text-slate-300 faq-answer text-sm md:text-base"
                style={{
                  maxHeight: open === idx ? 260 : 0,
                  opacity: open === idx ? 1 : 0,
                }}
              >
                <div className="pt-1">{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   Footer
--------------------------------------- */
function Footer() {
  return (
    <footer
      className="w-full border-t border-gray-800/80 pt-16 pb-10 relative"
      style={{
        background:
          'linear-gradient(to top, rgba(3,7,18,0.94), rgba(3,7,18,0.8), rgba(3,7,18,0.35))',
        backdropFilter: 'blur(18px)',
      }}
    >
      {/* subtle glow behind logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[380px] h-[220px] rounded-full blur-[90px]"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(53,191,255,0.3), transparent 65%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-12">
        <div className="flex flex-col items-start gap-3">
          <div
            className="text-4xl font-extrabold select-none"
            style={{
              fontFamily: 'Poppins, Inter, sans-serif',
              letterSpacing: '-0.04em',
            }}
          >
            <span style={{ color: '#35BFFF' }}>human</span>
            <span style={{ color: '#fff' }}>ai</span>
            <span style={{ color: '#35BFFF' }}>ra</span>
          </div>
          <div className="text-slate-400 text-sm max-w-xs mt-2">
            The premium freelance marketplace. Built for professionals who care
            about design and delivery.
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem] text-slate-400">
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/5 px-3 py-1">
              🔒 Secured by Stripe
            </span>
            <span className="rounded-full border border-slate-600/70 bg-slate-900 px-3 py-1">
              Humans + AI, together.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-6 text-sm">
          <FooterSection title="Platform">
            <Link href="/browse" className="footer-link">
              Browse freelancers
            </Link>
            <Link href="/categories" className="footer-link">
              Categories
            </Link>
            <Link href="/blog" className="footer-link">
              Blog
            </Link>
            <Link href="/how-it-works" className="footer-link">
              How it works
            </Link>
          </FooterSection>
          <FooterSection title="Company">
            <Link href="/about" className="footer-link">
              About
            </Link>
            <Link href="/support" className="footer-link">
              Customer support
            </Link>
            <Link href="/contact" className="footer-link">
              Contact
            </Link>
            <span className="block text-[0.8rem] text-slate-400 mt-1">
              hello@humanaira.com
            </span>
          </FooterSection>
          <FooterSection title="Legal">
            <Link href="/terms" className="footer-link">
              Terms
            </Link>
            <Link href="/privacy" className="footer-link">
              Privacy
            </Link>
            <Link href="/security" className="footer-link">
              Security
            </Link>
            <Link href="/refund" className="footer-link">
              Refund policy
            </Link>
          </FooterSection>
          <FooterSection title="Social">
            <a
              href="https://www.linkedin.com/company/humanaira/"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              LinkedIn
            </a>
            <a
              href="https://www.instagram.com/humanairaglobal"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Instagram
            </a>
          </FooterSection>
        </div>
      </div>

      <div className="relative mt-10 border-t border-slate-900/80 bg-transparent">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-[0.75rem] text-slate-500 md:px-6 md:text-xs">
          <span>
            © {new Date().getFullYear()} Humanaira. All rights reserved.
          </span>
          <span className="text-slate-500/80">
            Built for AI-driven work that actually ships.
          </span>
        </div>
      </div>

      <style jsx global>{`
        .footer-link {
          color: #9fb0c3;
          font-size: 0.95rem;
          padding: 0.15rem 0;
          text-decoration: none;
          transition: color 0.18s ease;
          display: block;
          font-weight: 400;
        }
        .footer-link:hover {
          color: #35bfff;
        }
      `}</style>
    </footer>
  )
}

function FooterSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="text-[#35BFFF] font-semibold mb-2 text-xs uppercase tracking-[0.2em]"
        style={{ fontFamily: 'Poppins, Inter, sans-serif' }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

/* ---------------------------------------
   Background brand mark
--------------------------------------- */
function BackgroundBrand() {
  return (
    <span
      className="fixed left-[-10vw] top-[60vh] text-[18vw] font-extrabold uppercase pointer-events-none select-none opacity-[0.05] z-0"
      style={{
        fontFamily: "'Poppins', Inter, Arial, sans-serif",
        color: '#35BFFF',
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
   Global styles
--------------------------------------- */
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;600;700;800;900&family=Pacifico&display=swap');

      :root {
        --accent: #35bfff;
        --soft: #0c1a2c;
      }
      html,
      body {
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        background: #020617;
        font-family: 'Inter', sans-serif;
      }
      .faq-answer {
        transition: max-height 420ms ease, opacity 300ms ease;
        overflow: hidden;
      }

      .hero-headline {
        font-family: 'Poppins', 'Inter', system-ui, -apple-system, 'Segoe UI',
          Roboto, 'Helvetica Neue', Arial;
        font-weight: 900;
        color: #ffffff;
        letter-spacing: -0.02em;
        -webkit-text-stroke: 0.4px rgba(0, 0, 0, 0.16);
        text-shadow:
          0 2px 8px rgba(0, 0, 0, 0.55),
          0 6px 24px rgba(53, 191, 255, 0.4),
          0 0 18px rgba(53, 191, 255, 0.45);
      }

      .handwritten {
        font-family: 'Pacifico', 'Inter', cursive;
        color: #35bfff;
        font-weight: 400;
        font-size: 1.02em;
        text-shadow: 0 4px 20px rgba(53, 191, 255, 0.45);
        display: inline-block;
      }

      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--accent);
        border-radius: 10px;
        border: 3px solid #020617;
      }
      ::-webkit-scrollbar-track {
        background: #020617;
      }
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
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null)
      }
    )
    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  // user ready for future personalization

  return (
    <main className="min-h-screen bg-gray-950 text-slate-100 font-sans relative overflow-x-hidden">
      <BackgroundBrand />
      <GlobalStyles />
      <div className="pt-[72px]">
        <Hero />
        <TrustedRow />
        <PersonasStrip />
        <PlatformSignalSection />
        <ServiceShowcase />
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
      </div>
    </main>
  )
}
