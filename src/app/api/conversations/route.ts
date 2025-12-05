import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { StreamChat } from 'stream-chat'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    console.log('API /api/conversations POST body:', body)

    let { buyer_id, seller_id, gig_id } = body

    if (!buyer_id || !seller_id) {
      return NextResponse.json({ error: 'buyer_id and seller_id required' }, { status: 400 })
    }

    if (buyer_id === seller_id) {
      return NextResponse.json({ error: 'Cannot chat with yourself' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      console.error('Supabase configuration missing.')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } })

    // 🧠 Convert SLUG to UUID if needed
    if (gig_id && typeof gig_id === 'string' && gig_id.length < 36) {
      const { data: gigLookup, error: slugErr } = await supabase
        .from('gigs')
        .select('id')
        .eq('slug', gig_id)
        .maybeSingle()

      if (slugErr) console.warn('Slug lookup error:', slugErr)

      if (gigLookup?.id) {
        console.log(`Mapped slug "${gig_id}" → gig UUID "${gigLookup.id}"`)
        gig_id = gigLookup.id
      }
    }

    // 🕵️‍♂️ Look for existing conversation
    let check = supabase
      .from('conversations')
      .select('id')
      .eq('seller_id', seller_id)
      .eq('buyer_id', buyer_id)

    check = gig_id == null ? check.is('gig_id', null) : check.eq('gig_id', gig_id)

    const { data: existing, error: findErr } = await check.limit(1).maybeSingle()

    if (findErr) {
      console.error('Supabase query error:', findErr)
      return NextResponse.json({ error: findErr.message }, { status: 500 })
    }

    if (existing) {
      console.log('Existing conversation:', existing.id)
      // Ensure Stream channel exists for existing conversation
      await ensureStreamChannel(existing.id, buyer_id, seller_id)
      return NextResponse.json({ id: existing.id }, { status: 200 })
    }

    // 🆕 Create conversation if none exists
    const newRow = {
      seller_id,
      buyer_id,
      gig_id: gig_id ?? null,
      status: 'open'
    }

    const { data: created, error: insertErr } = await supabase
      .from('conversations')
      .insert([newRow])
      .select('id')
      .single()

    if (insertErr) {
      console.error('Insert error:', insertErr)

      // 🪄 Try finding again in case of race condition
      const { data: after } = await supabase
        .from('conversations')
        .select('id')
        .eq('seller_id', seller_id)
        .eq('buyer_id', buyer_id)
        .limit(1)
        .maybeSingle()

      if (after) {
        return NextResponse.json({ id: after.id }, { status: 200 })
      }

      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    console.log('Created new conversation:', created.id)
    
    // Create Stream channel server-side with admin privileges
    await ensureStreamChannel(created.id, buyer_id, seller_id)
    
    return NextResponse.json({ id: created.id }, { status: 200 })

  } catch (err: any) {
    console.error('/api/conversations POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function ensureStreamChannel(conversationId: string, buyerId: string, sellerId: string) {
  try {
    const streamKey = process.env.NEXT_PUBLIC_STREAM_KEY
    const streamSecret = process.env.STREAM_SECRET

    if (!streamKey || !streamSecret) {
      console.error('Stream configuration missing')
      return
    }

    const serverClient = StreamChat.getInstance(streamKey, streamSecret)
    
    // Get user details from Supabase for both buyer and seller
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabase = createClient(url!, key!, { auth: { persistSession: false } })
    
    // Fetch both users - try profiles table first, fallback to auth.users
    let users: any[] = []
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, role')
        .in('id', [buyerId, sellerId])
      
      if (error) {
        console.warn('Profiles query failed, using default user data:', error.message)
        // Create minimal user objects if profiles don't exist
        users = [
          { id: buyerId, full_name: 'Buyer', avatar_url: null, role: 'user' },
          { id: sellerId, full_name: 'Seller', avatar_url: null, role: 'user' }
        ]
      } else {
        users = data || []
        console.log(`Fetched ${users.length} user profiles from Supabase`)
      }
    } catch (err) {
      console.error('Failed to fetch profiles:', err)
      // Use minimal user data as fallback
      users = [
        { id: buyerId, full_name: 'Buyer', avatar_url: null, role: 'user' },
        { id: sellerId, full_name: 'Seller', avatar_url: null, role: 'user' }
      ]
    }
    
    // Upsert both users in Stream Chat to ensure they exist
    for (const user of users || []) {
      try {
        await serverClient.upsertUser({
          id: user.id,
          name: user.full_name || 'User',
          image: user.avatar_url || undefined,
          // Don't pass role - Stream has its own role system
        })
        console.log(`Upserted Stream user: ${user.id}`)
      } catch (err) {
        console.error(`Failed to upsert user ${user.id}:`, err)
      }
    }
    
    // Now create or get the channel with both users as members
    const channel = serverClient.channel('messaging', conversationId, {
      created_by_id: buyerId,
      members: [buyerId, sellerId],
    });

    const response = await channel.create()
    console.log(`Stream channel created/retrieved: ${conversationId}`)
    
    // Ensure both users are members
    if (response.members) {
      const memberIds = Object.keys(response.members)
      console.log(`Channel members: ${memberIds.join(', ')}`)
    }
    
    return channel
  } catch (err: any) {
    console.error('Stream channel error:', {
      code: err.code,
      message: err.message,
      conversationId
    })
    throw err
  }
}
