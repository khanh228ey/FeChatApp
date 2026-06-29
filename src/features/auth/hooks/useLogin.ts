import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { loginService } from '../services/auth.service'
import { useAuthStore } from '../../../stores/auth.store'
import type { ApiError } from '../types/auth.types'

export function useLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await loginService({ identifier, password })
      login(result.token, result.user)
      navigate('/chat')
    } catch (err) {
      if (isAxiosError<ApiError>(err)) {
        setError(err.response?.data?.error ?? 'Đăng nhập thất bại')
      } else {
        setError('Không thể kết nối server')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    handleLoginSubmit,
  }
}
