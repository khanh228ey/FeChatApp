import type { KeyboardEvent } from 'react'
import styles from './MessageInput.module.css'

interface MessageInputProps {
  value: string
  onChange: (val: string) => void
  onSend: () => void
  disabled?: boolean
}

export function MessageInput({ value, onChange, onSend, disabled = false }: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        {/* Emoji placeholder */}
        <button className={styles.iconBtn} type="button" title="Biểu cảm" aria-label="Biểu cảm">
          😊
        </button>

        <textarea
          id="chat-message-input"
          className={styles.textarea}
          placeholder="Nhập tin nhắn... (Enter để gửi)"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          aria-label="Nhập tin nhắn"
        />

        {/* Attachment placeholder */}
        <button className={styles.iconBtn} type="button" title="Đính kèm" aria-label="Đính kèm tệp">
          📎
        </button>

        <button
          id="chat-send-btn"
          className={`${styles.sendBtn} ${value.trim() ? styles.active : ''}`}
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Gửi tin nhắn"
          title="Gửi (Enter)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <p className={styles.hint}>Enter để gửi · Shift+Enter để xuống dòng</p>
    </div>
  )
}
