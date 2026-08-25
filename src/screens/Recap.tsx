import { CONFIG } from '../config'
import { C, G, M } from '../theme'
import type { Derived } from '../lib/derive'
import type { Screen } from '../types'

interface Props {
  view: Derived
  onNavigate: (screen: Screen) => void
  onShare: () => void
}

const card: React.CSSProperties = {
  background: C.panel,
  border: `1px solid ${C.line}`,
  borderRadius: 14,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
}

const statLabel: React.CSSProperties = {
  font: M('400 8px/1'),
  letterSpacing: '.12em',
  color: C.mute,
}

export default function Recap({ view, onNavigate, onShare }: Props) {
  return (
    <div
      style={{
        padding: '4px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ font: G('600 17px/1') }}>Round recap</div>
        <div style={{ font: M('400 10px/1'), color: C.mute }}>
          {view.courseName} · TODAY · THRU {view.thru}
        </div>
      </div>

      <div
        style={{ display: 'flex', alignItems: 'flex-end', gap: 16, paddingBottom: 4 }}
      >
        <div style={{ font: M('700 76px/.8'), letterSpacing: '-.04em' }}>
          {view.totalScore}
        </div>
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 8 }}
        >
          <div style={{ font: M('600 20px/1'), color: CONFIG.accent }}>
            {view.deltaText}
          </div>
          <div style={{ font: M('400 9px/1'), letterSpacing: '.14em', color: C.mute }}>
            VS PAR {view.parThru}
          </div>
        </div>
      </div>

      {/* One bar per finished hole — par stays muted so birdies carry the accent. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ font: M('400 9px/1'), letterSpacing: '.16em', color: C.mute }}>
          HOLE BY HOLE
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            height: 74,
            borderBottom: `1px solid ${C.lineStrong}`,
          }}
        >
          {view.played.map((hole) => (
            <div
              key={hole.n}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 20,
                  borderRadius: '3px 3px 0 0',
                  height: hole.barH,
                  background: hole.color,
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {view.played.map((hole) => (
            <div
              key={hole.n}
              style={{
                flex: 1,
                textAlign: 'center',
                font: M('400 8px/1'),
                color: C.dim,
              }}
            >
              {hole.n}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={card}>
          <div style={{ font: M('700 19px/1'), color: CONFIG.accent }}>{view.birdies}</div>
          <div style={statLabel}>BIRDIES OR BETTER</div>
        </div>
        <div style={card}>
          <div style={{ font: M('700 19px/1') }}>{view.pars}</div>
          <div style={statLabel}>PARS</div>
        </div>
        <div style={card}>
          <div style={{ font: M('700 19px/1') }}>{view.girPct}%</div>
          <div style={statLabel}>GREENS IN REG</div>
        </div>
        <div style={card}>
          <div style={{ font: M('700 19px/1') }}>{view.puttsTotal}</div>
          <div style={statLabel}>PUTTS</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div
          className="tap hov-panel"
          onClick={() => onNavigate('card')}
          role="button"
          style={{
            flex: 1,
            border: `1px solid ${C.lineBright}`,
            borderRadius: 12,
            padding: 14,
            textAlign: 'center',
            font: G('600 13px/1'),
          }}
        >
          Edit card
        </div>
        <div
          className="tap hov-bright"
          onClick={onShare}
          role="button"
          style={{
            flex: 1,
            background: CONFIG.accent,
            color: C.onAccent,
            borderRadius: 12,
            padding: 14,
            textAlign: 'center',
            font: G('600 13px/1'),
          }}
        >
          Share round
        </div>
      </div>
    </div>
  )
}
