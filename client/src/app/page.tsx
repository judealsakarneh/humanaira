// app/page.tsx
'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// --- ⚠️ DEPENDENCY NOTES ---
// 1. Placeholder for Supabase: Replace with your actual path.
import { createSupabaseBrowser } from './api/lib/supabaseBrowser'
// 2. Placeholder for MD5: You MUST install 'blueimp-md5' or similar.
import md5 from 'blueimp-md5'

// ====================================================================
// --- UTILITY HOOKS & COMPONENTS ---
// ====================================================================

/**
 * Custom hook to detect when an element scrolls into view.
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

// --- Section Divider ---
function SectionDivider() {
  return (
    <div className="w-full flex justify-center items-center py-0 relative">
      <div className="w-2/3 h-[1px] bg-gradient-to-r from-transparent via-blue-900 to-transparent opacity-50 my-0" />
    </div>
  )
}

// ====================================================================
// --- PLANET & HERO COMPONENTS ---
// ====================================================================

// --- 3D Grid/Starfield Background Component for Hero (Unchanged) ---
function HeroOrbitGrid() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        zIndex: 0,
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Container for the Grid - positioned right of center */}
      <div
        className="absolute top-1/2 left-1/2 w-full h-full opacity-10"
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
              rgba(59, 130, 246, 0.2) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.2) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(
            circle at center,
            white 0%,
            transparent 70%
          );
          animation: spin-grid 120s linear infinite;
        }
        @keyframes spin-grid {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

// --- Orbiting Satellite (Moon) - No direct light, ellipsoid shape, 3D orbit ---
function OrbitingSatellite() {
    const SATELLITE_WIDTH = 40; // Width of the ellipsoid
    const SATELLITE_HEIGHT = 24; // Height of the ellipsoid
    const ORBIT_DISTANCE = 250; // Distance from the planet's center
    const ORBIT_DURATION = 20; // Seconds for one full orbit (faster than planet)
    const ORBIT_PERSPECTIVE_ANGLE = 60; // How much it 'leans' into the screen

    // Subtle noise texture for realism (if desired for the moon)
    const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

    return (
        <div className="satellite-orbit-container" style={{
            position: 'absolute',
            width: '1px', // This container is the pivot for the orbit animation
            height: '1px',
            top: 0,
            left: 0,
            animation: `satellite-orbit ${ORBIT_DURATION}s linear infinite`,
            transformStyle: 'preserve-3d', // Important for 3D rotation
            perspective: '1000px',
        }}>
            <div className="satellite-body" style={{
                width: SATELLITE_WIDTH,
                height: SATELLITE_HEIGHT,
                borderRadius: '50% / 30%', // Ellipsoid shape
                background: `#343a40 ${noiseTexture}`, // Dark grey with noise, no strong light reflection
                boxShadow: '0 0 12px rgba(167, 183, 201, 0.25)', // Increased subtle glow
                position: 'absolute',
                top: -SATELLITE_HEIGHT / 2, 
                left: -SATELLITE_WIDTH / 2,
                transformStyle: 'preserve-3d',
                animation: `satellite-spin ${ORBIT_DURATION / 2}s linear infinite`, // Self-rotation
            }} />
            <style jsx>{`
                .satellite-orbit-container {
                  @keyframes satellite-orbit {
                      0% { 
                          transform: rotateY(0deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg); 
                          z-index: 2; /* In front */
                      }
                      25% { 
                          transform: rotateY(90deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg);
                          z-index: 2;
                      }
                      50% { 
                          transform: rotateY(180deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg); 
                          z-index: 0; /* Behind */
                      }
                      75% { 
                          transform: rotateY(270deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg);
                          z-index: 0;
                      }
                      100% { 
                          transform: rotateY(360deg) translateX(${ORBIT_DISTANCE}px) rotateY(-${ORBIT_PERSPECTIVE_ANGLE}deg); 
                          z-index: 2; /* In front again */
                      }
                  }
                }
                
                .satellite-body {
                    @keyframes satellite-spin {
                        from { transform: rotateZ(0deg); }
                        to { transform: rotateZ(360deg); }
                    }
                }
            `}</style>
        </div>
    );
}


// --- ROTATING PLANET with INTENSE, FADED GRADIENT CIRCLES ---
function RotatingPlanet() {
    const PLANET_SIZE = 480; 

    // Define colors for the main planet (Darker base for contrast)
    const DEEP_BLUE_PLANET = '#020711'; // Very deep blue
    const DEEPER_BLUE_EDGE = '#000000'; // Almost black for edge depth

    // Define colors for the highly visible, faded inner gradients
    const gradientColors = [
        'rgba(0, 191, 255, 0.9)',    // Deep Sky Blue, high opacity
        'rgba(173, 216, 230, 0.8)', // Light Blue, high opacity
        'rgba(30, 144, 255, 0.8)',    // Dodger Blue, high opacity
        'rgba(255, 255, 255, 0.9)', // White/Near-fluorescent, highest opacity
    ];

    return (
        <div className="absolute top-1/2 left-1/2 hidden md:block" style={{
            transform: 'translate(25vw, -50%)', 
            zIndex: 1,
            width: PLANET_SIZE, 
            height: PLANET_SIZE,
            borderRadius: '50%',
            position: 'absolute',
            top: -PLANET_SIZE / 2, 
            left: -PLANET_SIZE / 2,
            overflow: 'visible', // Allow gradients to spill out slightly for a softer effect
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {/* The Main Planet (The dark base structure) */}
            <div className="main-planet" style={{
                width: '100%', 
                height: '100%',
                borderRadius: 'inherit',
                background: `radial-gradient(circle at center, ${DEEP_BLUE_PLANET} 50%, ${DEEPER_BLUE_EDGE} 100%)`,
                boxShadow: '0 0 150px rgba(59, 130, 246, 0.4), inset 0 0 60px rgba(0,0,0,0.9)', 
                animation: `spin-planet 90s linear infinite`, 
                zIndex: 1,
                position: 'absolute',
            }} />

            {/* **INTENSE FADED GRADIENT CIRCLES** - Highly visible and exaggerated movement */}
            {gradientColors.map((color, index) => (
                <div 
                    key={index}
                    className="intense-gradient-circle"
                    style={{
                        position: 'absolute',
                        width: `${PLANET_SIZE * (1.2 + index * 0.3)}px`, // MUCH larger sizes (up to 180% of planet)
                        height: `${PLANET_SIZE * (1.2 + index * 0.3)}px`,
                        borderRadius: '50%',
                        // Using a strong radial gradient with massive spread
                        background: `radial-gradient(circle at center, ${color} 0%, transparent 40%)`,
                        // Exaggerated animation for clear visibility
                        animation: `float-fade ${20 + index * 8}s linear infinite alternate${index % 2 === 0 ? '-reverse' : ''}`, 
                        filter: 'blur(50px)', // MASSIVE blur for the "fady" soft glow effect
                        opacity: 0.9,
                        zIndex: 2, // Layered above the main planet
                        pointerEvents: 'none',
                    }}
                />
            ))}
            
            <OrbitingSatellite /> {/* <-- The orbiting satellite (zIndex 3 by default) */}

            <style jsx>{`
                @keyframes spin-planet {
                    from { 
                        transform: rotateZ(0deg);
                    }
                    to { 
                        transform: rotateZ(360deg);
                    }
                }

                @keyframes float-fade {
                    0% {
                        /* Exaggerated movement */
                        transform: translate(-30%, -30%) scale(0.9);
                        opacity: 0.9;
                    }
                    50% {
                        transform: translate(30%, 30%) scale(1.05);
                        opacity: 0.6;
                    }
                    100% {
                        transform: translate(-30%, -30%) scale(0.9);
                        opacity: 0.9;
                    }
                }
            `}</style>
        </div>
    )
}


// --- Hero Section (Unchanged) ---
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
      className="relative w-full flex items-center justify-center bg-gray-950 overflow-hidden"
      style={{ minHeight: 'calc(100vh - 72px)' }}
    >
      <HeroOrbitGrid />
      <RotatingPlanet /> {/* <-- The central rotating planet, now with satellite */}
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-20 w-full min-h-[calc(100vh-72px)]">
        <h1
          className="mb-6 leading-tight tracking-tight drop-shadow-xl font-extrabold text-white"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            textShadow: '0 4px 32px #3b82f655, 0 2px 8px #1d4ed8cc',
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
              textShadow: '0 2px 15px rgba(59, 130, 246, 0.5)',
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
          >
            with Humanaira
          </span>
        </h1>
        <p
          className="text-lg md:text-xl mb-6 max-w-3xl mx-auto font-medium text-gray-300"
          style={{ letterSpacing: '0.01em', textShadow: '0 2px 12px #00000099' }}
        >
          Discover, hire, and collaborate with the next generation of AI talent and digital
          creators.
        </p>
        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl mx-auto flex items-center justify-center bg-gray-800/60 backdrop-blur-sm rounded-xl border border-blue-700 p-2 shadow-2xl"
          style={{ marginBottom: '2rem' }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for AI services, Gigs, or specialized talent..."
            className="flex-1 bg-transparent border-none outline-none text-white text-base px-3 py-3 placeholder:text-gray-400 placeholder:font-light"
            style={{ minWidth: 0, fontSize: '1rem' }}
          />
          <button
            type="submit"
            className="ml-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition text-base shadow-md"
          >
            Search
          </button>
        </form>
        <div className="flex flex-wrap gap-4 justify-center items-center font-medium">
          <Link
            href="/browse"
            className="inline-block px-5 py-2.5 rounded-lg bg-gray-800/80 border border-gray-700 text-blue-300 hover:text-blue-400 transition"
          >
            Browse Services →
          </Link>
          <Link
            href="/seller/gigs/new"
            className="inline-block px-5 py-2.5 rounded-lg bg-blue-600 border border-blue-700 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
          >
            Start Selling AI Services
          </Link>
        </div>
      </div>
    </section>
  )
}

// --- AI Stats Section (Unchanged) ---
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
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-24 bg-gray-900 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-14 text-center tracking-tight">
          The Future of Freelancing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <FactCard key={s.label} {...s} />
          ))}
        </div>
        <div className="text-center text-blue-300 text-xl font-light mt-16 max-w-3xl mx-auto">
          <span className="italic font-normal">
            AI freelancers are transforming how companies innovate, scale, and win.
          </span>
        </div>
      </div>
    </section>
  )
}

