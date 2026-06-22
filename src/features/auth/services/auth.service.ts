import * as authApi from '../../../api/endpoints/auth.api'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types'

export async function loginService(data: LoginRequest): Promise<AuthResponse> {
  return authApi.loginApi(data)
}

export async function registerService(data: RegisterRequest): Promise<AuthResponse> {
  return authApi.registerApi(data)
}
