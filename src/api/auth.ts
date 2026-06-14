import type { AuthResponse, LoginRequest } from '../types/auth'
import { api } from './client'

export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/v1/auth/login', data)
  return res.data
}

export async function logoutApi(): Promise<void> {
  await api.post('/api/v1/auth/logout')
}
