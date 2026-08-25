import { CONFIG } from '../config'
import { C, M } from '../theme'
import type { Screen } from '../types'

interface Props {
  screen: Screen
  onNavigate: (screen: Screen) => void
}

/**
 * Icons are drawn from borders rather than glyphs — the design uses no icon
 * font, and each mark reads at 16px in direct sun.
 */
const icon = (screen: Screen, color: string) => {
  switch (screen) {
    case 'play':
      return <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${color}` }} />
    case 'shots':
      return (
        <div
          style={{
            width: 16,
            height: 16,
            borderLeft: `2px solid ${color}`,
            borderBottom: `2px solid ${color}`,
            borderRadius: '0 0 0 3px',
          }}
        />
      )
    case 'card':
      return (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            border: `2px solid ${color}`,
            borderLeftWidth: 5,
          }}
        />
      )
    case 'summary':
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 16 }}>
          <div style={{ width: 3, height: 8, background: color }} />
          <div style={{ width: 3, height: 14, background: color }} />
          <div style={{ width: 3, height: 11, background: color }} />
        </div>
      )
    case 'friends':
      return (
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: '50% 50% 50% 3px',
            border: `2px solid ${color}`,
          }}
        />
      )
  }
}

const TABS: { screen: Screen; label: string }[] = [
  { screen: 'play', label: 'PLAY' },
  { screen: 'shots', label: 'SHOTS' },
  { screen: 'card', label: 'CARD' },
  { screen: 'summary', label: 'RECAP' },
  { screen: 'friends', label: 'GROUP' },
]

export default function TabBar({ screen, onNavigate }: Props) {
  return (
    <nav className="tabbar">
      {TABS.map((tab) => {
        const active = screen === tab.screen
        const color = active ? CONFIG.accent : C.dim
        return (
          <div
            key={tab.screen}
            className="tap"
            onClick={() => onNavigate(tab.screen)}
            role="button"
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 7,
              padding: '5px 0',
            }}
          >
            {icon(tab.screen, color)}
            <div style={{ font: M('500 8px/1'), letterSpacing: '.1em', color }}>
              {tab.label}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
