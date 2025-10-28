'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import {
  uploadChatFile,
  sendMessage,
  sendPaymentRequest,
  startPaymentForRequest,
} from '../../lib/messaging'

type Conversation = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  status?: string
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
  created_at?: string
  updated_at?: string
}

function detectExternalContact(text: string) {
  if (!text) return false
  const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
  const phone = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/
  const link = /\b(?:https?:\/\/|www\.|paypal\.me|venmo\.com|cash.app|zelle)\S*/i
  return email.test(text) || link.test(text) || phone.test(text)
}

export default function ChatWindow({ conversation }: { conversation: Conversation }) {
  const supabase = createSupabaseBrowser()
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestRow[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // load current user id
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUserId(data?.user?.id ?? null)
    })()
    return () => {
      mounted = false
    }
  }, [supabase])

  // Load messages and subscribe to realtime inserts
  useEffect(() => {
    if (!conversation) return
    let mounted = true

    const loadMessages = async () => {
      try {
        const res = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })
          .limit(500)
        const data = (res.data as unknown) as MessageRow[] | null
        if (mounted) setMessages(data || [])
        // scroll after load
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'auto' }), 120)
      } catch (err) {
        console.error('Failed to load messages', err)
      }
    }

    loadMessages()

    const channel = supabase
      .channel(`public:messages:conversation=${conversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversation.id}` },
        (payload: any) => {
          const newMsg = payload.new as MessageRow
          setMessages((prev) => [...prev, newMsg])
          setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      mounted = false
    }
  }, [supabase, conversation])

  // Load payment requests for this conversation and subscribe to realtime changes
  useEffect(() => {
    if (!conversation) return
    let mounted = true

    const loadRequests = async () => {
      try {
        const res = await supabase
          .from('payment_requests')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })
        const data = (res.data as unknown) as PaymentRequestRow[] | null
        if (mounted) setPaymentRequests(data || [])
      } catch (err) {
        console.error('Failed to load payment requests', err)
      }
    }

    loadRequests()

    const channel = supabase
      .channel(`public:payment_requests:conversation=${conversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'payment_requests', filter: `conversation_id=eq.${conversation.id}` },
        (payload: any) => {
          const newRow = payload.new as PaymentRequestRow
          setPaymentRequests((prev) => [...prev, newRow])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'payment_requests', filter: `conversation_id=eq.${conversation.id}` },
        (payload: any) => {
          const updated = payload.new as PaymentRequestRow
          setPaymentRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      mounted = false
    }
  }, [supabase, conversation])

  useEffect(() => {
    // keep scrolled to bottom when messages change
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current?.scrollHeight ?? 0, behavior: 'auto' }), 150)
  }, [messages.length])

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault()
    if ((!text || text.trim().length === 0) && files.length === 0) return
    setSending(true)

    // Moderation: simple detection for external contact or payment links
    if (text && detectExternalContact(text)) {
      await sendMessage({
        conversationId: conversation.id,
        text: '[Message blocked: external contact or payment link detected]',
        attachments: [],
        isSystem: true,
      })
      setText('')
      setFiles([])
      setSending(false)
      return
    }

    // upload files
    const uploaded: string[] = []
    try {
      for (const f of files) {
        const url = await uploadChatFile(f)
        uploaded.push(url)
      }

      await sendMessage({
        conversationId: conversation.id,
        text: text || null,
        attachments: uploaded,
        isSystem: false,
      })
    } catch (err) {
      console.error('sendMessage error', err)
      alert('Failed to send message')
    } finally {
      setText('')
      setFiles([])
      setSending(false)
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files
    if (!f?.length) return
    const file = f[0]
    // simple size guard (100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('File too large (max 100MB)')
      return
    }
    setFiles([file])
    e.currentTarget.value = ''
  }

  async function handleRequestPaymentClick() {
    if (!userId) return alert('Please sign in')
    const amount = prompt('Enter amount in USD (e.g. 150.00)')
    if (!amount) return
    const cents = Math.round(Number(amount) * 100)
    if (!cents || cents <= 0) return alert('Invalid amount')
    const otherId = conversation.seller_id === userId ? conversation.buyer_id : conversation.seller_id
    try {
      // create payment_request row (seller triggers this)
      const pr = await sendPaymentRequest({
        conversationId: conversation.id,
        amountCents: cents,
        toId: otherId,
      })
      // optionally insert a system message announcing the request
      await sendMessage({
        conversationId: conversation.id,
        text: `Payment request: $${(cents / 100).toFixed(2)}`,
        attachments: [],
        isSystem: true,
      })
      alert('Payment request created')
    } catch (err) {
      console.error('Failed to create payment request', err)
      alert('Failed to create payment request')
    }
  }

  async function handlePay(requestId: string) {
    try {
      await startPaymentForRequest(requestId)
      // startPaymentForRequest will redirect; code continues only if there was an error
    } catch (err: any) {
      console.error('Failed to start payment', err)
      alert(err?.message || 'Payment failed to start')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <header className="border-b border-slate-700/60 pb-3 mb-3 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold">{conversation.gig_id ? 'Service conversation' : 'Conversation'}</div>
          <div className="text-sm text-slate-400">Chat with the other participant</div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleRequestPaymentClick} className="px-3 py-2 bg-sky-700 rounded text-white text-sm">
            Request Payment
          </button>
        </div>
      </header>

      {/* Payment requests list */}
      {paymentRequests.length > 0 && (
        <div className="mb-3 space-y-2">
          <div className="text-sm text-slate-300 font-medium">Payment requests</div>
          <div className="space-y-2">
            {paymentRequests.map((r) => {
              const isRecipient = userId && r.to_id === userId
              return (
                <div key={r.id} className="flex items-center justify-between bg-[#071022] p-2 rounded">
                  <div>
                    <div className="text-sm text-slate-100">Request: ${(r.amount_cents / 100).toFixed(2)}</div>
                    <div className="text-xs text-slate-400">Status: {r.status}</div>
                  </div>
                  <div>
                    {r.status === 'pending' && isRecipient && (
                      <button onClick={() => handlePay(r.id)} className="px-3 py-1 rounded bg-emerald-600 text-white">
                        Pay
                      </button>
                    )}
                    {r.status === 'pending' && !isRecipient && (
                      <div className="text-xs text-slate-400">Waiting for payment</div>
                    )}
                    {r.status !== 'pending' && <div className="text-xs text-slate-400">Paid</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-3 bg-[#080E1B] rounded">
        {messages.map((m) => {
          const isMe = userId && m.sender_id === userId
          const time = m.created_at ? new Date(m.created_at).toLocaleString() : ''
          return (
            <div key={m.id} className={`max-w-[80%] ${isMe ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
              <div
                className={`inline-block p-3 rounded-xl ${
                  m.is_system ? 'bg-slate-700/70 text-slate-200' : isMe ? 'bg-sky-700 text-white' : 'bg-[#111827] text-slate-200'
                }`}
              >
                {m.text && <div className="whitespace-pre-wrap">{m.text}</div>}
                {Array.isArray(m.attachments) && m.attachments.length > 0 && (
                  <div className="mt-2 flex gap-2 flex-wrap justify-center">
                    {m.attachments.map((a, i) =>
                      a.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video key={i} src={a} controls className="w-48 h-28 rounded" />
                      ) : (
                        <img key={i} src={a} className="w-48 h-28 object-cover rounded" />
                      )
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">{time}</div>
            </div>
          )
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="mt-3 border-t border-slate-700/60 pt-3"
      >
        <div className="flex items-center gap-2">
          <label className="p-2 rounded bg-[#0B1024] border border-slate-700/60 cursor-pointer">
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
            <span className="text-slate-300 text-sm">Attach</span>
          </label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 p-3 rounded-lg bg-[#0B1024] border border-slate-700/60"
          />
          <button type="submit" disabled={sending} className="px-4 py-2 rounded-lg bg-sky-600 text-white">
            {sending ? 'Sending…' : 'Send'}
          </button>
        </div>
        {files.length > 0 && <div className="mt-2 text-sm text-slate-300">Attached: {files[0].name}</div>}
      </form>
    </div>
  )
}