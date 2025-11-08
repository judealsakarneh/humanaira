# Quick Start Guide - Messaging System

## For Developers

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Set Environment Variables
Ensure `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Database Migration
1. Copy contents of `supabase-messaging-schema.sql`
2. Open Supabase Dashboard → SQL Editor
3. Paste and execute

### 4. Enable Realtime
1. Go to Supabase Dashboard → Database → Replication
2. Enable realtime for:
   - `messages` table
   - `conversations` table

### 5. Start Development Server
```bash
npm run dev
```

## Testing the Feature

### Test Contact Seller Flow
1. Navigate to any service page (e.g., `/services/[slug]`)
2. Click "Contact Seller" button
3. Verify you're redirected to `/messages?conv=[id]`
4. Verify initial message appears: "Hi! I'm interested in..."

### Test Messaging
1. Type a message in the input field
2. Click "Send"
3. Verify message appears immediately
4. Open same conversation in another browser
5. Send message from one browser
6. Verify it appears in both browsers within 1-2 seconds

### Test Security (RLS)
Open browser console:
```javascript
// Try to access someone else's conversation
const { data, error } = await supabase
  .from('messages')
  .select('*')
  .eq('conversation_id', 'OTHER_USER_CONVERSATION_ID')

// Should return empty array (RLS blocks access)
console.log(data) // []
```

## File Structure

```
client/src/
├── lib/
│   ├── supabaseBrowser.ts       # Browser client with realtime
│   ├── messagesClient.ts        # Send message helper
│   └── messaging.ts             # Existing messaging utilities
├── hooks/
│   └── useMessages.ts           # Message fetching + realtime hook
├── components/
│   ├── MessageList.tsx          # Display messages
│   ├── SendMessageForm.tsx      # Message input form
│   └── ContactSellerButton.tsx  # Updated with initial message
└── app/
    ├── services/[slug]/page.tsx # Service page with contact handler
    └── messages/page.tsx        # Messages inbox page
```

## Key Concepts

### Realtime Subscription
```typescript
// Automatically handled by useMessages hook
const { messages, loading, error } = useMessages(conversationId)
```

### Sending Messages
```typescript
// Returns inserted row immediately
const { message, error } = await sendMessage(
  conversationId,
  senderId,
  text,
  attachments
)
```

### RLS Security
- Users can only read/write messages in conversations they're part of
- `auth.uid()` must match `sender_id` for inserts
- Participant validation via `conversations` join

## Common Issues

### "Missing NEXT_PUBLIC_SUPABASE_URL"
- Check `.env.local` exists in `/client` directory
- Restart dev server after adding env vars

### "Subscription status: CHANNEL_ERROR"
- Enable realtime in Supabase Dashboard
- Check RLS policies are applied

### Messages not appearing in realtime
- Verify subscription channel name matches conversation ID
- Check browser console for subscription errors
- Ensure user is authenticated

### Build fails with Firebase error
- This is a pre-existing issue in checkout route
- Doesn't affect messaging functionality
- Needs separate fix for Firebase config

## Documentation

- **IMPLEMENTATION_SUMMARY.md** - Complete technical overview
- **MESSAGING_TEST_CHECKLIST.md** - 13 comprehensive tests
- **supabase-messaging-schema.sql** - Database schema with comments

## Support

If tests fail:
1. Check Supabase Dashboard → Logs
2. Check browser console for errors
3. Verify environment variables
4. Review troubleshooting section in MESSAGING_TEST_CHECKLIST.md

## Success Criteria

✅ Contact Seller creates conversation
✅ Initial message sent automatically
✅ Messages appear immediately after sending
✅ Realtime works across multiple browsers
✅ RLS prevents unauthorized access
✅ No errors in console
