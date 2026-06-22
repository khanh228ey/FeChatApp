import type { ReactNode } from 'react'

interface ButtonProps {
  type?: 'submit' | 'button' | 'reset'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
}

export default function Button({
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  const isButtonDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '13px',
        borderRadius: 12,
        border: 'none',
        background: isButtonDisabled
          ? 'rgba(86,171,47,0.4)'
          : 'linear-gradient(135deg, #56ab2f, #a8e063)',
        color: '#fff',
        fontSize: 15,
        fontWeight: 700,
        cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
        boxShadow: isButtonDisabled ? 'none' : '0 4px 16px rgba(86,171,47,0.4)',
        letterSpacing: '0.2px',
        transition: 'all 0.2s ease',
      }}
    >
      {children}
    </button>
  )
}
