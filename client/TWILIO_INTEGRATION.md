# Twilio Conversations Integration

This document describes the Twilio Conversations integration for the Humanaira marketplace messaging system.

## Overview

The Humanaira marketplace now uses **Twilio Conversations** as its real-time messaging system for communication between buyers and sellers. This replaces the previous database-based messaging system.

## Architecture

### Components

1. **Backend Token Endpoint** (`/api/chat/token`)
   - Generates Twilio Access Tokens for client authentication
   - Uses server-side API credentials for secure token generation
   - Returns JWT tokens with 1-hour expiration

2. **Server Utility** (`lib/twilio/conversations.ts`)
   - Provides `getOrCreateConversation()` function
   - Creates named conversations based on order IDs
   - Manages participant identities (buyer/seller)

3. **React Hook** (`hooks/useTwilioConversation.ts`)
   - Client-side hook for managing Twilio Conversations
   - Handles connection, message loading, and real-time updates
   - Provides `sendMessage()` function and state management

4. **UI Component** (`components/HumanairaChat.tsx`)
   - Full-featured chat interface with Humanaira branding
   - Dark theme with #35BFFF accent color
   - Mobile-responsive design
   - Real-time message updates

## Environment Variables

Add these to your `.env.local` file:

```bash
# Twilio Credentials
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_API_KEY_SID=your_api_key_sid
TWILIO_API_KEY_SECRET=your_api_key_secret
TWILIO_CONVERSATIONS_SERVICE_SID=your_service_sid
```

**Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Usage

### Basic Implementation

```tsx
import HumanairaChat from '@/components/HumanairaChat'

function OrderPage({ orderId, conversationSid }) {
  return (
    <div>
      <h1>Order #{orderId}</h1>
      <HumanairaChat conversationSid={conversationSid} />
    </div>
  )
}
```

### Creating Conversations

Use the server-side utility to create conversations:

```typescript
import { getOrCreateConversation } from '@/lib/twilio/conversations'

// In an API route or server component
const conversation = await getOrCreateConversation(
  orderId,      // Your marketplace order ID
  buyerId,      // Buyer's user ID
  sellerId      // Seller's user ID
)

// Use conversation.conversationSid in your UI
```

### Using the Hook Directly

```tsx
import { useTwilioConversation } from '@/hooks/useTwilioConversation'

function CustomChat({ conversationSid }) {
  const { messages, sendMessage, loading, error, identity } = useTwilioConversation({
    conversationSid
  })
  
  // Build your custom UI
}
```

## Features

✅ Real-time messaging with Twilio Conversations  
✅ Secure token-based authentication  
✅ Auto-scrolling message list  
✅ Mobile-responsive design  
✅ Humanaira brand styling (#35BFFF accent)  
✅ User identity display  
✅ Loading and error states  
✅ Clean, modern UI  

## Integration with Supabase Auth

**TODO**: Currently using temporary random identities. To integrate with Supabase:

1. Update `/api/chat/token/route.ts`:
```typescript
// Get authenticated user
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

// Use real user ID as identity
const identity = user.id
```

2. Update `lib/twilio/conversations.ts`:
```typescript
// Use real user IDs instead of prefixed identities
const buyerIdentity = buyerId    // Just use the actual user ID
const sellerIdentity = sellerId  // Just use the actual user ID
```

## Migration from Old System

The old messaging endpoints (`/api/messages`) have been deprecated and now return HTTP 410 (Gone) status. To migrate:

1. Create Twilio conversations for existing orders
2. Update UI to use `HumanairaChat` component
3. Remove old message database queries
4. (Optional) Archive old messages to a legacy table

## Testing

A demo is available on the homepage at `http://localhost:3000`:

1. Scroll to "Twilio Conversations Demo" section
2. Create a test conversation in Twilio Console
3. Add the conversation SID to the component
4. Test sending and receiving messages

## API Reference

### GET `/api/chat/token`

Returns a Twilio access token for the current user.

**Response:**
```json
{
  "token": "eyJhbGc...",
  "identity": "user_abc123"
}
```

### `getOrCreateConversation(orderId, buyerId, sellerId)`

Creates or retrieves a conversation for an order.

**Parameters:**
- `orderId` (string): Marketplace order ID
- `buyerId` (string): Buyer's user ID
- `sellerId` (string): Seller's user ID

**Returns:**
```typescript
{
  conversationSid: string
  uniqueName: string
  buyerIdentity: string
  sellerIdentity: string
}
```

## Troubleshooting

### "Twilio configuration is incomplete"

Check that all environment variables are set in `.env.local`.

### "Client initialization failed"

1. Verify Twilio credentials are correct
2. Check that the Conversations Service SID exists
3. Ensure API key has proper permissions

### Messages not appearing

1. Check browser console for errors
2. Verify conversation SID is valid
3. Ensure participants are added to the conversation

## Resources

- [Twilio Conversations Docs](https://www.twilio.com/docs/conversations)
- [Twilio Conversations JS SDK](https://www.twilio.com/docs/conversations/javascript)
- [Humanaira Design System](https://github.com/judealsakarneh/humanaira)

## Support

For issues related to this integration, contact the development team or open an issue in the repository.
