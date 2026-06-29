import type { ChatUser, Conversation, Message } from '../types/chat.types'

// ==================== MOCK USERS ====================

export const MOCK_ME: ChatUser = {
  id: 'me',
  displayName: 'Bạn',
  isOnline: true,
}

export const MOCK_USERS: ChatUser[] = [
  {
    id: 'user_1',
    displayName: 'Nguyễn Minh Tuấn',
    isOnline: true,
    lastSeen: undefined,
  },
  {
    id: 'user_2',
    displayName: 'Trần Thị Hương',
    isOnline: false,
    lastSeen: '2026-06-29T10:30:00Z',
  },
  {
    id: 'user_3',
    displayName: 'Lê Quang Huy',
    isOnline: true,
    lastSeen: undefined,
  },
  {
    id: 'user_4',
    displayName: 'Phạm Thanh Lan',
    isOnline: false,
    lastSeen: '2026-06-28T18:00:00Z',
  },
  {
    id: 'user_5',
    displayName: 'Võ Đức Mạnh',
    isOnline: true,
    lastSeen: undefined,
  },
]

// ==================== MOCK CONVERSATIONS ====================

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    type: 'direct',
    name: 'Nguyễn Minh Tuấn',
    participants: [MOCK_USERS[0]],
    lastMessage: {
      content: 'Ok bạn, mình sẽ check lại rồi báo nhé!',
      senderId: 'user_1',
      createdAt: '2026-06-29T13:00:00Z',
    },
    unreadCount: 3,
    isPinned: true,
  },
  {
    id: 'conv_2',
    type: 'direct',
    name: 'Trần Thị Hương',
    participants: [MOCK_USERS[1]],
    lastMessage: {
      content: 'Mình đã gửi file design rồi nha',
      senderId: 'user_2',
      createdAt: '2026-06-29T09:15:00Z',
    },
    unreadCount: 0,
    isPinned: false,
  },
  {
    id: 'conv_3',
    type: 'group',
    name: 'Nhóm Dev Team 🚀',
    participants: [MOCK_USERS[0], MOCK_USERS[2], MOCK_USERS[4]],
    lastMessage: {
      content: 'Huy: Merge vào main chưa mấy bạn?',
      senderId: 'user_3',
      createdAt: '2026-06-28T22:40:00Z',
    },
    unreadCount: 7,
    isPinned: true,
  },
  {
    id: 'conv_4',
    type: 'direct',
    name: 'Phạm Thanh Lan',
    participants: [MOCK_USERS[3]],
    lastMessage: {
      content: 'Cuộc họp 3h chiều nha mọi người!',
      senderId: 'user_4',
      createdAt: '2026-06-28T14:20:00Z',
    },
    unreadCount: 1,
    isPinned: false,
  },
  {
    id: 'conv_5',
    type: 'direct',
    name: 'Võ Đức Mạnh',
    participants: [MOCK_USERS[4]],
    lastMessage: {
      content: 'Xem qua ticket #123 giúp tớ với',
      senderId: 'me',
      createdAt: '2026-06-27T11:00:00Z',
    },
    unreadCount: 0,
    isPinned: false,
  },
]

// ==================== MOCK MESSAGES ====================

export const MOCK_MESSAGES: Record<string, Message[]> = {
  conv_1: [
    {
      id: 'msg_1_1',
      conversationId: 'conv_1',
      senderId: 'user_1',
      content: 'Ê bạn ơi, deploy lên staging chưa?',
      createdAt: '2026-06-29T12:30:00Z',
      status: 'seen',
      isOwn: false,
    },
    {
      id: 'msg_1_2',
      conversationId: 'conv_1',
      senderId: 'me',
      content: 'Chưa, đang build. Tí nữa xong nhé!',
      createdAt: '2026-06-29T12:32:00Z',
      status: 'seen',
      isOwn: true,
    },
    {
      id: 'msg_1_3',
      conversationId: 'conv_1',
      senderId: 'user_1',
      content: 'Oke bạn, mình đợi nhé. Nhớ test kỹ trước khi push nha 😄',
      createdAt: '2026-06-29T12:34:00Z',
      status: 'seen',
      isOwn: false,
    },
    {
      id: 'msg_1_4',
      conversationId: 'conv_1',
      senderId: 'me',
      content: 'Yên tâm đi, mình luôn test kỹ mà 🤓',
      createdAt: '2026-06-29T12:50:00Z',
      status: 'delivered',
      isOwn: true,
    },
    {
      id: 'msg_1_5',
      conversationId: 'conv_1',
      senderId: 'user_1',
      content: 'Ok bạn, mình sẽ check lại rồi báo nhé!',
      createdAt: '2026-06-29T13:00:00Z',
      status: 'sent',
      isOwn: false,
    },
  ],
  conv_2: [
    {
      id: 'msg_2_1',
      conversationId: 'conv_2',
      senderId: 'me',
      content: 'Hương ơi, file Figma đâu rồi?',
      createdAt: '2026-06-29T09:00:00Z',
      status: 'seen',
      isOwn: true,
    },
    {
      id: 'msg_2_2',
      conversationId: 'conv_2',
      senderId: 'user_2',
      content: 'Mình đã gửi file design rồi nha',
      createdAt: '2026-06-29T09:15:00Z',
      status: 'seen',
      isOwn: false,
    },
  ],
  conv_3: [
    {
      id: 'msg_3_1',
      conversationId: 'conv_3',
      senderId: 'user_3',
      content: 'Huy: Merge vào main chưa mấy bạn?',
      createdAt: '2026-06-28T22:40:00Z',
      status: 'delivered',
      isOwn: false,
    },
    {
      id: 'msg_3_2',
      conversationId: 'conv_3',
      senderId: 'user_1',
      content: 'Tuấn: Chưa, đang review PR',
      createdAt: '2026-06-28T22:45:00Z',
      status: 'delivered',
      isOwn: false,
    },
  ],
  conv_4: [],
  conv_5: [
    {
      id: 'msg_5_1',
      conversationId: 'conv_5',
      senderId: 'me',
      content: 'Xem qua ticket #123 giúp tớ với',
      createdAt: '2026-06-27T11:00:00Z',
      status: 'seen',
      isOwn: true,
    },
  ],
}
