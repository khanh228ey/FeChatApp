import { Textarea as ShadTextarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface TextareaProps {
  label?: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  rows?: number
  required?: boolean
  error?: string
  className?: string
  id?: string
  maxLength?: number
}

/**
 * Textarea common — wrapper Shadcn Textarea + Label + char count.
 */
export default function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  error,
  className,
  id,
  maxLength,
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? 'textarea'

  return (
    <div className={cn('flex flex-col gap-1.5 w-full mb-3', className)}>
      {label && (
        <Label htmlFor={inputId} className="text-xs font-semibold text-foreground/80">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <ShadTextarea
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!error}
        className={cn(
          'text-sm resize-none bg-background/70 backdrop-blur-sm',
          'border-border focus-visible:ring-indigo-400 focus-visible:border-indigo-400',
          error && 'border-destructive focus-visible:ring-destructive/40'
        )}
      />
      <div className="flex justify-between items-center">
        {error && <p className="text-xs text-destructive font-medium">{error}</p>}
        {maxLength && (
          <p className={cn('text-xs text-muted-foreground ml-auto', value.length > maxLength * 0.9 && 'text-orange-500')}>
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
