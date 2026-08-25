import { C, G, M } from '../theme'

interface Props {
  title: string
  /** Extra tracking on the rangefinder's "Hole n". */
  titleSpacing?: string
  par: number
  yards: number | string
  unitLabel: string
  onPrev: () => void
  onNext: () => void
}

const chip: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 10,
  border: `1px solid ${C.lineStrong}`,
  background: C.panel,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  font: M('500 15px'),
  color: C.sub,
}

/** Hole navigation, shared by the rangefinder and the shot-tracking screen. */
export default function HoleStepper({
  title,
  titleSpacing,
  par,
  yards,
  unitLabel,
  onPrev,
  onNext,
}: Props) {
  return (
    <div
      style={{
        padding: '4px 20px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div className="tap" style={chip} onClick={onPrev} role="button" aria-label="Previous hole">
        ‹
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      >
        <div style={{ font: G('600 15px/1'), letterSpacing: titleSpacing }}>{title}</div>
        <div style={{ font: M('400 10px/1'), letterSpacing: '.1em', color: C.mute }}>
          PAR {par} · {yards} {unitLabel}
        </div>
      </div>
      <div className="tap" style={chip} onClick={onNext} role="button" aria-label="Next hole">
        ›
      </div>
    </div>
  )
}
