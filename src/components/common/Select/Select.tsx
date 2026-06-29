import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  error?: string
  className?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Select common — wrapper Shadcn Select + Label.
 * options: [{ value, label, disabled? }]
 */
export default function Select({
  label,
  placeholder = 'Chọn...',
  value,
  onChange,
  options,
  error,
  className,
  id,
  required,
  disabled,
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-') ?? 'select'

  return (
    <div className={cn('flex flex-col gap-1.5 w-full mb-3', className)}>
      {label && (
        <Label htmlFor={selectId} className="text-xs font-semibold text-foreground/80">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      <ShadSelect value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          className={cn(
            'h-10 text-sm bg-background/70',
            'border-border focus:ring-indigo-400 focus:border-indigo-400',
            error && 'border-destructive focus:ring-destructive/40'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </ShadSelect>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  )
}
