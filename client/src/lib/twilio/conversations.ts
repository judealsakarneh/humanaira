import Twilio from 'twilio'

/**
 * Server-side utility for managing Twilio Conversations
 * 
 * This utility:
 * - Initializes Twilio REST client with API key credentials
 * - Provides functions to manage conversations for the marketplace
 */

// Initialize Twilio client
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const apiKeySid = process.env.TWILIO_API_KEY_SID
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET

  if (!accountSid || !apiKeySid || !apiKeySecret) {
    throw new Error('Missing Twilio credentials in environment variables')
  }

  return Twilio(apiKeySid, apiKeySecret, { accountSid })
}

/**
 * Get or create a conversation for an order
 * 
 * @param orderId - The marketplace order ID
 * @param buyerId - The buyer's user ID
 * @param sellerId - The seller's user ID
 * @returns Conversation SID and metadata
 */
export async function getOrCreateConversation(
  orderId: string,
  buyerId: string,
  sellerId: string
): Promise<{
  conversationSid: string
  uniqueName: string
  buyerIdentity: string
  sellerIdentity: string
}> {
  const client = getTwilioClient()
  const conversationsServiceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID

  if (!conversationsServiceSid) {
    throw new Error('Missing TWILIO_CONVERSATIONS_SERVICE_SID')
  }

  // Create unique conversation name based on order ID
  const uniqueName = `order_${orderId}`
  
  // Create participant identities
  // TODO: When integrating with real Supabase auth, these should match the actual user IDs
  const buyerIdentity = `buyer_${buyerId}`
  const sellerIdentity = `seller_${sellerId}`

  try {
    // Try to fetch existing conversation
    const conversations = await client.conversations.v1
      .services(conversationsServiceSid)
      .conversations.list({ limit: 100 })

    const existing = conversations.find(c => c.uniqueName === uniqueName)

    if (existing) {
      console.log(`Found existing conversation: ${existing.sid}`)
      
      // Ensure both participants are added (idempotent operation)
      try {
        await client.conversations.v1
          .services(conversationsServiceSid)
          .conversations(existing.sid)
          .participants.create({ identity: buyerIdentity })
      } catch (err: any) {
        // Participant may already exist, that's okay
        if (!err.message?.includes('already exists')) {
          console.warn('Error adding buyer participant:', err)
        }
      }

      try {
        await client.conversations.v1
          .services(conversationsServiceSid)
          .conversations(existing.sid)
          .participants.create({ identity: sellerIdentity })
      } catch (err: any) {
        // Participant may already exist, that's okay
        if (!err.message?.includes('already exists')) {
          console.warn('Error adding seller participant:', err)
        }
      }

      return {
        conversationSid: existing.sid,
        uniqueName,
        buyerIdentity,
        sellerIdentity,
      }
    }

    // Create new conversation
    console.log(`Creating new conversation: ${uniqueName}`)
    const conversation = await client.conversations.v1
      .services(conversationsServiceSid)
      .conversations.create({
        uniqueName,
        friendlyName: `Order ${orderId} - Buyer & Seller Chat`,
      })

    // Add participants
    await client.conversations.v1
      .services(conversationsServiceSid)
      .conversations(conversation.sid)
      .participants.create({ identity: buyerIdentity })

    await client.conversations.v1
      .services(conversationsServiceSid)
      .conversations(conversation.sid)
      .participants.create({ identity: sellerIdentity })

    console.log(`Created conversation ${conversation.sid} with participants`)

    return {
      conversationSid: conversation.sid,
      uniqueName,
      buyerIdentity,
      sellerIdentity,
    }
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error)
    throw error
  }
}
