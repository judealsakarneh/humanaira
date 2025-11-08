import './globals.css'
import { Toaster } from 'react-hot-toast'
import React from 'react'
import { headers } from 'next/headers'
import ClientLayout from './ClientLayout'
import ClientProviders from './ClientProviders'
import Script from 'next/script'

export const metadata = {
  title: 'Humanaira',
  description: 'The best AI services marketplace',
  icons: { 
    icon: '/favicon.svg',
    apple: '/logo192.png'
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const pathname = h.get('x-invoke-path') || ''
  const showNav = !pathname.startsWith('/account')

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FL1CT5EXRS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FL1CT5EXRS');
          `}
        </Script>
      </head>
      <body className="bg-gray-50 text-gray-900">
        <Toaster position="top-right" />
        <ClientProviders>
          <ClientLayout showNav={showNav}>
            {children}
          </ClientLayout>
        </ClientProviders>
      </body>
    </html>
  )
}