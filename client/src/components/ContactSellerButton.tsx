'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../app/api/lib/supabaseBrowser'
import { getOrCreateConversation } from '../lib/messaging'

type Gig = {
  id: string
  seller_id: string
  title?: string
}

export default function ContactSellerButton({ gig, className }: { gig: Gig; className?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowser()

  async function handleContact() {
    try {
      setLoading(true)
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) {
        // not signed in — redirect to account/login
        router.push('/account')
        return
      }

      // create or fetch existing conversation
      const conv = await getOrCreateConversation({
        gigId: gig.id,
        sellerId: gig.seller_id,
        buyerId: user.id,
      })

      // Send initial message if it's a new conversation
      // The message will be picked up by realtime subscription in the messages page
      const initialText = `Hi! I'm interested in "${gig.title || 'your service'}".`
      
      try {
        // Import sendMessage dynamically to avoid circular dependencies
        const { sendMessage } = await import('@/lib/messaging')
        await sendMessage({
          conversationId: conv.id,
          text: initialText,
          attachments: [],
          isSystem: false,
        })
      } catch (msgErr) {
        console.error('Failed to send initial message', msgErr)
        // Continue anyway - user can send message manually
      }

      // redirect to messages page and auto-open conversation
      router.push(`/messages?conv=${conv.id}`)
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