# Twilio Chat Integration - Setup Guide

This guide explains how to set up Twilio Chat for real-time messaging in Humanaira.

## Overview

Humanaira uses Twilio Conversations API for real-time chat with the following features:
- Real-time messaging with typing indicators
- File attachments support
- Seamless fallback to Supabase when Twilio is not configured
- Premium UI with gradient designs and animations

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com)
2. Twilio Console access

## Setup Steps

### 1. Create a Twilio Account

If you don't have one already:
1. Go to https://www.twilio.com/try-twilio
2. Sign up for a free account
3. Verify your email and phone number

### 2. Get Your Twilio Credentials

From the Twilio Console (https://console.twilio.com):

1. **Account SID**: Find this on your Console Dashboard
2. **API Key and Secret**:
   - Navigate to Settings > API Keys
   - Click "Create API Key"
   - Choose "Standard" type
   - Name it (e.g., "Humanaira Chat")
   - Save both the SID (API Key) and Secret securely
   
3. **Chat Service SID**:
   - Go to Conversations > Services in the Twilio Console
   - Create a new Conversations Service or use the default
   - Copy the Service SID

### 3. Update Environment Variables

Add the following to your `.env.local` file:

```bash
# Twilio Chat Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your_api_secret_here
TWILIO_CHAT_SERVICE_SID=ISxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_TWILIO_CHAT_ENABLED=true
```

### 4. Database Schema Update

Add the following column to your `conversations` table in Supabase:

```sql
-- Add Twilio conversation SID column
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS twilio_conversation_sid TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversations_twilio_sid 
ON conversations(twilio_conversation_sid);
```

### 5. Restart Your Application

```bash
npm run dev
```

## Features

### With Twilio Enabled

- ✅ Real-time message delivery
- ✅ Typing indicators
- ✅ Read receipts
- ✅ Message history sync
- ✅ Participant management
- ✅ Token-based authentication
- ✅ WebSocket connections

### Fallback Mode (Supabase Only)

When Twilio credentials are not configured, the app automatically falls back to:
- ✅ Supabase Realtime for message sync
- ✅ Polling-based updates
- ✅ All core messaging features
- ⚠️ No typing indicators
- ⚠️ No automatic presence detection

## Testing

### Test Chat Functionality

1. Sign in as a buyer
2. Navigate to a service page
3. Click "Contact Seller"
4. Send a test message
5. Check that:
   - Messages appear in real-time
   - Typing indicator works (Twilio mode)
   - File attachments work
   - Payment requests work

### Test Fallback Mode

1. Comment out Twilio credentials in `.env.local`
2. Restart the app
3. Verify that chat still works via Supabase
4. Look for "Twilio Live" badge - it should not appear in fallback mode

## Troubleshooting

### "Token generation failed"

- Check that all environment variables are set correctly
- Verify your API Key and Secret are valid
- Ensure TWILIO_ACCOUNT_SID matches your account

### "Conversation not found"

- Verify the Chat Service SID is correct
- Check that the service is active in Twilio Console
- Ensure the user has proper permissions

### "WebSocket connection failed"

- Check your firewall settings
- Verify websocket connections are allowed
- Try installing optional dependencies:
  ```bash
  npm install bufferutil utf-8-validate --save-optional
  ```

### Messages not appearing

- Check browser console for errors
- Verify Supabase Realtime is enabled
- Check that the `conversations` table exists
- Verify Row Level Security (RLS) policies allow access

## Cost Considerations

### Twilio Pricing

- **Free Trial**: $15 credit (suitable for development)
- **Conversations API**: 
  - First 100,000 monthly active users: Free
  - Additional users: $0.05 per user/month
  - Messages: First 25,000 free, then $0.02 per 1,000 messages

### Recommended for Production

- Enable Twilio for better user experience
- Monitor usage in Twilio Console
- Set up billing alerts
- Consider upgrading to paid plan for production

## Security Best Practices

1. **Never commit credentials**: Keep `.env.local` in `.gitignore`
2. **Rotate keys regularly**: Create new API keys every 90 days
3. **Use separate keys**: Different keys for dev/staging/production
4. **Monitor usage**: Set up alerts in Twilio Console
5. **Restrict IP ranges**: Configure IP whitelists if possible

## Additional Resources

- [Twilio Conversations API Docs](https://www.twilio.com/docs/conversations)
- [Twilio Client SDK](https://www.twilio.com/docs/conversations/javascript)
- [Best Practices](https://www.twilio.com/docs/conversations/best-practices)

## Support

For issues related to:
- **Twilio setup**: Contact Twilio Support
- **Humanaira chat**: Open a GitHub issue
- **Database**: Check Supabase documentation
