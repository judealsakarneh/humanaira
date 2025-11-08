'use client'

import { createSupabaseBrowser } from '../app/api/lib/supabaseBrowser'

export type SendMessageInput = {
  conversationId: string
  text: string | null
  attachments: string[]
  isSystem?: boolean
}

export type SendPaymentRequestInput = {
  conversationId: string
  amountCents: number
  toId: string
}

export type ConversationRow = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  status?: string | null
  created_at?: string
}

const CHAT_BUCKET = process.env.NEXT_PUBLIC_CHAT_BUCKET || 'chat-attachments'

async function getUserIdOrThrow(supabase: ReturnType<typeof createSupabaseBrowser>) {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user?.id) throw new Error('Not authenticated')
  return data.user.id
}

export async function uploadChatFile(file: File): Promise<string> {
  const supabase = createSupabaseBrowser()
  const userId = await getUserIdOrThrow(supabase)

  const ext = file.name.split('.').pop() || 'bin'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const path = `${userId}/${fileName}`

  const { error: uploadErr } = await supabase.storage
    .from(CHAT_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type || undefined })

  if (uploadErr) throw uploadErr

  const { data: pub } = supabase.storage.from(CHAT_BUCKET).getPublicUrl(path)
  if (!pub?.publicUrl) throw new Error('Could not get public URL for upload')

  return pub.publicUrl
}

export async function sendMessage(input: SendMessageInput) {
  const supabase = createSupabaseBrowser()
  const senderId = await getUserIdOrThrow(supabase)

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: input.conversationId,
        sender_id: senderId,
        text: input.text,
        attachments: input.attachments ?? [],
        is_system: !!input.isSystem,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function sendPaymentRequest(input: SendPaymentRequestInput) {
  const supabase = createSupabaseBrowser()
  const fromId = await getUserIdOrThrow(supabase)

  const { data, error } = await supabase
    .from('payment_requests')
    .insert([
      {
        conversation_id: input.conversationId,
        from_id: fromId,
        to_id: input.toId,
        amount_cents: input.amountCents,
        currency: 'usd',
        status: 'pending',
      },
    ])
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function startPaymentForRequest(requestId: string) {
  const res = await fetch('/api/payments/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Failed to create checkout session')
  }

  const data = (await res.json()) as { url?: string; checkoutUrl?: string }
  const url = data.url || data.checkoutUrl
  if (!url) throw new Error('No checkout URL returned')

  window.location.href = url
}

export async function getOrCreateConversation(input: {
  gigId: string
  sellerId: string
  buyerId: string
}): Promise<ConversationRow> {
  const supabase = createSupabaseBrowser()

  const { data: existing, error: findErr } = await supabase
    .from('conversations')
    .select('*')
    .eq('gig_id', input.gigId)
    .eq('seller_id', input.sellerId)
    .eq('buyer_id', input.buyerId)
    .limit(1)
    .maybeSingle()

  if (findErr) throw findErr
  if (existing) return existing as ConversationRow

  const { data: created, error: insertErr } = await supabase
    .from('conversations')
    .insert([
      {
        gig_id: input.gigId,
        seller_id: input.sellerId,
        buyer_id: input.buyerId,
        status: 'open',
      },
    ])
    .select('*')
    .single()

  if (insertErr) {
    const { data: after, error: afterErr } = await supabase
      .from('conversations')
      .select('*')
      .eq('gig_id', input.gigId)
      .eq('seller_id', input.sellerId)
      .eq('buyer_id', input.buyerId)
      .limit(1)
      .maybeSingle()
    if (afterErr) throw insertErr
    if (after) return after as ConversationRow
    throw insertErr
  }

  return created as ConversationRow
}