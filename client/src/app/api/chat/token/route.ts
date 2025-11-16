import { NextRequest, NextResponse } from 'next/server'
import Twilio from 'twilio'
import { createClient } from '@supabase/supabase-js'

// Import AccessToken and ChatGrant (for Conversations)
const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant

/**
 * Backend endpoint to generate Twilio Access Tokens for Conversations
 * 
 * This endpoint:
 * - Authenticates the user via Supabase session
 * - Generates a Twilio Access Token using the user's Supabase ID as identity
 * - Uses ChatGrant for Conversations API access
 * - Returns { token, identity } to the client
 */
export async function GET(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Get authenticated user from Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Read Twilio environment variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const apiKeySid = process.env.TWILIO_API_KEY_SID
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET
    const conversationsServiceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID

    // Validate environment variables
    if (!accountSid || !apiKeySid || !apiKeySecret || !conversationsServiceSid) {
      console.error('Missing Twilio environment variables')
      return NextResponse.json(
        { error: 'Twilio configuration is incomplete' },
        { status: 500 }
      )
    }

    // Use Supabase user ID as Twilio identity
    const identity = user.id

    // Create access token
    const accessToken = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
      identity,
      // Token expires in 1 hour
      ttl: 3600,
    })

    // Grant access to Twilio Conversations (using ChatGrant)
    const chatGrant = new ChatGrant({
      serviceSid: conversationsServiceSid,
    })
    accessToken.addGrant(chatGrant)

    // Return token and identity
    return NextResponse.json({
      token: accessToken.toJwt(),
      identity,
    })
  } catch (error) {
    console.error('Error generating Twilio token:', error)
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}
