-- Migration: Add Twilio Conversation SID to conversations table
-- Date: 2025-11-19
-- Description: Adds support for Twilio Conversations API integration

-- Add column for storing Twilio conversation SID
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS twilio_conversation_sid TEXT;

-- Add index for faster lookups when joining Twilio conversations
CREATE INDEX IF NOT EXISTS idx_conversations_twilio_sid 
ON conversations(twilio_conversation_sid);

-- Add comment for documentation
COMMENT ON COLUMN conversations.twilio_conversation_sid IS 
'Stores the Twilio Conversations SID for real-time chat integration. Null indicates fallback to Supabase-only mode.';

-- Optional: Add check to ensure SID format is correct (starts with CH for Twilio Conversation)
-- Uncomment if you want strict validation
-- ALTER TABLE conversations 
-- ADD CONSTRAINT check_twilio_sid_format 
-- CHECK (twilio_conversation_sid IS NULL OR twilio_conversation_sid LIKE 'CH%');
