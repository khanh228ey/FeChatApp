// Types khớp với response từ Go API
export interface User {
  id: string
  email?: string
  phone?: string
}

export interface LoginRequest {
  identifier: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  error: string
}
