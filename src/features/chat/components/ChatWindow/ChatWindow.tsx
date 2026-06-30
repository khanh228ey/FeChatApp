import { Phone, Video, Info, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getInitials, stringToHue, formatTime } from '@/features/chat/utils/chat.utils'
import { cn } from '@/lib/utils'
import type { Conversation, Message, MessageStatus } from '@/features/chat/types/chat.types'
import { useRef, useEffect, type KeyboardEvent } from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'

// ── Small Avatar helper ─────────────────────────────────────────
function MiniAvatar({ name }: { name: string }) {
  const hue = stringToHue(name)
  return (
    <Avatar className="h-10 w-10 shrink-0">
      <AvatarFallback
        className="text-sm font-semibold text-white"
        style={{ background: `linear-gradient(135deg, hsl(${hue},65%,55%), hsl(${(hue + 40) % 360},70%,45%))` }}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}

// ── Message status icon ─────────────────────────────────────────
function StatusIcon({ status }: { status: MessageStatus }) {
  const map: Record<MessageStatus, { text: string; cls: string }> = {
    sending: { text: '○', cls: 'opacity-40' },
    sent:     { text: '✓', cls: 'opacity-60' },
    delivered:{ text: '✓✓', cls: 'opacity-80' },
    seen:     { text: '✓✓', cls: 'text-cyan-300' },
  }
  const { text, cls } = map[status]
  return <span className={cn('text-[10px] leading-none', cls)}>{text}</span>
}

// ── Message bubble ──────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  return (
    <div className={cn('flex animate-in fade-in slide-in-from-bottom-2 duration-200', message.isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[68%] rounded-2xl px-3.5 py-2.5',
          message.isOwn
            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
        <div className={cn('flex items-center gap-1 mt-1', message.isOwn ? 'justify-end' : 'justify-start')}>
          <span className={cn('text-[10px]', message.isOwn ? 'text-white/60' : 'text-muted-foreground')}>
            {formatTime(message.createdAt)}
          </span>
          {message.isOwn && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  )
}

// ── Empty conversation state ────────────────────────────────────
function EmptyMessages() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground p-8">
      <div className="text-5xl opacity-30">💬</div>
      <p className="text-sm">Bắt đầu cuộc trò chuyện nào!</p>
    </div>
  )
}

// ── Empty window state (no conv selected) ───────────────────────
function EmptyWindow() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 p-10 text-center">
      <div className="h-20 w-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-500">
        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <h3 className="font-bold text-xl text-foreground mb-1">Chọn một cuộc trò chuyện</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Chọn từ danh sách bên trái để bắt đầu nhắn tin ngay.
        </p>
      </div>
      <div className="flex gap-3 mt-2">
        {[
          { icon: '⚡', title: 'Nhanh chóng', desc: 'Tin nhắn tức thì, không độ trễ' },
          { icon: '🔍', title: 'Tìm kiếm', desc: 'Tìm nhanh người bạn muốn nhắn' },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="flex flex-col items-start gap-1 rounded-xl border bg-card p-3 max-w-[160px] text-left">
            <span className="text-xl">{icon}</span>
            <p className="text-xs font-semibold text-foreground">{title}</p>
            <p className="text-[11px] text-muted-foreground leading-snug">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Message Input ───────────────────────────────────────────────
function MessageInput({
  value,
  onChange,
  onSend,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
}) {
  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend() }
  }

  return (
    <div className="shrink-0 border-t bg-card px-4 py-3">
      <div className="flex items-center gap-2 rounded-2xl border bg-muted/40 px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/10 transition-all">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground" type="button">
          <Smile className="h-4 w-4" />
        </Button>
        <textarea
          id="chat-message-input"
          className="flex-1 bg-transparent text-sm resize-none outline-none py-0.5 max-h-28 placeholder:text-muted-foreground"
          placeholder="Nhập tin nhắn... (Enter để gửi)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          aria-label="Nhập tin nhắn"
        />
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground" type="button">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          id="chat-send-btn"
          size="icon"
          className={cn(
            'h-8 w-8 shrink-0 rounded-xl transition-all',
            value.trim()
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md hover:shadow-indigo-300/50 hover:scale-105'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
          disabled={!value.trim()}
          onClick={onSend}
          type="button"
          aria-label="Gửi tin nhắn"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-1.5">Enter để gửi · Shift+Enter để xuống dòng</p>
    </div>
  )
}

// ── ChatWindow ──────────────────────────────────────────────────
interface ChatWindowProps {
  conversation: Conversation | null
  messages: Message[]
  inputValue: string
  onInputChange: (val: string) => void
  onSend: () => void
  onBack?: () => void
}

export function ChatWindow({ conversation, messages, inputValue, onInputChange, onSend, onBack }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!conversation) return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Nút back mobile khi chưa chọn conv */}
      {onBack && (
        <div className="md:hidden flex items-center px-3 pt-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
      <EmptyWindow />
    </div>
  )

  const isOnline = conversation.type === 'direct' ? (conversation.participants[0]?.isOnline ?? false) : false

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 md:px-5 py-3 border-b bg-card shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          {/* Nút back — chỉ hiện trên mobile */}
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 shrink-0 -ml-1 text-muted-foreground hover:text-foreground"
              onClick={onBack}
              aria-label="Quay lại"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <MiniAvatar name={conversation.name} />
          <div>
            <h2 className="font-bold text-sm leading-tight">{conversation.name}</h2>
            <p className={cn('text-xs font-medium', isOnline ? 'text-emerald-500' : 'text-muted-foreground')}>
              {isOnline ? '● Đang hoạt động' : '○ Ngoại tuyến'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[
            { icon: Phone, label: 'Gọi thoại' },
            { icon: Video, label: 'Gọi video' },
            { icon: Info, label: 'Thông tin' },
          ].map(({ icon: Icon, label }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-indigo-600" type="button">
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>

      <Separator />

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        {messages.length === 0 ? (
          <EmptyMessages />
        ) : (
          <div className="flex flex-col gap-1.5 py-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <MessageInput value={inputValue} onChange={onInputChange} onSend={onSend} />
    </div>
  )
}
