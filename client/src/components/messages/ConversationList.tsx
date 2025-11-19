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
          <div key={i} className="h-20 bg-gradient-to-r from-[#0D1328] to-[#0B1024] rounded-xl border border-[#35BFFF]/10" />
        ))}
      </div>
    )
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-[#35BFFF]/10 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-[#35BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <div className="text-slate-400 font-medium">No conversations yet</div>
        <div className="text-slate-500 text-sm mt-1">Start chatting with freelancers</div>
      </div>
    )
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-2 overflow-auto max-h-[70vh] pr-2 custom-scrollbar">
      {conversations.map((c) => {
        const subtitle = c.last_message ? c.last_message : c.gig_id ? 'About service' : 'New conversation'
        const isActive = activeId === c.id
        const time = formatTime(c.updated_at ?? null)
        
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`w-full p-4 text-left rounded-xl transition-all duration-300 flex flex-col gap-2 group relative overflow-hidden ${
              isActive 
                ? 'bg-gradient-to-r from-[#35BFFF]/20 to-[#2A9FE6]/20 border-2 border-[#35BFFF]/50 shadow-lg shadow-[#35BFFF]/20' 
                : 'bg-gradient-to-r from-[#0D1328] to-[#0B1024] border border-[#35BFFF]/10 hover:border-[#35BFFF]/30 hover:shadow-md hover:shadow-[#35BFFF]/10'
            }`}
          >
            {/* Glow effect on hover */}
            {!isActive && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#35BFFF]/0 via-[#35BFFF]/5 to-[#35BFFF]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-[#35BFFF]' : 'bg-[#35BFFF]/20'
                }`}>
                  {c.gig_id ? (
                    <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#35BFFF]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#35BFFF]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  )}
                </div>
                <div className="font-semibold text-white">
                  {c.gig_id ? '🎯 Service chat' : '💬 Direct Message'}
                </div>
              </div>
              {time && (
                <div className={`text-xs ${isActive ? 'text-[#35BFFF]' : 'text-slate-500'}`}>
                  {time}
                </div>
              )}
            </div>
            
            <div className={`text-sm truncate relative z-10 ${isActive ? 'text-slate-200' : 'text-slate-400'} pl-13`}>
              {subtitle}
            </div>
            
            <div className="mt-1 relative z-10 pl-13">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  c.status === 'ordered' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-slate-700/40 text-slate-300 border border-slate-600/30'
                }`}
              >
                {String(c.status || 'open').toUpperCase()}
              </span>
            </div>
          </button>
        )
      })}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
      `}</style>
    </div>
  )
}