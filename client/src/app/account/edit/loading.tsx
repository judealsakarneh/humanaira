'use client'

const BRAND = '#35BFFF'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
      <div
        className="w-12 h-12 border-4 border-solid border-t-transparent rounded-full animate-spin mb-4"
        style={{ borderColor: BRAND }}
      />
      <div className="text-xl font-medium" style={{ color: BRAND }}>
        Loading editor...
      </div>
    </div>
  )
}