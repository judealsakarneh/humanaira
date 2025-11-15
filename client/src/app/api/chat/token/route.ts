import { NextRequest, NextResponse } from 'next/server'
import Twilio from 'twilio'

// Import AccessToken and ChatGrant (for Conversations)
const AccessToken = Twilio.jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant

/**
 * Backend endpoint to generate Twilio Access Tokens for Conversations
 * 
 * This endpoint:
 * - Reads Twilio environment variables securely
 * - Generates a Twilio Access Token using ChatGrant (for Conversations API)
 * - For now, uses a temporary random identity (will be replaced with Supabase auth later)
 * - Returns { token, identity } to the client
 */
export async function GET(req: NextRequest) {
  try {
    // Read environment variables
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

    // Generate a temporary identity
    // TODO: Replace with Supabase authenticated user ID when integrating with real auth
    const identity = `user_${Math.random().toString(36).slice(2, 10)}`

    // Create access token
    const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
      identity,
      // Token expires in 1 hour
      ttl: 3600,
    })

    // Grant access to Twilio Conversations (using ChatGrant)
    const chatGrant = new ChatGrant({
      serviceSid: conversationsServiceSid,
    })
    token.addGrant(chatGrant)

    // Return token and identity
    return NextResponse.json({
      token: token.toJwt(),
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
