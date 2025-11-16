# Production Twilio Conversations Integration - Complete Guide

## Overview

This integration implements a production-ready Twilio Conversations system for the Humanaira marketplace with:
- ✅ Secure server-side token generation using Supabase auth
- ✅ Database persistence for conversation metadata and messages
- ✅ Twilio webhook integration for message durability
- ✅ Real-time messaging via Twilio Conversations SDK
- ✅ Contact Seller flow with automatic conversation creation
- ✅ Backward compatibility with legacy conversations

## Architecture

### Components

1. **Token Endpoint** (`/api/chat/token`)
   - Authenticates users via Supabase session token
   - Generates Twilio Access Tokens using user's Supabase ID as identity
   - Secure: Uses API Key authentication (not account auth on client)

2. **Conversation Endpoint** (`/api/chat/conversations`)
   - Creates or retrieves Twilio conversations
   - Stores mapping: `twilio_conversation_sid` ↔ database conversation
   - Supports conversation uniqueness by order or buyer-seller pair

3. **Webhook Endpoint** (`/api/webhooks/twilio`)
   - Validates Twilio signatures for security
   - Persists messages to database on: onMessageAdded, onMessageUpdated, onMessageRemoved
   - Updates conversation metadata (last_message, updated_at)

4. **React Hook** (`hooks/useTwilioConversation`)
   - Client-side hook for Twilio Conversations
   - Fetches token with authentication
   - Manages real-time message state
   - Provides sendMessage function

5. **UI Components**
   - `TwilioChatWindow`: Real-time chat with Twilio SDK
   - `ContactSellerButton`: Creates conversations and navigates to messages
   - `Messages Page`: Lists conversations and renders appropriate chat component

## Database Schema

### Required Columns

Add these columns to your existing tables:

```sql
-- conversations table
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS twilio_conversation_sid TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS last_message TEXT;

-- messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS twilio_message_sid TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
```

### Table Structure

**conversations**
- `id` (uuid, primary key)
- `seller_id` (uuid, references users)
- `buyer_id` (uuid, references users)
- `gig_id` (uuid, nullable, references gigs)
- `status` (text)
- `twilio_conversation_sid` (text, unique) - **NEW**
- `last_message` (text) - **NEW**
- `created_at` (timestamp)
- `updated_at` (timestamp)

**messages**
- `id` (uuid, primary key)
- `conversation_id` (uuid, references conversations)
- `sender_id` (uuid, references users)
- `text` (text)
- `attachments` (jsonb, array of URLs)
- `twilio_message_sid` (text, unique) - **NEW**
- `is_system` (boolean)
- `deleted_at` (timestamp) - **NEW**
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Environment Variables

Ensure these are set in your `.env.local`:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SID=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_CONVERSATIONS_SERVICE_SID=ISxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

## Twilio Console Setup

### 1. Configure Webhook URL

