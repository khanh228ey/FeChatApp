import { useNavigate } from 'react-router-dom'
import { useRegister } from '../../features/auth/hooks/useRegister'
import { Button, Card, Input, MeadowBackground } from '../../components/common'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    rePassword,
    setRePassword,
    loading,
    error,
    handleRegisterSubmit,
  } = useRegister()

  return (
    <div className={styles.container}>
      <MeadowBackground />

      <div className={styles.formWrapper}>
        <Card>
          <form onSubmit={handleRegisterSubmit}>
            <div className={styles.header}>
              <div className={styles.logo}>🌿</div>
              <h2 className={styles.title}>Đăng ký tài khoản</h2>
              <p className={styles.subtitle}>Tham gia đồng cỏ vô tận ngay hôm nay</p>
            </div>

            <Input
              label="Email hoặc Số điện thoại"
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
              placeholder="Tối thiểu 6 ký tự"
              required
            />

            <Input
              label="Nhập lại mật khẩu"
              type="password"
              value={rePassword}
              onChange={setRePassword}
              placeholder="••••••••"
              required
            />

            {error && <p className={styles.error}>{error}</p>}

            <Button type="submit" loading={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký ngay →'}
            </Button>

            <div className={styles.footerLinkContainer}>
              <span className={styles.footerLinkText}>Đã có tài khoản? </span>
              <span
                onClick={() => navigate('/login')}
                className={styles.footerLink}
              >
                Đăng nhập
              </span>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
