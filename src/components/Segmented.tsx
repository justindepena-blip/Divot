import { CONFIG } from '../config'
import { C, M } from '../theme'

interface Props<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  /** TAP/GRID sits at 7px, GROSS/NET at 8px in the design. */
  padY?: number
}

/** Two-up pill switch: selected segment fills with the accent. */
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  padY = 7,
}: Props<T>) {
  return (
    <div
      style={{
        display: 'flex',
        background: C.panel,
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 10,
        padding: 3,
      }}
    >
      {options.map((option) => {
        const on = option.value === value
        return (
          <div
            key={option.value}
            className="tap"
            onClick={() => onChange(option.value)}
            role="button"
            aria-pressed={on}
            style={{
              padding: `${padY}px 11px`,
              borderRadius: 7,
              font: M('500 10px/1'),
              letterSpacing: '.08em',
              background: on ? CONFIG.accent : 'transparent',
              color: on ? C.onAccent : C.sub,
            }}
          >
            {option.label}
          </div>
        )
      })}
    </div>
  )
}
