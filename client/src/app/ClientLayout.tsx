'use client'
import NavBar from './components/NavBar'
import Footer from '../components/Footer'

export default function ClientLayout({
  children,
  showNav,
}: {
  children: React.ReactNode
  showNav: boolean
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {showNav && <NavBar />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}