// --- Fact Card with Slide Up Animation (Unchanged) ---
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
      className={`bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl shadow-gray-900/50 transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)] hover:border-blue-600 hover:shadow-blue-900/30
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
    >
      <div className="text-5xl font-extrabold text-blue-400 mb-3">{stat}</div>
      <div className="text-lg font-semibold text-white mb-2">{label}</div>
      <div className="text-gray-400 text-base">{desc}</div>
    </div>
  )
}

// --- How It Works Section (Unchanged) ---
function HowItWorks() {
  const points = [
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: 'Vetted AI Talent',
      desc: 'All sellers are rigorously vetted for expertise and AI-specific skills.',
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 8v4l3 3m-3 7a9 9 0 110-18 9 9 0 010 18z"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: '24/7 Support',
      desc: 'Our team is here to help you anytime, day or night.',
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M8 10h.01M16 10h.01M12 12c-3.1 0-6 2.3-6 5h12c0-2.7-2.9-5-6-5z"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: 'Instant Collaboration',
      desc: 'Chat instantly with AI freelancers for smooth project execution.',
    },
    {
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 3v18M4 7h16M4 17h16"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      ),
      title: 'Secure Escrow Payments',
      desc: 'Your funds are protected until you approve the final, delivered work.',
    },
  ]
  return (
    <section className="w-full py-24 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-blue-300 mb-14 text-center tracking-tight">
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

// --- How It Works Card with Slide Up Animation (Unchanged) ---
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
      className={`bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)] hover:shadow-blue-900/30
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
    >
      <div className="mb-4 p-3 rounded-full bg-blue-900/30">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-base">{desc}</p>
    </div>
  )
}

