'use client'

import { useRive } from '@rive-app/react-canvas'

export default function RiveOrb() {
  const { RiveComponent } = useRive({
    src: '/animations/ai-orb.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
  })

  return (
    <div className="w-[340px] h-[340px] relative">
      <RiveComponent />
    </div>
  )
}
