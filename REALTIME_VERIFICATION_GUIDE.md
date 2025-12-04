# Supabase Real-time Chat Verification Guide

## Prerequisites
- Access to Supabase Dashboard: https://supabase.com/dashboard/project/ekjxetwphxedvoeywebe
- Two browser windows/tabs or two different browsers for testing
- User accounts in your application

## Step 1: Enable Real-time on Supabase (CRITICAL)

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire content of `supabase_realtime_fix.sql`
3. Click "Run" to execute the script
4. Verify output shows no errors

**What this does:**
- Enables real-time replication on `messages` and `payment_requests` tables
- Sets up proper RLS (Row Level Security) policies
- Ensures users can only see messages in their own conversations

## Step 2: Verify Real-time is Enabled

1. In Supabase Dashboard → Database → Publications
2. Look for publication named `supabase_realtime`
3. Verify it includes these tables:
   - ✅ `messages`
   - ✅ `payment_requests`

If not listed, run this SQL again:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_requests;
```

## Step 3: Test Real-time Subscription (Browser Console)

### Test Setup:
1. Open your app at `/messages` page
2. Open Browser DevTools (F12) → Console tab
3. Look for these debug messages:

**Expected Console Output on Page Load:**
```
[DEBUG] ChatWindow mounted
[DEBUG] useEffect: load Supabase messages
[DEBUG] Loading Supabase messages for conversation <id>
[DEBUG] Loaded Supabase messages: [...]
[DEBUG] Subscription status: SUBSCRIBED
[DEBUG] Successfully subscribed to messages channel
[DEBUG] Payment requests subscription status: SUBSCRIBED
[DEBUG] Successfully subscribed to payment requests channel
```

**If you see errors:**
- `CHANNEL_ERROR` → RLS policies are blocking access (re-run SQL script)
- `TIMED_OUT` → Network issue or Supabase project paused
- No subscription logs → Check if conversation exists

## Step 4: Test Message Real-time Delivery

### Single Window Test:
1. Open `/messages` page
2. Select or create a conversation
3. Type a message and click "Send"
4. Watch the console for:
```
[DEBUG] handleSend called: text="your message", files=
[DEBUG] Sent Supabase message: text="your message", uploaded=
[DEBUG] Real-time payload received: {new: {...}, old: null, eventType: "INSERT"}
[DEBUG] Adding new message to state: {...}
```
5. Message should appear immediately in the chat window

### Two Window Test (BEST TEST):
1. **Window A**: Login as User 1, open a conversation with User 2
2. **Window B**: Login as User 2, open same conversation
3. **Window A**: Send a message
4. **Window B**: Should see message appear immediately WITHOUT refreshing

**Expected behavior:**
- Message appears in Window A immediately (from INSERT operation)
- Message appears in Window B 1-2 seconds later (from real-time subscription)
- Both windows show same message with same timestamp

## Step 5: Verify Messages are Inserted in Database

1. Go to Supabase Dashboard → Table Editor → `messages`
2. Find the most recent message
3. Verify fields:
   - `conversation_id` matches your conversation
   - `sender_id` matches your user ID
   - `text` contains your message
   - `created_at` is recent timestamp
   - `is_system` is `false`
   - `blocked` is `false` or `NULL`

## Step 6: Check RLS Policies

Run this SQL in Supabase SQL Editor to verify policies:
```sql
-- Check messages policies
SELECT * FROM pg_policies 
WHERE tablename = 'messages';

-- Check if current user can see messages
SELECT * FROM messages 
WHERE conversation_id = '<your-conversation-id>'
LIMIT 5;
```

**Expected output:**
- Should show policies for SELECT and INSERT
- SELECT query should return messages

## Troubleshooting Guide

### Problem: Messages INSERT to database but don't appear in real-time

**Diagnosis:**
1. Check browser console for subscription status
2. Look for `SUBSCRIBED` vs `CHANNEL_ERROR` or `TIMED_OUT`

**Solutions:**

**Solution A - RLS Issue:**
```sql
-- Verify you can see messages
SELECT m.*, c.seller_id, c.buyer_id 
FROM messages m
JOIN conversations c ON c.id = m.conversation_id
WHERE m.conversation_id = '<your-conversation-id>';

-- If empty, check your user ID
SELECT auth.uid();

-- If user ID doesn't match seller_id or buyer_id, RLS is blocking
-- Re-run the RLS policies from supabase_realtime_fix.sql
```

**Solution B - Real-time Not Enabled:**
```sql
-- Check if table is in publication
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename = 'messages';

-- If not listed, add it:
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

**Solution C - Subscription Filter Issue:**
The code now uses this format:
```typescript
.channel(`messages-${conversation.id}`)
.on('postgres_changes', { 
  event: 'INSERT', 
  schema: 'public', 
  table: 'messages', 
  filter: `conversation_id=eq.${conversation.id}` 
})
```

Make sure the conversation ID is valid and exists.

### Problem: Duplicate messages appearing

**Solution:**
The updated code now includes duplicate prevention:
```typescript
setMessages((prev) => {
  if (prev.some(m => m.id === newMsg.id)) {
    return prev; // Skip duplicate
  }
  return [...prev, newMsg];
})
```

### Problem: Messages appear after refresh but not real-time

**Cause:** Real-time subscription is working for reading but not for live updates

**Solution:**
1. Check if Supabase project is on a paid plan (free tier has limits)
2. Verify Supabase project is not paused
3. Check browser console for WebSocket connection errors
4. Try in incognito mode to rule out extensions

## Testing Checklist

- [ ] SQL script executed successfully in Supabase
- [ ] Real-time enabled on messages table (verified in Publications)
- [ ] RLS policies created (verified in pg_policies)
- [ ] Console shows "SUBSCRIBED" status on page load
- [ ] Single window test: Message appears immediately after sending
- [ ] Two window test: Message appears in other user's window
- [ ] Message visible in Supabase Table Editor
- [ ] No CHANNEL_ERROR or TIMED_OUT in console
- [ ] No duplicate messages appearing
- [ ] Payment requests real-time also working (optional test)

## Success Criteria

✅ **Real-time is working when:**
1. User A sends message → appears immediately in their window
2. User B sees same message appear 1-2 seconds later WITHOUT refresh
3. Console shows `[DEBUG] Real-time payload received`
4. No errors in browser console
5. Supabase Table Editor shows the inserted message

## Additional Debug Commands

Run in browser console while on `/messages` page:

```javascript
// Check if Supabase client is available
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

// Check auth state
const supabase = createSupabaseBrowser();
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user?.id);

// Check conversation
console.log('Current conversation ID:', /* inspect component state */);

// Manually test INSERT
await supabase.from('messages').insert([{
  conversation_id: '<your-conv-id>',
  sender_id: '<your-user-id>',
  text: 'Test message',
  attachments: [],
  is_system: false
}]);
```

## Contact / Next Steps

If issues persist after following all steps:
1. Export console logs (Right-click in console → Save as...)
2. Screenshot of Supabase Publications page
3. Screenshot of messages table with recent entries
4. Note which specific step failed
5. Check if using correct Supabase project (ekjxetwphxedvoeywebe)
