import { useAuthStore } from '../../stores/authStore'
import { useNavigate } from 'react-router-dom'

export default function HelloPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: 20,
        padding: '40px 48px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(86,171,47,0.15)',
      }}>
        <h1 style={{ color: '#2d5a1b', margin: '0 0 8px' }}>
          Xin chào! 🌿
        </h1>
        <p style={{ color: '#4a7a35', margin: '0 0 4px' }}>
          {user?.email || user?.phone || 'User'}
        </p>
        <p style={{ color: '#8ab87a', fontSize: 13, margin: '0 0 24px' }}>
          ID: {user?.id}
        </p>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, #56ab2f, #a8e063)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
