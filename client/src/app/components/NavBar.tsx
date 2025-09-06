'use client'
import Link from 'next/link'
import UserMenu from './UserMenu'
import { useSession } from '@supabase/auth-helpers-react'
import { useEffect, useState, useRef } from 'react'
import { createSupabaseBrowser } from '../api/lib/supabaseBrowser' // adjust path if needed

export default function NavBar() {
  const session = useSession()
  const [user, setUser] = useState(session?.user || null)
  const supabase = createSupabaseBrowser()

  useEffect(() => {
    setUser(session?.user || null)

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [session, supabase])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 w-full h-16 flex items-center justify-between px-6 shadow-sm border-b border-gray-900"
      style={{
        background: 'rgba(16,18,32,0.18)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        boxShadow: '0 2px 24px 0 #2563eb22',
      }}
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="focus:outline-none group flex items-center relative">
          <AnimatedLogo />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {!user ? (
          <Link
            href="/login"
            className="ml-2 px-4 py-2 rounded-md text-sm font-semibold bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            Sign up / Login
          </Link>
        ) : (
          <UserMenu user={user} />
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
        fontSize: '2rem',
        lineHeight: 1,
      }}
    >
      <span style={{ color: '#2563eb' }}>human</span>
      <span style={{ color: '#fff', position: 'relative', zIndex: 2 }}>
        <span style={{ color: '#fff', fontWeight: 800 }}>a</span>
        <span style={{
          color: '#fff',
          fontWeight: 800,
          background: 'none',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'white'
        }}>i</span>
      </span>
      <span style={{ color: '#38bdf8' }}>ra</span>
      <svg
        width="120"
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
      <span className="inline-block align-middle ml-2 w-2.5 h-2.5 rounded-full bg-blue-700 animate-pulse shadow-lg"></span>
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