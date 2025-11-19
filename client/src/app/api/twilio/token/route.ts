import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../lib/supabaseServer'

const twilio = require('twilio')

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const apiKey = process.env.TWILIO_API_KEY
    const apiSecret = process.env.TWILIO_API_SECRET
    const chatServiceSid = process.env.TWILIO_CHAT_SERVICE_SID

    if (!accountSid || !apiKey || !apiSecret || !chatServiceSid) {
      console.warn('Twilio credentials not configured - using fallback mode')
      return NextResponse.json({ 
        token: null, 
        identity: user.id,
        fallbackMode: true 
      })
    }

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

    return NextResponse.json({
      token: token.toJwt(),
      identity: user.id,
      fallbackMode: false,
    })
  } catch (error: any) {
    console.error('Error generating Twilio token:', error)
    return NextResponse.json(
      { error: 'Failed to generate token', fallbackMode: true },
      { status: 500 }
    )
  }
}
