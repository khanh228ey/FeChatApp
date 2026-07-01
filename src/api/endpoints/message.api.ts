import { api } from '../client'

export interface ChatMessageResponse {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface ChatMessageListResponse {
  messages: ChatMessageResponse[]
}

/** Lấy lịch sử tin nhắn của một conversation */
export async function getMessagesApi(
  conversationId: string,
  limit = 50,
): Promise<ChatMessageListResponse> {
  const { data } = await api.get<ChatMessageListResponse>('/api/v1/messages', {
    params: { conversation_id: conversationId, limit },
  })
  return data
}
