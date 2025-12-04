'use client'
import React from 'react'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Modern Supabase setup doesn't need SessionContextProvider
  // Use createSupabaseBrowser() directly in components that need it
  return <>{children}</>
}