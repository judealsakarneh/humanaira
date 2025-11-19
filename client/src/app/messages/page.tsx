'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '../../api/lib/supabaseBrowser'
import { useTwilioChat } from '../../contexts/TwilioChatContext'
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
  const requestedConvId = search?.get('conv') ?? search?.get('cid') ?? null
  const { client: twilioClient, fallbackMode, loading: twilioLoading, error: twilioError } = useTwilioChat()

  const [user, setUser] = useState<any | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)
  const [debugOpen, setDebugOpen] = useState(false)
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [consoleLogs, setConsoleLogs] = useState<any[]>([])
  const [networkLogs, setNetworkLogs] = useState<any[]>([])
  const [storageInfo, setStorageInfo] = useState<any>({})

  // Helper to add debug logs
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugLogs((prev) => [...prev, `[${timestamp}] ${message}`])
    console.log(`[DEBUG] ${message}`)
  }

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn
    
    console.log = (...args: any[]) => {
      setConsoleLogs((prev) => [...prev.slice(-49), { type: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '), timestamp: new Date().toISOString() }])
      originalLog.apply(console, args)
    }
    
    console.error = (...args: any[]) => {
      setConsoleLogs((prev) => [...prev.slice(-49), { type: 'error', message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '), timestamp: new Date().toISOString() }])
      originalError.apply(console, args)
    }
    
    console.warn = (...args: any[]) => {
      setConsoleLogs((prev) => [...prev.slice(-49), { type: 'warn', message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '), timestamp: new Date().toISOString() }])
      originalWarn.apply(console, args)
    }
    
    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  // Collect storage and environment info
  const collectDiagnostics = () => {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      cookies: {},
      localStorage: {},
      sessionStorage: {},
      env: {},
      supabase: {}
    }

    // Collect cookies
    try {
      const cookies = document.cookie.split(';')
      cookies.forEach(cookie => {
        const [key, value] = cookie.trim().split('=')
        if (key) diagnostics.cookies[key] = value?.substring(0, 50) + '...'
      })
    } catch (e) {
      diagnostics.cookies = { error: String(e) }
    }

    // Collect localStorage
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key)
          if (key.includes('sb-') || key.includes('supabase')) {
            try {
              const parsed = JSON.parse(value || '{}')
              diagnostics.localStorage[key] = {
                hasAccessToken: !!parsed?.access_token,
                hasRefreshToken: !!parsed?.refresh_token,
                expiresAt: parsed?.expires_at ? new Date(parsed.expires_at * 1000).toISOString() : 'none',
                userId: parsed?.user?.id || 'none'
              }
            } catch {
              diagnostics.localStorage[key] = 'parse error'
            }
          }
        }
      }
    } catch (e) {
      diagnostics.localStorage = { error: String(e) }
    }

    // Collect sessionStorage
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && (key.includes('sb-') || key.includes('supabase'))) {
          diagnostics.sessionStorage[key] = sessionStorage.getItem(key)?.substring(0, 100) + '...'
        }
      }
    } catch (e) {
      diagnostics.sessionStorage = { error: String(e) }
    }

    // Collect environment info
    diagnostics.env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set (hidden)' : 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set'
    }

    // Supabase client state
    diagnostics.supabase = {
      clientExists: !!supabase,
      authExists: !!supabase?.auth
    }

    setStorageInfo(diagnostics)
    return diagnostics
  }

  // load current user
  useEffect(() => {
    let mounted = true
    ;(async () => {
      addDebugLog('Loading user...')
      
      // Collect full diagnostics on load
      const diag = collectDiagnostics()
      addDebugLog(`Browser: ${navigator.userAgent.substring(0, 50)}...`)
      addDebugLog(`Environment URL: ${diag.env.NEXT_PUBLIC_SUPABASE_URL}`)
      
      // Check localStorage for session
      try {
        const storageKey = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`
        const storedSession = localStorage.getItem(storageKey)
        addDebugLog(`localStorage session exists: ${!!storedSession}`)
        if (storedSession) {
          const parsed = JSON.parse(storedSession)
          addDebugLog(`localStorage has access_token: ${!!parsed?.access_token}`)
          addDebugLog(`localStorage has refresh_token: ${!!parsed?.refresh_token}`)
          if (parsed?.expires_at) {
            const expiryDate = new Date(parsed.expires_at * 1000)
            const now = new Date()
            const isExpired = expiryDate < now
            addDebugLog(`Session expires at: ${expiryDate.toLocaleString()}`)
            addDebugLog(`Session expired: ${isExpired}`)
          }
        }
      } catch (e) {
        addDebugLog(`localStorage check error: ${e}`)
      }
      
      // Check cookies
      try {
        const cookies = document.cookie.split(';').filter(c => c.includes('sb-'))
        addDebugLog(`Supabase cookies found: ${cookies.length}`)
        cookies.forEach(cookie => {
          const [key] = cookie.trim().split('=')
          addDebugLog(`Cookie: ${key}`)
        })
      } catch (e) {
        addDebugLog(`Cookie check error: ${e}`)
      }
      
      // Try getUser first
      const { data: userData, error: userError } = await supabase.auth.getUser()
      addDebugLog(`getUser result: ${userData?.user?.id ?? 'null'}, error: ${userError?.message ?? 'none'}`)
      if (userError) {
        addDebugLog(`getUser error details: ${JSON.stringify(userError)}`)
      }
      
      // Also check session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      addDebugLog(`getSession result: ${sessionData?.session?.user?.id ?? 'null'}, error: ${sessionError?.message ?? 'none'}`)
      if (sessionError) {
        addDebugLog(`getSession error details: ${JSON.stringify(sessionError)}`)
      }
      if (sessionData?.session) {
        addDebugLog(`Session access_token exists: ${!!sessionData.session.access_token}`)
        addDebugLog(`Session expires_at: ${new Date(sessionData.session.expires_at * 1000).toLocaleString()}`)
      }
      
      if (!mounted) return
      
      // Prefer session user if available
      const actualUser = sessionData?.session?.user ?? userData?.user ?? null
      setUser(actualUser)
      addDebugLog(`Final user set: ${actualUser?.id ?? 'none'}`)
      
      if (!actualUser) {
        addDebugLog('⚠️ WARNING: No authenticated user found.')
        addDebugLog('💡 Suggestion: Try logging out and logging back in.')
        addDebugLog('💡 Or check if you are on the correct domain/URL.')
        addDebugLog('💡 Check browser console for Supabase errors.')
      } else {
        addDebugLog(`✓ User authenticated: ${actualUser.email}`)
      }
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
    addDebugLog(`Loading conversations for user: ${user.id}`)
    addDebugLog(`Requested conversation ID: ${requestedConvId || 'none'}`)

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
        addDebugLog(`Loaded ${rows?.length || 0} conversations`)

        // Auto-open conversation if conv query param provided
        if (requestedConvId) {
          const found = rows?.find((r) => r.id === requestedConvId)
          if (found) {
            setActiveConv(found)
            addDebugLog(`Auto-selected conversation: ${found.id}`)
          } else {
            addDebugLog(`Conversation ${requestedConvId} not in list, fetching directly...`)
            // If conversation not found in initial load, try fetching it directly
            const { data: directConv } = await supabase
              .from('conversations')
              .select('*')
              .eq('id', requestedConvId)
              .single()
            
            if (directConv && mounted) {
              // Add it to the list and select it
              setConversations((prev) => [directConv as Conversation, ...prev])
              setActiveConv(directConv as Conversation)
              addDebugLog(`Fetched and selected conversation: ${directConv.id}`)
            } else {
              addDebugLog(`ERROR: Could not fetch conversation ${requestedConvId}`)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load conversations', err)
        addDebugLog(`ERROR loading conversations: ${err}`)
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
  }, [supabase, user, requestedConvId])

  // If the requested conv id arrives after conversations are loaded, auto-select it
  useEffect(() => {
    if (!requestedConvId || conversations.length === 0) return
    const found = conversations.find((c) => c.id === requestedConvId)
    if (found) {
      setActiveConv(found)
      addDebugLog(`Late auto-selection: ${found.id}`)
    }
  }, [requestedConvId, conversations])

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
    <main className="min-h-screen bg-gradient-to-br from-[#070D1C] via-[#0A0F1E] to-[#050A14] text-slate-100 p-6 md:p-10 pt-24 md:pt-28 relative overflow-hidden">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#35BFFF]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Debug Panel */}
        <div className="mb-6 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-2 border-[#35BFFF]/30 rounded-xl overflow-hidden shadow-xl">
          <button
            onClick={() => setDebugOpen(!debugOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${fallbackMode ? 'bg-yellow-500' : twilioClient ? 'bg-green-500' : 'bg-red-500'} shadow-lg ${fallbackMode ? 'shadow-yellow-500/50' : twilioClient ? 'shadow-green-500/50' : 'shadow-red-500/50'} animate-pulse`} />
              <span className="font-bold text-white text-lg">Debug Panel</span>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${fallbackMode ? 'bg-yellow-500/20 text-yellow-300' : twilioClient ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {twilioLoading ? 'Initializing...' : fallbackMode ? 'Fallback Mode' : twilioClient ? 'Twilio Connected' : 'Disconnected'}
              </span>
            </div>
            <svg
              className={`w-6 h-6 text-[#35BFFF] transform transition-transform ${debugOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {debugOpen && (
            <div className="px-6 pb-6 space-y-4 border-t border-[#35BFFF]/20 pt-4">
              {/* Connection Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-bold text-[#35BFFF] mb-2">Connection Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Twilio Client:</span>
                      <span className={twilioClient ? 'text-green-400 font-semibold' : 'text-red-400'}>
                        {twilioClient ? '✓ Connected' : '✗ Not Connected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Fallback Mode:</span>
                      <span className={fallbackMode ? 'text-yellow-400 font-semibold' : 'text-slate-500'}>
                        {fallbackMode ? '✓ Active' : '✗ Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Loading:</span>
                      <span className={twilioLoading ? 'text-yellow-400' : 'text-slate-500'}>
                        {twilioLoading ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {twilioError && (
                      <div className="mt-2 p-2 bg-red-900/30 border border-red-700 rounded text-red-300 text-xs">
                        Error: {twilioError}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-bold text-[#35BFFF] mb-2">Conversation State</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">User ID:</span>
                      <span className="text-white font-mono text-xs">{user?.id?.slice(0, 8) || 'None'}...</span>
                    </div>
                    {user?.email && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <span className="text-white text-xs">{user.email}</span>
                      </div>
                    )}
                    {!user && (
                      <div className="mt-2 p-2 bg-yellow-900/30 border border-yellow-700 rounded text-yellow-300 text-xs">
                        ⚠️ No authenticated user detected. Please ensure you're logged in.
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Conversations:</span>
                      <span className="text-white font-semibold">{conversations.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Conv ID:</span>
                      <span className="text-white font-mono text-xs">{activeConv?.id?.slice(0, 8) || 'None'}...</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Requested Conv:</span>
                      <span className="text-white font-mono text-xs">{requestedConvId?.slice(0, 8) || 'None'}...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Debug Logs */}
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-[#35BFFF]">Event Log</h3>
                  <button
                    onClick={() => setDebugLogs([])}
                    className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition"
                  >
                    Clear
                  </button>
                </div>
                <div className="bg-black/50 rounded p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
                  {debugLogs.length === 0 ? (
                    <div className="text-slate-500 italic">No events yet...</div>
                  ) : (
                    debugLogs.map((log, idx) => (
                      <div key={idx} className={`${log.includes('ERROR') ? 'text-red-400' : log.includes('Auto-selected') || log.includes('Fetched') ? 'text-green-400' : 'text-slate-300'}`}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Advanced Diagnostics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Console Logs */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-sm font-bold text-[#35BFFF] mb-2">Console Logs (Last 50)</h3>
                  <div className="bg-black/50 rounded p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-1 custom-scrollbar">
                    {consoleLogs.length === 0 ? (
                      <div className="text-slate-500 italic">No console logs captured yet...</div>
                    ) : (
                      consoleLogs.map((log, idx) => (
                        <div key={idx} className={`${log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-slate-300'}`}>
                          [{new Date(log.timestamp).toLocaleTimeString()}] {log.type.toUpperCase()}: {log.message}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Storage Info */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#35BFFF]">Storage & Environment</h3>
                    <button
                      onClick={collectDiagnostics}
                      className="text-xs px-2 py-1 bg-[#35BFFF] hover:bg-[#2fb2ff] rounded text-white transition"
                    >
                      Refresh
                    </button>
                  </div>
                  <div className="bg-black/50 rounded p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-2 custom-scrollbar">
                    {Object.keys(storageInfo).length === 0 ? (
                      <div className="text-slate-500 italic">Click "Refresh" to collect diagnostics...</div>
                    ) : (
                      <>
                        <div className="text-green-400">📍 URL: {storageInfo.url}</div>
                        <div className="text-blue-400 border-t border-slate-700 pt-2">🌐 Environment:</div>
                        {storageInfo.env && Object.entries(storageInfo.env).map(([key, value]: [string, any]) => (
                          <div key={key} className="pl-4 text-slate-300">{key}: {value}</div>
                        ))}
                        <div className="text-blue-400 border-t border-slate-700 pt-2">💾 LocalStorage (Supabase keys):</div>
                        {storageInfo.localStorage && Object.entries(storageInfo.localStorage).map(([key, value]: [string, any]) => (
                          <div key={key} className="pl-4 text-slate-300">
                            {key.substring(0, 30)}...: {typeof value === 'object' ? JSON.stringify(value) : value}
                          </div>
                        ))}
                        <div className="text-blue-400 border-t border-slate-700 pt-2">🍪 Cookies (count): {Object.keys(storageInfo.cookies || {}).length}</div>
                        {storageInfo.cookies && Object.keys(storageInfo.cookies).filter(k => k.includes('sb-')).map((key: string) => (
                          <div key={key} className="pl-4 text-slate-300">{key}: {storageInfo.cookies[key]}</div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={async () => {
                    addDebugLog('Checking auth session manually...')
                    const { data: sessionData } = await supabase.auth.getSession()
                    addDebugLog(`Session check: ${sessionData?.session?.user?.id ?? 'no session'}`)
                    if (sessionData?.session?.user) {
                      setUser(sessionData.session.user)
                      addDebugLog('User state updated from session')
                    } else {
                      addDebugLog('ERROR: No valid session found. Please log in.')
                    }
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-green-600/30"
                >
                  Check Auth
                </button>
                <button
                  onClick={async () => {
                    addDebugLog('Attempting to refresh session...')
                    const { data, error } = await supabase.auth.refreshSession()
                    if (error) {
                      addDebugLog(`ERROR refreshing session: ${error.message}`)
                    } else if (data?.session?.user) {
                      addDebugLog(`✓ Session refreshed successfully for: ${data.session.user.email}`)
                      setUser(data.session.user)
                    } else {
                      addDebugLog('No session to refresh. Please log in.')
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-purple-600/30"
                >
                  Refresh Session
                </button>
                <button
                  onClick={() => {
                    collectDiagnostics()
                    addDebugLog('✓ Diagnostics collected and displayed above')
                  }}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-orange-600/30"
                >
                  Collect Diagnostics
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-[#35BFFF] hover:bg-[#2fb2ff] text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-[#35BFFF]/30"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => {
                    const fullReport = {
                      debugLogs,
                      consoleLogs,
                      storageInfo,
                      user: user ? { id: user.id, email: user.email } : null,
                      conversations: conversations.length,
                      activeConv: activeConv?.id || null,
                      twilioState: { connected: !!twilioClient, fallback: fallbackMode, loading: twilioLoading, error: twilioError }
                    }
                    const report = JSON.stringify(fullReport, null, 2)
                    navigator.clipboard.writeText(report)
                    alert('Complete diagnostic report copied to clipboard!')
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-semibold transition"
                >
                  Copy Full Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-3">
            <svg className="w-10 h-10 text-[#35BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Messages
          </h1>
          <p className="text-slate-400 text-lg">Connect with freelancers and buyers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversations List */}
          <aside className="lg:col-span-4 bg-gradient-to-br from-[#0D1328]/80 to-[#0A0F1E]/80 backdrop-blur-sm border border-[#35BFFF]/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#35BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Conversations
                </h2>
                <p className="text-sm text-slate-400">Recent chats</p>
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

          {/* Chat Window */}
          <section className="lg:col-span-8 min-h-[600px]">
            {activeConv ? (
              <ChatWindow conversation={activeConv} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0D1328]/80 to-[#0A0F1E]/80 backdrop-blur-sm border border-[#35BFFF]/20 rounded-2xl p-12 shadow-2xl text-center">
                <div className="w-24 h-24 rounded-full bg-[#35BFFF]/10 flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-[#35BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white mb-3">Select a conversation</div>
                <div className="text-slate-400 text-base max-w-md">
                  Choose a conversation from the left to start chatting, or contact a seller from a service page
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}