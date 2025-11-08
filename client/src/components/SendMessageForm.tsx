'use client'
import React, { useState } from 'react'
import { sendMessage } from '@/lib/messagesClient'

export default function SendMessageForm({ conversationId, senderId }: { conversationId: string; senderId: string }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return

    setSending(true)
    try {
      const { error } = await sendMessage(conversationId, senderId, text.trim())
      if (error) {
        console.error('Failed to send message', error)
        alert('Failed to send message. Please try again.')
      } else {
        setText('')
      }
    } catch (err) {
      console.error('Send message exception', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-lg bg-[#0B1024] border border-slate-700/60 text-slate-100"
        disabled={sending}
      />
      <button
        type="submit"
        disabled={sending || !text.trim()}
        className="px-6 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
