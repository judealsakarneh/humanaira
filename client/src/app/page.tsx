'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from './api/lib/supabaseBrowser'

/**
 * Simple intersection observer hook for reveal-on-scroll
 */
const useInView = (threshold = 0.18) => {
  const ref = useRef<HTMLDivElement | null>(null)
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
      <div className="w-[76%] h-[1px] bg-gradient-to-r from-transparent via-[#35BFFF] to-transparent opacity-50 my-0" />
    </div>
  )
}

/* ---------------------------------------
   GlassyWater (ambient animated blur) - used in Service section only
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
   ScribbleLines — thin-line animated scribble for Services section
--------------------------------------- */
function ScribbleLines() {
  // Deterministic "random"
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
        const x = cx + (rx + 3 * Math.sin(t * 3.1 + i)) * Math.cos(t) + n1 * 0.35
        const y = cy + (ry + 3 * Math.cos(t * 2.7 + i)) * Math.sin(t) + n2 * 0.35
        d += k === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`
      }
      return d
    }

    return Array.from({ length: loops }).map((_, i) => makePath(i))
  }, [])

  return (
    <div className="scribble-wrap" aria-hidden>
      <svg viewBox="0 0 300 300" className="scribble-svg" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Scribble lines">
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
              style={{
                animationDelay: `${idx * 0.12}s`,
              }}
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
          background: radial-gradient(60% 60% at 50% 45%, rgba(53,191,255,0.08), rgba(3,6,16,0.0));
          border-radius: 22px;
        }
        .scribble-svg { width: 100%; height: 100%; display: block; }

        .scribble-group { animation: scribbleRotate 28s linear infinite; transform-origin: 150px 150px; }
        @keyframes scribbleRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .scribble-stroke {
          stroke-dasharray: 2.8 7;
          animation: dashDrift 10s linear infinite;
        }
        @keyframes dashDrift {
          0%   { stroke-dashoffset: 0;   }
          100% { stroke-dashoffset: -220; }
        }

        @media (max-width: 640px) {
          .scribble-wrap { width: 280px; height: 280px; }
        }
      `}</style>
    </div>
  )
}

