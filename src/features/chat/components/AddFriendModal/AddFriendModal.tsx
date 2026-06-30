import { useState, useRef, useCallback } from 'react'
import { UserPlus, Search, X, CheckCircle2, Loader2, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { searchUserByEmailApi, sendFriendRequestApi } from '@/api/endpoints/friendship.api'
import type { SearchUserResult } from '@/features/chat/types/friendship.types'
import { getInitials, stringToHue } from '@/features/chat/utils/chat.utils'

interface AddFriendModalProps {
  isOpen: boolean
  onClose: () => void
  onFriendAdded: () => void
}

type SearchState = 'idle' | 'loading' | 'found' | 'not_found' | 'error'
type AddState = 'idle' | 'loading' | 'success' | 'already'

export function AddFriendModal({ isOpen, onClose, onFriendAdded }: AddFriendModalProps) {
  const [email, setEmail] = useState('')
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const [addState, setAddState] = useState<AddState>('idle')
  const [foundUser, setFoundUser] = useState<SearchUserResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    setFoundUser(null)
    setAddState('idle')
    setErrorMsg('')

    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = value.trim()
    if (!trimmed || !trimmed.includes('@')) {
      setSearchState('idle')
      return
    }

    setSearchState('loading')
    debounceRef.current = setTimeout(async () => {
      try {
        const user = await searchUserByEmailApi(trimmed)
        setFoundUser(user)
        setSearchState('found')
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setSearchState('not_found')
        } else {
          setSearchState('error')
          setErrorMsg('Có lỗi xảy ra, vui lòng thử lại')
        }
      }
    }, 600)
  }, [])

  const handleAddFriend = async () => {
    if (!foundUser) return
    setAddState('loading')
    try {
      await sendFriendRequestApi(foundUser.id)
      setAddState('success')
      onFriendAdded()
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setAddState('already')
      } else {
        setAddState('idle')
        setErrorMsg('Kết bạn thất bại, vui lòng thử lại')
      }
    }
  }

  const handleClose = () => {
    setEmail('')
    setSearchState('idle')
    setAddState('idle')
    setFoundUser(null)
    setErrorMsg('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
        <div
          className="relative w-full md:max-w-md rounded-t-2xl md:rounded-2xl border bg-card shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 md:zoom-in-95 duration-200 pb-safe"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag handle — only mobile */}
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/60">
                <UserPlus className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Thêm bạn bè</h2>
                <p className="text-xs text-muted-foreground">Nhập email để tìm kiếm</p>
              </div>
            </div>
            <Button
              id="add-friend-modal-close"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search input */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="add-friend-email-input"
                type="email"
                placeholder="Nhập email bạn bè..."
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="pl-9 h-10 bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-indigo-400"
                autoFocus
              />
              {searchState === 'loading' && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-500 animate-spin" />
              )}
            </div>
          </div>

          {/* Result area */}
          <div className="px-6 pb-6 min-h-[80px]">
            {searchState === 'idle' && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Nhập email để tìm người dùng
              </p>
            )}

            {searchState === 'not_found' && (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                <Search className="h-4 w-4" />
                Không tìm thấy người dùng với email này
              </div>
            )}

            {(searchState === 'error') && (
              <p className="text-center text-sm text-destructive py-4">{errorMsg}</p>
            )}

            {searchState === 'found' && foundUser && (
              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className="font-semibold text-white text-sm"
                      style={{
                        background: `linear-gradient(135deg, hsl(${stringToHue(foundUser.email)},65%,55%), hsl(${(stringToHue(foundUser.email) + 40) % 360},70%,45%))`,
                      }}
                    >
                      {getInitials(foundUser.email)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{foundUser.email}</p>
                  <p className="text-xs text-muted-foreground">ID: {foundUser.id.slice(0, 8)}...</p>
                </div>

                {/* Action button */}
                {addState === 'success' ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                    Đã gửi lời mời
                  </div>
                ) : addState === 'already' ? (
                  <div className="flex items-center gap-1.5 text-indigo-500 text-sm font-medium shrink-0">
                    <UserCheck className="h-4 w-4" />
                    Đã gửi trước đó
                  </div>
                ) : (
                  <Button
                    id="add-friend-confirm-btn"
                    size="sm"
                    className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white h-8 px-3 gap-1.5"
                    onClick={handleAddFriend}
                    disabled={addState === 'loading'}
                  >
                    {addState === 'loading' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="h-3.5 w-3.5" />
                    )}
                    Gửi lời mời
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
