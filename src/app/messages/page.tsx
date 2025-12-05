"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelList,
  Window,
  MessageList,
  MessageInput,
  TypingIndicator,
  MessageSimple,
  Avatar,
} from "stream-chat-react";

import { useSearchParams } from "next/navigation";
import "stream-chat-react/dist/css/v2/index.css";
import { createSupabaseBrowser } from "../api/lib/supabaseBrowser";

type ChatClient = ReturnType<typeof StreamChat.getInstance>;

/* -----------------------------------------
   ⭐ Custom Message with Online Indicator
------------------------------------------*/
const CustomMessage = (props: any) => {
  return (
    <div className="flex items-start gap-3">
      {props.avatar && (
        <div className="relative">
          <Avatar {...props.avatar.props} />
          {/* Online Badge */}
          <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_6px_rgba(0,255,100,0.9)]"></span>
        </div>
      )}
      <div className="flex-1">
        <MessageSimple {...props} />
      </div>
    </div>
  );
};

export default function MessagesPage() {
  const [client, setClient] = useState<ChatClient | null>(null);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [debugMessages, setDebugMessages] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addDebug = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugMessages(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const supabase = createSupabaseBrowser();
  const searchParams = useSearchParams();
  const deepLinkChannel = searchParams.get("channel");

  useEffect(() => {
    let mounted = true;
    let instance: ChatClient | null = null;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        addDebug('❌ No user authenticated');
        return setUserLoaded(true);
      }

      addDebug('✅ User authenticated: ' + user.email);

      const STREAM_KEY = process.env.NEXT_PUBLIC_STREAM_KEY!;
      instance = StreamChat.getInstance(STREAM_KEY, {
        timeout: 10000, // 10 second timeout for requests
        enableInsights: false,
        enableWSFallback: true,
      });

      addDebug('🔄 Fetching Stream token...');

      // Fetch secure token from backend with retry logic
      let res;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          res = await fetch("/api/chat/token", {
            credentials: 'include', // Ensure cookies are sent
          });
          if (res.ok) break;
          attempts++;
          if (attempts < maxAttempts) {
            addDebug(`⚠️ Token fetch failed, retrying (${attempts}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          attempts++;
          addDebug(`❌ Token fetch error (attempt ${attempts}): ${error}`);
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (!res || !res.ok) {
        const errorText = res ? await res.text() : "No response";
        addDebug(`❌ Failed to fetch Stream token after retries: ${errorText}`);
        return setUserLoaded(true);
      }

      addDebug('✅ Stream token received');
      
      const data = await res.json();
      
      if (!data.token || !data.user) {
        addDebug('❌ Invalid Stream token response');
        return setUserLoaded(true);
      }
      
      const { token, user: streamUser } = data;

      // Connect to Stream with timeout handling
      try {
        addDebug('🔄 Connecting to Stream Chat...');
        await Promise.race([
          instance.connectUser(streamUser, token),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Stream connection timeout')), 15000)
          )
        ]);
        addDebug('✅ Stream Chat connected successfully');
      } catch (err) {
        addDebug(`❌ Failed to connect to Stream: ${err}`);
        return setUserLoaded(true);
      }

      if (!mounted) return;

      setClient(instance);
      setUserLoaded(true);
      addDebug('✅ Client ready, loading UI...');

      // Auto open channel via deep link: /messages?channel=XXXX
      if (deepLinkChannel) {
        try {
          addDebug(`🔄 Querying for channel: ${deepLinkChannel}`);
          
          // First try to get the channel directly
          const channel = instance.channel('messaging', deepLinkChannel);
          
          try {
            // Try to query channel state (read-only, doesn't create)
            const state = await channel.query();
            addDebug(`✅ Channel found with ${Object.keys(state.members).length} members`);
            setActiveChannel(channel);
            addDebug('✅ Channel set as active');
          } catch (queryErr: any) {
            addDebug(`⚠️ Channel query failed: ${queryErr.message}`);
            
            // Fallback: try querying all user's channels
            addDebug(`🔄 Searching all channels...`);
            const channels = await instance.queryChannels({
              type: 'messaging',
              members: { $in: [instance.userID!] }
            });
            
            addDebug(`ℹ️ Found ${channels.length} total channels for user`);
            const targetChannel = channels.find(ch => ch.id === deepLinkChannel);
            
            if (targetChannel) {
              addDebug(`✅ Found target channel in user's channels`);
              setActiveChannel(targetChannel);
            } else {
              addDebug(`❌ Channel ${deepLinkChannel} not in user's channel list`);
              addDebug(`Available channels: ${channels.map(ch => ch.id).join(', ')}`);
            }
          }
        } catch (err: any) {
          addDebug(`❌ Failed to access channel: ${err.message || err}`);
          console.error('Channel error:', err);
        }
      } else {
        addDebug('ℹ️ No channel parameter in URL');
      }
    };

    init();

    return () => {
      mounted = false;
      instance?.disconnectUser().catch(() => {});
    };
  }, [deepLinkChannel]);

  // Handle channel selection from sidebar
  const handleChannelSelect = async (channel: any) => {
    if (!channel) return;
    
    try {
      await channel.watch();
      setActiveChannel(channel);
      // Update URL without reloading
      window.history.replaceState({}, "", `/messages?channel=${channel.id}`);
    } catch (err) {
      console.error('Failed to select channel:', err);
    }
  };

  /* ---------------- UI States ---------------- */
  if (!userLoaded)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#35BFFF] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading messages...</p>
          {debugMessages.length > 0 && (
            <div className="mt-6 bg-gray-800 rounded-lg p-4 max-w-2xl mx-auto text-left">
              <div className="text-xs font-mono text-gray-300 space-y-1">
                {debugMessages.map((msg, i) => (
                  <div key={i}>{msg}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );

  if (!client)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center max-w-2xl px-4">
          <div className="text-white text-lg mb-4">❌ Chat client failed to connect</div>
          {debugMessages.length > 0 && (
            <div className="mt-6 bg-gray-800 rounded-lg p-4 text-left">
              <div className="text-sm font-semibold text-red-400 mb-2">Debug Log:</div>
              <div className="text-xs font-mono text-gray-300 space-y-1 max-h-96 overflow-y-auto">
                {debugMessages.map((msg, i) => (
                  <div key={i}>{msg}</div>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-[#35BFFF] text-white rounded-lg hover:bg-[#2a9fd9] transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );

  /* Channel filters */
  const filters = { members: { $in: [client.userID!] } };
  const sort = { last_message_at: -1 as const };

  return (
    <div className="pt-24 h-screen bg-[#020617] text-white relative">
      <Chat client={client} theme="str-chat__theme-dark">
        <div className="flex h-[calc(100vh-6rem)] relative">
          
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-28 left-4 z-50 lg:hidden p-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition"
            aria-label="Toggle sidebar"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {sidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Sidebar with ChannelList */}
          <aside 
            className={`
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              fixed lg:relative lg:translate-x-0
              w-full sm:w-80 lg:w-[26%]
              h-[calc(100vh-6rem)]
              bg-[#050A12]/95 lg:bg-[#050A12]/70 
              backdrop-blur-2xl 
              border-r border-[#1f2a3b] 
              shadow-[0_0_35px_rgba(53,191,255,0.15)]
              transition-transform duration-300 ease-in-out
              z-40
            `}
            onClick={() => {
              // Close sidebar on mobile when channel is clicked
              if (window.innerWidth < 1024) {
                setTimeout(() => setSidebarOpen(false), 100);
              }
            }}
          >
            <ChannelList 
              filters={filters} 
              sort={sort} 
              options={{ presence: true }}
            />
          </aside>

          {/* Overlay for mobile when sidebar is open */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Chat Window */}
          <main className="flex-1 bg-[#040b1a] w-full lg:w-auto">
            <Channel 
              TypingIndicator={TypingIndicator} 
              Message={CustomMessage}
            >
              <Window hideOnThread>
                <MessageList messageActions={['react', 'delete', 'edit']} />
                <MessageInput 
                  additionalTextareaProps={{ placeholder: "Write a message…" }}
                />
              </Window>
            </Channel>
          </main>

        </div>
      </Chat>

      {/* Global UI Styling */}
      <style jsx global>{`
        .str-chat__message--me .str-chat__message-bubble {
          background: linear-gradient(135deg, #35bfff, #008cff);
          border-radius: 16px 16px 4px 16px;
          color: white !important;
          box-shadow: 0 0 12px rgba(53, 191, 255, 0.45);
        }

        .str-chat__message--other .str-chat__message-bubble {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 16px 16px 16px 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb {
          background: #35bfff;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
