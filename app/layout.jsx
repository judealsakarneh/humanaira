import '../src/app/globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata = {
  title: 'humanaira - AI Freelance Marketplace',
  description: 'Connect with AI-powered freelancers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
