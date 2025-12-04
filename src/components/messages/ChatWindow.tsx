'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createSupabaseBrowser } from '../../app/api/lib/supabaseBrowser'
import {
  uploadChatFile,
  sendMessage,
  sendPaymentRequest,
  startPaymentForRequest,
} from '../../lib/messaging'
import { Client as TwilioClient } from '@twilio/conversations'

type Conversation = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  status?: string
  twilio_sid?: string
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

type ChatWindowProps = {
  conversation: Conversation
  twilioMessages: any[]
  twilioClient: TwilioClient | null
  userId: string | null
}

function detectExternalContact(text: string) {
  if (!text) return false
  const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i
  const phone = /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}/
  const link = /\b(?:https?:\/\/|www\.|paypal\.me|venmo\.com|cash.app|zelle)\S*/i
  return email.test(text) || link.test(text) || phone.test(text)
}

export default function ChatWindow({
  conversation,
  twilioMessages,
  twilioClient,
  userId,
}: ChatWindowProps) {
  const supabase = createSupabaseBrowser()
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestRow[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  // Debug: log props on mount and show in UI
  useEffect(() => {
    const info = `
[DEBUG] ChatWindow mounted
conversation: ${JSON.stringify(conversation, null, 2)}
twilioMessages.length: ${twilioMessages.length}
twilioClient: ${twilioClient ? 'connected' : 'null'}
userId: ${userId}
`
    setDebugInfo(info)
    console.log(info)
  }, [conversation, twilioMessages, twilioClient, userId])

  // load Supabase messages only if no Twilio
  useEffect(() => {
    console.log('[DEBUG] useEffect: load Supabase messages', {
      conversation,
      twilioMessagesLength: twilioMessages.length,
    })
    if (!conversation || twilioMessages.length > 0) return
    let mounted = true

    const loadMessages = async () => {
      try {
        console.log('[DEBUG] Loading Supabase messages for conversation', conversation.id)
        const res = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })
          .limit(500)
        const data = (res.data as unknown) as MessageRow[] | null
        if (mounted) setMessages(data || [])
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'auto' }), 120)
        console.log('[DEBUG] Loaded Supabase messages:', data)
      } catch (err) {
        console.error('[DEBUG] Failed to load messages', err)
      }
    }

    loadMessages()

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages', 
          filter: `conversation_id=eq.${conversation.id}` 
        },
        (payload: any) => {
          console.log('[DEBUG] Real-time payload received:', payload)
          const newMsg = payload.new as MessageRow
          if (mounted) {
            setMessages((prev) => {
              // Prevent duplicates
              if (prev.some(m => m.id === newMsg.id)) {
                console.log('[DEBUG] Duplicate message, skipping:', newMsg.id)
                return prev
              }
              console.log('[DEBUG] Adding new message to state:', newMsg)
              return [...prev, newMsg]
            })
            setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100)
          }
        }
      )
      .subscribe((status) => {
        console.log('[DEBUG] Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('[DEBUG] Successfully subscribed to messages channel')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[DEBUG] Channel error - check RLS policies and realtime settings')
        } else if (status === 'TIMED_OUT') {
          console.error('[DEBUG] Subscription timed out')
        }
      })

    return () => {
      console.log('[DEBUG] Unsubscribing from messages channel')
      supabase.removeChannel(channel)
      mounted = false
    }
  }, [supabase, conversation, twilioMessages.length])

  // Load payment requests and subscribe
  useEffect(() => {
    console.log('[DEBUG] useEffect: load payment requests', { conversation })
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
        console.log('[DEBUG] Loaded payment requests:', data)
      } catch (err) {
        console.error('[DEBUG] Failed to load payment requests', err)
      }
    }

    loadRequests()

    // Set up real-time subscription for payment requests
    const channel = supabase
      .channel(`payment-requests-${conversation.id}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'payment_requests', 
          filter: `conversation_id=eq.${conversation.id}` 
        },
        (payload: any) => {
          console.log('[DEBUG] Real-time payment request INSERT:', payload)
          const newRow = payload.new as PaymentRequestRow
          if (mounted) {
            setPaymentRequests((prev) => {
              // Prevent duplicates
              if (prev.some(r => r.id === newRow.id)) {
                console.log('[DEBUG] Duplicate payment request, skipping:', newRow.id)
                return prev
              }
              console.log('[DEBUG] Adding new payment request to state:', newRow)
              return [...prev, newRow]
            })
          }
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'payment_requests', 
          filter: `conversation_id=eq.${conversation.id}` 
        },
        (payload: any) => {
          console.log('[DEBUG] Real-time payment request UPDATE:', payload)
          const updated = payload.new as PaymentRequestRow
          if (mounted) {
            setPaymentRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
          }
        }
      )
      .subscribe((status) => {
        console.log('[DEBUG] Payment requests subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('[DEBUG] Successfully subscribed to payment requests channel')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('[DEBUG] Payment requests channel error - check RLS policies and realtime settings')
        }
      })

    return () => {
      console.log('[DEBUG] Unsubscribing from payment requests channel')
      supabase.removeChannel(channel)
      mounted = false
    }
  }, [supabase, conversation])

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current?.scrollHeight ?? 0, behavior: 'auto' }), 150)
    console.log('[DEBUG] Scrolled to bottom', { messagesLength: messages.length, twilioMessagesLength: twilioMessages.length })
  }, [messages.length, twilioMessages.length])

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault()
    console.log('[DEBUG] handleSend called', { text, files })
    setDebugInfo(prev => prev + `\n[DEBUG] handleSend called: text="${text}", files=${files.map(f => f.name).join(',')}`)
    if ((!text || text.trim().length === 0) && files.length === 0) return
    setSending(true)

    if (text && detectExternalContact(text)) {
      console.log('[DEBUG] External contact detected, blocking message:', text)
      setDebugInfo(prev => prev + `\n[DEBUG] External contact detected, blocking message: ${text}`)
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

    const uploaded: string[] = []
    try {
      for (const f of files) {
        const url = await uploadChatFile(f)
        uploaded.push(url)
        console.log('[DEBUG] Uploaded file:', url)
        setDebugInfo(prev => prev + `\n[DEBUG] Uploaded file: ${url}`)
      }

      await sendMessage({
        conversationId: conversation.id,
        text: text || null,
        attachments: uploaded,
        isSystem: false,
      })
      console.log('[DEBUG] Sent Supabase message:', { text, uploaded })
      setDebugInfo(prev => prev + `\n[DEBUG] Sent Supabase message: text="${text}", uploaded=${uploaded.join(',')}`)
    } catch (err) {
      console.error('[DEBUG] sendMessage error', err)
      setDebugInfo(prev => prev + `\n[DEBUG] sendMessage error: ${err}`)
      alert('Failed to send message')
    } finally {
      setText('')
      setFiles([])
      setSending(false)
    }
  }

  // Example: Send Twilio message (expand as needed)
  async function handleSendTwilio(e?: React.FormEvent) {
    e?.preventDefault()
    console.log('[DEBUG] handleSendTwilio called', { text, twilioClient, twilio_sid: conversation.twilio_sid })
    setDebugInfo(prev => prev + `\n[DEBUG] handleSendTwilio called: text="${text}", twilioClient=${twilioClient ? 'connected' : 'null'}, twilio_sid=${conversation.twilio_sid}`)
    if (!twilioClient || !conversation.twilio_sid || !text) return
    setSending(true)
    try {
      const conv = await twilioClient.getConversationBySid(conversation.twilio_sid)
      await conv.sendMessage(text)
      setText('')
      console.log('[DEBUG] Sent Twilio message:', text)
      setDebugInfo(prev => prev + `\n[DEBUG] Sent Twilio message: ${text}`)
    } catch (err) {
      console.error('[DEBUG] Twilio send error', err)
      setDebugInfo(prev => prev + `\n[DEBUG] Twilio send error: ${err}`)
      alert('Failed to send Twilio message')
    } finally {
      setSending(false)
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files
    if (!f?.length) return
    const file = f[0]
    if (file.size > 100 * 1024 * 1024) {
      alert('File too large (max 100MB)')
      return
    }
    setFiles([file])
    e.currentTarget.value = ''
    console.log('[DEBUG] File selected:', file.name)
    setDebugInfo(prev => prev + `\n[DEBUG] File selected: ${file.name}`)
  }

  async function handleRequestPaymentClick() {
    if (!userId) return alert('Please sign in')
    const amount = prompt('Enter amount in USD (e.g. 150.00)')
    if (!amount) return
    const cents = Math.round(Number(amount) * 100)
    if (!cents || cents <= 0) return alert('Invalid amount')
    const otherId = conversation.seller_id === userId ? conversation.buyer_id : conversation.seller_id
    try {
      const pr = await sendPaymentRequest({
        conversationId: conversation.id,
        amountCents: cents,
        toId: otherId,
      })
      await sendMessage({
        conversationId: conversation.id,
        text: `Payment request: $${(cents / 100).toFixed(2)}`,
        attachments: [],
        isSystem: true,
      })
      alert('Payment request created')
      console.log('[DEBUG] Payment request created:', pr)
      setDebugInfo(prev => prev + `\n[DEBUG] Payment request created: ${JSON.stringify(pr)}`)
    } catch (err) {
      console.error('[DEBUG] Failed to create payment request', err)
      setDebugInfo(prev => prev + `\n[DEBUG] Failed to create payment request: ${err}`)
      alert('Failed to create payment request')
    }
  }

  async function handlePay(requestId: string) {
    try {
      await startPaymentForRequest(requestId)
      console.log('[DEBUG] Payment started for request:', requestId)
      setDebugInfo(prev => prev + `\n[DEBUG] Payment started for request: ${requestId}`)
    } catch (err: any) {
      console.error('[DEBUG] Failed to start payment', err)
      setDebugInfo(prev => prev + `\n[DEBUG] Failed to start payment: ${err}`)
      alert(err?.message || 'Payment failed to start')
    }
  }

  // Render Twilio messages if available, else Supabase messages
  const renderMessages = () => {
    if (twilioMessages.length > 0) {
      console.log('[DEBUG] Rendering Twilio messages:', twilioMessages)
      setDebugInfo(prev => prev + `\n[DEBUG] Rendering Twilio messages: count=${twilioMessages.length}`)
      return (
        <div>
          {twilioMessages.map((m: any, i: number) => {
            const isMe = userId && m.author === userId
            const time = m.dateCreated ? new Date(m.dateCreated).toLocaleString() : ''
            return (
              <div key={m.sid || i} className={`max-w-[80%] ${isMe ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                <div className={`inline-block p-3 rounded-xl ${isMe ? 'bg-sky-700 text-white' : 'bg-[#111827] text-slate-200'}`}>
                  <div className="whitespace-pre-wrap">{m.body}</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">{time}</div>
              </div>
            )
          })}
        </div>
      )
    }
    // Fallback to Supabase messages
    console.log('[DEBUG] Rendering Supabase messages:', messages)
    setDebugInfo(prev => prev + `\n[DEBUG] Rendering Supabase messages: count=${messages.length}`)
    return (
      <div>
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
                        // eslint-disable-next-line @next/next/no-img-element
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
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* DEBUG INFO UI */}
      <div style={{
        background: '#1e293b',
        color: '#fbbf24',
        fontSize: '12px',
        padding: '8px',
        borderRadius: '8px',
        marginBottom: '12px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {debugInfo}
      </div>
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
        {renderMessages()}
      </div>

      <form
        onSubmit={twilioMessages.length > 0 ? handleSendTwilio : (e) => { e.preventDefault(); handleSend(); }}
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