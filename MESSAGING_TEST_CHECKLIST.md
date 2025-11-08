# Messaging System Test Checklist

This document provides step-by-step instructions for testing the messaging system locally.

## Prerequisites

1. Ensure you have the following environment variables set in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Run the SQL schema file in Supabase SQL Editor:
   ```bash
   # Located at: /supabase-messaging-schema.sql
   ```

3. Enable Realtime for tables in Supabase Dashboard:
   - Go to Database > Replication
   - Enable realtime for `messages` and `conversations` tables

## Test 1: Start Development Server

```bash
cd client
npm run dev
```

Expected: Server starts without errors on http://localhost:3000

## Test 2: Verify Supabase Client Initialization

1. Open browser console (F12)
2. Navigate to any page on the site
3. Check for errors related to Supabase

Expected: No console errors about missing environment variables or Supabase initialization

## Test 3: Browser Console - Manual Message Query

1. Log in as a user
2. Open browser console
3. Run the following (replace `<VALID_CONVERSATION_ID>` with an actual conversation ID from your database):

```javascript
// Import the supabase client
const { supabase } = await import('/src/lib/supabaseBrowser.ts')

// Test conversation ID - replace with actual ID from your database
const convId = '<VALID_CONVERSATION_ID>'

// Fetch messages
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', convId)
  .order('created_at', { ascending: true })

console.log({ data, error })
```

Expected: 
- `data` contains array of messages (or empty array if no messages)
- `error` is null

## Test 4: Browser Console - Realtime Subscription

Continue in browser console:

```javascript
// Set up realtime subscription
const ch = supabase
  .channel('test')
  .on(
    'postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'messages', 
      filter: `conversation_id=eq.${convId}` 
    },
    (payload) => console.log('Realtime payload:', payload)
  )
  .subscribe((status) => console.log('Subscription status:', status))
```

Expected:
- Console logs "Subscription status: SUBSCRIBED"
- No errors

## Test 5: Browser Console - Insert Message

Continue in browser console (with subscription still active):

```javascript
// Get current user ID
const { data: { session } } = await supabase.auth.getSession()
const userId = session?.user?.id

if (!userId) {
  console.error('Not logged in!')
} else {
  // Insert a test message
  const { data, error } = await supabase
    .from('messages')
    .insert([{
      conversation_id: convId,
      sender_id: userId,
      text: 'Hello from console test!'
    }])
    .select()
  
  console.log('Insert result:', { data, error })
}
```

Expected:
- `data` contains the inserted message with all fields including `id` and `created_at`
- `error` is null
- Realtime subscription from Test 4 logs the new message payload
- Console shows: "Realtime payload: { new: { ... message data ... } }"

## Test 6: Contact Seller Button

1. Navigate to any service/gig page (e.g., `/services/[slug]`)
2. Ensure you are logged in
3. Click "Contact Seller" button

Expected:
- Loading state shows "Opening chat…"
- User is redirected to `/messages?conv=<conversation-id>`
- A new conversation is created (or existing one is opened)
- Initial message appears: "Hi! I'm interested in..."
- No errors in console

## Test 7: Messages Page - View Conversation

1. From Test 6, you should be on `/messages?conv=<id>`
2. Verify the messages UI loads

Expected:
- Conversation list appears on left sidebar
- Selected conversation is highlighted
- Messages appear in the center panel
- Initial message from Test 6 is visible
- No console errors

## Test 8: Send Message via UI

1. On the messages page, type a message in the input field
2. Click "Send" button

Expected:
- "Sending..." state appears briefly
- Message appears in the chat immediately (optimistic update)
- Input field clears
- New message appears with your user styling (right-aligned, blue background)
- Message has timestamp
- No errors in console

## Test 9: Realtime - Two Browser Windows

1. Open the same conversation in two different browser windows/tabs
2. Log in as different users in each window (one as buyer, one as seller)
3. Send a message from window 1

Expected:
- Message appears immediately in window 1 (optimistic)
- Message appears in window 2 within 1-2 seconds (realtime)
- Both windows show the message
- Timestamps match

## Test 10: RLS Policy Verification

### Test Unauthorized Access

1. Log in as User A
2. Get a conversation ID that User A is NOT part of
3. Try to fetch messages from browser console:

```javascript
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', '<OTHER_USER_CONVERSATION_ID>')

console.log({ data, error })
```

Expected:
- `data` is empty array (RLS prevents access)
- No error (RLS silently filters results)

### Test Unauthorized Insert

```javascript
const { data, error } = await supabase
  .from('messages')
  .insert([{
    conversation_id: '<OTHER_USER_CONVERSATION_ID>',
    sender_id: '<YOUR_USER_ID>',
    text: 'Unauthorized message'
  }])
  .select()

console.log({ data, error })
```

Expected:
- `error` is present with message about policy violation
- `data` is null
- Message is NOT inserted

## Test 11: Error Handling

1. Turn off internet connection
2. Try to send a message

Expected:
- Error alert appears: "Failed to send message. Please try again."
- Message does not appear in chat
- Console shows network error
- UI remains functional after error

## Test 12: Large Message Volume

1. Send 10+ messages in quick succession

Expected:
- All messages appear in order
- No duplicate messages
- Realtime subscription handles all messages
- No performance degradation
- Scroll position updates to show latest message

## Test 13: Special Characters & Formatting

1. Send messages with:
   - Emoji: "Hello 👋 World 🌍"
   - Line breaks (press Shift+Enter if supported)
   - URLs: "Check this out: https://example.com"
   - Special chars: "Price: $100 & 50% off!"

Expected:
- All characters display correctly
- No XSS vulnerabilities
- URLs are plain text (not auto-linked unless you implement that)
- Formatting preserved

## Cleanup

After testing, clean up test data if needed:

```sql
-- Delete test messages (run in Supabase SQL Editor)
DELETE FROM public.messages WHERE text LIKE '%test%' OR text LIKE '%console%';

-- Or delete entire test conversations
-- DELETE FROM public.conversations WHERE id = '<test-conversation-id>';
```

## Troubleshooting

### Issue: "Missing NEXT_PUBLIC_SUPABASE_URL"
- Solution: Check `.env.local` has the correct variables
- Restart dev server after adding env vars

### Issue: "Subscription status: CHANNEL_ERROR"
- Solution: Enable realtime for tables in Supabase Dashboard
- Check RLS policies allow the current user

### Issue: Messages not appearing in realtime
- Solution: Verify subscription channel name matches
- Check browser console for subscription errors
- Ensure user is authenticated

### Issue: "Row level security policy violation"
- Solution: Run the SQL schema file to create/update policies
- Verify user is participant in conversation
- Check sender_id matches authenticated user

### Issue: Duplicate messages appearing
- Solution: Check for multiple subscriptions (unmount cleanup)
- Verify deduplication logic in useMessages hook

## Success Criteria

All tests pass if:

✅ Supabase client initializes without errors
✅ Messages can be fetched via SELECT query
✅ Realtime subscription receives INSERT events
✅ Contact Seller creates conversation and sends initial message
✅ Messages UI displays conversations and messages
✅ Send message form works and updates UI immediately
✅ Realtime works across multiple browser windows
✅ RLS policies prevent unauthorized access
✅ Error handling shows user-friendly messages
✅ No security vulnerabilities (XSS, SQL injection)
✅ No console errors during normal operation

## Notes

- Test with both buyer and seller accounts
- Test on different browsers (Chrome, Firefox, Safari)
- Test on mobile devices if applicable
- Monitor Supabase Dashboard > Logs for backend errors
- Check Network tab for API calls and responses
