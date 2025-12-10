'use client'

import { useRive, useStateMachineInput } from '@rive-app/react-canvas'
import { ReactNode } from 'react'

interface RiveButtonHoverProps {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function RiveButtonHover({ 
  children, 
  onClick, 
  className = '',
  disabled = false 
}: RiveButtonHoverProps) {
  const { rive, RiveComponent } = useRive({
    src: '/animations/button-hover.riv',
    stateMachines: 'Hover',
    autoplay: true,
  })

  const hoverInput = useStateMachineInput(rive, 'Hover', 'isHover')

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative ${className}`}
      onMouseEnter={() => hoverInput?.value && (hoverInput.value = true)}
      onMouseLeave={() => hoverInput?.value && (hoverInput.value = false)}
    >
      <div className="absolute inset-0 -z-10">
        <RiveComponent />
      </div>
      {children}
    </button>
  )
}
