'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../app/api/lib/supabaseBrowser'
import { addDebugLog } from './DebugPanel'

type Gig = {
  id: string
  seller_id: string
  title?: string | null
  slug?: string | null
}

export default function ContactSellerButton({ gig, className }: { gig: Gig; className?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  async function handleContact() {
    try {
      setLoading(true)
      addDebugLog('info', 'Contact Seller clicked', { gigId: gig.id, sellerId: gig.seller_id })
      
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      
      if (!user) {
        addDebugLog('error', 'User not logged in - redirecting to /account')
        router.push('/account')
        return
      }

      addDebugLog('success', 'User authenticated', { userId: user.id })

      // Call the new Twilio conversation endpoint
      addDebugLog('info', 'Calling /api/chat/conversations...')
      const res = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          sellerId: gig.seller_id,
          gigId: gig.id,
        }),
      })

      addDebugLog('info', `API Response: ${res.status} ${res.statusText}`)

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        addDebugLog('error', 'API returned error', errorData)
        throw new Error(errorData.error || 'Could not start conversation')
      }

      const body = await res.json()
      addDebugLog('success', 'Conversation created/retrieved', body)
      
      const { dbConversationId, conversationSid } = body

      if (!dbConversationId || !conversationSid) {
        addDebugLog('error', 'Missing conversation IDs in response', body)
        throw new Error('Missing conversation data')
      }

      const targetUrl = `/messages?conv=${dbConversationId}`
      addDebugLog('info', 'Navigating to messages page', { url: targetUrl, convId: dbConversationId })
      router.push(targetUrl)
    } catch (err: any) {
      addDebugLog('error', 'Contact Seller failed', { error: err.message, stack: err.stack })
      alert(`Error: ${err.message}\n\nCheck the debug panel at the bottom of the screen for details.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className={`px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition ${className || ''}`}
      aria-disabled={loading}
    >
      {loading ? 'Opening chat…' : 'Contact seller'}
    </button>
  )
}