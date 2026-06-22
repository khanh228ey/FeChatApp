import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  style?: React.CSSProperties
}

export default function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        pointerEvents: 'all',
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(22px)',
        WebkitBackdropFilter: 'blur(22px)',
        border: '1px solid rgba(255,255,255,0.75)',
        borderRadius: '24px',
        padding: '40px 40px',
        width: '360px',
        boxShadow: '0 12px 48px rgba(80,140,60,0.18), 0 2px 8px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
