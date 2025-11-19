'use client'
import React from 'react'

type Conversation = {
  id: string
  gig_id?: string | null
  last_message?: string | null
  updated_at?: string | null
  status?: string | null
}

export default function ConversationList({
  conversations,
  loading,
  onSelect,
  activeId,
}: {
  conversations: Conversation[] | null
  loading: boolean
  onSelect: (c: Conversation) => void
  activeId?: string | null
}) {
  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-[#0B1024] rounded-lg" />
        ))}
      </div>
    )
  }

  if (!conversations || conversations.length === 0) {
    return <div className="text-slate-500">No conversations yet.</div>
  }

  return (
    <div className="space-y-3 overflow-auto max-h-[64vh] pr-2">
      {conversations.map((c) => {
        const subtitle = c.last_message ? c.last_message : c.gig_id ? 'About service' : 'New conversation'
        const isActive = activeId === c.id
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`w-full p-3 text-left rounded-lg transition flex flex-col gap-1 ${
              isActive ? 'bg-sky-900/30 border border-sky-600' : 'hover:bg-white/2'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-white">{c.gig_id ? 'Service chat' : 'Conversation'}</div>
              <div className="text-xs text-slate-400">{c.updated_at ? new Date(c.updated_at).toLocaleString() : ''}</div>
            </div>
            <div className="text-slate-400 text-sm truncate">{subtitle}</div>
            <div className="mt-2">
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  c.status === 'ordered' ? 'bg-emerald-900/40 text-emerald-200' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {String(c.status || 'open').toUpperCase()}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}