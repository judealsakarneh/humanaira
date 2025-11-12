'use client'
import React from 'react'

type Profile = {
  id: string
  username?: string | null
  avatar_url?: string | null
  full_name?: string | null
}

type Gig = {
  id: string
  title?: string | null
  slug?: string | null
}

type LatestMessage = {
  id: string
  text?: string | null
  created_at?: string
  sender_id: string
}

type Conversation = {
  id: string
  gig_id?: string | null
  buyer_id: string
  seller_id: string
  last_message?: string | null
  updated_at?: string | null
  status?: string | null
  buyer?: Profile
  seller?: Profile
  gig?: Gig
  latest_message?: LatestMessage | null
}

export default function ConversationList({
  conversations,
  loading,
  onSelect,
  activeId,
  currentUserId,
}: {
  conversations: Conversation[] | null
  loading: boolean
  onSelect: (c: Conversation) => void
  activeId?: string | null
  currentUserId?: string | null
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
        // Determine the other participant (the person we're chatting with)
        const otherParticipant = 
          currentUserId === c.buyer_id ? c.seller : c.buyer
        
        const participantName = 
          otherParticipant?.full_name || 
          otherParticipant?.username || 
          'Unknown User'
        
        const participantAvatar = otherParticipant?.avatar_url
        
        // Show latest message or gig title
        const messagePreview = 
          c.latest_message?.text || 
          c.last_message || 
          (c.gig?.title ? `About: ${c.gig.title}` : 'New conversation')
        
        const timestamp = c.latest_message?.created_at || c.updated_at
        const timeDisplay = timestamp 
          ? new Date(timestamp).toLocaleDateString(undefined, { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : ''
        
        const isActive = activeId === c.id
        
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className={`w-full p-3 text-left rounded-lg transition flex gap-3 ${
              isActive ? 'bg-sky-900/30 border border-sky-600' : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              {participantAvatar ? (
                <img
                  src={participantAvatar}
                  alt={participantName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {participantName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-white truncate">
                  {participantName}
                </div>
                <div className="text-xs text-slate-400 ml-2 flex-shrink-0">
                  {timeDisplay}
                </div>
              </div>
              
              <div className="text-slate-400 text-sm truncate mb-2">
                {messagePreview}
              </div>
              
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    c.status === 'ordered' 
                      ? 'bg-emerald-900/40 text-emerald-200' 
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {String(c.status || 'open').toUpperCase()}
                </span>
                {c.gig?.title && (
                  <span className="text-xs text-slate-500 truncate">
                    {c.gig.title}
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}