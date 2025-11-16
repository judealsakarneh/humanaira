-- Migration: Add Twilio Conversations support columns
-- Description: Adds required columns for Twilio Conversations integration
-- Date: 2025-11-16

-- Add twilio_conversation_sid column to conversations table
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS twilio_conversation_sid TEXT UNIQUE;

-- Add last_message column to conversations table for caching
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS last_message TEXT;

-- Add twilio_message_sid column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS twilio_message_sid TEXT UNIQUE;

-- Add deleted_at column to messages table for soft deletes
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversations_twilio_sid 
ON conversations(twilio_conversation_sid);

CREATE INDEX IF NOT EXISTS idx_messages_twilio_sid 
ON messages(twilio_message_sid);

-- Add comment for documentation
COMMENT ON COLUMN conversations.twilio_conversation_sid IS 'Twilio Conversations SID for real-time messaging integration';
COMMENT ON COLUMN messages.twilio_message_sid IS 'Twilio Message SID for tracking messages in Twilio Conversations';
