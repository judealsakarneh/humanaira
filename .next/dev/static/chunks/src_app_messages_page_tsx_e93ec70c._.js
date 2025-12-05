(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/messages/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MessagesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2f$dist$2f$browser$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat/dist/browser.es.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Chat$2f$Chat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Chat/Chat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Channel$2f$Channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Channel/Channel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$ChannelList$2f$ChannelList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/ChannelList/ChannelList.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Window$2f$Window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Window/Window.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$MessageList$2f$MessageList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/MessageList/MessageList.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$MessageInput$2f$MessageInput$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/MessageInput/MessageInput.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$TypingIndicator$2f$TypingIndicator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/TypingIndicator/TypingIndicator.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Message$2f$MessageSimple$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Message/MessageSimple.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Avatar$2f$Avatar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Avatar/Avatar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$lib$2f$supabaseBrowser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/lib/supabaseBrowser.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
/* -----------------------------------------
   ⭐ Custom Message with Online Indicator
------------------------------------------*/ const CustomMessage = (props)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start gap-3",
        children: [
            props.avatar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Avatar$2f$Avatar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                        ...props.avatar.props
                    }, void 0, false, {
                        fileName: "[project]/src/app/messages/page.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_6px_rgba(0,255,100,0.9)]"
                    }, void 0, false, {
                        fileName: "[project]/src/app/messages/page.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/messages/page.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Message$2f$MessageSimple$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageSimple"], {
                    ...props
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/messages/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/messages/page.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = CustomMessage;
function MessagesPage() {
    _s();
    const [client, setClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeChannel, setActiveChannel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userLoaded, setUserLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [debugMessages, setDebugMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showDebug, setShowDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const addDebug = (message)=>{
        const timestamp = new Date().toLocaleTimeString();
        setDebugMessages((prev)=>[
                ...prev,
                `[${timestamp}] ${message}`
            ]);
    };
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$lib$2f$supabaseBrowser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSupabaseBrowser"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const deepLinkChannel = searchParams.get("channel");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MessagesPage.useEffect": ()=>{
            let mounted = true;
            let instance = null;
            const init = {
                "MessagesPage.useEffect.init": async ()=>{
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) {
                        addDebug('❌ No user authenticated');
                        return setUserLoaded(true);
                    }
                    addDebug('✅ User authenticated: ' + user.email);
                    const STREAM_KEY = ("TURBOPACK compile-time value", "tw7fwmvr3ekz");
                    instance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2f$dist$2f$browser$2e$es$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StreamChat"].getInstance(STREAM_KEY, {
                        timeout: 10000,
                        enableInsights: false,
                        enableWSFallback: true
                    });
                    addDebug('🔄 Fetching Stream token...');
                    // Fetch secure token from backend with retry logic
                    let res;
                    let attempts = 0;
                    const maxAttempts = 3;
                    while(attempts < maxAttempts){
                        try {
                            res = await fetch("/api/chat/token", {
                                credentials: 'include'
                            });
                            if (res.ok) break;
                            attempts++;
                            if (attempts < maxAttempts) {
                                addDebug(`⚠️ Token fetch failed, retrying (${attempts}/${maxAttempts})...`);
                                await new Promise({
                                    "MessagesPage.useEffect.init": (resolve)=>setTimeout(resolve, 1000)
                                }["MessagesPage.useEffect.init"]);
                            }
                        } catch (error) {
                            attempts++;
                            addDebug(`❌ Token fetch error (attempt ${attempts}): ${error}`);
                            if (attempts < maxAttempts) {
                                await new Promise({
                                    "MessagesPage.useEffect.init": (resolve)=>setTimeout(resolve, 1000)
                                }["MessagesPage.useEffect.init"]);
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
                            new Promise({
                                "MessagesPage.useEffect.init": (_, reject)=>setTimeout({
                                        "MessagesPage.useEffect.init": ()=>reject(new Error('Stream connection timeout'))
                                    }["MessagesPage.useEffect.init"], 15000)
                            }["MessagesPage.useEffect.init"])
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
                            } catch (queryErr) {
                                addDebug(`⚠️ Channel query failed: ${queryErr.message}`);
                                // Fallback: try querying all user's channels
                                addDebug(`🔄 Searching all channels...`);
                                const channels = await instance.queryChannels({
                                    type: 'messaging',
                                    members: {
                                        $in: [
                                            instance.userID
                                        ]
                                    }
                                });
                                addDebug(`ℹ️ Found ${channels.length} total channels for user`);
                                const targetChannel = channels.find({
                                    "MessagesPage.useEffect.init.targetChannel": (ch)=>ch.id === deepLinkChannel
                                }["MessagesPage.useEffect.init.targetChannel"]);
                                if (targetChannel) {
                                    addDebug(`✅ Found target channel in user's channels`);
                                    setActiveChannel(targetChannel);
                                } else {
                                    addDebug(`❌ Channel ${deepLinkChannel} not in user's channel list`);
                                    addDebug(`Available channels: ${channels.map({
                                        "MessagesPage.useEffect.init": (ch)=>ch.id
                                    }["MessagesPage.useEffect.init"]).join(', ')}`);
                                }
                            }
                        } catch (err) {
                            addDebug(`❌ Failed to access channel: ${err.message || err}`);
                            console.error('Channel error:', err);
                        }
                    } else {
                        addDebug('ℹ️ No channel parameter in URL');
                    }
                }
            }["MessagesPage.useEffect.init"];
            init();
            return ({
                "MessagesPage.useEffect": ()=>{
                    mounted = false;
                    instance?.disconnectUser().catch({
                        "MessagesPage.useEffect": ()=>{}
                    }["MessagesPage.useEffect"]);
                }
            })["MessagesPage.useEffect"];
        }
    }["MessagesPage.useEffect"], [
        deepLinkChannel
    ]);
    // Handle channel selection from sidebar
    const handleChannelSelect = async (channel)=>{
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
    /* ---------------- UI States ---------------- */ if (!userLoaded) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen items-center justify-center bg-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#35BFFF] mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 219,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-white text-lg",
                    children: "Loading messages..."
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 220,
                    columnNumber: 11
                }, this),
                debugMessages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 bg-gray-800 rounded-lg p-4 max-w-2xl mx-auto text-left",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs font-mono text-gray-300 space-y-1",
                        children: debugMessages.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: msg
                            }, i, false, {
                                fileName: "[project]/src/app/messages/page.tsx",
                                lineNumber: 225,
                                columnNumber: 19
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/messages/page.tsx",
                        lineNumber: 223,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 222,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/messages/page.tsx",
            lineNumber: 218,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/messages/page.tsx",
        lineNumber: 217,
        columnNumber: 7
    }, this);
    if (!client) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen items-center justify-center bg-gray-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center max-w-2xl px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-white text-lg mb-4",
                    children: "❌ Chat client failed to connect"
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 238,
                    columnNumber: 11
                }, this),
                debugMessages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 bg-gray-800 rounded-lg p-4 text-left",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-semibold text-red-400 mb-2",
                            children: "Debug Log:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 241,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs font-mono text-gray-300 space-y-1 max-h-96 overflow-y-auto",
                            children: debugMessages.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: msg
                                }, i, false, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 244,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 242,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 240,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>window.location.reload(),
                    className: "mt-4 px-6 py-2 bg-[#35BFFF] text-white rounded-lg hover:bg-[#2a9fd9] transition",
                    children: "Retry Connection"
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 249,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/messages/page.tsx",
            lineNumber: 237,
            columnNumber: 9
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/messages/page.tsx",
        lineNumber: 236,
        columnNumber: 7
    }, this);
    /* Channel filters */ const filters = {
        members: {
            $in: [
                client.userID
            ]
        }
    };
    const sort = {
        last_message_at: -1
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-e8dff7bbcfacbf5f" + " " + "pt-24 h-screen bg-[#020617] text-white relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Chat$2f$Chat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Chat"], {
                client: client,
                theme: "str-chat__theme-dark",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "jsx-e8dff7bbcfacbf5f" + " " + "flex h-[calc(100vh-6rem)] relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setSidebarOpen(!sidebarOpen),
                            "aria-label": "Toggle sidebar",
                            className: "jsx-e8dff7bbcfacbf5f" + " " + "fixed top-28 left-4 z-50 lg:hidden p-2 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                className: "jsx-e8dff7bbcfacbf5f" + " " + "w-6 h-6 text-white",
                                children: sidebarOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M6 18L18 6M6 6l12 12",
                                    className: "jsx-e8dff7bbcfacbf5f"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 276,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M4 6h16M4 12h16M4 18h16",
                                    className: "jsx-e8dff7bbcfacbf5f"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 278,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/messages/page.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 269,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            onClick: ()=>{
                                // Close sidebar on mobile when channel is clicked
                                if (window.innerWidth < 1024) {
                                    setTimeout(()=>setSidebarOpen(false), 100);
                                }
                            },
                            className: "jsx-e8dff7bbcfacbf5f" + " " + `
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
            `,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$ChannelList$2f$ChannelList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChannelList"], {
                                filters: filters,
                                sort: sort,
                                options: {
                                    presence: true
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/messages/page.tsx",
                                lineNumber: 304,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 284,
                            columnNumber: 11
                        }, this),
                        sidebarOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: ()=>setSidebarOpen(false),
                            className: "jsx-e8dff7bbcfacbf5f" + " " + "fixed inset-0 bg-black/50 z-30 lg:hidden"
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 313,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "jsx-e8dff7bbcfacbf5f" + " " + "flex-1 bg-[#040b1a] w-full lg:w-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Channel$2f$Channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Channel"], {
                                TypingIndicator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$TypingIndicator$2f$TypingIndicator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TypingIndicator"],
                                Message: CustomMessage,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Window$2f$Window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Window"], {
                                    hideOnThread: true,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$MessageList$2f$MessageList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageList"], {
                                            messageActions: [
                                                'react',
                                                'delete',
                                                'edit'
                                            ]
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 326,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$MessageInput$2f$MessageInput$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageInput"], {
                                            additionalTextareaProps: {
                                                placeholder: "Write a message…"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/messages/page.tsx",
                                            lineNumber: 327,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/messages/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/messages/page.tsx",
                                lineNumber: 321,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/page.tsx",
                            lineNumber: 320,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/messages/page.tsx",
                    lineNumber: 266,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/messages/page.tsx",
                lineNumber: 265,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "e8dff7bbcfacbf5f",
                children: ".str-chat__message--me .str-chat__message-bubble{background:linear-gradient(135deg,#35bfff,#008cff);border-radius:16px 16px 4px;box-shadow:0 0 12px #35bfff73;color:#fff!important}.str-chat__message--other .str-chat__message-bubble{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#fff;background:#ffffff0f;border:1px solid #ffffff1a;border-radius:16px 16px 16px 4px}::-webkit-scrollbar{width:8px}::-webkit-scrollbar-thumb{background:#35bfff;border-radius:6px}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/messages/page.tsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
}
_s(MessagesPage, "tPphIj/gVNIClEPRjFZxPslv0+8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c1 = MessagesPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "CustomMessage");
__turbopack_context__.k.register(_c1, "MessagesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_messages_page_tsx_e93ec70c._.js.map