// --- Why Humanaira Section (ICONS REMOVED, as requested) ---
function WhyHumanaira() {
  const items = [
    {
      title: 'Curated AI Talent',
      desc: 'Top performers only. We vet portfolios and delivery history for AI-specific projects.',
    },
    {
      title: 'AI-First Workflows',
      desc: 'Faster iterations with integrated AI tooling while human expertise ensures final quality.',
    },
    {
      title: 'Transparent Pricing',
      desc: 'Clear fees and milestone-based payments. No surprises or hidden costs.',
    },
    {
      title: 'Reliable Global Support',
      desc: 'SLA-backed, multilingual support for your most important AI initiatives.',
    },
  ]
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-14 text-center text-white tracking-tight">
        Why Choose Humanaira
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((it, idx) => (
          <WhyCard
            key={it.title}
            title={it.title}
            desc={it.desc}
            index={idx}
          />
        ))}
      </div>
    </section>
  )
}

// --- Why Card with Slide Up Animation (NO icon rendering) ---
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
      className={`p-6 rounded-xl bg-gray-900 border border-blue-900 shadow-xl shadow-blue-900/10 hover:translate-y-[-4px] transition-transform duration-300 flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)]
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
    >
      {/* Icon div remains removed */}
      <div className="font-semibold text-white text-lg mb-2">{title}</div>
      <div className="text-gray-400 text-sm">{desc}</div>
    </div>
  )
}

// --- NEW SECTION: Call to Action (CTA) ---
function ReadyToMakeTheChangeCTA() {
  const { ref, inView } = useInView(0.3)
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <div
        ref={ref}
        className={`bg-gray-900 border border-blue-700/50 rounded-3xl p-10 md:p-20 text-center shadow-2xl shadow-blue-900/20 transition-all duration-1000 ease-out
        ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
            style={{ textShadow: '0 2px 10px rgba(59, 130, 246, 0.4)' }}>
          Elevate Your Ambition
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
          Join the platform where tomorrow's AI innovations are built today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/browse"
            className="px-10 py-4 text-lg font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 transform hover:scale-[1.03]"
          >
            Explore AI Services
          </Link>
          <Link
            href="/seller/gigs/new"
            className="px-10 py-4 text-lg font-bold rounded-xl bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600 transition transform hover:scale-[1.03]"
          >
            Start Selling Today
          </Link>
        </div>
      </div>
    </section>
  )
}


