'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import ConversationList from '../../components/messages/ConversationList'
import ChatWindowWithUIKit from '../../components/messages/ChatWindowWithUIKit'

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
  const [fetchAttempts, setFetchAttempts] = useState(0)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const fetchedConvIds = useRef<Set<string>>(new Set())

  // load current user
  useEffect(() => {
    let mounted = true
    console.log('Loading user authentication...')
    ;(async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        console.log('Auth getUser result:', { data, error })
        if (!mounted) return
        if (error) {
          console.error('Error loading user:', error)
        }
        const loadedUser = data?.user ?? null
        console.log('User loaded:', loadedUser ? loadedUser.id : 'NO USER')
        setUser(loadedUser)
      } catch (err) {
        console.error('Exception loading user:', err)
        if (mounted) setUser(null)
      }
    })()
    return () => {
      mounted = false
    }
  }, [supabase])

  // PRIORITY: If we have a requestedConvId, fetch it IMMEDIATELY with RETRY LOOP
  // This will keep trying until it succeeds
  useEffect(() => {
    if (!requestedConvId) {
      console.log('PRIORITY FETCH: No requestedConvId in URL')
      return
    }
    
    // If we've already fetched this conversation successfully, don't fetch again
    if (fetchedConvIds.current.has(requestedConvId)) {
      console.log('PRIORITY FETCH: Conversation already fetched successfully, skipping')
      return
    }
    
    let currentAttempt = 0
    let isMounted = true
    
    const fetchWithRetry = async () => {
      while (isMounted && currentAttempt < 10) {
        currentAttempt++
        setFetchAttempts(currentAttempt)
        
        console.log(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: Starting fetch for conversation:`, requestedConvId)
        console.log('PRIORITY FETCH: User status:', user ? `Loaded (${user.id})` : 'NOT LOADED YET')
        
        try {
          // ALWAYS try API route (works with or without user auth)
          console.log(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: Calling API route /api/conversations/${requestedConvId}`)
          
          const apiRes = await fetch(`/api/conversations/${requestedConvId}`)
          console.log(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: API response status:`, apiRes.status)
          
          if (apiRes.ok) {
            const apiData = await apiRes.json()
            console.log(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: API route SUCCESS! Data:`, apiData)
            
            if (apiData && apiData.id) {
              const conv = apiData as Conversation
              console.log(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: Setting active conversation:`, conv.id)
              
              if (!isMounted) return
              
              // Set the conversation as active
              setActiveConv(conv)
              
              // Add to conversations list if not already there
              setConversations((prev) => {
                const exists = prev.find((p) => p.id === conv.id)
                if (exists) return prev
                return [conv, ...prev]
              })
              
              setFetchError(null)
              fetchedConvIds.current.add(requestedConvId)
              
              console.log('✅ PRIORITY FETCH: SUCCESS - Conversation loaded and set as active!')
              return // Success! Exit the retry loop
            } else {
              console.error(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: API returned invalid data:`, apiData)
              setFetchError('Invalid data returned from API')
            }
          } else {
            const errorText = await apiRes.text()
            console.error(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: API route failed with status ${apiRes.status}:`, errorText)
            setFetchError(`API error: ${apiRes.status} - ${errorText}`)
          }
        } catch (apiErr: any) {
          console.error(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: API route exception:`, apiErr)
          setFetchError(`Exception: ${apiErr.message}`)
        }
        
        // If we get here, the fetch failed - wait before retrying
        if (currentAttempt < 10 && isMounted) {
          const delay = Math.min(1000 * currentAttempt, 5000) // Progressive delay, max 5s
          console.log(`PRIORITY FETCH [Attempt ${currentAttempt}/10]: FAILED - waiting ${delay}ms before retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
      
      // If we've exhausted all retries
      if (currentAttempt >= 10 && isMounted) {
        console.error('❌ PRIORITY FETCH: Max retry attempts reached (10). Giving up.')
        setFetchError('Conversation not found after 10 attempts. It may not exist yet or there may be a database issue.')
      }
    }
    
    // Start the fetch/retry loop
    fetchWithRetry()
    
    // Cleanup on unmount
    return () => {
      isMounted = false
    }
  }, [requestedConvId, user]) // Re-run when requestedConvId or user changes

  // load conversations once we have user
  useEffect(() => {
    if (!user) {
      setConversations([])
      // Don't clear activeConv here - it may have been set by priority fetch
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

        console.log('Loaded conversations from user query:', rows?.length || 0)
        
        // Note: We DON'T auto-set activeConv here - that's handled by the priority fetch effect
        // This prevents race conditions between the two effects
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
  }, [supabase, user]) // Removed requestedConvId and activeConv from dependencies

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

        <section className="lg:col-span-8 bg-[#0D1328] border border-slate-700/60 rounded-2xl overflow-hidden">
          {activeConv ? (
            <ChatWindowWithUIKit conversation={activeConv} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[480px] p-4">
              <div className="text-xl font-semibold mb-2">No conversation selected</div>
              <div className="text-sm">Open a conversation from the left, or contact a seller from a service page.</div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}