'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createSupabaseBrowser } from '../../app/api/lib/supabaseBrowser'
import { useTwilioChat } from '../../contexts/TwilioChatContext'
import { Conversation as TwilioConversation, Message as TwilioMessage } from '@twilio/conversations'
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
  twilio_conversation_sid?: string | null
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

type UnifiedMessage = {
  id: string
  sender: string
  text: string
  attachments: string[]
  timestamp: Date
  isSystem: boolean
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
  const { client: twilioClient, fallbackMode, loading: twilioLoading } = useTwilioChat()
  
  const [messages, setMessages] = useState<UnifiedMessage[]>([])
  const [twilioConversation, setTwilioConversation] = useState<TwilioConversation | null>(null)
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestRow[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [typing, setTyping] = useState(false)
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

  // Initialize Twilio conversation or fallback to Supabase
  useEffect(() => {
    if (!conversation || twilioLoading) return
    
    if (!fallbackMode && twilioClient) {
      initializeTwilioConversation()
    } else {
      initializeSupabaseConversation()
    }
  }, [conversation, twilioClient, fallbackMode, twilioLoading])

  const initializeTwilioConversation = async () => {
    if (!twilioClient || !conversation) return
    
    try {
      let conv: TwilioConversation
      
      if (conversation.twilio_conversation_sid) {
        // Join existing Twilio conversation
        conv = await twilioClient.getConversationBySid(conversation.twilio_conversation_sid)
      } else {
        // Create new Twilio conversation
        const uniqueName = `conv_${conversation.id}`
        try {
          conv = await twilioClient.createConversation({
            uniqueName,
            friendlyName: `Chat for ${conversation.gig_id ? 'Service' : 'Direct message'}`,
          })
          
          // Save Twilio conversation SID to Supabase
          await supabase
            .from('conversations')
            .update({ twilio_conversation_sid: conv.sid })
            .eq('id', conversation.id)
          
        } catch (err: any) {
          // Conversation might already exist
          if (err.message?.includes('already exists')) {
            conv = await twilioClient.getConversationByUniqueName(uniqueName)
          } else {
            throw err
          }
        }
        
        // Add participants
        try {
          await conv.join()
        } catch (e) {
          console.log('Already joined conversation')
        }
      }
      
      setTwilioConversation(conv)
      
      // Load messages
      const paginator = await conv.getMessages()
      const twilioMessages: UnifiedMessage[] = paginator.items.map((msg: TwilioMessage) => ({
        id: msg.sid,
        sender: msg.author || 'system',
        text: msg.body || '',
        attachments: msg.attachedMedia?.map((m: any) => m.contentTemporaryUrl) || [],
        timestamp: msg.dateCreated || new Date(),
        isSystem: msg.author === 'system',
      }))
      
      setMessages(twilioMessages)
      scrollToBottom()
      
      // Listen for new messages
      conv.on('messageAdded', (message: TwilioMessage) => {
        const newMsg: UnifiedMessage = {
          id: message.sid,
          sender: message.author || 'system',
          text: message.body || '',
          attachments: message.attachedMedia?.map((m: any) => m.contentTemporaryUrl) || [],
          timestamp: message.dateCreated || new Date(),
          isSystem: message.author === 'system',
        }
        setMessages((prev) => [...prev, newMsg])
        scrollToBottom()
      })
      
      // Listen for typing indicators
      conv.on('typingStarted', (participant: any) => {
        if (participant.identity !== userId) {
          setTyping(true)
        }
      })
      
      conv.on('typingEnded', (participant: any) => {
        if (participant.identity !== userId) {
          setTyping(false)
        }
      })
      
    } catch (err) {
      console.error('Failed to initialize Twilio conversation:', err)
      // Fallback to Supabase
      initializeSupabaseConversation()
    }
  }

  const initializeSupabaseConversation = () => {
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
        const unifiedMessages: UnifiedMessage[] = (data || []).map((msg) => ({
          id: msg.id,
          sender: msg.sender_id,
          text: msg.text || '',
          attachments: msg.attachments || [],
          timestamp: msg.created_at ? new Date(msg.created_at) : new Date(),
          isSystem: msg.is_system || false,
        }))
        
        if (mounted) setMessages(unifiedMessages)
        scrollToBottom()
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
          const unifiedMsg: UnifiedMessage = {
            id: newMsg.id,
            sender: newMsg.sender_id,
            text: newMsg.text || '',
            attachments: newMsg.attachments || [],
            timestamp: newMsg.created_at ? new Date(newMsg.created_at) : new Date(),
            isSystem: newMsg.is_system || false,
          }
          setMessages((prev) => [...prev, unifiedMsg])
          scrollToBottom()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      mounted = false
    }
  }

  // Load payment requests
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

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  const handleSendTwilio = async () => {
    if (!twilioConversation || (!text && files.length === 0)) return
    
    try {
      if (text && detectExternalContact(text)) {
        await twilioConversation.sendMessage('[Message blocked: external contact detected]')
        return
      }
      
      if (text) {
        await twilioConversation.sendMessage(text)
      }
      
      // Handle file attachments - Twilio uses FormData differently
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        await twilioConversation.sendMessage({
          contentType: file.type,
          media: formData,
        } as any)
      }
    } catch (err) {
      console.error('Twilio send error:', err)
      throw err
    }
  }

  const handleSendSupabase = async () => {
    if ((!text || text.trim().length === 0) && files.length === 0) return

    if (text && detectExternalContact(text)) {
      await sendMessage({
        conversationId: conversation.id,
        text: '[Message blocked: external contact or payment link detected]',
        attachments: [],
        isSystem: true,
      })
      return
    }

    const uploaded: string[] = []
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
  }

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault()
    if ((!text || text.trim().length === 0) && files.length === 0) return
    
    setSending(true)

    try {
      if (!fallbackMode && twilioConversation) {
        await handleSendTwilio()
      } else {
        await handleSendSupabase()
      }
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
      await sendPaymentRequest({
        conversationId: conversation.id,
        amountCents: cents,
        toId: otherId,
      })
      
      await sendMessage({
        conversationId: conversation.id,
        text: `💰 Payment request: $${(cents / 100).toFixed(2)}`,
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
    } catch (err: any) {
      console.error('Failed to start payment', err)
      alert(err?.message || 'Payment failed to start')
    }
  }

  const handleTyping = () => {
    if (twilioConversation && !fallbackMode) {
      twilioConversation.typing()
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#0A0F1E] to-[#050A14] rounded-2xl border border-[#35BFFF]/20 shadow-2xl">
      <header className="border-b border-[#35BFFF]/30 pb-4 mb-4 px-6 pt-6 flex items-center justify-between bg-gradient-to-r from-[#0D1328]/80 to-[#0A0F1E]/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#35BFFF] to-[#2A9FE6] flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              {conversation.gig_id ? '🎯 Service Chat' : '💬 Direct Message'}
              {!fallbackMode && (
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
                  🟢 Twilio Live
                </span>
              )}
            </div>
            <div className="text-sm text-slate-400 flex items-center gap-2">
              Chat with the other participant
              {typing && (
                <span className="text-[#35BFFF] animate-pulse">• typing...</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRequestPaymentClick} 
            className="px-4 py-2 bg-gradient-to-r from-[#35BFFF] to-[#2A9FE6] rounded-lg text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#35BFFF]/50 transition-all transform hover:scale-105"
          >
            💰 Request Payment
          </button>
        </div>
      </header>

      {paymentRequests.length > 0 && (
        <div className="mb-4 space-y-2 px-6">
          <div className="text-sm text-[#35BFFF] font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Payment Requests
          </div>
          <div className="space-y-2">
            {paymentRequests.map((r) => {
              const isRecipient = userId && r.to_id === userId
              return (
                <div key={r.id} className="flex items-center justify-between bg-gradient-to-r from-[#0D1328] to-[#071022] p-3 rounded-xl border border-[#35BFFF]/20 hover:border-[#35BFFF]/40 transition-all">
                  <div>
                    <div className="text-sm text-white font-semibold">💵 ${(r.amount_cents / 100).toFixed(2)}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      Status: 
                      <span className={`px-2 py-0.5 rounded-full ${r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    {r.status === 'pending' && isRecipient && (
                      <button 
                        onClick={() => handlePay(r.id)} 
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
                      >
                        ✓ Pay Now
                      </button>
                    )}
                    {r.status === 'pending' && !isRecipient && (
                      <div className="text-xs text-slate-400">⏳ Awaiting payment</div>
                    )}
                    {r.status !== 'pending' && <div className="text-xs text-green-400">✓ Completed</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-4 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <div className="w-20 h-20 rounded-full bg-[#35BFFF]/10 flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-[#35BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-lg font-semibold mb-2">Start the conversation</div>
            <div className="text-sm">Send a message to begin chatting</div>
          </div>
        )}
        {messages.map((m) => {
          const isMe = userId && m.sender === userId
          const time = m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          return (
            <div key={m.id} className={`max-w-[75%] ${isMe ? 'ml-auto' : 'mr-auto'} animate-fade-in`}>
              <div
                className={`inline-block p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                  m.isSystem 
                    ? 'bg-slate-700/50 text-slate-200 border border-slate-600/30' 
                    : isMe 
                      ? 'bg-gradient-to-br from-[#35BFFF] to-[#2A9FE6] text-white shadow-[#35BFFF]/30' 
                      : 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-slate-100 border border-slate-700/50'
                }`}
              >
                {m.text && <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>}
                {m.attachments && m.attachments.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {m.attachments.map((a, i) =>
                      a.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video key={i} src={a} controls className="w-56 h-32 rounded-lg object-cover border border-white/10" />
                      ) : (
                        <img key={i} src={a} alt="attachment" className="w-56 h-32 object-cover rounded-lg border border-white/10" />
                      )
                    )}
                  </div>
                )}
              </div>
              <div className={`text-xs text-slate-500 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                {time}
              </div>
            </div>
          )
        })}
      </div>

      <form
        onSubmit={handleSend}
        className="mt-4 border-t border-[#35BFFF]/30 pt-4 px-6 pb-6 bg-gradient-to-r from-[#0D1328]/60 to-[#0A0F1E]/60 backdrop-blur-sm"
      >
        <div className="flex items-end gap-3">
          <label className="p-3 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#35BFFF]/20 cursor-pointer hover:border-[#35BFFF]/40 hover:shadow-lg hover:shadow-[#35BFFF]/20 transition-all transform hover:scale-105">
            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
            <svg className="w-5 h-5 text-[#35BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </label>
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                handleTyping()
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your message..."
              rows={1}
              className="w-full p-4 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#35BFFF]/20 focus:border-[#35BFFF]/50 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/30 text-white placeholder:text-slate-500 resize-none transition-all"
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
            {files.length > 0 && (
              <div className="mt-2 text-sm text-[#35BFFF] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {files[0].name}
              </div>
            )}
          </div>
          <button 
            type="submit" 
            disabled={sending || (!text.trim() && files.length === 0)} 
            className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#35BFFF] to-[#2A9FE6] text-white font-semibold hover:shadow-xl hover:shadow-[#35BFFF]/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
          >
            {sending ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #35BFFF, #2A9FE6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2A9FE6, #35BFFF);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
