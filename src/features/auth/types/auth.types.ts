export interface User {
  id: string
  email?: string
  phone?: string
  displayName?: string   // Tên hiển thị (API trả về, hoặc fallback email/phone)
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  error: string
}
