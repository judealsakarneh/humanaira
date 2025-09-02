'use client'
import NavBar from './components/NavBar'

export default function ClientLayout({
  children,
  showNav,
}: {
  children: React.ReactNode
  showNav: boolean
}) {
  return (
    <>
      {showNav && <NavBar />}
      {children}
    </>
  )
}