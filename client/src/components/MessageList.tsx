'use client'
import React from 'react'
import type { Message } from '@/hooks/useMessages'

export default function MessageList({ messages, currentUserId }: { messages: Message[], currentUserId?: string }) {
  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div key={m.id} className={`p-3 rounded-lg ${m.sender_id === currentUserId ? 'bg-[#083358] text-sky-200 self-end' : 'bg-[#0b1a2b] text-slate-200'}`}>
          <div className="text-sm">{m.text}</div>
          <div className="text-xs text-slate-400 mt-1">{new Date(m.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}
