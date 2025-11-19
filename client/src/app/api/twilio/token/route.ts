import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServer } from '../../lib/createSupabaseServer'

const twilio = require('twilio')

export async function GET(request: NextRequest) {
  try {
    console.log('[Twilio API] Token request received')
    
    // Create supabase client with runtime env check
    let supabase
    try {
      supabase = await createSupabaseServer()
    } catch (envError: any) {
      console.error('[Twilio API] Environment error:', envError.message)
      return NextResponse.json(
        { error: 'Server configuration error', details: envError.message },
        { status: 500 }
      )
    }
    
    // Try both getUser and getSession for better diagnostics
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('[Twilio API] getUser result:', user?.id ?? 'null', authError?.message ?? 'no error')
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    console.log('[Twilio API] getSession result:', sessionData?.session?.user?.id ?? 'null', sessionError?.message ?? 'no error')
    
    const actualUser = sessionData?.session?.user ?? user

    if (!actualUser) {
      console.log('[Twilio API] Unauthorized - no user found via getUser or getSession')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Twilio API] User authenticated:', actualUser.id, actualUser.email)

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
        identity: actualUser.id,
        fallbackMode: true 
      })
    }

    console.log('[Twilio API] Generating Twilio token...')
    const AccessToken = twilio.jwt.AccessToken
    const ChatGrant = AccessToken.ChatGrant

    const token = new AccessToken(accountSid, apiKey, apiSecret, {
      identity: actualUser.id,
      ttl: 3600, // 1 hour
    })

    const chatGrant = new ChatGrant({
      serviceSid: chatServiceSid,
    })

    token.addGrant(chatGrant)

    console.log('[Twilio API] ✓ Token generated successfully for user:', actualUser.email)
    return NextResponse.json({
      token: token.toJwt(),
      identity: actualUser.id,
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
