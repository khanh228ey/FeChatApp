import styles from './ChatWindow.module.css'
import { MessageList } from '../MessageBubble/MessageBubble'
import { MessageInput } from '../MessageInput/MessageInput'
import { ChatAvatar } from '../ChatAvatar/ChatAvatar'
import type { Conversation, Message } from '../../types/chat.types'

interface ChatWindowProps {
  conversation: Conversation | null
  messages: Message[]
  inputValue: string
  onInputChange: (val: string) => void
  onSend: () => void
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIconWrap}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className={styles.emptyTitle}>Chọn một cuộc trò chuyện</h3>
      <p className={styles.emptyDesc}>
        Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin.
      </p>
      <div className={styles.emptyHints}>
        <div className={styles.hint}>
          <span className={styles.hintIcon}>⚡</span>
          <div>
            <strong>Nhanh chóng</strong>
            <p>Nhắn tin tức thì, không độ trễ</p>
          </div>
        </div>
        <div className={styles.hint}>
          <span className={styles.hintIcon}>🔍</span>
          <div>
            <strong>Tìm kiếm</strong>
            <p>Tìm nhanh người bạn muốn nhắn</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ChatWindow({
  conversation,
  messages,
  inputValue,
  onInputChange,
  onSend,
}: ChatWindowProps) {
  if (!conversation) {
    return (
      <div className={styles.window}>
        <EmptyState />
      </div>
    )
  }

  const isOnline =
    conversation.type === 'direct'
      ? (conversation.participants[0]?.isOnline ?? false)
      : false

  return (
    <div className={styles.window}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <ChatAvatar name={conversation.name} isOnline={isOnline} size="md" />
          <div className={styles.headerInfo}>
            <h2 className={styles.headerName}>{conversation.name}</h2>
            <span className={styles.headerStatus}>
              {isOnline ? '● Đang hoạt động' : '○ Ngoại tuyến'}
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.actionBtn} type="button" title="Gọi thoại" aria-label="Gọi thoại">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6 6l.91-1.08a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className={styles.actionBtn} type="button" title="Gọi video" aria-label="Gọi video">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button className={styles.actionBtn} type="button" title="Thông tin" aria-label="Thông tin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Input */}
      <MessageInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSend}
      />
    </div>
  )
}
