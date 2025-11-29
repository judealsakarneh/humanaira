'use client'

export default function HumanairaLoader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-[560px] max-w-[80vw]">
        <svg viewBox="0 0 560 140" className="w-full h-auto" role="img" aria-label="humanaira loading">
          <defs>
            <linearGradient id="humanaira-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Stroke (outline drawing) */}
          <text
            x="50%" y="55%" textAnchor="middle" dominantBaseline="middle"
            fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
            fontWeight="800" fontSize="72"
            fill="transparent" stroke="url(#humanaira-grad)" strokeWidth="2.2"
            className="hum-stroke" filter="url(#soft-glow)"
          >
            humanaira
          </text>

          {/* Fill fades in after stroke draws */}
          <text
            x="50%" y="55%" textAnchor="middle" dominantBaseline="middle"
            fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
            fontWeight="800" fontSize="72"
            fill="url(#humanaira-grad)" className="hum-fill"
          >
            humanaira
          </text>
        </svg>
      </div>

      {subtitle && <div className="text-slate-300 text-sm tracking-wide">{subtitle}</div>}

      <style jsx>{`
        .hum-stroke {
          stroke-dasharray: 1200;
          stroke-dashoffset: 1200;
          animation: hum-draw 2.2s ease-in-out forwards;
        }
        .hum-fill {
          opacity: 0;
          animation: hum-fill 0.8s ease-in forwards;
          animation-delay: 1.8s;
        }
        @keyframes hum-draw { to { stroke-dashoffset: 0; } }
        @keyframes hum-fill { to { opacity: 1; } }
      `}</style>
    </div>
  )
}