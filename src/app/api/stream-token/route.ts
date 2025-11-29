import { NextRequest, NextResponse } from 'next/server'
import { StreamChat } from 'stream-chat'

const STREAM_KEY = process.env.NEXT_PUBLIC_STREAM_KEY
const STREAM_SECRET = process.env.STREAM_SECRET

if (!STREAM_KEY || !STREAM_SECRET) {
  console.warn('[Stream] Missing NEXT_PUBLIC_STREAM_KEY or STREAM_SECRET env vars')
}

const serverClient =
  STREAM_KEY && STREAM_SECRET
    ? StreamChat.getInstance(STREAM_KEY, STREAM_SECRET)
    : null

export async function POST(req: NextRequest) {
  try {
    if (!serverClient) {
      return NextResponse.json(
        { error: 'Stream Chat not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { userId, name, image } = body || {}

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const safeName = (name && String(name).slice(0, 64)) || 'Humanaira user'

    // Upsert user in Stream
    await serverClient.upsertUser({
      id: userId,
      name: safeName,
      image: image || undefined,
    })

    // Generate token
    const token = serverClient.createToken(userId)

    return NextResponse.json({
      token,
      apiKey: STREAM_KEY,
      user: { id: userId, name: safeName, image: image || null },
    })
  } catch (err) {
    console.error('[Stream token error]', err)
    return NextResponse.json(
      { error: 'Failed to create token' },
      { status: 500 }
    )
  }
}
