'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import ConversationList from '../../components/messages/ConversationList'
import ChatWindow from '../../components/messages/ChatWindow'
import TwilioChatWindow from '../../components/messages/TwilioChatWindow'

type GigSummary = {
  id: string
  title?: string | null
  slug?: string | null
  cover_image_url?: string | null
  price_cents?: number | null
}

type Conversation = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  last_message?: string | null
  status?: string
  twilio_conversation_sid?: string | null
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
  gig?: GigSummary | null
}

export default function MessagesPage() {
  const supabase = createSupabaseBrowser()
  const search = useSearchParams()
  const router = useRouter()
  const requestedConvId = search?.get('conv') ?? null

  console.log('[MessagesPage] Requested conversation ID:', requestedConvId)

  const [user, setUser] = useState<any | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const requestedConvFetch = useRef<{ id: string | null; fetching: boolean }>({ id: null, fetching: false })

  // load current user
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUser(data?.user ?? null)
    })()
    return () => {
      mounted = false
    }
  }, [supabase])

  // load conversations once we have user
  useEffect(() => {
    if (!user) {
      setConversations([])
      setActiveConv(null)
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)

    const load = async () => {
      try {
        // Query both where seller_id = user.id OR buyer_id = user.id
        const orFilter = `seller_id.eq.${user.id},buyer_id.eq.${user.id}`
        const res = await supabase
          .from('conversations')
          .select('*, gig:gigs(id,title,slug,cover_image_url,price_cents)')
          .or(orFilter)
          .order('updated_at', { ascending: false })

        const rows = (res.data as unknown) as Conversation[] | null
        if (!mounted) return
        console.log('[MessagesPage] Loaded conversations:', rows?.length || 0, 'Requested:', requestedConvId)
        setConversations(rows || [])
        setLoading(false)

        // Auto-open conversation if conv query param provided
        if (requestedConvId && rows && rows.length > 0) {
          const found = rows.find((r) => r.id === requestedConvId)
          console.log('[MessagesPage] Found requested conversation in initial load:', !!found)
          if (found) setActiveConv(found)
        }
      } catch (err) {
        console.error('Failed to load conversations', err)
        if (mounted) setLoading(false)
      }
    }

    load()

    // Realtime subscription: listen for INSERT/UPDATE on conversations where user is participant
    const channel = supabase
      .channel(`public:conversations:user=${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations', filter: `seller_id=eq.${user.id}` },
        (payload: any) => {
          const newRow = payload.new as Conversation
          let enrichedRow: Conversation | null = null
          setConversations((prev) => {
            const exists = prev.find((p) => p.id === newRow.id)
            const enriched: Conversation =
              exists && !newRow.gig ? { ...newRow, gig: exists.gig } : newRow
            enrichedRow = enriched
            if (exists) {
              return prev.map((p) => (p.id === enriched.id ? enriched : p))
            }
            return [enriched, ...prev]
          })
          if (requestedConvId && newRow.id === requestedConvId && enrichedRow) {
            setActiveConv(enrichedRow)
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations', filter: `buyer_id=eq.${user.id}` },
        (payload: any) => {
          const newRow = payload.new as Conversation
          let enrichedRow: Conversation | null = null
          setConversations((prev) => {
            const exists = prev.find((p) => p.id === newRow.id)
            const enriched: Conversation =
              exists && !newRow.gig ? { ...newRow, gig: exists.gig } : newRow
            enrichedRow = enriched
            if (exists) {
              return prev.map((p) => (p.id === enriched.id ? enriched : p))
            }
            return [enriched, ...prev]
          })
          if (requestedConvId && newRow.id === requestedConvId && enrichedRow) {
            setActiveConv(enrichedRow)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      mounted = false
    }
  }, [supabase, user, requestedConvId])

  // If the requested conv id arrives after conversations are loaded, auto-select it
  useEffect(() => {
    if (!requestedConvId || conversations.length === 0) return
    const found = conversations.find((c) => c.id === requestedConvId)
    console.log('[MessagesPage] Auto-selecting from loaded conversations:', !!found)
    if (found) setActiveConv(found)
  }, [requestedConvId, conversations])

  // Fallback: if we were sent to /messages?conv=<id> but the conversation is
  // not yet in the list (for example right after creation), fetch it directly.
  useEffect(() => {
    if (!requestedConvId || !user) {
      requestedConvFetch.current = { id: null, fetching: false }
      return
    }

    if (requestedConvFetch.current.id !== requestedConvId) {
      requestedConvFetch.current = { id: requestedConvId, fetching: false }
    }

    const existing = conversations.find((c) => c.id === requestedConvId)
    if (existing) {
      setActiveConv(existing)
      return
    }

    if (requestedConvFetch.current.fetching) return

    let cancelled = false
    requestedConvFetch.current.fetching = true

    ;(async () => {
      try {
        console.log('[MessagesPage] Fetching conversation directly:', requestedConvId)
        const { data, error } = await supabase
          .from('conversations')
          .select('*, gig:gigs(id,title,slug,cover_image_url,price_cents)')
          .eq('id', requestedConvId)
          .maybeSingle()

        if (cancelled) return
        if (error) {
          console.error('Failed to fetch requested conversation', error)
          return
        }

        if (data) {
          console.log('[MessagesPage] Fetched conversation:', data)
          const conv = data as Conversation
          setConversations((prev) => {
            if (prev.find((p) => p.id === conv.id)) return prev
            return [conv, ...prev]
          })
          setActiveConv(conv)
        } else {
          console.log('[MessagesPage] Conversation not found:', requestedConvId)
        }
      } finally {
        if (!cancelled) {
          requestedConvFetch.current.fetching = false
        }
      }
    })()

    return () => {
      cancelled = true
      requestedConvFetch.current.fetching = false
    }
  }, [requestedConvId, user, conversations, supabase])

  // navigate to messages page from other UI areas
  const openMessages = (conv?: Conversation) => {
    if (conv) {
      router.push(`/messages?conv=${encodeURIComponent(conv.id)}`)
      setActiveConv(conv)
    } else {
      router.push('/messages')
    }
  }

  return (
    // Added top padding so the page content sits below any fixed header/navbar.
    // Adjust pt-24 / md:pt-28 values to match your site's header height if needed.
    <main className="min-h-screen bg-[#070D1C] text-slate-100 p-6 md:p-10 pt-24 md:pt-28">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-4 bg-[#0D1328] border border-slate-700/60 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold">Messages</h2>
              <p className="text-sm text-slate-400">Conversations with buyers & freelancers</p>
            </div>
            <div>
              <button
                onClick={() => openMessages()}
                className="px-3 py-1 rounded bg-slate-800 text-slate-200 text-sm"
              >
                New
              </button>
            </div>
          </div>

          <div className="mt-2">
            <ConversationList
              conversations={conversations}
              loading={loading}
              onSelect={(c: Conversation) => setActiveConv(c)}
              activeId={activeConv?.id ?? null}
            />
          </div>
        </aside>

        <section className="lg:col-span-8 bg-[#0D1328] border border-slate-700/60 rounded-2xl p-4 min-h-[480px]">
          {activeConv ? (
            // Use TwilioChatWindow if conversation has Twilio SID, otherwise fall back to old ChatWindow
            activeConv.twilio_conversation_sid ? (
              <TwilioChatWindow conversation={activeConv} />
            ) : (
              <ChatWindow conversation={activeConv} />
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="text-xl font-semibold mb-2">No conversation selected</div>
              <div className="text-sm">Open a conversation from the left, or contact a seller from a service page.</div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}