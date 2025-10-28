// Messaging helper library (client-side helpers using Supabase)
// Place this file at: client/src/lib/messaging.ts
// Usage examples:
// import { getOrCreateConversation, sendMessage, uploadChatFile, sendPaymentRequest, startPaymentForRequest } from '@/lib/messaging'
// (Adjust import paths in your app if you don't use the @ alias)

import { createSupabaseBrowser } from '../api/lib/supabaseBrowser'

type ConversationRow = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  last_message?: string | null
  status: string
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

type MessageRow = {
  id: string
  conversation_id: string
  sender_id: string
  text?: string | null
  attachments?: string[] | null
  is_system?: boolean
  blocked?: boolean
  created_at?: string
}

type PaymentRequestRow = {
  id: string
  conversation_id?: string | null
  from_id: string
  to_id: string
  amount_cents: number
  currency: string
  status: string
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

/**
 * Find or create a conversation for the given gig & participants.
 * - Tries to find exact match when gigId provided, then falls back to participant-only match.
 * - Returns the conversation row.
 */
export async function getOrCreateConversation({
  gigId,
  sellerId,
  buyerId,
}: {
  gigId?: string | null
  sellerId: string
  buyerId: string
}) {
  const supabase = createSupabaseBrowser()

  // If gigId provided, try exact match first
  if (gigId) {
    const { data: existingByGig, error: e1 } = await supabase
      .from('conversations')
      .select('*')
      .eq('gig_id', gigId)
      .eq('seller_id', sellerId)
      .eq('buyer_id', buyerId)
      .limit(1)

    if (e1) throw e1
    if (existingByGig && existingByGig.length > 0) return (existingByGig as unknown) as ConversationRow
  }

  // Try to find a conversation between the two participants (either order)
  const { data: existing, error: e2 } = await supabase
    .from('conversations')
    .select('*')
    .or(`and(seller_id.eq.${sellerId},buyer_id.eq.${buyerId}),and(seller_id.eq.${buyerId},buyer_id.eq.${sellerId})`)
    .limit(1)

  if (e2) throw e2
  if (existing && existing.length > 0) return (existing as unknown) as ConversationRow

  // Create a new conversation
  const payload: Partial<ConversationRow> = {
    gig_id: gigId ?? null,
    seller_id: sellerId,
    buyer_id: buyerId,
    status: 'open',
    metadata: {},
  }

  const { data, error } = await supabase.from('conversations').insert([payload]).select().single()
  if (error) throw error
  return (data as unknown) as ConversationRow
}

/**
 * Send a message in a conversation (client-side).
 * - Ensures user is authenticated.
 * - Inserts message row, then creates a notification for the other participant.
 */
export async function sendMessage({
  conversationId,
  text,
  attachments = [],
  isSystem = false,
}: {
  conversationId: string
  text?: string | null
  attachments?: string[]
  isSystem?: boolean
}) {
  const supabase = createSupabaseBrowser()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: conversationId,
        sender_id: user.id,
        text: text ?? null,
        attachments,
        is_system: isSystem,
      },
    ])
    .select()
    .single()

  if (error) throw error

  // create a notification for the other participant
  try {
    const { data: conv } = await supabase.from('conversations').select('*').eq('id', conversationId).limit(1).single()
    if (conv) {
      const otherId = conv.seller_id === user.id ? conv.buyer_id : conv.seller_id
      await supabase.from('notifications').insert([
        {
          user_id: otherId,
          type: 'message_received',
          payload: { conversation_id: conversationId, snippet: (text || '')?.slice(0, 200) },
        },
      ])
    }
  } catch (e) {
    // Don't block on notification failure
    // eslint-disable-next-line no-console
    console.warn('Failed to create notification after sendMessage', e)
  }

  return (data as unknown) as MessageRow
}

/**
 * Upload a chat file to the 'chat-media' storage bucket.
 * - Returns the public URL (for public bucket) or the object returned by getPublicUrl.
 * - For private buckets you should implement a signed URL flow on the server.
 */
export async function uploadChatFile(file: File) {
  const supabase = createSupabaseBrowser()
  const key = `chat/${Date.now()}_${file.name}`
  const { error } = await supabase.storage.from('chat-media').upload(key, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from('chat-media').getPublicUrl(key)
  return data.publicUrl
}

/**
 * Create a payment_request row (freelancer -> buyer) and notify the target.
 */
export async function sendPaymentRequest({
  conversationId,
  amountCents,
  currency = 'usd',
  toId,
}: {
  conversationId: string
  amountCents: number
  currency?: string
  toId: string
}) {
  const supabase = createSupabaseBrowser()
  const { data: authData } = await supabase.auth.getUser()
  const user = authData?.user
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('payment_requests')
    .insert([
      {
        conversation_id: conversationId,
        from_id: user.id,
        to_id: toId,
        amount_cents: amountCents,
        currency,
        status: 'pending',
      },
    ])
    .select()
    .single()

  if (error) throw error

  // create a notification for the target
  try {
    await supabase.from('notifications').insert([
      {
        user_id: toId,
        type: 'payment_requested',
        payload: { request_id: (data as any).id, amount_cents: amountCents, conversation_id: conversationId },
      },
    ])
  } catch (e) {
    // swallow notification error
    // eslint-disable-next-line no-console
    console.warn('Failed to create notification after sendPaymentRequest', e)
  }

  return (data as unknown) as PaymentRequestRow
}

/**
 * Start Stripe Checkout for a payment request.
 * - Calls server API /api/payments/create-session which must create a Stripe session with metadata.payment_request_id.
 * - Redirects the browser to the checkout URL.
 */
export async function startPaymentForRequest(paymentRequestId: string) {
  const res = await fetch('/api/payments/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_request_id: paymentRequestId }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error || 'Failed to create session')
  if (!json.url) throw new Error('No checkout url returned')
  // redirect to Stripe Checkout
  window.location.href = json.url
}