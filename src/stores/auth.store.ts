import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../features/auth/types/auth.types'
import { logoutApi } from '../api/endpoints/auth.api'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      // Lưu token + user sau khi đăng nhập thành công
      login: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      // Gọi API logout rồi xóa state local
      logout: async () => {
        try {
          await logoutApi()
        } catch {
          // Vẫn xóa local dù API lỗi (token hết hạn, mất mạng...)
        }
        set({ token: null, user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
