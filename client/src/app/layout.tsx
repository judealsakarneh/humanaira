import './globals.css'
import { Toaster } from 'react-hot-toast'
import React from 'react'
import { headers } from 'next/headers'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'Humanaira',
  description: 'The best AI services marketplace',
  icons: { icon: '/favicon.ico' }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const pathname = h.get('x-invoke-path') || ''
  const showNav = !pathname.startsWith('/account')

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Toaster position="top-right" />
        <ClientLayout showNav={showNav}>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}