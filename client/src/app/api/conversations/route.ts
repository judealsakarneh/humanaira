import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { buyer_id, seller_id, gig_id } = await req.json().catch(() => ({}))
    
    console.log('[API /conversations] Request:', { buyer_id, seller_id, gig_id })
    
    if (!buyer_id || !seller_id) {
      console.error('[API /conversations] Missing required fields')
      return NextResponse.json({ error: 'buyer_id and seller_id required' }, { status: 400 })
    }
    if (buyer_id === seller_id) {
      console.error('[API /conversations] Same buyer and seller')
      return NextResponse.json({ error: 'Cannot chat with yourself' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      console.error('[API /conversations] Missing env config')
      return NextResponse.json({ error: 'Server env not configured' }, { status: 500 })
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } })

    // Find existing conversation between these two users for this gig
    // In a marketplace, roles are fixed: buyer contacts seller about a specific gig
    // So we check for exact match: buyer_id, seller_id, and gig_id
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('seller_id', seller_id)
      .eq('buyer_id', buyer_id)

    query = gig_id == null ? query.is('gig_id', null) : query.eq('gig_id', gig_id)

    const { data: existing, error: findErr } = await query.limit(1).maybeSingle()
    if (findErr) {
      console.error('[API /conversations] Error finding existing:', findErr)
      return NextResponse.json({ error: findErr.message }, { status: 500 })
    }
    if (existing) {
      console.log('[API /conversations] Found existing conversation:', existing.id)
      return NextResponse.json({ id: existing.id, conversation: existing, is_new: false }, { status: 200 })
    }

    // Create new
    const now = new Date().toISOString()
    const insertRow = { 
      seller_id, 
      buyer_id, 
      gig_id: gig_id ?? null, 
      status: 'open',
      created_at: now,
      updated_at: now
    }
    
    console.log('[API /conversations] Creating new conversation:', insertRow)
    
    const { data: created, error: insertErr } = await supabase
      .from('conversations')
      .insert([insertRow])
      .select('*')
      .single()

    if (insertErr) {
      console.error('[API /conversations] Error creating conversation:', insertErr)
      // Race condition fallback: another request might have created it
      let again = supabase
        .from('conversations')
        .select('*')
        .eq('seller_id', seller_id)
        .eq('buyer_id', buyer_id)

      again = gig_id == null ? again.is('gig_id', null) : again.eq('gig_id', gig_id)

      const { data: after } = await again.limit(1).maybeSingle()
      if (after) {
        console.log('[API /conversations] Found in race fallback:', after.id)
        return NextResponse.json({ id: after.id, conversation: after, is_new: false }, { status: 200 })
      }
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    console.log('[API /conversations] Created new conversation:', created.id)
    return NextResponse.json({ id: created.id, conversation: created, is_new: true }, { status: 200 })
  } catch (e: any) {
    console.error('[API /conversations] POST error', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}