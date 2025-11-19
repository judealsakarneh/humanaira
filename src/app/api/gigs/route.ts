import { NextRequest, NextResponse } from 'next/server'
import slugify from 'slugify'
import { createSupabaseServer } from '../lib/supabaseServer'
import { v4 as uuid } from 'uuid'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, description, cover_image_url, category_id, subcategory_id, packages } = body

  // create slug
  const slug = slugify(title, { lower: true, strict: true }) + '-' + uuid().slice(0, 6)

  const { data: gig, error: gigErr } = await supabase.from('gigs').insert({
    seller_id: user.id,
    title, description, cover_image_url,
    category_id, subcategory_id,
    slug, status: 'ACTIVE'
  }).select('id,slug').single()
  if (gigErr) return NextResponse.json({ error: gigErr.message }, { status: 400 })

  // insert packages (expect 3)
  const payload = (packages || []).map((p: any) => ({
    gig_id: gig.id,
    tier: p.tier,
    price_cents: p.price_cents,
    delivery_days: p.delivery_days,
    revisions: p.revisions,
    features: p.features || ''
  }))
  const { error: pErr } = await supabase.from('gig_packages').insert(payload)
  if (pErr) return NextResponse.json({ error: pErr.message }, { status: 400 })

  return NextResponse.json({ ok: true, slug: gig.slug })
} 