import { supabase } from './supabaseBrowser'
import type { Message } from '@/hooks/useMessages'

export async function sendMessage(conversationId: string, senderId: string, text: string, attachments: any[] = []): Promise<{ message?: Message; error?: any }> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: senderId,
          text,
          attachments,
        },
      ])
      .select() // return inserted rows
      .single()

    if (error) {
      console.error('sendMessage error', error)
      return { error }
    }

    return { message: data as Message }
  } catch (err) {
    console.error('sendMessage exception', err)
    return { error: err }
  }
}
