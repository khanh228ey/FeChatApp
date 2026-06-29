import { Slider as ShadSlider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface SliderProps {
  label?: string
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
  showValue?: boolean
  unit?: string
  disabled?: boolean
}

/**
 * Slider common — wrapper Shadcn Slider với hiển thị giá trị.
 */
export default function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
  showValue = true,
  unit = '',
  disabled,
}: SliderProps) {
  return (
    <div className={cn('flex flex-col gap-2 mb-3', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <Label className="text-xs font-semibold text-foreground/80">{label}</Label>}
          {showValue && (
            <span className="text-xs font-semibold text-indigo-600">{value}{unit}</span>
          )}
        </div>
      )}
      <ShadSlider
        value={[value]}
        onValueChange={([v]) => onChange(v ?? 0)}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="[&_[role=slider]]:border-indigo-500 [&_[role=slider]]:bg-indigo-600 [&_.range]:bg-indigo-500"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}
