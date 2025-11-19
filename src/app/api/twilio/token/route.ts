import { NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(req: Request) {
  const { identity } = await req.json()
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const apiKey = process.env.TWILIO_API_KEY
  const apiSecret = process.env.TWILIO_API_SECRET
  const chatServiceSid = process.env.TWILIO_CHAT_SERVICE_SID

  if (!identity) return NextResponse.json({ error: 'Missing identity' }, { status: 400 })

  const AccessToken = twilio.jwt.AccessToken
  const ChatGrant = AccessToken.ChatGrant

  const chatGrant = new ChatGrant({ serviceSid: chatServiceSid })
  const token = new AccessToken(accountSid, apiKey, apiSecret, { identity })
  token.addGrant(chatGrant)

  return NextResponse.json({ token: token.toJwt() })
}