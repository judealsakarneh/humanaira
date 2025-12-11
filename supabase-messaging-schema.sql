-- ============================================================================
-- Humanaira Messaging System - Database Schema & RLS Policies
-- ============================================================================
-- This file contains the complete schema for conversations, messages,
-- and their security policies (Row Level Security)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: conversations
-- ----------------------------------------------------------------------------
-- Stores conversations between buyers and sellers
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  gig_id uuid,
  status text DEFAULT 'open',
  last_message text,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON public.conversations (buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_seller_id ON public.conversations (seller_id);
CREATE INDEX IF NOT EXISTS idx_conversations_gig_id ON public.conversations (gig_id);

-- ----------------------------------------------------------------------------
-- TABLE: conversation_participants
-- ----------------------------------------------------------------------------
-- Junction table for many-to-many relationship (if needed for group chats)
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON public.conversation_participants (user_id);

-- ----------------------------------------------------------------------------
-- TABLE: messages
-- ----------------------------------------------------------------------------
-- Note: This table should already exist. If not, here's the schema:
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  text text,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_system boolean DEFAULT false,
  blocked boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Index for faster message retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- CONVERSATIONS POLICIES
-- ----------------------------------------------------------------------------

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS conversations_select_participant ON public.conversations;
DROP POLICY IF EXISTS conversations_insert_participant ON public.conversations;
DROP POLICY IF EXISTS conversations_update_participant ON public.conversations;

-- SELECT: Allow users to see conversations where they are buyer or seller
CREATE POLICY conversations_select_participant ON public.conversations
  FOR SELECT
  USING (
    auth.uid() = buyer_id 
    OR auth.uid() = seller_id
  );

-- INSERT: Allow authenticated users to create conversations where they are buyer or seller
CREATE POLICY conversations_insert_participant ON public.conversations
  FOR INSERT
  WITH CHECK (
    auth.uid() = buyer_id 
    OR auth.uid() = seller_id
  );

-- UPDATE: Allow participants to update conversation metadata
CREATE POLICY conversations_update_participant ON public.conversations
  FOR UPDATE
  USING (
    auth.uid() = buyer_id 
    OR auth.uid() = seller_id
  )
  WITH CHECK (
    auth.uid() = buyer_id 
    OR auth.uid() = seller_id
  );

-- ----------------------------------------------------------------------------
-- CONVERSATION_PARTICIPANTS POLICIES
-- ----------------------------------------------------------------------------

DROP POLICY IF EXISTS participants_select_own ON public.conversation_participants;
DROP POLICY IF EXISTS participants_insert_own ON public.conversation_participants;

-- SELECT: Users can see participants of conversations they're part of
CREATE POLICY participants_select_own ON public.conversation_participants
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
        AND cp.user_id = auth.uid()
    )
  );

-- INSERT: Allow adding participants to conversations (typically done server-side)
CREATE POLICY participants_insert_own ON public.conversation_participants
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- MESSAGES POLICIES (Consolidated from redundant policies)
-- ----------------------------------------------------------------------------

-- Drop any existing duplicate policies
DROP POLICY IF EXISTS messages_select_participant ON public.messages;
DROP POLICY IF EXISTS messages_insert_participant ON public.messages;
DROP POLICY IF EXISTS messages_select_conversation ON public.messages;
DROP POLICY IF EXISTS messages_insert_conversation ON public.messages;

-- SELECT: Allow authenticated users to read messages if they are a participant in the conversation
-- (either buyer or seller)
CREATE POLICY messages_select_participant ON public.messages
  FOR SELECT
  USING (
    auth.uid() = sender_id
    OR EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = public.messages.conversation_id
        AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
    )
  );

-- INSERT: Allow authenticated users to insert messages only if:
-- 1. They are the sender (auth.uid() = sender_id)
-- 2. They are a participant in the conversation (buyer or seller)
CREATE POLICY messages_insert_participant ON public.messages
  FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = public.messages.conversation_id
        AND (auth.uid() = c.buyer_id OR auth.uid() = c.seller_id)
    )
  );

-- ----------------------------------------------------------------------------
-- REALTIME PUBLICATION
-- ----------------------------------------------------------------------------
-- Enable realtime for messages table (if not already enabled)
-- This allows the Supabase client to subscribe to INSERT/UPDATE/DELETE events

-- Check if realtime is enabled for the tables
-- You may need to enable this in Supabase Dashboard > Database > Replication
-- or run: ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- ----------------------------------------------------------------------------
-- HELPER FUNCTIONS (Optional)
-- ----------------------------------------------------------------------------

-- Function to update conversation's updated_at timestamp when a message is inserted
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update conversation timestamp
DROP TRIGGER IF EXISTS messages_update_conversation_timestamp ON public.messages;
CREATE TRIGGER messages_update_conversation_timestamp
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_timestamp();

-- ----------------------------------------------------------------------------
-- NOTES
-- ----------------------------------------------------------------------------
-- 1. Make sure to enable realtime for 'messages' and 'conversations' tables
--    in Supabase Dashboard > Database > Replication
-- 2. Verify that auth.uid() returns the correct user ID in your setup
-- 3. Test policies thoroughly with different user roles
-- 4. Consider adding policies for DELETE operations if needed
-- 5. Monitor performance and add indexes as needed based on query patterns
-- ============================================================================
