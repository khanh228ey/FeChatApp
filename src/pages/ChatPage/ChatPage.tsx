import { useState, useEffect } from 'react'
import { ChatSidebar } from '@/features/chat/components/ChatSidebar/ChatSidebar'
import { ChatWindow } from '@/features/chat/components/ChatWindow/ChatWindow'
import { useChat } from '@/features/chat/hooks/useChat'

/** Hook detect mobile (< 768px = md breakpoint) */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export default function ChatPage() {
  const {
    conversations,
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
  } = useChat()

  const isMobile = useIsMobile()

  // Mobile state: 'sidebar' | 'chat'
  const [mobilePanel, setMobilePanel] = useState<'sidebar' | 'chat'>('sidebar')

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id)
    if (isMobile) setMobilePanel('chat')
  }

  const handleBackToSidebar = () => {
    setMobilePanel('sidebar')
  }

  // ── DESKTOP: hai panel song song ─────────────────────────────────
  if (!isMobile) {
    return (
      <div className="flex w-screen overflow-hidden bg-background" style={{ height: '100dvh' }}>
        {/* Sidebar cố định 288px */}
        <div className="w-72 shrink-0 flex flex-col h-full border-r bg-card overflow-hidden">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectConversation={handleSelectConversation}
            onOpenChatWithFriend={(friend) => {
              openChatWithFriend(friend)
              if (isMobile) setMobilePanel('chat')
            }}
          />
        </div>

        {/* Chat chiếm phần còn lại */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            inputValue={currentInput}
            onInputChange={setCurrentInput}
            onSend={sendMessage}
            onBack={handleBackToSidebar}
          />
        </div>
      </div>
    )
  }

  // ── MOBILE: chỉ hiển thị 1 panel tại 1 thời điểm ─────────────────
  return (
    <div className="w-screen overflow-hidden bg-background" style={{ height: '100dvh' }}>
      {mobilePanel === 'sidebar' ? (
        // Panel sidebar — full screen
        <div className="flex flex-col w-full h-full bg-card">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectConversation={handleSelectConversation}
            onOpenChatWithFriend={(friend) => {
              openChatWithFriend(friend)
              setMobilePanel('chat')
            }}
          />
        </div>
      ) : (
        // Panel chat — full screen
        <div className="flex flex-col w-full h-full">
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            inputValue={currentInput}
            onInputChange={setCurrentInput}
            onSend={sendMessage}
            onBack={handleBackToSidebar}
          />
        </div>
      )}
    </div>
  )
}
