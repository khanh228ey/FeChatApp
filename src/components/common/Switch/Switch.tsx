import { Switch as ShadSwitch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
  disabled?: boolean
  className?: string
  description?: string
}

/**
 * Switch (toggle) common — wrapper Shadcn Switch + Label.
 */
export default function Switch({
  label,
  checked,
  onChange,
  id,
  disabled,
  className,
  description,
}: SwitchProps) {
  const swId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={cn('flex items-center justify-between gap-3 mb-2', className)}>
      <div className="grid gap-0.5">
        <Label htmlFor={swId} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <ShadSwitch
        id={swId}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="data-[state=checked]:bg-indigo-600"
      />
    </div>
  )
}