/* ---------------------------------------
   AudioWave (SIMULATED) — unchanged
--------------------------------------- */
function AudioWaveSim({ height = 120 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true
    const DPR = Math.min(2, window.devicePixelRatio || 1)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * DPR)
      canvas.height = Math.floor(rect.height * DPR)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(DPR, DPR)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      if (!running) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      const t = performance.now() / 1000
      const draws = [
        { amp: 0.18, freq: 2.1, offset: Math.sin(t * 0.6) * 0.5, colorStops: ['#35BFFF', '#35BFFF', '#35BFFF'], alpha: 0.95, width: 3 },
        { amp: 0.10, freq: 3.2, offset: Math.cos(t * 0.9) * 0.8, colorStops: ['#35BFFF', '#35BFFF', '#35BFFF'], alpha: 0.6, width: 1.6 },
        { amp: 0.06, freq: 1.6, offset: Math.sin(t * 1.7) * 0.2, colorStops: ['rgba(53,191,255,0.8)', 'rgba(53,191,255,0.6)'], alpha: 0.36, width: 1.2 },
      ]

      for (const layer of draws) {
        const grad = ctx.createLinearGradient(0, 0, w, 0)
        const stops = layer.colorStops
        grad.addColorStop(0, stops[0])
        grad.addColorStop(0.5, stops[Math.floor(stops.length / 2)])
        grad.addColorStop(1, stops[stops.length - 1] || stops[0])
        ctx.strokeStyle = grad
        ctx.globalAlpha = layer.alpha
        ctx.lineWidth = layer.width
        ctx.beginPath()
        for (let x = 0; x <= w; x += 2) {
          const nx = x / w
          const y =
            h / 2 +
            Math.sin(nx * Math.PI * layer.freq + layer.offset) * (h * layer.amp) *
              (0.6 + 0.4 * Math.sin(t * (0.8 + nx * 1.2)))
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="w-full rounded-xl overflow-hidden border border-[rgba(53,191,255,0.08)] p-2 bg-[#030616]">
      <canvas ref={canvasRef} className="w-full" style={{ display: 'block', height }} aria-hidden />
      <div className="mt-2 text-xs text-slate-400">Stylized waveform — continuous loop.</div>
    </div>
  )
}

/* ---------------------------------------
   Text→Visual morph — unchanged
--------------------------------------- */
function TextToImageMorphOptimized({ phrase = 'Humanaira' }: { phrase?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particlesRef = useRef<any[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true
    const DPR = Math.min(2, window.devicePixelRatio || 1)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.floor(rect.width * DPR)
      canvas.height = Math.floor(rect.height * DPR)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(DPR, DPR)
    }
    resize()
    window.addEventListener('resize', resize)

    const drawTargetImageToBuffer = (w: number, h: number) => {
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const octx = off.getContext('2d')!
      octx.clearRect(0, 0, w, h)
      const grad = octx.createRadialGradient(w * 0.6, h * 0.35, 30, w * 0.5, h * 0.5, Math.max(w, h))
      grad.addColorStop(0, 'rgba(53,191,255,0.95)')
      grad.addColorStop(0.35, 'rgba(53,191,255,0.9)')
      grad.addColorStop(1, 'rgba(10,12,24,0.0)')
      octx.fillStyle = grad
      octx.fillRect(0, 0, w, h)

      for (let i = 0; i < 5; i++) {
        const gx = octx.createRadialGradient(
          Math.random() * w,
          Math.random() * h,
          0,
          Math.random() * w,
          Math.random() * h,
          Math.max(w, h) * 0.5
        )
        const c1 = `rgba(53,191,255,${0.08 + Math.random() * 0.25})`
        const c2 = `rgba(53,191,255,${0.02 + Math.random() * 0.08})`
        gx.addColorStop(0, c1)
        gx.addColorStop(1, c2)
        octx.fillStyle = gx
        octx.beginPath()
        octx.ellipse(Math.random() * w, Math.random() * h, 120 + Math.random() * 260, 80 + Math.random() * 160, Math.random() * Math.PI, 0, Math.PI * 2)
        octx.fill()
      }
      return off
    }

    const sampleTextPositions = (w: number, h: number, maxParticles = 900) => {
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const octx = off.getContext('2d')!
      octx.clearRect(0, 0, w, h)
      const fontSize = Math.floor(Math.min(w, h) * 0.16)
      octx.font = `700 ${fontSize}px Poppins, Inter, sans-serif`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.fillStyle = '#fff'
      octx.fillText(phrase, w / 2, h / 2)
      const img = octx.getImageData(0, 0, w, h).data
      const step = Math.max(3, Math.floor(Math.min(w, h) / 100))
      const positions: { x: number; y: number }[] = []
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4
          if (img[idx + 3] > 150) positions.push({ x, y })
          if (positions.length >= maxParticles) break
        }
        if (positions.length >= maxParticles) break
      }
      for (const p of positions) {
        p.x += (Math.random() - 0.5) * step * 0.4
        p.y += (Math.random() - 0.5) * step * 0.4
      }
      return positions
    }

    const init = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const targetCanvas = drawTargetImageToBuffer(w, h)
      const targetCtx = targetCanvas.getContext('2d')!
      const textPositions = sampleTextPositions(w, h, 900)
      const tStep = Math.max(3, Math.floor(Math.min(w, h) / 90))
      const targetPositions: { x: number; y: number }[] = []
      const targetImg = targetCtx.getImageData(0, 0, w, h).data
      for (let y = 0; y < h; y += tStep) {
        for (let x = 0; x < w; x += tStep) {
          const idx = (y * w + x) * 4
          const a = targetImg[idx + 3]
          if (a > 6) targetPositions.push({ x, y })
        }
      }
      if (targetPositions.length === 0) {
        for (let i = 0; i < textPositions.length; i++) {
          targetPositions.push({ x: (i % w), y: ((i * 31) % h) })
        }
      }

      const particles = textPositions.map((p, i) => {
        const t = targetPositions[i % targetPositions.length]
        return {
          x: p.x + (Math.random() - 0.5) * 8,
          y: p.y + (Math.random() - 0.5) * 8,
          vx: 0,
          vy: 0,
          tx: t.x + (Math.random() - 0.5) * 6,
          ty: t.y + (Math.random() - 0.5) * 6,
          size: 1 + Math.random() * 2.2,
        }
      })

      particlesRef.current = particles
    }

    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)

      const bg = ctx.createLinearGradient(0, 0, w, h)
      bg.addColorStop(0, 'rgba(2,6,23,0.4)')
      bg.addColorStop(1, 'rgba(0,0,0,0.05)')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, w, h)

      const particles = particlesRef.current
      if (!particles || particles.length === 0) {
        ctx.font = `700 ${Math.floor(Math.min(w, h) * 0.12)}px Poppins, Inter, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = 'rgba(53,191,255,0.25)'
        ctx.fillText(phrase, w / 2, h / 2)
      } else {
        const now = performance.now()
        const t = now / 1000
        for (const p of particles) {
          const dx = p.tx - p.x
          const dy = p.ty - p.y
          p.vx += dx * 0.008 * (0.6 + 0.4 * Math.sin(t * 0.5))
          p.vy += dy * 0.008 * (0.6 + 0.4 * Math.cos(t * 0.4))
          p.vx *= 0.84
          p.vy *= 0.84
          p.x += p.vx + Math.sin((p.x + t * 20) * 0.015) * 0.25
          p.y += p.vy + Math.cos((p.y + t * 17) * 0.012) * 0.25

          const cx = Math.floor(53 + (p.x / w) * 191)
          const cy = Math.floor(191 + (p.y / h) * 64)
          const cz = Math.floor(255 - (p.x / w) * 20)
          ctx.fillStyle = `rgba(${cx},${cy},${cz},0.95)`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const grd = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.8)
      grd.addColorStop(0, 'rgba(0,0,0,0)')
      grd.addColorStop(1, 'rgba(0,0,0,0.28)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      rafRef.current = requestAnimationFrame(animate)
    }

    init()
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [phrase])

  const replay = () => {
    const particles = particlesRef.current
    for (const p of particles) {
      p.x += (Math.random() - 0.5) * 20
      p.y += (Math.random() - 0.5) * 20
      p.vx = (Math.random() - 0.5) * 2
      p.vy = (Math.random() - 0.5) * 2
    }
  }

  return (
    <div className="bg-[#04081a] border border-[rgba(53,191,255,0.06)] rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-lg font-semibold text-white">Text → Visual</div>
          <div className="text-xs text-slate-400">Preloaded, optimized morph. Lightweight and looping for smooth presentation.</div>
        </div>
        <div className="flex gap-2">
          <button onClick={replay} className="px-3 py-1.5 rounded-md bg-[#35BFFF] text-white text-sm">Replay</button>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full h-64 rounded-md shadow-inner" style={{ display: 'block' }} aria-hidden />
    </div>
  )
}

/* ---------------------------------------
   ServiceShowcase — uses ScribbleLines
--------------------------------------- */
function ServiceShowcase() {
  const advantages = [
    { title: 'Faster Delivery', desc: 'Automate repetitive tasks and iterate faster to hit deadlines.' },
    { title: 'Lower Cost', desc: 'Reduce manual hours and optimize resource allocation.' },
    { title: 'Scale Effortlessly', desc: 'Spin up campaigns, media, and experiments at scale.' },
    { title: 'Consistent Output', desc: 'Maintain brand tone and quality across deliverables.' },
  ]

  const disadvantages = [
    { title: 'Slower Time-to-Market', desc: 'Manual workflows are more error-prone and slower.' },
    { title: 'Higher Operational Cost', desc: 'More human hours required for the same output.' },
    { title: 'Limited Scalability', desc: 'Harder to run multiple experiments or versions.' },
    { title: 'Inconsistent Quality', desc: 'Human variation and fatigue introduce inconsistencies.' },
  ]

  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-[#030712] via-[#040816] to-[#02020a] overflow-hidden">
      <GlassyWater />
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
              Services Delivered — visible, fast, reliable
            </h2>

            <div className="p-6 rounded-2xl border border-[rgba(53,191,255,0.06)] shadow-lg bg-gradient-to-r from-[rgba(53,191,255,0.02)] to-[rgba(53,191,255,0.02)]">
              <ScribbleLines />
            </div>
          </div>

          <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#061026] to-[#001022] border border-[rgba(53,191,255,0.06)]">
              <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Advantages</div>
              <div className="space-y-3">
                {advantages.map((a) => (
                  <div key={a.title} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[linear-gradient(135deg,#35BFFF,#35BFFF)] shadow-md">
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                        <path d="M20 6L9 17l-5-5" stroke="#021226" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{a.title}</div>
                      <div className="text-sm text-slate-400">{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#06101a] to-[#050618] border border-[rgba(53,191,255,0.04)]">
              <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Without these services</div>
              <div className="space-y-3">
                {disadvantages.map((d) => (
                  <div key={d.title} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[rgba(255,255,255,0.03)]">
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                        <path d="M6 18L18 6M6 6l12 12" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{d.title}</div>
                      <div className="text-sm text-slate-400">{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#021124] to-[#00121a] border border-[rgba(53,191,255,0.03)] col-span-2">
              <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">How teams use these services</div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                <li>• Rapid A/B testing for marketing creatives</li>
                <li>• Automated short-form video production</li>
                <li>• Consistent brand imaging across campaigns</li>
                <li>• Scalable chat & support automations</li>
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
   ReadyToMakeTheChangeCTA
--------------------------------------- */
function ReadyToMakeTheChangeCTA() {
  const { ref, inView } = useInView(0.3)
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <div
        ref={ref}
        className={`bg-gray-900 border border-[rgba(53,191,255,0.18)] rounded-3xl p-10 md:p-20 text-center shadow-2xl transition-all duration-1000 ease-out
        ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight"
          style={{ textShadow: '0 2px 10px rgba(53,191,255,0.18)', fontFamily: 'Poppins, Inter, sans-serif' }}
        >
          Elevate Your Ambition
        </h2>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
          Join the platform where tomorrow&apos;s AI innovations are built today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            href="/browse"
            className="px-10 py-4 text-lg font-bold rounded-xl bg-[#35BFFF] text-white hover:bg-[#2fb2ff] transition shadow-lg transform hover:scale-[1.03]"
          >
            Explore Services
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
   FactCard
--------------------------------------- */
function FactCard({ stat, label, desc, index }: { stat: string; label: string; desc: string; index: number }) {
  const { ref, inView } = useInView(0.25)
  return (
    <div
      ref={ref}
      className={`bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)] hover:border-[rgba(53,191,255,0.28)] hover:shadow-[0_20px_40px_rgba(53,191,255,0.06)]
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms', willChange: 'opacity, transform' }}
    >
      <div className="text-5xl font-extrabold text-[#35BFFF] mb-3">{stat}</div>
      <div className="text-lg font-semibold text-white mb-2">{label}</div>
      <div className="text-slate-300 text-base">{desc}</div>
    </div>
  )
}

/* ---------------------------------------
   AIStats
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
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[70%] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(53,191,255,0.45), transparent)' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-14 text-center tracking-tight" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
          The Future of Freelancing
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <FactCard key={s.label} {...s} />
          ))}
        </div>
        <div className="text-center text-[#35BFFF] text-xl font-light mt-16 max-w-3xl mx-auto">
          <span className="italic font-normal">
            AI freelancers are transforming how companies innovate, scale, and win.
          </span>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------
   HowItWorks
--------------------------------------- */
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
      className={`bg-gray-800 border border-gray-700 rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)] hover:shadow-[0_24px_40px_rgba(53,191,255,0.06)]
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms', willChange: 'opacity, transform' }}
    >
      <div className="mb-4 p-3 rounded-full bg-[#071329]">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-base">{desc}</p>
    </div>
  )
}

