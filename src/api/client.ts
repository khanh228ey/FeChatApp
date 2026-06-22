import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

// Axios instance dùng chung — tự gắn token vào mọi request
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: gắn Bearer token nếu user đã đăng nhập
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: tự logout khi token hết hạn / không hợp lệ
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = useAuthStore.getState().token
      if (token) {
        // Chỉ logout khi đang đăng nhập mà token hết hạn
        useAuthStore.getState().logout()
      }
      // Nếu chưa có token (đang login fail) → bỏ qua, để loginApi tự handle lỗi
    }
    return Promise.reject(error)
  },
)