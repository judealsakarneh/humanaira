export default function GlassyWater() {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          overflow: 'hidden',
          transformOrigin: 'center',
          mixBlendMode: 'screen',
          opacity: 0.55,
        }}
        className="glassy-water-layer"
      />
      <style jsx>{`
        .glassy-water-layer {
          background:
            radial-gradient(40% 30% at 10% 20%, rgba(53,191,255,0.06), transparent 12%),
            radial-gradient(30% 20% at 80% 80%, rgba(53,191,255,0.04), transparent 10%),
            linear-gradient(180deg, rgba(255,255,255,0.02), rgba(2,6,23,0.03));
          filter: blur(18px) saturate(120%);
          animation: waterFlow 14s linear infinite;
        }
        @keyframes waterFlow {
          0% { transform: translateY(0px) scale(1); opacity: 0.56; }
          50% { transform: translateY(-6px) scale(1.01); opacity: 0.48; }
          100% { transform: translateY(0px) scale(1); opacity: 0.56; }
        }
        @media (max-width: 640px) {
          .glassy-water-layer { filter: blur(10px) saturate(110%); animation-duration: 18s; }
        }
      `}</style>
    </>
  )
}