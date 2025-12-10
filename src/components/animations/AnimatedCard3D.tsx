'use client'

import { useState, useRef, ReactNode } from 'react'

export function AnimatedCard3D({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setGlowPosition({ x, y })
    
    const rotateX = ((y - 50) / 50) * -10
    const rotateY = ((x - 50) / 50) * 10
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setGlowPosition({ x: 50, y: 50 })
  }

  return (
    <div
      ref={cardRef}
      className={`animated-card-3d ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
      }}
    >
      <div
        className="card-glow"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(53,191,255,0.15), transparent 60%)`,
        }}
      />
      {children}
      <style jsx>{`
        .animated-card-3d {
          position: relative;
          transition: transform 0.3s ease;
          transform-style: preserve-3d;
        }
        .card-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .animated-card-3d:hover .card-glow {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
