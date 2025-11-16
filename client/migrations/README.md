# Database Migration for Twilio Conversations

This migration adds the required database columns for Twilio Conversations integration.

## Required Columns

The integration requires these columns to be added to your existing database tables:

### `conversations` table
- `twilio_conversation_sid` (TEXT, UNIQUE) - Stores the Twilio Conversation SID for mapping
- `last_message` (TEXT, NULLABLE) - Caches the last message for quick conversation list display

### `messages` table
- `twilio_message_sid` (TEXT, UNIQUE) - Stores the Twilio Message SID for tracking
- `deleted_at` (TIMESTAMP, NULLABLE) - Soft delete timestamp for message removal

## How to Apply the Migration

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **+ New Query**
4. Copy and paste the contents of `add_twilio_conversation_columns.sql`
5. Click **Run** to execute the migration
6. Verify the columns were created in the **Table Editor**

### Option 2: Supabase CLI

```bash
# Navigate to your project directory
cd /path/to/your/project

# Run the migration
supabase db push migrations/add_twilio_conversation_columns.sql
```

### Option 3: Direct SQL Connection

If you have direct access to your PostgreSQL database:

```bash
psql <your-database-url> < migrations/add_twilio_conversation_columns.sql
```

## Verification

After running the migration, verify the columns exist:

```sql
-- Check conversations table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'conversations' 
  AND column_name IN ('twilio_conversation_sid', 'last_message');

-- Check messages table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'messages' 
  AND column_name IN ('twilio_message_sid', 'deleted_at');
```

You should see 4 rows total (2 for each table).

## After Migration

Once the migration is complete:

1. Redeploy your application on Vercel
2. Test the Contact Seller flow
3. The debug panel should now show:
   ```
   [Services] API response: 200
   [Services] Success
   {
     "dbConversationId": "<uuid>",
     "conversationSid": "CH..."
   }
   ```
4. You should be redirected to the messages page with the conversation loaded

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Remove columns from conversations table
ALTER TABLE conversations DROP COLUMN IF EXISTS twilio_conversation_sid;
ALTER TABLE conversations DROP COLUMN IF EXISTS last_message;

-- Remove columns from messages table
ALTER TABLE messages DROP COLUMN IF EXISTS twilio_message_sid;
ALTER TABLE messages DROP COLUMN IF EXISTS deleted_at;

-- Remove indexes
DROP INDEX IF EXISTS idx_conversations_twilio_sid;
DROP INDEX IF EXISTS idx_messages_twilio_sid;
```

## Troubleshooting

**Error: relation "conversations" does not exist**
- The conversations table doesn't exist in your database
- Check if you're connected to the correct database
- Ensure your existing messaging system has this table

**Error: column "twilio_conversation_sid" already exists**
- The migration has already been applied
- This is safe to ignore - the script uses `ADD COLUMN IF NOT EXISTS`

**Error: permission denied**
- Your database user doesn't have ALTER TABLE permissions
- Use a superuser account or contact your database administrator
