import type { AuthResponse, LoginRequest, RegisterRequest } from '../../features/auth/types/auth.types'
import { api } from '../client'

export async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/v1/auth/login', data)
  return res.data
}

export async function registerApi(data: RegisterRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/v1/auth/register', data)
  return res.data
}

export async function logoutApi(): Promise<void> {
  await api.post('/api/v1/auth/logout')
}
