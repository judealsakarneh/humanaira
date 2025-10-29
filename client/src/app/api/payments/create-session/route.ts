import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    // Lazy import/initialize Supabase so module import never throws during build
    const { getSupabaseServer } = await import('@/lib/supabaseServer')
    const supabaseServer = await getSupabaseServer()

    if (!supabaseServer) {
      console.error('Supabase not configured (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing)')
      return NextResponse.json({ error: 'supabase not configured' }, { status: 500 })
    }

    // Your handler logic here. Example: parse body and create conversation from order.
    const body = await req.json().catch(() => ({}))
    const { order_id, ...rest } = body
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

    // Example DB operation (adjust to your schema)
    const { data: conv, error } = await supabaseServer
      .from('conversations')
      .insert([{ /* create record based on order_id and rest */ order_id, metadata: rest, created_at: new Date().toISOString() }])
      .select()
      .single()

    if (error) {
      console.error('Failed to create conversation from order:', error)
      return NextResponse.json({ error: 'db error' }, { status: 500 })
    }

    return NextResponse.json({ conversation: conv })
  } catch (err: any) {
    console.error('create-from-order error:', err)
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
  }
}