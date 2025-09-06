import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../api/lib/supabaseServer'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServer()
  const { data: order } = await supabase
    .from('orders')
    .select('*,gig:gigs(title)')
    .eq('id', params.id).single()
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ order })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await req.json()
  let nextStatus: string | null = null
  if (action === 'DELIVER') nextStatus = 'DELIVERED'
  if (action === 'ACCEPT') nextStatus = 'COMPLETED'
  if (!nextStatus) return NextResponse.json({ error: 'Bad action' }, { status: 400 })

  // Ensure user is seller for DELIVER, buyer for ACCEPT
  const { data: order } = await supabase.from('orders').select('*').eq('id', params.id).single()
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (action === 'DELIVER' && order.seller_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (action === 'ACCEPT' && order.buyer_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: updated, error } = await supabase.from('orders').update({ status: nextStatus }).eq('id', params.id).select('*,gig:gigs(title)').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ order: updated })
}