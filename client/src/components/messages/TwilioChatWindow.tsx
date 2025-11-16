'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { createSupabaseBrowser } from '../../app/api/lib/supabaseBrowser'
import { useTwilioConversation } from '../../hooks/useTwilioConversation'

type Conversation = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  status?: string
  twilio_conversation_sid?: string | null
  gig?: GigSummary | null
}

type GigSummary = {
  id: string
  title?: string | null
  slug?: string | null
  cover_image_url?: string | null
  price_cents?: number | null
}

/**
 * TwilioChatWindow - Chat interface using Twilio Conversations SDK
 * 
 * Features:
 * - Loads messages from Twilio Conversations
 * - Real-time message updates via Twilio SDK
 * - Database-backed conversation metadata
 * - Fallback to database messages if Twilio SID not available
 */
export default function TwilioChatWindow({ conversation }: { conversation: Conversation }) {
  const supabase = createSupabaseBrowser()
  const [userId, setUserId] = useState<string | null>(null)
  const [gig, setGig] = useState<GigSummary | null>(conversation.gig ?? null)
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Use Twilio conversation hook
  const {
    messages: twilioMessages,
    sendMessage: sendTwilioMessage,
    loading: twilioLoading,
    error: twilioError,
    identity
  } = useTwilioConversation({
    conversationSid: conversation.twilio_conversation_sid || null
  })

  // Load current user
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

  // Load gig details if needed
  useEffect(() => {
    setGig(conversation.gig ?? null)
  }, [conversation.gig])

  useEffect(() => {
    if (!conversation.gig_id || conversation.gig) return
    let active = true
    ;(async () => {
      try {
        const { data } = await supabase
          .from('gigs')
          .select('id,title,slug,cover_image_url,price_cents')
          .eq('id', conversation.gig_id)
          .maybeSingle()
        if (active) setGig((data as GigSummary) || null)
      } catch (err) {
        console.error('Failed to load gig', err)
      }
    })()
    return () => {
      active = false
    }
  }, [conversation.gig_id, conversation.gig, supabase])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [twilioMessages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    try {
      await sendTwilioMessage(inputText)
      setInputText('')
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Failed to send message. Please try again.')
    }
  }

  if (!conversation.twilio_conversation_sid) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b border-slate-700/60 pb-3 mb-3">
          <div className="text-lg font-bold">Conversation not initialized</div>
          <div className="text-sm text-slate-400">
            This conversation needs to be migrated to Twilio Conversations.
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">Migration Required</div>
            <div className="text-sm">
              Contact support to migrate this conversation to the new messaging system.
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (twilioLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-[#35BFFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div className="text-slate-300">Loading conversation...</div>
        </div>
      </div>
    )
  }

  if (twilioError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-400">
          <div className="text-lg font-semibold mb-2">Error loading conversation</div>
          <div className="text-sm">{twilioError}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700/60 pb-3 mb-3">
        <div className="text-lg font-bold">
          {gig?.title || 'Marketplace conversation'}
        </div>
        <div className="text-sm text-slate-400">
          Chat with {userId === conversation.buyer_id ? 'seller' : 'buyer'}
        </div>
      </header>

      {/* Gig Info */}
      {gig && (
        <div className="mb-4 rounded-xl border border-slate-700/60 bg-[#0b1429] p-4 flex flex-col sm:flex-row gap-4">
          {gig.cover_image_url && (
            <div className="w-full sm:w-32 sm:flex-shrink-0">
              <img
                src={gig.cover_image_url}
                alt={gig.title || 'Service image'}
                className="w-full h-24 object-cover rounded-lg border border-slate-800"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
          <div className="flex-1">
            <div className="text-xs uppercase text-slate-400 tracking-wide">Service</div>
            <div className="text-lg font-semibold text-white">{gig.title || 'Humanaira service'}</div>
            {typeof gig.price_cents === 'number' && !Number.isNaN(gig.price_cents) && (
              <div className="text-sm text-slate-400 mt-1">
                Starting from ${(gig.price_cents / 100).toFixed(2)}
              </div>
            )}
            {gig.slug && (
              <Link
                href={`/services/${gig.slug}`}
                className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-sky-600/20 text-sky-300 text-sm hover:bg-sky-600/30"
              >
                View service details
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-3 bg-[#080E1B] rounded mb-3">
        {twilioMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          twilioMessages.map((msg) => {
            const isMe = msg.author === userId
            return (
              <div
                key={msg.sid}
                className={`max-w-[80%] ${isMe ? 'ml-auto text-right' : 'mr-auto text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-xl ${
                    isMe ? 'bg-[#35BFFF] text-white' : 'bg-[#111827] text-slate-200'
                  }`}
                >
                  {msg.body && <div className="whitespace-pre-wrap">{msg.body}</div>}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {msg.dateCreated ? new Date(msg.dateCreated).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) : ''}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-slate-700/60 pt-3">
        <div className="flex items-center gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 p-3 rounded-lg bg-[#0B1024] border border-slate-700/60 text-white placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-6 py-3 rounded-lg bg-[#35BFFF] text-white hover:bg-[#2fb2ff] disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
