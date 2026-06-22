import { useState } from 'react'

interface InputProps {
  label: string
  type?: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  required?: boolean
}

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: InputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: 14, width: '100%' }}>
      <label style={{ color: '#4a7a35', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.7)',
          border: focused ? '1.5px solid #56ab2f' : '1.5px solid rgba(86,171,47,0.3)',
          borderRadius: 12,
          padding: '12px 14px',
          color: '#2d4a1e',
          fontSize: 14,
          outline: 'none',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}
