import { useState, useMemo, useCallback } from 'react'
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
} from '../mock/chat.mock'
import { useAuthStore } from '../../../stores/auth.store'
import { getUserDisplayName } from '../../auth/utils/auth.utils'
import type { Conversation, Message, ChatUser } from '../types/chat.types'

export function useChat() {
  const { user } = useAuthStore()

  // Me — lấy từ auth store, fallback cho mock
  const me: ChatUser = {
    id: user?.id ?? 'me',
    displayName: getUserDisplayName(user),
    isOnline: true,
  }

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({})
  const [allMessages, setAllMessages] = useState(MOCK_MESSAGES)

  // Filtered conversations by search
  const filteredConversations = useMemo<Conversation[]>(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return MOCK_CONVERSATIONS
    return MOCK_CONVERSATIONS.filter((c) =>
      c.name.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Active conversation info
  const activeConversation = useMemo(
    () => MOCK_CONVERSATIONS.find((c) => c.id === activeConversationId) ?? null,
    [activeConversationId]
  )

  // Messages of active conversation
  const activeMessages = useMemo<Message[]>(() => {
    if (!activeConversationId) return []
    return allMessages[activeConversationId] ?? []
  }, [activeConversationId, allMessages])

  // Current input value
  const currentInput = activeConversationId ? (messageInputs[activeConversationId] ?? '') : ''

  const setCurrentInput = useCallback((value: string) => {
    if (!activeConversationId) return
    setMessageInputs((prev) => ({ ...prev, [activeConversationId]: value }))
  }, [activeConversationId])

  // Send message (mock - just prepend to local state)
  const sendMessage = useCallback(() => {
    const text = currentInput.trim()
    if (!text || !activeConversationId) return

    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId: activeConversationId,
      senderId: me.id,
      content: text,
      createdAt: new Date().toISOString(),
      status: 'sending',
      isOwn: true,
    }

    setAllMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] ?? []), newMsg],
    }))

    setCurrentInput('')

    // Simulate sent status
    setTimeout(() => {
      setAllMessages((prev) => ({
        ...prev,
        [activeConversationId]: prev[activeConversationId]?.map((m) =>
          m.id === newMsg.id ? { ...m, status: 'sent' } : m
        ) ?? [],
      }))
    }, 800)
  }, [currentInput, activeConversationId, setCurrentInput, me.id])

  return {
    conversations: filteredConversations,
    activeConversation,
    activeMessages,
    activeConversationId,
    setActiveConversationId,
    searchQuery,
    setSearchQuery,
    currentInput,
    setCurrentInput,
    sendMessage,
    me,
  }
}
