import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * GET /api/conversations/list?userId={userId}
 * 
 * Fetches all conversations for the specified user (as buyer OR seller)
 * Uses service role key to bypass RLS restrictions
 */
export async function GET(request: Request) {
  try {
    // Get userId from query parameter
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      console.error('[API /conversations/list] Missing userId parameter')
      return NextResponse.json({ error: 'userId parameter required' }, { status: 400 })
    }

    console.log(`[API /conversations/list] Fetching conversations for user: ${userId}`)

    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    )

    // First, try a simple query to ensure basic functionality works
    console.log('[API /conversations/list] Step 1: Fetching basic conversations')
    const { data: basicConversations, error: basicError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false })

    if (basicError) {
      console.error('[API /conversations/list] Basic query error:', basicError)
      return NextResponse.json(
        { error: 'Failed to fetch conversations', details: basicError.message },
        { status: 500 }
      )
    }

    console.log(`[API /conversations/list] Basic query found ${basicConversations?.length || 0} conversations`)

    // If we have no conversations, return empty array early
    if (!basicConversations || basicConversations.length === 0) {
      console.log('[API /conversations/list] No conversations found for user')
      return NextResponse.json({ conversations: [] })
    }

    // Now try to enrich with joins - if this fails, we'll still return basic data
    console.log('[API /conversations/list] Step 2: Enriching with profile data')
    const { data: enrichedConversations, error: enrichError } = await supabaseAdmin
      .from('conversations')
      .select(`
        *,
        buyer:profiles!buyer_id(id, username, avatar_url, full_name),
        seller:profiles!seller_id(id, username, avatar_url, full_name),
        gig:gigs!gig_id(id, title, slug)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false })

    // Use enriched data if available, otherwise fall back to basic
    const conversationsToProcess = enrichError ? basicConversations : (enrichedConversations || basicConversations)
    
    if (enrichError) {
      console.warn('[API /conversations/list] Profile join failed, using basic data:', enrichError.message)
    }

    // For each conversation, fetch the latest message and message count
    console.log('[API /conversations/list] Step 3: Fetching messages for each conversation')
    const conversationsWithMessages = await Promise.all(
      conversationsToProcess.map(async (conv) => {
        // Get message count
        const { count: messageCount } = await supabaseAdmin
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)

        // Get latest message
        const { data: latestMessage } = await supabaseAdmin
          .from('messages')
          .select('id, text, created_at, sender_id')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        return {
          ...conv,
          messages: messageCount !== null ? [{ count: messageCount }] : [{ count: 0 }],
          latest_message: latestMessage,
        }
      })
    )

    console.log(`[API /conversations/list] SUCCESS - Returning ${conversationsWithMessages.length} conversations`)

    return NextResponse.json({ conversations: conversationsWithMessages })
  } catch (error: any) {
    console.error('[API /conversations/list] Exception:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
