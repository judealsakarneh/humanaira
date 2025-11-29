import HumanairaLoader from '../../components/HumanairaLoader'

export default function ServicesSegmentLoading() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0F1F] pt-24 md:pt-28">
      <HumanairaLoader subtitle="Loading services…" />
    </main>
  )
}