function HowItWorks() {
  const points = [
    { icon: (<svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#35BFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>), title: 'Vetted Talent', desc: 'Sellers are vetted for expertise and delivery history.' },
    { icon: (<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 8v4l3 3m-3 7a9 9 0 110-18 9 9 0 010 18z" stroke="#35BFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>), title: '24/7 Support', desc: 'Help whenever you need it.' },
    { icon: (<svg width="24" height="24" viewBox="0 0 24 24"><path d="M8 10h.01M16 10h.01M12 12c-3.1 0-6 2.3-6 5h12c0-2.7-2.9-5-6-5z" stroke="#35BFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>), title: 'Collaboration', desc: 'Seamless communication and delivery tracking.' },
    { icon: (<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 3v18M4 7h16M4 17h16" stroke="#35BFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>), title: 'Escrow Payments', desc: 'Funds protected until you accept the work.' },
  ]
  return (
    <section className="w-full py-24 px-4 bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(53,191,255,0.4), transparent)' }} />
        <div className="absolute bottom-10 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(53,191,255,0.4), transparent)' }} />
      </div>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-14 text-center tracking-tight" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
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

/* ---------------------------------------
   WhyHumanaira
--------------------------------------- */
function WhyHumanaira() {
  const items = [
    { title: 'Curated Talent', desc: 'Top performers only. We vet portfolios and delivery history.' },
    { title: 'AI-First Workflows', desc: 'Faster iterations with integrated tooling.' },
    { title: 'Transparent Pricing', desc: 'Clear fees, milestone-based payments.' },
    { title: 'Reliable Support', desc: 'SLA-backed, multilingual support.' },
  ]
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-14 text-center text-white tracking-tight" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
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
      className={`p-6 rounded-xl bg-gray-900 border border-[rgba(53,191,255,0.12)] shadow-xl hover:-translate-y-[4px] transition-transform duration-300 flex flex-col items-center text-center transition-all duration-700 ease-[cubic-bezier(.2,.9,.3,1)]
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: inView ? `${index * 80 + 80}ms` : '0ms', willChange: 'opacity, transform' }}
    >
      <div className="font-semibold text-white text-lg mb-2">{title}</div>
      <div className="text-slate-300 text-sm">{desc}</div>
    </div>
  )
}

/* ---------------------------------------
   FAQ
--------------------------------------- */
function FAQSection() {
  const faqs = [
    {
      q: 'How do payments work?',
      a: 'You pay securely via our gateway. Funds are held in escrow until you accept the work.',
    },
    {
      q: 'What if I need revisions?',
      a: 'Sellers typically include revision rounds; track them in the order workspace.',
    },
    {
      q: 'Is there a refund policy?',
      a: 'Contact support within 7 days for any claim and we will review your case.',
    },
  ]
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative max-w-5xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-12 text-center text-white tracking-tight" style={{ fontFamily: 'Poppins, Inter, sans-serif' }}>
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
                className="text-[#35BFFF] text-3xl transition-transform duration-300"
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
   BackgroundBrand
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
   GLOBAL STYLES (fonts + subtle hero glow)
--------------------------------------- */
function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;600;700;800;900&family=Pacifico&display=swap');

      :root {
        --accent: #35BFFF;
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

      .hero-headline {
        font-family: 'Poppins', 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        font-weight: 900;
        color: #ffffff;
        letter-spacing: -0.02em;
        -webkit-text-stroke: 0.4px rgba(0,0,0,0.16);
        text-shadow:
          0 2px 8px rgba(0,0,0,0.55),
          0 6px 24px rgba(53,191,255,0.40),
          0 0 18px rgba(53,191,255,0.45);
      }

      .handwritten {
        font-family: 'Pacifico', 'Inter', cursive;
        color: #35BFFF;
        font-weight: 400;
        font-size: 1.02em;
        text-shadow: 0 4px 20px rgba(53,191,255,0.45);
        display: inline-block;
      }

      ::-webkit-scrollbar { width: 10px; height: 10px; }
      ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 10px; border: 3px solid #080911; }
      ::-webkit-scrollbar-track { background: #1f2937; }
    `}</style>
  )
}

/* ---------------------------------------
   HERO — CLEAN (no visuals)
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
      className="relative w-full flex items-center justify-center bg-gray-950"
      style={{ minHeight: 'calc(100vh - 72px)' }}
    >
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center">
        <h1
          className="mb-2 leading-tight tracking-tight hero-headline flex flex-col items-center"
          style={{
            fontSize: 'clamp(2.6rem, 7vw, 4.8rem)',
            lineHeight: 1.02,
          }}
        >
          <span style={{ whiteSpace: 'nowrap' }}>Elevate Your Next Project</span>
          <span className="handwritten">with Humanaira</span>
        </h1>

        <div className="relative mt-3 mb-4">
          <div className="mx-auto h-[10px] w-[240px] rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(53,191,255,0.6), transparent)', filter: 'blur(8px)' }} />
          <div className="mx-auto h-px w-[260px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(53,191,255,0.45), transparent)' }} />
        </div>

        <p
          className="text-lg md:text-xl mb-8 max-w-3xl mx-auto font-medium text-slate-300"
          style={{ letterSpacing: '0.01em' }}
        >
          Discover, hire, and collaborate with the next generation of AI talent and digital creators.
        </p>

        <form
          onSubmit={handleSearch}
          className="w-full max-w-xl mx-auto flex items-center justify-center bg-gray-800/60 backdrop-blur-sm rounded-xl border border-[rgba(53,191,255,0.28)] p-2"
          style={{ marginBottom: '1.75rem' }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for services, gigs, or talent..."
            className="flex-1 bg-transparent border-none outline-none text-white text-base px-3 py-3 placeholder:text-slate-400 placeholder:font-light"
            style={{ minWidth: 0, fontSize: '1rem', fontFamily: 'Inter, system-ui' }}
          />
          <button
            type="submit"
            className="ml-2 px-6 py-3 rounded-lg bg-[#35BFFF] text-white font-semibold hover:bg-[#2fb2ff] transition text-base"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-4 justify-center items-center font-medium">
          <Link
            href="/browse"
            className="inline-block px-5 py-2.5 rounded-lg bg-gray-800/80 border border-gray-700 text-[#35BFFF] hover:text-[#2fb2ff] hover:border-[rgba(53,191,255,0.28)] transition"
          >
            Browse Services →
          </Link>
          <Link
            href="/seller/gigs/new"
            className="inline-block px-5 py-2.5 rounded-lg bg-[#35BFFF] border border-[#35BFFF]/30 text-white hover:bg-[#2fb2ff] transition"
          >
            Start Selling AI Services
          </Link>
        </div>
      </div>
    </section>
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
        <GlobalStyles />
        <BackgroundBrand />
      </div>
    </main>
  )
}