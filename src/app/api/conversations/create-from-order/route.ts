import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    // Lazy-import the helper and initialize the client at request-time
    const { getSupabaseServer } = await import('@/lib/supabaseServer')
    const supabaseServer = await getSupabaseServer()

    if (!supabaseServer) {
      console.error('Supabase not configured (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing)')
      return NextResponse.json({ error: 'supabase not configured' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const { order_id, title, user_id } = body

    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

    // Adjust the insert payload to match your actual schema
    const { data: conv, error } = await supabaseServer
      .from('conversations')
      .insert([
        {
          order_id,
          title: title ?? `Order ${order_id}`,
          created_by: user_id ?? null,
          status: 'ordered',
          created_at: new Date().toISOString(),
        },
      ])
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