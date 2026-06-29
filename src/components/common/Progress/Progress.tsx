import { Progress as ShadProgress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number          // 0–100
  label?: string
  showPercent?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'indigo' | 'emerald' | 'amber' | 'rose'
}

const colorMap = {
  indigo:  '[&>div]:bg-indigo-500',
  emerald: '[&>div]:bg-emerald-500',
  amber:   '[&>div]:bg-amber-500',
  rose:    '[&>div]:bg-rose-500',
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

/**
 * Progress common — wrapper Shadcn Progress với label + percent display.
 */
export default function Progress({
  value,
  label,
  showPercent = true,
  className,
  size = 'md',
  color = 'indigo',
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className={cn('flex flex-col gap-1.5 mb-3', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs font-semibold text-foreground/80">{label}</span>}
          {showPercent && (
            <span className="text-xs font-semibold text-muted-foreground">{clamped}%</span>
          )}
        </div>
      )}
      <ShadProgress
        value={clamped}
        className={cn(sizeMap[size], 'bg-muted', colorMap[color])}
      />
    </div>
  )
}
