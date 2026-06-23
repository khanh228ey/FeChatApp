import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { registerService } from '../services/auth.service'
import { useAuthStore } from '../../../stores/auth.store'
import type { ApiError } from '../types/auth.types'

export function useRegister() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setError('Vui lòng nhập Email')
      return
    }

    if (!trimmedEmail.includes('@')) {
      setError('Email không hợp lệ')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự')
      return
    }

    if (password !== rePassword) {
      setError('Nhập lại mật khẩu không trùng khớp')
      return
    }

    setLoading(true)

    try {
      const result = await registerService({ email: trimmedEmail, password })
      login(result.token, result.user)
      navigate('/hello')
    } catch (err) {
      if (isAxiosError<ApiError>(err)) {
        setError(err.response?.data?.error ?? 'Đăng ký thất bại')
      } else {
        setError('Không thể kết nối server')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    rePassword,
    setRePassword,
    loading,
    error,
    handleRegisterSubmit,
  }
}
