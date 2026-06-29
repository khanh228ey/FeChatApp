import { Input as ShadInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface InputProps {
  label: string
  type?: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  required?: boolean
  error?: string
  className?: string
  id?: string
}

/**
 * Input common — wrapper Shadcn Input + Label.
 * API giữ nguyên (label, type, value, onChange, placeholder, required).
 * Thêm: error, className, id.
 */
export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  className,
  id,
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex flex-col gap-1.5 w-full mb-3', className)}>
      <Label htmlFor={inputId} className="text-xs font-semibold text-foreground/80">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <ShadInput
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        className={cn(
          'h-10 text-sm bg-background/70 backdrop-blur-sm',
          'border-border focus-visible:ring-indigo-400 focus-visible:border-indigo-400',
          error && 'border-destructive focus-visible:ring-destructive/40'
        )}
      />
      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  )
}
