'use client'

import { useEffect, useState, useRef } from 'react'

interface AnimatedEyesProps {
  isPasswordFocused: boolean
}

export default function AnimatedEyes({ isPasswordFocused }: AnimatedEyesProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const eyesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (eyesRef.current) {
        const rect = eyesRef.current.getBoundingClientRect()
        const eyesCenterX = rect.left + rect.width / 2
        const eyesCenterY = rect.top + rect.height / 2
        
        setMousePosition({
          x: e.clientX - eyesCenterX,
          y: e.clientY - eyesCenterY,
        })
      }
    }

    if (!isPasswordFocused) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isPasswordFocused])

  // Calculate pupil position based on mouse
  const getPupilPosition = (maxDistance: number = 8) => {
    const distance = Math.sqrt(mousePosition.x ** 2 + mousePosition.y ** 2)
    const angle = Math.atan2(mousePosition.y, mousePosition.x)
    const limitedDistance = Math.min(distance / 30, maxDistance)
    
    return {
      x: Math.cos(angle) * limitedDistance,
      y: Math.sin(angle) * limitedDistance,
    }
  }

  const pupilPos = getPupilPosition()

  return (
    <div ref={eyesRef} className="flex items-center justify-center gap-8 mb-6">
      {/* Left Eye */}
      <div className="relative">
        <div
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
          style={{
            transform: isPasswordFocused ? 'scaleY(0.1)' : 'scaleY(1)',
          }}
        >
          {!isPasswordFocused && (
            <div
              className="w-8 h-8 bg-slate-900 rounded-full transition-transform duration-150 ease-out"
              style={{
                transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
              }}
            >
              <div className="w-3 h-3 bg-white rounded-full ml-2 mt-2 opacity-80" />
            </div>
          )}
        </div>
        {/* Eyelid when closed */}
        {isPasswordFocused && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-1 bg-slate-700 rounded-full" />
          </div>
        )}
      </div>

      {/* Right Eye */}
      <div className="relative">
        <div
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
          style={{
            transform: isPasswordFocused ? 'scaleY(0.1)' : 'scaleY(1)',
          }}
        >
          {!isPasswordFocused && (
            <div
              className="w-8 h-8 bg-slate-900 rounded-full transition-transform duration-150 ease-out"
              style={{
                transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
              }}
            >
              <div className="w-3 h-3 bg-white rounded-full ml-2 mt-2 opacity-80" />
            </div>
          )}
        </div>
        {/* Eyelid when closed */}
        {isPasswordFocused && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-1 bg-slate-700 rounded-full" />
          </div>
        )}
      </div>
    </div>
  )
}
