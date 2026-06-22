import { useAuthStore } from '../../stores/auth.store'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/common'
import styles from './HelloPage.module.css'

export default function HelloPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Xin chào! 🌿</h1>
        <p className={styles.email}>{user?.email || user?.phone || 'User'}</p>
        <p className={styles.userId}>ID: {user?.id}</p>
        <div style={{ width: '120px', margin: '0 auto' }}>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </div>
      </div>
    </div>
  )
}
