import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../lib/supabaseServer'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const order_id = searchParams.get('order_id')
  if (!order_id) return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
  const supabase = await createSupabaseServer()
  const { data: review } = await supabase.from('reviews').select('*').eq('order_id', order_id).single()
  return NextResponse.json({ review })
}

// Keep your POST handler for submitting reviews here as well
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { order_id, rating, comment } = await req.json()
  // Only allow review if user is the buyer and order is completed
  const { data: order } = await supabase.from('orders').select('*').eq('id', order_id).single()
  if (!order || order.buyer_id !== user.id || order.status !== 'COMPLETED')
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 })

  // Insert review
  const { error } = await supabase.from('reviews').insert({
    order_id,
    buyer_id: user.id,
    seller_id: order.seller_id,
    rating,
    comment,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Update seller's rating stats
  const { data: stats } = await supabase
    .from('reviews')
    .select('rating')
    .eq('seller_id', order.seller_id)
  const ratings = stats?.map((r: any) => r.rating) || []
  const avg = ratings.length ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0
  await supabase.from('profiles').update({
    rating_avg: avg,
    rating_count: ratings.length
  }).eq('id', order.seller_id)

  return NextResponse.json({ ok: true })
}