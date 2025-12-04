'use client'
import React from 'react'

export default function ClientProvidersClient({ children }: { children: React.ReactNode }) {
  // Modern Supabase doesn't need SessionContextProvider
  // Use createSupabaseBrowser() directly in components
  return <>{children}</>
}