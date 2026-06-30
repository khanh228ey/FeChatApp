import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  // Legacy compat
  style?: React.CSSProperties
  // Extended props
  title?: string
  description?: string
  footer?: ReactNode
  glass?: boolean  // glassmorphism style (giống card login cũ)
}

/**
 * Card common — wrapper Shadcn Card.
 * glass=true → style glassmorphism giống card login cũ.
 */
export default function Card({
  children,
  className,
  style,
  title,
  description,
  footer,
  glass = true,
}: CardProps) {
  return (
    <ShadCard
      className={cn(
        'border shadow-lg pointer-events-auto',
        glass && [
          'bg-white/55 backdrop-blur-2xl',
          'border-white/70',
          'shadow-[0_12px_48px_rgba(80,140,60,0.18),0_2px_8px_rgba(0,0,0,0.08)]',
        ],
        className
      )}
      style={style}
    >
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-xl font-bold">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn(!title && !description && 'pt-6', 'px-5 sm:px-6')}>
        {children}
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </ShadCard>
  )
}
