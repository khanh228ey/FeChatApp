import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { getUserDisplayName } from '@/features/auth/utils/auth.utils'
import { useWebSocket } from './useWebSocket'
import { getMessagesApi } from '@/api/endpoints/message.api'
import type { Conversation, Message, ChatUser, WsMessage } from '../types/chat.types'
import type { FriendResponse } from '../types/friendship.types'

/** Tạo conversationId deterministic từ 2 userID (giống backend BuildConversationID) */
function buildConversationId(idA: string, idB: string): string {
  return [idA, idB].sort().join('_')
}

/** Chuyển FriendResponse thành Conversation */
function friendToConversation(friend: FriendResponse, myId: string): Conversation {
  return {
    id: buildConversationId(myId, friend.id),
    type: 'direct',
    name: friend.email,
    participants: [{ id: friend.id, displayName: friend.email, isOnline: false }],
    unreadCount: 0,
    isPinned: false,
  }
}

export function useChat() {
  const { user, token } = useAuthStore()

  const me: ChatUser = {
    id: user?.id ?? '',
    displayName: getUserDisplayName(user),
    isOnline: true,
  }

  // ── State ─────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({})
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({})
  const loadedConvs = useRef<Set<string>>(new Set()) // tránh load lịch sử nhiều lần
  const meIdRef = useRef(user?.id ?? '')             // ref tránh stale closure trong WS handler
  meIdRef.current = user?.id ?? ''

  // ── WebSocket ─────────────────────────────────────────────────────
  const handleWsMessage = useCallback((ws: WsMessage) => {
    if (ws.type !== 'chat_message' || !ws.conversation_id || !ws.id) return

    const isOwn = ws.sender_id === meIdRef.current
    const newMsg: Message = {
      id: ws.id,
      conversationId: ws.conversation_id,
      senderId: ws.sender_id ?? '',
      content: ws.content ?? '',
      createdAt: ws.created_at ?? new Date().toISOString(),
      status: isOwn ? 'sent' : 'delivered',
      isOwn,
    }

    setAllMessages((prev) => {
      const convMsgs = prev[ws.conversation_id!] ?? []
      // Tránh duplicate: xóa temp message 'sending' cùng nội dung
      const withoutTemp = convMsgs.filter(
        (m) => !(m.isOwn && m.status === 'sending' && m.content === ws.content)
      )
      // Kiểm tra có ID trùng chưa (tránh double append)
      if (withoutTemp.some((m) => m.id === ws.id)) return prev
      return { ...prev, [ws.conversation_id!]: [...withoutTemp, newMsg] }
    })

    // Cập nhật lastMessage của conversation trong sidebar
    setConversations((prev) =>
      prev.map((c) =>
        c.id === ws.conversation_id
          ? {
              ...c,
              lastMessage: {
                content: ws.content ?? '',
                senderId: ws.sender_id ?? '',
                createdAt: ws.created_at ?? new Date().toISOString(),
              },
            }
          : c
      )
    )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // không cần dependency — dùng ref

  const { send } = useWebSocket({ token, onMessage: handleWsMessage })

  // ── Mở chat với bạn bè (gọi từ ChatSidebar) ──────────────────────
  const openChatWithFriend = useCallback(
    (friend: FriendResponse) => {
      if (!me.id) return
      const conv = friendToConversation(friend, me.id)

      // Thêm vào danh sách nếu chưa có
      setConversations((prev) => {
        if (prev.find((c) => c.id === conv.id)) return prev
        return [conv, ...prev]
      })
      setActiveConversationId(conv.id)
    },
    [me.id]
  )

  // ── Load lịch sử khi chọn conversation ───────────────────────────
  useEffect(() => {
    if (!activeConversationId) return
    if (loadedConvs.current.has(activeConversationId)) return

    loadedConvs.current.add(activeConversationId)

    getMessagesApi(activeConversationId)
      .then(({ messages }) => {
        const mapped: Message[] = messages.map((m) => ({
          id: m.id,
          conversationId: m.conversation_id,
          senderId: m.sender_id,
          content: m.content,
          createdAt: m.created_at,
          status: 'seen' as const,
          isOwn: m.sender_id === meIdRef.current,
        }))
        setAllMessages((prev) => ({ ...prev, [activeConversationId]: mapped }))

        // Cập nhật lastMessage sidebar nếu có
        if (mapped.length > 0) {
          const last = mapped[mapped.length - 1]
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId
                ? {
                    ...c,
                    lastMessage: {
                      content: last.content,
                      senderId: last.senderId,
                      createdAt: last.createdAt,
                    },
                  }
                : c
            )
          )
        }
      })
      .catch(() => {
        // Lần sau sẽ thử lại
        loadedConvs.current.delete(activeConversationId)
      })
  }, [activeConversationId, me.id])

  // ── Derived state ─────────────────────────────────────────────────
  const filteredConversations = useMemo<Conversation[]>(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return conversations
    return conversations.filter((c) => c.name.toLowerCase().includes(q))
  }, [searchQuery, conversations])

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId) ?? null,
    [activeConversationId, conversations]
  )

  const activeMessages = useMemo<Message[]>(() => {
    if (!activeConversationId) return []
    return allMessages[activeConversationId] ?? []
  }, [activeConversationId, allMessages])

  const currentInput = activeConversationId ? (messageInputs[activeConversationId] ?? '') : ''

  const setCurrentInput = useCallback(
    (value: string) => {
      if (!activeConversationId) return
      setMessageInputs((prev) => ({ ...prev, [activeConversationId]: value }))
    },
    [activeConversationId]
  )

  // ── Gửi message qua WebSocket ─────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = currentInput.trim()
    if (!text || !activeConversationId || !meIdRef.current) return

    // Optimistic UI: hiển thị ngay với status 'sending'
    const tempMsg: Message = {
      id: `temp_${Date.now()}`,
      conversationId: activeConversationId,
      senderId: meIdRef.current,
      content: text,
      createdAt: new Date().toISOString(),
      status: 'sending',
      isOwn: true,
    }
    setAllMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] ?? []), tempMsg],
    }))
    setCurrentInput('')

    // Gửi qua WS
    send({
      type: 'chat_message',
      conversation_id: activeConversationId,
      content: text,
    })
  }, [currentInput, activeConversationId, send, setCurrentInput])

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
    openChatWithFriend,
    me,
  }
}
