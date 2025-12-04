'use client'
import React from 'react'
import { AuthProvider } from './hooks/useAuth'

export default function ClientProvidersClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}