1. Go to [Twilio Console](https://console.twilio.com)
2. Navigate to: **Conversations** → **Configuration** → **Webhooks**
3. Set webhook URL: `https://yourdomain.com/api/webhooks/twilio`
4. Enable these events:
   - `onMessageAdded`
   - `onMessageUpdated`
   - `onMessageRemoved`
5. **Save Configuration**

### 2. Verify Webhook

Test webhook with Twilio's test tool or send a test message and check server logs.

## User Flow

### Contact Seller Flow

1. **User clicks "Contact Seller" button**
   ```
   ContactSellerButton onClick:
   → Check Supabase auth
   → POST /api/chat/conversations { sellerId, gigId }
   → Server creates Twilio conversation
   → Server stores twilio_conversation_sid in DB
   → Redirect to /messages?conv={dbConversationId}
   ```

2. **Messages page loads**
   ```
   Messages Page:
   → Fetch conversation from DB (includes twilio_conversation_sid)
   → Render TwilioChatWindow with conversationSid
   → Hook fetches Twilio token (with Supabase session)
   → Twilio SDK initializes and loads messages
   → Real-time updates via Twilio SDK
   ```

3. **User sends message**
   ```
   Send Message:
   → Twilio SDK: conversation.sendMessage(text)
   → Twilio webhook fires: onMessageAdded
   → Webhook persists message to DB
   → Real-time update in UI via Twilio SDK
   ```

### Message Persistence Flow

```
User sends message
    ↓
Twilio Conversations API
    ↓
Twilio webhook → /api/webhooks/twilio
    ↓
Validate signature
    ↓
Find conversation by twilio_conversation_sid
    ↓
Insert message to DB with twilio_message_sid
    ↓
Update conversation.last_message
```

## API Reference

### POST /api/chat/token

**Headers:**
- `Authorization: Bearer {supabase_session_token}`

**Response:**
```json
{
  "token": "eyJhbGc...",
  "identity": "user-uuid-from-supabase"
}
```

### POST /api/chat/conversations

**Headers:**
- `Authorization: Bearer {supabase_session_token}`
- `Content-Type: application/json`

**Body:**
```json
{
  "sellerId": "uuid",
  "gigId": "uuid",
  "orderId": "optional-order-id"
}
```

**Response:**
```json
{
  "conversationSid": "CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "dbConversationId": "uuid",
  "uniqueName": "order_123 or pair_buyer_seller"
}
```

### POST /api/webhooks/twilio

**Headers:**
- `X-Twilio-Signature: {hmac-signature}`

**Form Data:**
- `EventType`: onMessageAdded | onMessageUpdated | onMessageRemoved
- `ConversationSid`: CHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
- `MessageSid`: IMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
- `Author`: user-uuid
- `Body`: message text
- `DateCreated`: ISO timestamp

**Response:**
```json
{
  "status": "ok"
}
```

## Conversation Uniqueness

### Order-Tied Conversations

When an order exists:
```
uniqueName = "order_{orderId}"
```

### General Buyer-Seller Conversations

For pre-order or general contact:
```
uniqueName = "pair_{buyerId}_{sellerId}"
```

This ensures:
- One conversation per order
- One general conversation per buyer-seller pair
- No duplicate conversations

## Security

### Token Generation

- ✅ Server-side only (uses API Key)
- ✅ Authenticated via Supabase session
- ✅ User ID from Supabase auth (trusted)
- ✅ 1-hour expiration
- ✅ Cannot be forged

### Webhook Validation

- ✅ Validates X-Twilio-Signature header
- ✅ Uses TWILIO_AUTH_TOKEN for HMAC verification
- ✅ Prevents unauthorized webhook calls

### Database Access

- ✅ Service role key used on server only
- ✅ User authentication required for all endpoints
- ✅ Conversation access controlled by buyer_id/seller_id

## Testing

### Local Development

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Test Contact Seller:
   - Navigate to any service page
   - Click "Contact Seller" (must be logged in)
   - Should redirect to messages page
   - Chat should load with Twilio SDK

4. Test messaging:
   - Send a message
   - Check database for new message record
   - Check Twilio Console → Conversations → Messages

### Webhook Testing

Use [ngrok](https://ngrok.com) for local webhook testing:

```bash
# Expose local server
ngrok http 3000

# Update Twilio webhook URL to:
https://{your-ngrok-url}/api/webhooks/twilio
```

## Troubleshooting

### "Missing authorization header"

The frontend is not sending the Supabase session token. Check:
- User is logged in
- `session.access_token` exists
- Authorization header is set correctly

### "Conversation not initialized"

The conversation doesn't have a `twilio_conversation_sid`. This means:
- It's a legacy conversation (pre-Twilio)
- Migration needed: Call `/api/chat/conversations` with the conversation's buyer/seller/gig IDs

### "Client initialization failed"

Twilio SDK couldn't connect. Check:
- Token is valid and not expired
- TWILIO_CONVERSATIONS_SERVICE_SID is correct
- Network connectivity

### Webhook not firing

Check:
- Webhook URL is correct in Twilio Console
- Server is accessible from internet
- Webhook events are enabled
- Check Twilio Console → Conversations → Webhooks → Logs

## Migration Guide

### For Existing Conversations

**Option 1: Lazy Migration**
- New conversations automatically get Twilio integration
- Old conversations use legacy ChatWindow until reopened
- When user reopens, call `/api/chat/conversations` to create Twilio conversation

**Option 2: Bulk Migration**
```javascript
// Migration script (run once)
const { data: conversations } = await supabase
  .from('conversations')
  .select('*')
  .is('twilio_conversation_sid', null)

for (const conv of conversations) {
  await fetch('/api/chat/conversations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sellerId: conv.seller_id,
      gigId: conv.gig_id
    })
  })
}
```

## Future Enhancements

Possible additions:
- [ ] Message read receipts
- [ ] Typing indicators
- [ ] File/image attachments via Twilio Media
- [ ] Message reactions
- [ ] Conversation archiving
- [ ] Search across messages
- [ ] Push notifications

## Support

For issues or questions:
1. Check Twilio Console logs
2. Check server logs for errors
3. Verify database schema
4. Test webhook with Twilio's test tools
5. Check this documentation

## Conclusion

This integration provides a production-ready Twilio Conversations system with:
- ✅ Secure authentication
- ✅ Database persistence
- ✅ Real-time updates
- ✅ Webhook integration
- ✅ Backward compatibility

All requirements from the issue have been implemented and tested.
