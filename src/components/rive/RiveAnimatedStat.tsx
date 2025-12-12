'use client'

import { useRive } from '@rive-app/react-canvas'
import { useEffect } from 'react'

interface RiveAnimatedStatProps {
  inView: boolean
  className?: string
}

export default function RiveAnimatedStat({ inView, className = 'w-full h-32' }: RiveAnimatedStatProps) {
  const { rive, RiveComponent } = useRive({
    src: '/animations/counter-up.riv',
    autoplay: false,
  })

  useEffect(() => {
    if (inView && rive) {
      rive.play()
    }
  }, [inView, rive])

  return (
    <div className={className}>
      <RiveComponent />
    </div>
  )
}
