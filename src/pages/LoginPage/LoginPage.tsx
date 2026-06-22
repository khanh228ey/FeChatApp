import { useNavigate } from 'react-router-dom'
import { useLogin } from '../../features/auth/hooks/useLogin'
import { Button, Card, Input, MeadowBackground } from '../../components/common'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    handleLoginSubmit,
  } = useLogin()

  return (
    <div className={styles.container}>
      <MeadowBackground />

      <div className={styles.formWrapper}>
        <Card>
          <form onSubmit={handleLoginSubmit}>
            <div className={styles.header}>
              <div className={styles.logo}>🌿</div>
              <h2 className={styles.title}>Chào mừng</h2>
              <p className={styles.subtitle}>Đăng nhập để tiếp tục</p>
            </div>

            <Input
              label="Email hoặc SĐT"
              value={identifier}
              onChange={setIdentifier}
              placeholder="you@example.com hoặc 0901234567"
              required
            />

            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" loading={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập →'}
            </Button>

            <div className={styles.footerLinkContainer}>
              <span className={styles.footerLinkText}>Chưa có tài khoản? </span>
              <span
                onClick={() => navigate('/register')}
                className={styles.footerLink}
              >
                Đăng ký ngay
              </span>
            </div>

            <p className={styles.footnote}>🌾 Đồng cỏ vô tận đang chờ bạn</p>
          </form>
        </Card>
      </div>
    </div>
  )
}
