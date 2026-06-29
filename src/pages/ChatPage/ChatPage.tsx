import styles from './ChatPage.module.css'
import { ChatSidebar } from '../../features/chat/components/ChatSidebar/ChatSidebar'
import { ChatWindow } from '../../features/chat/components/ChatWindow/ChatWindow'
import { useChat } from '../../features/chat/hooks/useChat'

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
  } = useChat()

  return (
    <div className={styles.layout}>
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectConversation={setActiveConversationId}
      />
      <ChatWindow
        conversation={activeConversation}
        messages={activeMessages}
        inputValue={currentInput}
        onInputChange={setCurrentInput}
        onSend={sendMessage}
      />
    </div>
  )
}
