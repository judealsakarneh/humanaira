'use client'

export default function PremiumLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background blobs with liquid morphing */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(53,191,255,0.4) 0%, rgba(53,191,255,0.1) 50%, transparent 100%)',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full opacity-15 blur-[120px] animate-float-medium"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(168,85,247,0.08) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Multi-ring spinner with glow */}
      <div className="relative">
        <div
          className="w-16 h-16 border-[3px] rounded-full animate-spin"
          style={{
            borderColor: '#35BFFF40',
            borderTopColor: '#35BFFF',
            boxShadow: '0 0 20px #35BFFF60, 0 0 40px #35BFFF30',
          }}
        >
          {/* Inner accent ring */}
          <div
            className="absolute inset-2 border-2 rounded-full opacity-50"
            style={{
              borderColor: 'transparent',
              borderRightColor: '#35BFFF',
              animation: 'spin 1.5s linear infinite reverse',
            }}
          />
        </div>
      </div>

      {/* Loading text with pulse */}
      <div className="mt-8 text-lg font-semibold animate-pulse" style={{ color: '#35BFFF' }}>
        {text}
      </div>

      {/* Shimmer progress bar */}
      <div className="mt-3 h-1 w-32 rounded-full bg-slate-800/50 overflow-hidden">
        <div
          className="h-full rounded-full animate-shimmer-slide"
          style={{
            background: 'linear-gradient(90deg, transparent, #35BFFF, transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      {/* Inline animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -25px) scale(1.08); }
        }
        @keyframes liquid-morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%; }
          75% { border-radius: 60% 40% 60% 40% / 70% 30% 50% 60%; }
        }
        @keyframes shimmer-slide {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .animate-float-slow {
          animation: float-slow 25s ease-in-out infinite, liquid-morph 12s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 30s ease-in-out infinite, liquid-morph 15s ease-in-out infinite;
        }
        .animate-shimmer-slide {
          animation: shimmer-slide 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
