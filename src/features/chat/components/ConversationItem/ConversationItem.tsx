import styles from './ConversationItem.module.css'
import { ChatAvatar } from '../ChatAvatar/ChatAvatar'
import { formatRelativeTime } from '../../utils/chat.utils'
import type { Conversation } from '../../types/chat.types'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const isOnline =
    conversation.type === 'direct'
      ? (conversation.participants[0]?.isOnline ?? false)
      : false

  return (
    <button
      className={`${styles.item} ${isActive ? styles.active : ''}`}
      onClick={onClick}
      aria-current={isActive ? 'true' : undefined}
    >
      <ChatAvatar
        name={conversation.name}
        isOnline={isOnline}
        size="md"
      />

      <div className={styles.info}>
        <div className={styles.topRow}>
          <span className={styles.name}>
            {conversation.type === 'group' && (
              <span className={styles.groupIcon}>👥 </span>
            )}
            {conversation.name}
          </span>
          {conversation.lastMessage && (
            <span className={styles.time}>
              {formatRelativeTime(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className={styles.bottomRow}>
          <span className={styles.preview}>
            {conversation.lastMessage?.content ?? 'Chưa có tin nhắn'}
          </span>
          {conversation.unreadCount > 0 && (
            <span className={styles.badge}>
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
