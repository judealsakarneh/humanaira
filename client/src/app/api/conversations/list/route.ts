import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * GET /api/conversations/list
 * 
 * Fetches all conversations for the authenticated user (as buyer OR seller)
 * Uses service role key to bypass RLS restrictions
 */
export async function GET(request: Request) {
  try {
    // Get user from session cookie
    const cookieStore = cookies()
    const authCookie = cookieStore.get('sb-access-token') || cookieStore.get('supabase-auth-token')
    
    if (!authCookie) {
      console.error('[API /conversations/list] No auth cookie found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Get the user from the auth cookie
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(authCookie.value)
    
    if (authError || !user) {
      console.error('[API /conversations/list] Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log(`[API /conversations/list] Fetching conversations for user: ${user.id}`)

    // Fetch conversations where user is buyer OR seller
    // Using service role bypasses RLS
    const { data: conversations, error: fetchError } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
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
