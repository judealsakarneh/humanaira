import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const orderId = body?.orderId as string | undefined
    if (!orderId) {
      return NextResponse.json({ error: 'orderId required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server env not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    })

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, gig_id, seller_id, buyer_id')
      .eq('id', orderId)
      .maybeSingle()

    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const { data: existing, error: findErr } = await supabase
      .from('conversations')
      .select('*')
      .eq('gig_id', order.gig_id)
      .eq('seller_id', order.seller_id)
      .eq('buyer_id', order.buyer_id)
      .limit(1)
      .maybeSingle()

    if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 })
    if (existing) return NextResponse.json({ conversationId: existing.id }, { status: 200 })

    const { data: created, error: insertErr } = await supabase
      .from('conversations')
      .insert([{ gig_id: order.gig_id, seller_id: order.seller_id, buyer_id: order.buyer_id, status: 'open' }])
      .select('*')
      .single()

    if (insertErr) {
      const { data: after } = await supabase
        .from('conversations')
        .select('*')
        .eq('gig_id', order.gig_id)
        .eq('seller_id', order.seller_id)
        .eq('buyer_id', order.buyer_id)
        .limit(1)
        .maybeSingle()
      if (after) return NextResponse.json({ conversationId: after.id }, { status: 200 })
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    return NextResponse.json({ conversationId: created.id }, { status: 200 })
  } catch (err: any) {
    console.error('create-from-order error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}