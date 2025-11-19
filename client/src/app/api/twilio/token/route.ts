import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../lib/supabaseServer'

const twilio = require('twilio')

export async function GET(request: NextRequest) {
  try {
    console.log('[Twilio API] Token request received')
    const supabase = createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('[Twilio API] Unauthorized - no user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Twilio API] User authenticated:', user.id)

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const apiKey = process.env.TWILIO_API_KEY
    const apiSecret = process.env.TWILIO_API_SECRET
    const chatServiceSid = process.env.TWILIO_CHAT_SERVICE_SID

    console.log('[Twilio API] Checking credentials:', {
      hasAccountSid: !!accountSid,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
      hasChatServiceSid: !!chatServiceSid
    })

    if (!accountSid || !apiKey || !apiSecret || !chatServiceSid) {
      console.warn('[Twilio API] Twilio credentials not configured - using fallback mode')
      return NextResponse.json({ 
        token: null, 
        identity: user.id,
        fallbackMode: true 
      })
    }

    console.log('[Twilio API] Generating Twilio token...')
    const AccessToken = twilio.jwt.AccessToken
    const ChatGrant = AccessToken.ChatGrant

    const token = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: user.id,
      ttl: 3600, // 1 hour
    })

    const chatGrant = new ChatGrant({
      serviceSid: chatServiceSid,
    })

    token.addGrant(chatGrant)

    console.log('[Twilio API] ✓ Token generated successfully')
    return NextResponse.json({
      token: token.toJwt(),
      identity: user.id,
      fallbackMode: false,
    })
  } catch (error: any) {
    console.error('[Twilio API] Error generating Twilio token:', error)
    return NextResponse.json(
      { error: 'Failed to generate token', fallbackMode: true },
      { status: 500 }
    )
  }
}
