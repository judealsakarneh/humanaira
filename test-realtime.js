/**
 * SUPABASE REALTIME TEST SCRIPT
 * 
 * This script tests if realtime subscriptions are working properly.
 * Run this in your browser console while on the messages page.
 */

(async function testSupabaseRealtime() {
  console.log('🧪 Starting Supabase Realtime Test...\n');

  // Import the Supabase client
  const { createClient } = await import('@supabase/supabase-js');
  
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });

  // Test 1: Check authentication
  console.log('1️⃣ Checking authentication...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    console.error('❌ Authentication failed:', authError);
    return;
  }
  console.log('✅ Authenticated as:', user.email);

  // Test 2: Fetch a conversation
  console.log('\n2️⃣ Fetching conversations...');
  const { data: conversations, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .limit(1);

  if (convError || !conversations?.length) {
    console.error('❌ No conversations found:', convError);
    return;
  }

  const testConversation = conversations[0];
  console.log('✅ Using conversation:', testConversation.id);

  // Test 3: Subscribe to messages
  console.log('\n3️⃣ Setting up realtime subscription...');
  
  const channel = supabase
    .channel(`test-messages-${testConversation.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${testConversation.id}`,
      },
      (payload) => {
        console.log('🎉 REALTIME MESSAGE RECEIVED:', payload.new);
      }
    )
    .subscribe((status, error) => {
      if (error) {
        console.error('❌ Subscription error:', error);
      } else {
        console.log('📡 Subscription status:', status);
      }
    });

  // Wait for subscription to be ready
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 4: Insert a test message
  console.log('\n4️⃣ Inserting test message...');
  const { data: newMessage, error: insertError } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: testConversation.id,
        sender_id: user.id,
        text: `🧪 Test message at ${new Date().toISOString()}`,
        attachments: [],
        is_system: false,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error('❌ Insert failed:', insertError);
  } else {
    console.log('✅ Message inserted:', newMessage);
  }

  // Test 5: Wait for realtime event
  console.log('\n5️⃣ Waiting 5 seconds for realtime event...');
  console.log('⏳ Check console for "🎉 REALTIME MESSAGE RECEIVED" message');
  
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Cleanup
  console.log('\n6️⃣ Cleaning up...');
  await supabase.removeChannel(channel);
  console.log('✅ Test complete!');

  console.log('\n📊 RESULTS:');
  console.log('If you saw "🎉 REALTIME MESSAGE RECEIVED" above, realtime is working!');
  console.log('If not, check:');
  console.log('  - Supabase dashboard > Database > Replication');
  console.log('  - Run the SQL fix script: supabase-realtime-fix.sql');
  console.log('  - Check browser console for errors');
})();
