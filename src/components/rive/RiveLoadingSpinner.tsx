'use client'

import { useRive } from '@rive-app/react-canvas'

interface RiveLoadingSpinnerProps {
  className?: string
}

export default function RiveLoadingSpinner({ className = 'w-20 h-8' }: RiveLoadingSpinnerProps) {
  const { RiveComponent } = useRive({
    src: '/animations/loading-dots.riv',
    autoplay: true,
  })

  return (
    <div className={className}>
      <RiveComponent />
    </div>
  )
}
