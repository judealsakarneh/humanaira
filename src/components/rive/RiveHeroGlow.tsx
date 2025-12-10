'use client'

import { useRive } from '@rive-app/react-canvas'

export default function RiveHeroGlow() {
  const { RiveComponent } = useRive({
    src: '/animations/hero-glow.riv',
    autoplay: true,
  })

  return (
    <div className="absolute inset-0 -z-10 opacity-40 pointer-events-none overflow-hidden">
      <RiveComponent />
    </div>
  )
}
