import { useRef, useEffect } from 'react'
import styles from './MessageBubble.module.css'
import { formatTime } from '../../utils/chat.utils'
import type { Message, MessageStatus } from '../../types/chat.types'

interface MessageBubbleProps {
  message: Message
}

function StatusIcon({ status }: { status: MessageStatus }) {
  switch (status) {
    case 'sending':
      return <span className={styles.statusSending} title="Đang gửi">○</span>
    case 'sent':
      return <span className={styles.statusSent} title="Đã gửi">✓</span>
    case 'delivered':
      return <span className={styles.statusDelivered} title="Đã nhận">✓✓</span>
    case 'seen':
      return <span className={styles.statusSeen} title="Đã xem">✓✓</span>
    default:
      return null
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`${styles.wrapper} ${message.isOwn ? styles.own : styles.other}`}>
      <div className={styles.bubble}>
        <p className={styles.content}>{message.content}</p>
        <div className={styles.meta}>
          <span className={styles.time}>{formatTime(message.createdAt)}</span>
          {message.isOwn && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  )
}

// ==================== MESSAGE LIST ====================

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className={styles.emptyMessages}>
        <div className={styles.emptyIcon}>💬</div>
        <p>Bắt đầu cuộc trò chuyện nào!</p>
      </div>
    )
  }

  return (
    <div className={styles.list} role="log" aria-label="Tin nhắn">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
