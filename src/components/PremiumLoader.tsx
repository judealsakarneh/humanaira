'use client'

const BRAND = '#35BFFF'

export default function PremiumLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen w-full bg-[#030712] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full opacity-20 blur-[100px] animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(53,191,255,0.4) 0%, rgba(96,165,250,0.2) 50%, transparent 70%)',
            animation: 'float-slow 25s ease-in-out infinite, liquid-morph 12s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full opacity-15 blur-[120px] animate-float-medium"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)',
            animation: 'float-medium 30s ease-in-out infinite, liquid-morph 15s ease-in-out infinite reverse'
          }}
        />
      </div>

      {/* Loading spinner */}
      <div className="relative">
        {/* Outer glow ring */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${BRAND}80, transparent)`,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
        
        {/* Main spinner */}
        <div 
          className="w-16 h-16 border-[3px] border-solid rounded-full animate-spin relative"
          style={{
            borderColor: `${BRAND}40`,
            borderTopColor: BRAND,
            boxShadow: `0 0 20px ${BRAND}60, inset 0 0 20px ${BRAND}20`
          }}
        >
          {/* Inner accent ring */}
          <div 
            className="absolute inset-2 border-2 border-solid rounded-full opacity-50"
            style={{
              borderColor: 'transparent',
              borderRightColor: BRAND,
              animation: 'spin 1.5s linear infinite reverse'
            }}
          />
        </div>
      </div>

      {/* Loading text */}
      <div 
        className="mt-8 text-lg font-semibold tracking-wide animate-pulse"
        style={{ color: BRAND }}
      >
        {text}
      </div>

      {/* Shimmer effect */}
      <div className="mt-3 h-1 w-32 rounded-full overflow-hidden bg-slate-800/50">
        <div 
          className="h-full rounded-full animate-shimmer-slide"
          style={{
            background: `linear-gradient(90deg, transparent, ${BRAND}, transparent)`,
            animation: 'shimmer-slide 2s ease-in-out infinite'
          }}
        />
      </div>

      {/* Animation keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, -10px) scale(1.02); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, 25px) scale(1.03); }
          66% { transform: translate(25px, -25px) scale(0.97); }
        }
        @keyframes liquid-morph {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 60% 30% 60% / 30% 50% 70% 40%; }
          75% { border-radius: 60% 40% 50% 60% / 70% 30% 50% 60%; }
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  )
}
