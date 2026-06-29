// ==================== ENUMS ====================

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen'

export type ConversationType = 'direct' | 'group'

// ==================== ENTITIES ====================

export interface ChatUser {
  id: string
  displayName: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
  status: MessageStatus
  isOwn: boolean
}

export interface Conversation {
  id: string
  type: ConversationType
  name: string
  avatar?: string
  participants: ChatUser[]
  lastMessage?: {
    content: string
    senderId: string
    createdAt: string
  }
  unreadCount: number
  isPinned: boolean
}

// ==================== UI STATE ====================

export interface ChatUIState {
  activeConversationId: string | null
  searchQuery: string
  isSidebarOpen: boolean
}
