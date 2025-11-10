'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import ConversationList from '../../components/messages/ConversationList'
import ChatWindow from '../../components/messages/ChatWindow'

type Conversation = {
  id: string
  gig_id?: string | null
  seller_id: string
  buyer_id: string
  last_message?: string | null
  status?: string
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export default function MessagesPage() {
  const supabase = createSupabaseBrowser()
  const search = useSearchParams()
  const router = useRouter()
  const requestedConvId = search?.get('conv') ?? null

  const [user, setUser] = useState<any | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchedConvIds = useRef<Set<string>>(new Set())

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

  // PRIORITY: If we have a requestedConvId, fetch it IMMEDIATELY
  // Don't wait for the full conversation list to load
  useEffect(() => {
    if (!requestedConvId || !user) return
    
    // Prevent duplicate fetches
    if (fetchedConvIds.current.has(requestedConvId)) return
    fetchedConvIds.current.add(requestedConvId)
    
    console.log('PRIORITY FETCH: Immediately fetching requested conversation:', requestedConvId)
    
    const fetchImmediate = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', requestedConvId)
          .single()
        
        if (error) {
          console.error('Priority fetch error:', error)
          console.error('Priority fetch error details:', JSON.stringify(error))
          return
        }
        
        if (data) {
          console.log('Priority fetch SUCCESS - conversation data:', data)
          const conv = data as Conversation
          console.log('Setting active conversation to:', conv.id)
          setActiveConv(conv)
          // Also add to conversations list if not already there
          setConversations((prev) => {
            const exists = prev.find((p) => p.id === conv.id)
            if (exists) return prev
            console.log('Adding conversation to list')
            return [conv, ...prev]
          })
        } else {
          console.error('Priority fetch returned no data for conversation ID:', requestedConvId)
        }
      } catch (err) {
        console.error('Priority fetch exception:', err)
      }
    }
    
    fetchImmediate()
  }, [requestedConvId, user, supabase])

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
          .select('*')
          .or(orFilter)
          .order('updated_at', { ascending: false })

        const rows = (res.data as unknown) as Conversation[] | null
        if (!mounted) return
        setConversations(rows || [])
        setLoading(false)

        console.log('Loaded conversations:', rows?.length || 0)
        // Auto-open conversation if conv query param provided and not already set
        if (requestedConvId && rows && rows.length > 0 && !activeConv) {
          const found = rows.find((r) => r.id === requestedConvId)
          if (found) {
            console.log('Found requested conversation in full list:', requestedConvId)
            setActiveConv(found)
          }
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
          setConversations((prev) => {
            const exists = prev.find((p) => p.id === newRow.id)
            if (exists) {
              return prev.map((p) => (p.id === newRow.id ? newRow : p))
            }
            return [newRow, ...prev]
          })
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations', filter: `buyer_id=eq.${user.id}` },
        (payload: any) => {
          const newRow = payload.new as Conversation
          setConversations((prev) => {
            const exists = prev.find((p) => p.id === newRow.id)
            if (exists) {
              return prev.map((p) => (p.id === newRow.id ? newRow : p))
            }
            return [newRow, ...prev]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      mounted = false
    }
  }, [supabase, user, requestedConvId, activeConv])

  // navigate to messages page from other UI areas
  const openMessages = (conv?: Conversation) => {
    if (conv) {
      router.push(`/messages?conv=${conv.id}`)
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
            <ChatWindow conversation={activeConv} />
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