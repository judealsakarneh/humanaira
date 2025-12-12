'use client'

import { useState, useEffect } from 'react'

interface Particle {
  left: string
  top: string
  width: string
  height: string
  delay: string
  duration: string
}

export function FloatingParticles({ count = 20 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${4 + Math.random() * 8}px`,
        height: `${4 + Math.random() * 8}px`,
        delay: `${Math.random() * 5}s`,
        duration: `${15 + Math.random() * 25}s`,
      })
    }
    setParticles(newParticles)
  }, [count])

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
      <style jsx>{`
        .floating-particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(53,191,255,0.3), transparent);
          animation: float-up infinite ease-in-out;
          pointer-events: none;
        }
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
