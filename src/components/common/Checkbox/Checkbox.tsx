import { Checkbox as ShadCheckbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  disabled?: boolean
  className?: string
  description?: string
}

/**
 * Checkbox common — wrapper Shadcn Checkbox + Label.
 */
export default function Checkbox({
  label,
  checked,
  onChange,
  id,
  disabled,
  className,
  description,
}: CheckboxProps) {
  const cbId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex items-start gap-2.5 mb-2', className)}>
      <ShadCheckbox
        id={cbId}
        checked={checked}
        onCheckedChange={(val) => onChange(Boolean(val))}
        disabled={disabled}
        className="border-indigo-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
      />
      <div className="grid gap-0.5 leading-none">
        <Label htmlFor={cbId} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  )
}
