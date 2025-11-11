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

    // Fetch conversations where user is buyer OR seller
    // Using service role bypasses RLS
    const { data: conversations, error: fetchError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('updated_at', { ascending: false })

    if (fetchError) {
      console.error('[API /conversations/list] Error fetching conversations:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch conversations', details: fetchError.message },
        { status: 500 }
      )
    }

    console.log(`[API /conversations/list] SUCCESS - Found ${conversations?.length || 0} conversations`)

    return NextResponse.json({ conversations: conversations || [] })
  } catch (error: any) {
    console.error('[API /conversations/list] Exception:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
