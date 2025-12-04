'use client'

import Link from 'next/link'
import UserMenu from './UserMenu'
import { useEffect, useRef, useState } from 'react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'
import { User } from '@supabase/supabase-js'

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) setProfile(data)
          })
      }
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (!error && data) setProfile(data)
            else setProfile(null)
          })
      } else {
        setProfile(null)
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      data-scrolled={scrolled ? 'true' : 'false'}
      className="nav-root fixed top-0 left-0 right-0 z-50 w-full h-20 flex items-center justify-between px-6 md:px-8"
      aria-label="Main Navigation"
      style={{ borderRadius: '0 0 18px 18px' }}
    >
      {/* Blur layer */}
      <div className="nav-blur" aria-hidden />
      {/* Thin blue bottom line */}
      <div className="nav-bottom-edge" aria-hidden />

      {/* Content */}
      <div className="flex items-center gap-4 relative z-10">
        <Link href="/" className="focus:outline-none group flex items-center relative" aria-label="Humanaira Home">
          <BrandLogo />
        </Link>
      </div>

      <div className="flex items-center gap-3 relative z-10">
        {!user ? (
          <Link
            href="/login"
            className="ml-2 px-5 py-2 rounded-xl text-base font-semibold bg-[#35BFFF] text-[#06121f] hover:bg-[#2fb2ff] transition"
            style={{ boxShadow: '0 8px 24px rgba(53,191,255,0.22)' }}
          >
            Sign up / Login
          </Link>
        ) : (
          <UserMenu
            user={user}
            avatarUrl={profile?.avatar_url}
            username={profile?.username || user.email?.split('@')[0] || ''}
          />
        )}
      </div>

      {/* Scoped styles */}
      <style jsx>{`
        .nav-root {
          background: transparent;
        }

        .nav-blur {
          position: absolute;
          inset: 0;
          border-radius: 0 0 18px 18px;
          background: rgba(10, 14, 24, 0.15); /* slight tint for depth */
          backdrop-filter: blur(28px) saturate(140%);
          -webkit-backdrop-filter: blur(28px) saturate(140%);
          transition: backdrop-filter 240ms ease, background 240ms ease;
        }

        nav[data-scrolled='true'] .nav-blur {
          background: rgba(10, 14, 24, 0.25);
          backdrop-filter: blur(40px) saturate(150%);
          -webkit-backdrop-filter: blur(40px) saturate(150%);
        }

        .nav-bottom-edge {
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(53, 191, 255, 0.6), transparent);
          border-radius: 9999px;
          pointer-events: none;
        }
      `}</style>
    </nav>
  )
}

/* Brand logo unchanged */
function BrandLogo() {
  const BLUE = '#35BFFF'
  const wrapRef = useRef<HTMLSpanElement | null>(null)
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = wrapRef.current
    if (!el) return

    const update = () => {
      const r = el.getBoundingClientRect()
      setSize({ w: Math.round(r.width), h: Math.round(r.height) })
    }

    update()

    let ro: ResizeObserver | null = null
    try {
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(update)
        ro.observe(el)
      } else {
        window.addEventListener('resize', update)
      }
    } catch {
      window.addEventListener('resize', update)
    }

    return () => {
      if (ro) ro.disconnect()
      else window.removeEventListener('resize', update)
    }
  }, [])

  const padX = 14
  const padY = 10
  const rx = 12

  const svgW = size.w + padX * 2
  const svgH = size.h + padY * 2

  return (
    <span className="relative inline-flex items-center">
      {svgW > 0 && svgH > 0 && (
        <svg
          className="absolute -z-10"
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          aria-hidden
          style={{ left: -padX, top: -padY }}
        >
          <defs>
            <linearGradient id="brandOrbitGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e9fbff" stopOpacity="0.7" />
              <stop offset="50%" stopColor={BLUE} stopOpacity="1" />
              <stop offset="100%" stopColor="#91e6ff" stopOpacity="0.8" />
            </linearGradient>
            <filter id="brandGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect
            x="2"
            y="2"
            width={svgW - 4}
            height={svgH - 4}
            rx={rx + 2}
            ry={rx + 2}
            fill="rgba(53,191,255,0.06)"
            filter="url(#brandGlow)"
          />

          <g style={{ transformOrigin: `${svgW / 2}px ${svgH / 2}px` }}>
            <rect
              x="3.5"
              y="3.5"
              width={svgW - 7}
              height={svgH - 7}
              rx={rx}
              ry={rx}
              fill="none"
              stroke="url(#brandOrbitGrad)"
              strokeWidth="1.8"
              pathLength={100}
              strokeDasharray="16 84"
              className="orbit-stroke"
            />
            <rect
              x="3.5"
              y="3.5"
              width={svgW - 7}
              height={svgH - 7}
              rx={rx}
              ry={rx}
              fill="none"
              stroke="rgba(53,191,255,0.15)"
              strokeWidth="2.2"
              pathLength={100}
              strokeDasharray="8 92"
              className="orbit-stroke-slow"
            />
          </g>

          <style jsx>{`
            @keyframes dashMove {
              to {
                stroke-dashoffset: -100;
              }
            }
            .orbit-stroke {
              animation: dashMove 9s linear infinite;
              stroke-linecap: round;
            }
            .orbit-stroke-slow {
              animation: dashMove 18s linear infinite;
              stroke-linecap: round;
            }
          `}</style>
        </svg>
      )}

      <span
        ref={wrapRef}
        className="select-none"
        style={{
          fontFamily: 'Poppins, Inter, sans-serif',
          fontWeight: 800,
          fontSize: '1.6rem',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          textShadow: '0 2px 8px rgba(0,0,0,0.35)',
        }}
      >
        <span style={{ color: BLUE }}>human</span>
        <span style={{ color: '#ffffff' }}>ai</span>
        <span style={{ color: BLUE }}>ra</span>
      </span>
    </span>
  )
}
