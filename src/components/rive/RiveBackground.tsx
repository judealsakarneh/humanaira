'use client'

import { useRive } from '@rive-app/react-canvas'

export default function RiveBackground() {
  const { RiveComponent } = useRive({
    src: '/animations/floating-particles.riv',
    autoplay: true,
  })

  return (
    <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
      <RiveComponent />
    </div>
  )
}
