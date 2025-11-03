'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../app/api/lib/supabaseBrowser'
import { sendMessage } from '../lib/messaging'

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
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) {
        // not signed in — redirect to account/login
        router.push('/account')
        return
      }

      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: user.id,
          seller_id: gig.seller_id,
          gig_id: gig.id,
        }),
      })

      if (!res.ok) {
        throw new Error('Could not start conversation')
      }

      const body = await res.json()
      const conversationId = body?.id as string | undefined
      const wasCreated = Boolean(body?.created)

      if (!conversationId) {
        throw new Error('Missing conversation identifier')
      }

      if (wasCreated && gig.title) {
        try {
          const origin = typeof window !== 'undefined' ? window.location.origin : ''
          const serviceUrl = gig.slug ? `${origin}/services/${gig.slug}` : ''
          const introLines = [
            `Hi there,`,
            '',
            `I'm interested in your service "${gig.title}" and would love to chat about the details.`,
          ]
          if (serviceUrl) {
            introLines.push('', `Service link: ${serviceUrl}`)
          }
          await sendMessage({
            conversationId,
            text: introLines.join('\n'),
            attachments: [],
          })
        } catch (messageErr) {
          console.error('Failed to send intro message', messageErr)
        }
      }

      router.push(`/messages?conv=${conversationId}`)
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