import type { User } from '../types/auth.types'

/**
 * Lấy tên hiển thị từ User.
 * Thứ tự ưu tiên: displayName → phần tên trong email → phone → 'Người dùng'
 */
export function getUserDisplayName(user: User | null | undefined): string {
  if (!user) return 'Người dùng'
  if (user.displayName) return user.displayName
  if (user.email) {
    // Lấy phần trước @ và capitalize
    const namePart = user.email.split('@')[0] ?? ''
    return namePart.charAt(0).toUpperCase() + namePart.slice(1)
  }
  if (user.phone) return user.phone
  return 'Người dùng'
}
