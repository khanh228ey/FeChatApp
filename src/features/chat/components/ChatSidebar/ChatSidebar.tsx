import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, Users, Settings, UserPlus, LogOut, Check, X, Bell } from 'lucide-react'
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
import type { FriendResponse, PendingRequestItem } from '@/features/chat/types/friendship.types'
import {
  getFriendsApi,
  getPendingRequestsApi,
  acceptFriendRequestApi,
  rejectFriendRequestApi,
} from '@/api/endpoints/friendship.api'
import { AddFriendModal } from '../AddFriendModal/AddFriendModal'

type ActiveTab = 'messages' | 'contacts' | 'settings'

// ── Avatar gradient ──────────────────────────────────────────────
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

// ── Conversation row ─────────────────────────────────────────────
function ConvItem({ conv, isActive, onClick }: { conv: Conversation; isActive: boolean; onClick: () => void }) {
  const isOnline = conv.type === 'direct' ? (conv.participants[0]?.isOnline ?? false) : false
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
        isActive ? 'bg-indigo-50 dark:bg-indigo-950/40' : 'hover:bg-muted/60'
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

// ── Friend row (accepted) ────────────────────────────────────────
function FriendItem({ friend }: { friend: FriendResponse }) {
  const hue = stringToHue(friend.email)
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/60 transition-colors">
      <Avatar className="h-10 w-10 text-sm shrink-0">
        <AvatarFallback
          className="font-semibold text-white"
          style={{ background: `linear-gradient(135deg, hsl(${hue},65%,55%), hsl(${(hue + 40) % 360},70%,45%))` }}
        >
          {getInitials(friend.email)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate text-foreground">{friend.email}</p>
        <p className="text-xs text-emerald-500 font-medium">● Bạn bè</p>
      </div>
    </div>
  )
}

// ── Pending request row ──────────────────────────────────────────
function PendingItem({
  req,
  onAccept,
  onReject,
}: {
  req: PendingRequestItem
  onAccept: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}) {
  const hue = stringToHue(req.email)
  const [loading, setLoading] = useState<'accept' | 'reject' | null>(null)

  const handle = async (action: 'accept' | 'reject') => {
    setLoading(action)
    try {
      if (action === 'accept') await onAccept(req.friendship_id)
      else await onReject(req.friendship_id)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
      <Avatar className="h-9 w-9 text-xs shrink-0">
        <AvatarFallback
          className="font-semibold text-white"
          style={{ background: `linear-gradient(135deg, hsl(${hue},65%,55%), hsl(${(hue + 40) % 360},70%,45%))` }}
        >
          {getInitials(req.email)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate text-foreground">{req.email}</p>
        <p className="text-[11px] text-amber-600 font-medium">Muốn kết bạn với bạn</p>
      </div>
      {/* Actions */}
      <div className="flex gap-1 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="h-7 w-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
              onClick={() => handle('accept')}
              disabled={loading !== null}
            >
              {loading === 'accept' ? (
                <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Chấp nhận</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
              onClick={() => handle('reject')}
              disabled={loading !== null}
            >
              {loading === 'reject' ? (
                <span className="h-3 w-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Từ chối</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

// ── ChatSidebar ──────────────────────────────────────────────────
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

  const [activeTab, setActiveTab] = useState<ActiveTab>('messages')
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

  const [friends, setFriends] = useState<FriendResponse[]>([])
  const [pendingRequests, setPendingRequests] = useState<PendingRequestItem[]>([])
  const [loadingContacts, setLoadingContacts] = useState(false)

  const fetchContacts = useCallback(async () => {
    setLoadingContacts(true)
    try {
      const [friendsData, pendingData] = await Promise.all([
        getFriendsApi(),
        getPendingRequestsApi(),
      ])
      setFriends(friendsData.friends ?? [])
      setPendingRequests(pendingData.requests ?? [])
    } catch {
      // silent
    } finally {
      setLoadingContacts(false)
    }
  }, [])

  // Load contacts khi chuyển sang tab Danh bạ
  useEffect(() => {
    if (activeTab === 'contacts') {
      fetchContacts()
    }
  }, [activeTab, fetchContacts])

  // Poll pending requests số lượng (để hiện badge trên tab)
  useEffect(() => {
    getPendingRequestsApi()
      .then((d) => setPendingRequests(d.requests ?? []))
      .catch(() => {})
  }, [])

  const handleAccept = async (friendshipId: string) => {
    await acceptFriendRequestApi(friendshipId)
    // Xóa khỏi pending, thêm vào friends
    setPendingRequests((prev) => prev.filter((r) => r.friendship_id !== friendshipId))
    // Reload friends để lấy info mới
    getFriendsApi().then((d) => setFriends(d.friends ?? [])).catch(() => {})
  }

  const handleReject = async (friendshipId: string) => {
    await rejectFriendRequestApi(friendshipId)
    setPendingRequests((prev) => prev.filter((r) => r.friendship_id !== friendshipId))
  }

  const tabs = [
    { id: 'messages' as ActiveTab, icon: MessageSquare, label: 'Tin nhắn' },
    { id: 'contacts' as ActiveTab, icon: Users, label: 'Danh bạ' },
    { id: 'settings' as ActiveTab, icon: Settings, label: 'Cài đặt' },
  ]

  return (
    <>
      <aside className="flex flex-col w-full h-full shrink-0 border-r bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span className="font-bold text-base tracking-tight">CodeChill Chat</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="add-friend-btn"
                size="icon"
                className="h-8 w-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                onClick={() => setIsAddFriendOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Thêm bạn bè</TooltipContent>
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
          {tabs.map(({ id, icon: Icon, label }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === id ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-1.5 h-8 text-xs font-medium relative',
                    activeTab === id && 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40'
                  )}
                  onClick={() => setActiveTab(id)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  {/* Badge lời mời trên tab Danh bạ */}
                  {id === 'contacts' && pendingRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {pendingRequests.length}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator />

        {/* ── Tab: Tin nhắn ──────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <>
            <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0">
              Cuộc trò chuyện
            </p>
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
          </>
        )}

        {/* ── Tab: Danh bạ ───────────────────────────────────────── */}
        {activeTab === 'contacts' && (
          <ScrollArea className="flex-1 px-2">
            {loadingContacts ? (
              <p className="text-center text-sm text-muted-foreground py-8">Đang tải...</p>
            ) : (
              <div className="flex flex-col gap-3 py-2">

                {/* Lời mời đến */}
                {pendingRequests.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-1 pb-2">
                      <Bell className="h-3.5 w-3.5 text-amber-500" />
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-600">
                        Lời mời kết bạn · {pendingRequests.length}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {pendingRequests.map((req) => (
                        <PendingItem
                          key={req.friendship_id}
                          req={req}
                          onAccept={handleAccept}
                          onReject={handleReject}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Danh sách bạn bè */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground px-1 pb-2">
                    Bạn bè · {friends.length}
                  </p>
                  {friends.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                      <Users className="h-8 w-8 opacity-30" />
                      <p className="text-sm">Chưa có bạn bè</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 mt-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        onClick={() => setIsAddFriendOpen(true)}
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Thêm bạn bè ngay
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {friends.map((friend) => (
                        <FriendItem key={friend.id} friend={friend} />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </ScrollArea>
        )}

        {/* ── Tab: Cài đặt ───────────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Cài đặt (sắp ra mắt)</p>
          </div>
        )}

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

      <AddFriendModal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
        onFriendAdded={() => {
          if (activeTab === 'contacts') fetchContacts()
        }}
      />
    </>
  )
}
