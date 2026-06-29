import styles from './ChatAvatar.module.css'
import { getInitials, stringToHue } from '../../utils/chat.utils'

interface ChatAvatarProps {
  name: string
  isOnline?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ChatAvatar({ name, isOnline = false, size = 'md' }: ChatAvatarProps) {
  const hue = stringToHue(name)
  const initials = getInitials(name)

  return (
    <div
      className={`${styles.avatar} ${styles[size]}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue},65%,55%), hsl(${(hue + 40) % 360},70%,45%))`,
      }}
      aria-label={name}
    >
      <span className={styles.initials}>{initials}</span>
      {isOnline && <span className={styles.onlineDot} aria-label="Đang online" />}
    </div>
  )
}
