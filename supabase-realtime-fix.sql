-- ============================================================
-- SUPABASE REALTIME FIX FOR MESSAGES TABLE
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Enable Realtime on the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 2. Set replica identity to FULL (required for realtime to work properly)
ALTER TABLE messages REPLICA IDENTITY FULL;

-- 3. Enable Realtime on payment_requests table
ALTER PUBLICATION supabase_realtime ADD TABLE payment_requests;
ALTER TABLE payment_requests REPLICA IDENTITY FULL;

-- 4. Verify RLS is enabled
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for messages table (if not exists)
-- Allow users to see messages in conversations they are part of
DROP POLICY IF EXISTS "Users can read messages in their conversations" ON messages;
CREATE POLICY "Users can read messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
);

-- Allow users to insert messages in conversations they are part of
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;
CREATE POLICY "Users can insert messages in their conversations"
ON messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
  AND sender_id = auth.uid()
);

-- 6. Create RLS policies for payment_requests table (if not exists)
DROP POLICY IF EXISTS "Users can read payment requests in their conversations" ON payment_requests;
CREATE POLICY "Users can read payment requests in their conversations"
ON payment_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = payment_requests.conversation_id
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can create payment requests in their conversations" ON payment_requests;
CREATE POLICY "Users can create payment requests in their conversations"
ON payment_requests FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = payment_requests.conversation_id
    AND (conversations.buyer_id = auth.uid() OR conversations.seller_id = auth.uid())
  )
  AND from_id = auth.uid()
);

DROP POLICY IF EXISTS "Users can update their payment requests" ON payment_requests;
CREATE POLICY "Users can update their payment requests"
ON payment_requests FOR UPDATE
USING (
  to_id = auth.uid() OR from_id = auth.uid()
);

-- 7. Grant necessary permissions (if needed)
GRANT SELECT, INSERT ON messages TO authenticated;
GRANT SELECT, INSERT, UPDATE ON payment_requests TO authenticated;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_requests_conversation_id ON payment_requests(conversation_id);

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check if realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN ('messages', 'payment_requests');

-- Check replica identity
SELECT schemaname, tablename, relreplident
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE relname IN ('messages', 'payment_requests')
AND nspname = 'public';
-- Result should show 'f' for FULL

-- Check RLS policies
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('messages', 'payment_requests')
ORDER BY tablename, policyname;
