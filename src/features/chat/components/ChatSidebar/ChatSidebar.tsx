import { MessageSquare, Users, Settings, Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAuthStore } from '@/stores/auth.store'
import { getUserDisplayName } from '@/features/auth/utils/auth.utils'
import { getInitials, stringToHue, formatRelativeTime } from '@/features/chat/utils/chat.utils'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/features/chat/types/chat.types'

// ── Avatar có màu gradient theo tên ────────────────────────────
function UserAvatar({ name, isOnline = false, size = 'md' }: { name: string; isOnline?: boolean; size?: 'sm' | 'md' }) {
  const hue = stringToHue(name)
  const sizeClass = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'

  return (
    <div className="relative inline-flex shrink-0">
      <Avatar className={sizeClass}>
        <AvatarFallback
          className="font-semibold text-white"
          style={{ background: `linear-gradient(135deg, hsl(${hue},65%,55%), hsl(${(hue + 40) % 360},70%,45%))` }}
        >
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
      )}
    </div>
  )
}

// ── Conversation row ────────────────────────────────────────────
function ConvItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation
  isActive: boolean
  onClick: () => void
}) {
  const isOnline = conv.type === 'direct' ? (conv.participants[0]?.isOnline ?? false) : false

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
        isActive
          ? 'bg-indigo-50 dark:bg-indigo-950/40'
          : 'hover:bg-muted/60'
      )}
    >
      <UserAvatar name={conv.name} isOnline={isOnline} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className={cn('text-sm font-semibold truncate', isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-foreground')}>
            {conv.type === 'group' && <span className="mr-1">👥</span>}
            {conv.name}
          </span>
          {conv.lastMessage && (
            <span className="text-[11px] text-muted-foreground shrink-0">
              {formatRelativeTime(conv.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-muted-foreground truncate flex-1">
            {conv.lastMessage?.content ?? 'Chưa có tin nhắn'}
          </p>
          {conv.unreadCount > 0 && (
            <Badge className="h-4 min-w-4 px-1 text-[10px] bg-indigo-500 hover:bg-indigo-500 shrink-0">
              {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </button>
  )
}

// ── ChatSidebar ─────────────────────────────────────────────────
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
    <aside className="flex flex-col w-72 shrink-0 border-r bg-card h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💬</span>
          <span className="font-bold text-base tracking-tight">CodeChill Chat</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button id="chat-new-btn" size="sm" className="h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-3.5 w-3.5" />
              Mới
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tạo cuộc trò chuyện mới</TooltipContent>
        </Tooltip>
      </div>

      {/* Search */}
      <div className="px-3 pb-3 shrink-0">
        <Input
          id="chat-search-input"
          placeholder="Tìm kiếm cuộc trò chuyện..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 text-sm bg-muted border-0 focus-visible:ring-1 focus-visible:ring-indigo-400"
        />
      </div>

      {/* Nav tabs */}
      <div className="flex gap-1 px-3 pb-2 shrink-0">
        {[
          { icon: MessageSquare, label: 'Tin nhắn', active: true },
          { icon: Users, label: 'Danh bạ', active: false },
          { icon: Settings, label: 'Cài đặt', active: false },
        ].map(({ icon: Icon, label, active }) => (
          <Tooltip key={label}>
            <TooltipTrigger asChild>
              <Button
                variant={active ? 'secondary' : 'ghost'}
                size="sm"
                className={cn('gap-1.5 h-8 text-xs font-medium', active && 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40')}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <Separator />

      {/* Label */}
      <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
        Cuộc trò chuyện
      </p>

      {/* List */}
      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-0.5 py-1">
          {conversations.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">Không tìm thấy kết quả</p>
          ) : (
            conversations.map((conv) => (
              <ConvItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeConversationId}
                onClick={() => onSelectConversation(conv.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <Separator />
      <div className="flex items-center gap-2.5 px-3 py-3 shrink-0">
        <UserAvatar name={displayName} isOnline size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{displayName}</p>
          <p className="text-[11px] text-emerald-500 font-medium">● Đang hoạt động</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="chat-logout-btn"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={logout}
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Đăng xuất</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  )
}
