import { Button as ShadButton } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ButtonProps {
  type?: 'submit' | 'button' | 'reset'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  fullWidth?: boolean
}

/**
 * Button common — wrapper của Shadcn Button.
 * API giữ nguyên (type, loading, disabled, onClick, children).
 * Thêm: variant, size, className, fullWidth.
 */
export default function Button({
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  children,
  variant = 'default',
  size = 'default',
  className,
  fullWidth = true,
}: ButtonProps) {
  return (
    <ShadButton
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      variant={variant}
      size={size}
      className={cn(
        fullWidth && 'w-full',
        'font-semibold transition-all',
        variant === 'default' && 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md hover:shadow-indigo-300/40',
        className
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </span>
      ) : children}
    </ShadButton>
  )
}