// --- FAQ Section (Unchanged) ---
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
          <div
            key={f.q}
            className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl"
          >
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              className="w-full text-left px-6 py-4 flex justify-between items-center transition hover:bg-gray-800/80"
            >
              <div className="font-medium text-white text-lg">{f.q}</div>
              <div
                className="text-blue-400 text-3xl transition-transform duration-300"
                style={{ transform: open === idx ? 'rotate(45deg)' : 'rotate(0deg)' }}
                aria-hidden
              >
                +
              </div>
            </button>
            <div
              className="px-6 pb-6 text-gray-300 faq-answer text-base"
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

// --- Footer (Updated: removed Careers & Investors; added postal address) ---
function Footer() {
  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-12">
        {/* Logo and description */}
        <div className="flex flex-col items-start gap-3">
          <div
            className="text-4xl font-extrabold select-none"
            style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.04em' }}
          >
            <span className="text-blue-500">human</span>
            <span className="text-gray-50">ai</span>
            <span className="text-blue-500">ra</span>
          </div>
          <div className="text-gray-400 text-sm max-w-xs mt-2">
            The premium AI-powered freelance marketplace. Built for professionals, by professionals.
          </div>

          {/* Business postal address for Stripe / verification */}
          <div className="text-gray-400 text-sm mt-3">
            Humanaira Ltd<br />
            167-169 Great Portland Street, 5th Floor<br />
            London, W1W 5PF<br />
            United Kingdom
          </div>
        </div>
        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6">
          <FooterSection title="Explore">
            <Link
              href="/blog"
              className="footer-link"
            >
              Blog
            </Link>
            <Link
              href="/browse"
              className="footer-link"
            >
              Browse Gigs
            </Link>
            <Link
              href="/help"
              className="footer-link"
            >
              Help Center
            </Link>
          </FooterSection>
          <FooterSection title="Company">
            <Link
              href="/about"
              className="footer-link"
            >
              About Us
            </Link>
            {/* Careers and Investors removed as requested */}
          </FooterSection>
          <FooterSection title="Legal">
            <Link
              href="/terms"
              className="footer-link"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="footer-link"
            >
              Privacy Policy
            </Link>
            <Link
              href="/refund-policy"
              className="footer-link"
            >
              Refund Policy
            </Link>
          </FooterSection>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-12 pt-8 border-t border-gray-900 opacity-70">
        &copy; {new Date().getFullYear()} Humanaira. All rights reserved.
      </div>
      <style jsx global>{`
        .footer-link {
          color: #a7b7c9;
          font-size: 0.95rem;
          padding: 0.35rem 0;
          text-decoration: none;
          transition: color 0.2s;
          display: block;
          font-weight: 400;
        }
        .footer-link:hover {
          color: #60a5fa;
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
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-blue-400 font-semibold mb-2 text-base uppercase tracking-wider">
        {title}
      </div>
      {children}
    </div>
  )
}

// --- Transparent Brand Background (Unchanged) ---
function BackgroundBrand() {
  return (
    <>
      <span
        className="fixed left-[-10vw] top-[60vh] text-[18vw] font-extrabold uppercase pointer-events-none select-none opacity-5 z-0"
        style={{
          fontFamily: "'Inter', Arial, sans-serif",
          color: '#3b82f6',
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

// --- Global Styles (Unchanged) ---
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Pacifico&display=swap');

      :root {
        --accent: #3b82f6;
        --soft: #0c1a2c;
      }
      body {
        margin: 0;
        padding: 0;
        background: #080911;
        font-family: 'Inter', sans-serif;
      }
      .faq-answer {
        transition: max-height 420ms ease, opacity 300ms ease;
        overflow: hidden;
      }

      /* Professional Scrollbar (Dark Theme) */
      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      ::-webkit-scrollbar-thumb {
        background: #3b82f6;
        border-radius: 10px;
        border: 3px solid #080911;
      }
      ::-webkit-scrollbar-track {
        background: #1f2937;
      }
    `}</style>
  )
}

// --- Avatar Component (Kept for compatibility) ---
function Avatar({ email }: { email: string }) {
  const hash =
    typeof window !== 'undefined' && email ? md5(email.trim().toLowerCase()) : ''
  const url = email
    ? `https://www.gravatar.com/avatar/${hash}?d=identicon&s=40`
    : 'https://www.gravatar.com/avatar/?d=mp&s=40'
  return (
    <img
      src={url}
      alt="User Avatar"
      className="w-10 h-10 rounded-full border-2 border-blue-600 bg-gray-800 object-cover ring-2 ring-blue-500/50"
      style={{ minWidth: 40, minHeight: 40 }}
    />
  )
}

// ====================================================================
// --- MAIN HOME PAGE COMPONENT ---
// ====================================================================

export default function HomePage() {
  const [user, setUser] = useState<any>(null)

  // Hydrate user session from Supabase on client-load and listen for changes
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

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 font-sans relative overflow-x-hidden">
      {/* This div provides the main padding-top for the fixed Header */}
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