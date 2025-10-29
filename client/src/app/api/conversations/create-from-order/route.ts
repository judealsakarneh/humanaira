import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Server API route to create-or-get a conversation between buyer and seller.
 * Expects JSON body: { buyer_id: string, seller_id: string, gig_id?: string | null }
 *
 * Notes:
 * - This uses the SUPABASE_SERVICE_ROLE_KEY (server-only) from env. Add SUPABASE_SERVICE_ROLE_KEY and SUPABASE_URL.
 * - Adjust table/column names to match your DB schema.
 */

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Missing SUPABASE env in conversations route')
}

const supabaseAdmin = createClient(SUPABASE_URL || '', SUPABASE_SERVICE_ROLE_KEY || '')

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { buyer_id, seller_id, gig_id } = body || {}

    if (!buyer_id || !seller_id) {
      return NextResponse.json({ error: 'buyer_id and seller_id are required' }, { status: 400 })
    }

    // Try to find existing conversation
    const { data: existing, error: selErr } = await supabaseAdmin
      .from('conversations')
      .select('id')
      .match({ buyer_id: String(buyer_id), seller_id: String(seller_id) })
      .limit(1)
      .maybeSingle()

    if (selErr) {
      console.error('convo select error', selErr)
    }

    if (existing && (existing as any).id) {
      return NextResponse.json({ id: (existing as any).id }, { status: 200 })
    }

    // Create a new conversation
    const insertRow: any = {
      buyer_id: String(buyer_id),
      seller_id: String(seller_id),
      created_at: new Date().toISOString(),
    }
    if (gig_id) insertRow.gig_id = gig_id

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from('conversations')
      .insert([insertRow])
      .select('id')
      .limit(1)
      .maybeSingle()

    if (insErr || !inserted) {
      console.error('convo insert error', insErr)
      return NextResponse.json({ error: 'Could not create conversation' }, { status: 500 })
    }

    return NextResponse.json({ id: (inserted as any).id }, { status: 201 })
  } catch (err) {
    console.error('conversations route error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}