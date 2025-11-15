'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useTwilioConversation } from '../hooks/useTwilioConversation'

/**
 * HumanairaChat Component
 * 
 * A chat UI component for Twilio Conversations with Humanaira branding
 * 
 * Features:
 * - Dark background with #35BFFF accent color
 * - Scrollable message list
 * - Message sending
 * - User identity display
 * - Mobile responsive
 */

interface HumanairaChatProps {
  conversationSid: string | null
}

export default function HumanairaChat({ conversationSid }: HumanairaChatProps) {
  const { messages, sendMessage, loading, error, identity } = useTwilioConversation({
    conversationSid,
  })

  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || sending) return

    setSending(true)
    try {
      await sendMessage(inputText)
      setInputText('')
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (!conversationSid) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-2xl border border-gray-700">
        <div className="text-center text-gray-400">
          No conversation selected
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-2xl border border-gray-700">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-3 border-[#35BFFF] border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-300">Loading conversation...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900 rounded-2xl border border-red-500/50">
        <div className="text-center">
          <div className="text-red-400 font-semibold mb-2">Error</div>
          <div className="text-gray-300">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-2xl border border-[rgba(53,191,255,0.2)] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-[rgba(53,191,255,0.2)] px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#35BFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Marketplace Chat
        </h2>
        <div className="text-sm text-gray-400 mt-1">
          Connected as: <span className="text-[#35BFFF]">{identity}</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[500px] overflow-y-auto bg-[#0a0e1a] p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.author === identity
            return (
              <div
                key={msg.sid}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`max-w-[75%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                  {/* Author label */}
                  <div
                    className={`text-xs mb-1 ${
                      isMe ? 'text-right text-[#35BFFF]' : 'text-left text-gray-400'
                    }`}
                  >
                    {msg.author || 'Unknown'}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      isMe
                        ? 'bg-[#35BFFF] text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{msg.body}</div>
                  </div>

                  {/* Timestamp */}
                  {msg.dateCreated && (
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        isMe ? 'text-right' : 'text-left'
                      }`}
                    >
                      {new Date(msg.dateCreated).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSend}
        className="bg-gray-800 border-t border-[rgba(53,191,255,0.2)] p-4"
      >
        <div className="flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
            className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-[#35BFFF] focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/30 transition placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="px-6 py-3 bg-[#35BFFF] text-white font-semibold rounded-xl hover:bg-[#2fb2ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-[#35BFFF]/50"
          >
            {sending ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Send
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
