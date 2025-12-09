-- ============================================
-- Supabase Real-time Chat Fix
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- No project-specific values need to be replaced

-- Step 1: Enable realtime on the messages table
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Step 2: Enable realtime on the payment_requests table
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE payment_requests;

-- Step 3: Verify and fix RLS policies for messages table
-- ============================================

-- Drop existing policies if they exist (to recreate them correctly)
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages in conversations they're part of
CREATE POLICY "Users can view messages in their conversations" ON messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (
      conversations.seller_id = auth.uid()
      OR conversations.buyer_id = auth.uid()
    )
  )
);

-- Policy: Users can insert messages in conversations they're part of
CREATE POLICY "Users can insert messages in their conversations" ON messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (
      conversations.seller_id = auth.uid()
      OR conversations.buyer_id = auth.uid()
    )
  )
  AND sender_id = auth.uid()
);

-- Step 4: Verify and fix RLS policies for payment_requests table
-- ============================================

DROP POLICY IF EXISTS "Users can view payment requests in their conversations" ON payment_requests;
DROP POLICY IF EXISTS "Users can insert payment requests" ON payment_requests;
DROP POLICY IF EXISTS "Users can update their payment requests" ON payment_requests;

-- Enable RLS on payment_requests table
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view payment requests in their conversations
CREATE POLICY "Users can view payment requests in their conversations" ON payment_requests
FOR SELECT
USING (
  from_id = auth.uid() OR to_id = auth.uid()
);

-- Policy: Users can insert payment requests
CREATE POLICY "Users can insert payment requests" ON payment_requests
FOR INSERT
WITH CHECK (
  from_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = payment_requests.conversation_id
    AND (
      conversations.seller_id = auth.uid()
      OR conversations.buyer_id = auth.uid()
    )
  )
);

-- Policy: Users can update payment requests they're involved in
CREATE POLICY "Users can update their payment requests" ON payment_requests
FOR UPDATE
USING (
  from_id = auth.uid() OR to_id = auth.uid()
)
WITH CHECK (
  from_id = auth.uid() OR to_id = auth.uid()
);

-- Step 5: Verify conversations table RLS
-- ============================================

DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;

-- Enable RLS on conversations table
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view conversations they're part of
CREATE POLICY "Users can view their conversations" ON conversations
FOR SELECT
USING (
  seller_id = auth.uid() OR buyer_id = auth.uid()
);

-- Policy: Users can create conversations
CREATE POLICY "Users can create conversations" ON conversations
FOR INSERT
WITH CHECK (
  seller_id = auth.uid() OR buyer_id = auth.uid()
);

-- Step 6: Verify table structure (optional - for debugging)
-- ============================================

-- Check if messages table has the correct structure
-- Expected columns: id, conversation_id, sender_id, text, attachments, is_system, blocked, created_at

-- Check if payment_requests table has the correct structure  
-- Expected columns: id, conversation_id, from_id, to_id, amount_cents, currency, status, created_at, updated_at

-- Step 7: Test real-time by checking publication
-- ============================================

-- Verify messages table is in the publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' 
AND tablename IN ('messages', 'payment_requests', 'conversations');

-- Expected output:
-- Should show messages, payment_requests in the results

-- ============================================
-- Verification Steps (run in browser console):
-- ============================================
-- 1. Open browser DevTools Console on /messages page
-- 2. Send a message
-- 3. Look for these console logs:
--    - "[DEBUG] Subscription status: SUBSCRIBED"
--    - "[DEBUG] Successfully subscribed to messages channel"
--    - "[DEBUG] Sent Supabase message: ..."
--    - "[DEBUG] Real-time payload received: ..."
--    - "[DEBUG] Adding new message to state: ..."
-- 4. If you see "CHANNEL_ERROR" or "TIMED_OUT", check:
--    - RLS policies are correctly set up (run this script again)
--    - Messages table is in supabase_realtime publication
--    - User is authenticated (check auth.uid() in console)

-- ============================================
-- Common Issues & Solutions:
-- ============================================
-- Issue 1: "CHANNEL_ERROR" in console
-- Solution: Run Step 1-2 above to enable realtime on tables

-- Issue 2: Can see messages in dashboard but not in real-time
-- Solution: Check RLS policies (Step 3-5 above)

-- Issue 3: Messages appear after page refresh but not real-time
-- Solution: Verify the publication includes the table (Step 7)

-- Issue 4: Subscription shows "TIMED_OUT"
-- Solution: Check network/firewall, verify Supabase project is not paused
