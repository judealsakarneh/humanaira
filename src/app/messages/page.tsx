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
  Thread,
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

      if (!user) return setUserLoaded(true);

      const STREAM_KEY = process.env.NEXT_PUBLIC_STREAM_KEY!;
      instance = StreamChat.getInstance(STREAM_KEY);

      // Fetch secure token from backend
      const res = await fetch("/api/chat/token");
      const { token, user: streamUser } = await res.json();

      await instance.connectUser(streamUser, token);

      if (!mounted) return;

      setClient(instance);
      setUserLoaded(true);

      // Auto open channel via deep link: /messages?channel=XXXX
      if (deepLinkChannel) {
        const channel = instance.channel("humanaira_conversation", deepLinkChannel);
        await channel.watch();
        setActiveChannel(channel);
      }

      // Listen when user selects a channel from sidebar
      instance.on("channel.selected" as any, async (event: any) => {
        const channel = event?.channel;
        if (!channel) return;

        await channel.watch();
        setActiveChannel(channel);

        // Update URL without reloading
        window.history.replaceState({}, "", `/messages?channel=${channel.id}`);
      });
    };

    init();

    return () => {
      mounted = false;
      instance?.disconnectUser().catch(() => {});
    };
  }, [deepLinkChannel]);

  /* ---------------- UI States ---------------- */
  if (!userLoaded)
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        Connecting…
      </div>
    );

  if (!client)
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        Please log in to view messages.
      </div>
    );

  /* Channel filters */
  const filters = { members: { $in: [client.userID!] } };
  const sort = { last_message_at: -1 as const };

  return (
    <div className="h-screen bg-[#020617] text-white">
      <Chat client={client} theme="str-chat__theme-dark">
        <div className="flex h-full">

          {/* Sidebar - Glass UI */}
          <aside className="w-[26%] bg-[#050A12]/70 backdrop-blur-2xl border-r border-[#1f2a3b] shadow-[0_0_35px_rgba(53,191,255,0.15)]">
            <ChannelList 
              filters={filters} 
              sort={sort} 
              options={{ presence: true }} 
            />
          </aside>

          {/* Main Chat Window */}
          <main className="flex flex-col flex-1 bg-[#040b1a]">
            {activeChannel ? (
              <Channel 
                channel={activeChannel} 
                TypingIndicator={TypingIndicator} 
                Message={CustomMessage}
              >
                <Window>
                  <MessageList />
                  <div className="border-t border-[#1e293b] p-3">
                    <MessageInput 
                      additionalTextareaProps={{ placeholder: "Write a message…" }}
                    />
                  </div>
                </Window>
                <Thread />
              </Channel>
            ) : (
              <div className="flex items-center justify-center text-gray-500 text-lg">
                Select a conversation or start a new one ✨
              </div>
            )}
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
