import styles from './ChatSidebar.module.css'
import { ConversationItem } from '../ConversationItem/ConversationItem'
import { ChatAvatar } from '../ChatAvatar/ChatAvatar'
import { useAuthStore } from '../../../../stores/auth.store'
import { getUserDisplayName } from '../../../../features/auth/utils/auth.utils'
import type { Conversation } from '../../types/chat.types'

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId: string | null
  searchQuery: string
  onSearchChange: (q: string) => void
  onSelectConversation: (id: string) => void
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
}: ChatSidebarProps) {
  const { user, logout } = useAuthStore()

  const displayName = getUserDisplayName(user)

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>💬</span>
          <span className={styles.brandName}>CodeChill Chat</span>
        </div>
        <button
          id="chat-new-btn"
          className={styles.newChatBtn}
          type="button"
          title="Tạo cuộc trò chuyện mới"
          aria-label="Tạo cuộc trò chuyện mới"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span>Mới</span>
        </button>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id="chat-search-input"
          className={styles.searchInput}
          type="search"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Tìm kiếm cuộc trò chuyện"
        />
      </div>

      {/* Nav */}
      <nav className={styles.nav} aria-label="Điều hướng">
        <button className={`${styles.navItem} ${styles.navActive}`} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tin nhắn
        </button>
        <button className={styles.navItem} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Danh bạ
        </button>
        <button className={styles.navItem} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Cài đặt
        </button>
      </nav>

      {/* Conversation list */}
      <div className={styles.convLabel}>Cuộc trò chuyện</div>
      <div className={styles.convList} role="list" aria-label="Danh sách cuộc trò chuyện">
        {conversations.length === 0 ? (
          <div className={styles.noResult}>Không tìm thấy kết quả</div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))
        )}
      </div>

      {/* Footer / current user */}
      <div className={styles.footer}>
        <ChatAvatar name={displayName} isOnline size="sm" />
        <div className={styles.footerInfo}>
          <span className={styles.footerName}>{displayName}</span>
          <span className={styles.footerStatus}>● Đang hoạt động</span>
        </div>
        <button
          id="chat-logout-btn"
          className={styles.logoutBtn}
          type="button"
          onClick={logout}
          title="Đăng xuất"
          aria-label="Đăng xuất"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  )
}
