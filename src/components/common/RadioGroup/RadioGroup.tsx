import { RadioGroup as ShadRadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

interface RadioGroupProps {
  label?: string
  value: string
  onChange: (val: string) => void
  options: RadioOption[]
  className?: string
  orientation?: 'vertical' | 'horizontal'
}

/**
 * RadioGroup common — wrapper Shadcn RadioGroup + Label.
 */
export default function RadioGroup({
  label,
  value,
  onChange,
  options,
  className,
  orientation = 'vertical',
}: RadioGroupProps) {
  return (
    <div className={cn('flex flex-col gap-1.5 mb-3', className)}>
      {label && (
        <span className="text-xs font-semibold text-foreground/80">{label}</span>
      )}
      <ShadRadioGroup
        value={value}
        onValueChange={onChange}
        className={cn(
          orientation === 'horizontal' ? 'flex flex-row gap-4 flex-wrap' : 'flex flex-col gap-2'
        )}
      >
        {options.map((opt) => (
          <div key={opt.value} className="flex items-start gap-2.5">
            <RadioGroupItem
              value={opt.value}
              id={opt.value}
              disabled={opt.disabled}
              className="border-indigo-300 text-indigo-600"
            />
            <div className="grid gap-0.5 leading-none">
              <Label htmlFor={opt.value} className="text-sm font-medium cursor-pointer">
                {opt.label}
              </Label>
              {opt.description && (
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              )}
            </div>
          </div>
        ))}
      </ShadRadioGroup>
    </div>
  )
}
