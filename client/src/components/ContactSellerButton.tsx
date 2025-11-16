'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../app/api/lib/supabaseBrowser'

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
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      
      if (!user) {
        // not signed in — redirect to account/login
        router.push('/account')
        return
      }

      // Call the new Twilio conversation endpoint
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Could not start conversation')
      }

      const body = await res.json()
      const { dbConversationId, conversationSid } = body

      if (!dbConversationId || !conversationSid) {
        throw new Error('Missing conversation data')
      }

      // Navigate to messages page with the conversation
      router.push(`/messages?conv=${dbConversationId}`)
    } catch (err) {
      console.error('Contact seller failed', err)
      alert('Could not open chat. Please try again.')
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