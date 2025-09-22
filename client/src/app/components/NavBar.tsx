'use client'
import Link from 'next/link'
import UserMenu from './UserMenu'
import { useSession } from '@supabase/auth-helpers-react'
import { useEffect, useState, useRef } from 'react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

export default function NavBar() {
  const session = useSession()
  const [user, setUser] = useState(session?.user || null)
  const [profile, setProfile] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createSupabaseBrowser()

  // Fetch profile for avatar and username
  useEffect(() => {
    setUser(session?.user || null)
    async function fetchProfile() {
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', session.user.id)
          .single()
        if (!error && data) setProfile(data)
      } else {
        setProfile(null)
      }
    }
    fetchProfile()
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
  }, [session, supabase])

  // Scroll effect for header background
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 32)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Make header taller (h-20 = 80px, adjust as needed)
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full h-20 flex items-center justify-between px-8 shadow-sm border-b transition-all duration-300
        ${scrolled
          ? 'bg-[rgba(10,12,20,0.82)] border-gray-900 backdrop-blur-[22px]'
          : 'bg-transparent border-transparent backdrop-blur-0 shadow-none'
        }
      `}
      style={{
        boxShadow: scrolled ? '0 2px 24px 0 #10131e44' : 'none',
        borderRadius: '0 0 1.5rem 1.5rem',
      }}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="focus:outline-none group flex items-center relative">
          <AnimatedLogo />
        </Link>
      </div>
      <div className="flex items-center gap-3">
        {!user ? (
          <Link
            href="/login"
            className="ml-2 px-5 py-2 rounded-lg text-base font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
            style={{ borderRadius: '1rem' }}
          >
            Sign up / Login
          </Link>
        ) : (
          <UserMenu
            user={user}
            avatarUrl={profile?.avatar_url}
            username={profile?.username || user.email?.split('@')[0] || ''}
            // Make sure your UserMenu avatar is also a bit bigger (w-12 h-12)
          />
        )}
      </div>
    </nav>
  )
}

// --- AnimatedLogo and MovingOrb ---
function AnimatedLogo() {
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
        fontSize: '1.75rem', // bigger logo
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span style={{ color: '#2563eb' }}>hum</span>
      <span style={{ color: '#2563eb' }}>an</span>
      <span style={{ color: '#fff', fontWeight: 800 }}>a</span>
      <span style={{ color: '#fff', fontWeight: 800 }}>i</span>
      <span style={{ color: '#2563eb' }}>ra</span>
      <svg
        width="100"
        height="18"
        viewBox="0 0 120 18"
        className="absolute left-0 bottom-[-8px] pointer-events-none"
        style={{ zIndex: 1 }}
        aria-hidden
      >
        <path
          ref={underlineRef}
          d="M8 12 Q40 20 80 10 Q110 2 118 14"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 6px #38bdf8cc)',
            strokeDasharray: undefined,
            strokeDashoffset: undefined,
          }}
        />
        <MovingOrb />
      </svg>
      <span className="inline-block align-middle ml-2 w-3 h-3 rounded-full bg-blue-700 animate-pulse shadow-lg"></span>
    </span>
  )
}

function MovingOrb() {
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