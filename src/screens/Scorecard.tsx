import { CONFIG } from '../config'
import { UNIT_LABEL } from '../lib/geo'
import Segmented from '../components/Segmented'
import { C, G, M } from '../theme'
import type { Derived, GridCell } from '../lib/derive'
import type { RoundApi } from '../state/useRound'
import type { CardMode, Fairway, Screen } from '../types'

interface Props {
  round: RoundApi
  view: Derived
  mode: CardMode
  onMode: (mode: CardMode) => void
  onNavigate: (screen: Screen) => void
}

const chipColors = (on: boolean) => ({
  background: on ? 'rgba(47,169,232,.16)' : C.well,
  color: on ? CONFIG.accent : C.sub,
  border: `1px solid ${on ? 'rgba(47,169,232,.5)' : 'rgba(255,255,255,.08)'}`,
})

const stepper: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: 16,
  background: C.well,
  border: `1px solid ${C.lineStrong}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  font: G('400 26px/1'),
  color: C.sub,
}

const rowLabel: React.CSSProperties = {
  width: 44,
  font: M('400 9px/1'),
  color: C.mute,
}

const totalCol: React.CSSProperties = {
  width: 32,
  textAlign: 'right',
}

const FAIRWAYS: { value: Fairway; label: string }[] = [
  { value: 'left', label: 'LEFT' },
  { value: 'hit', label: 'HIT' },
  { value: 'right', label: 'RIGHT' },
]

export default function Scorecard({ round, view, mode, onMode, onNavigate }: Props) {
  const { round: state } = round
  const hole = view.hole
  const score = view.currentScore
  const lastHole = state.holeCount || 18

  const saveAndAdvance = () => {
    round.setScore(hole, score)
    if (hole >= lastHole) onNavigate('summary')
    else round.goToHole(hole + 1)
  }

  /** One nine of the grid — header, pars, then the tappable score cells. */
  const nine = (title: string, cells: GridCell[], parTotal: number, scoreTotal: number | string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ font: M('400 9px/1'), letterSpacing: '.16em', color: C.mute }}>
        {title}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={rowLabel}>HOLE</div>
        {cells.map((cell) => (
          <div
            key={cell.n}
            style={{ flex: 1, textAlign: 'center', font: M('400 10px/1'), color: C.sub }}
          >
            {cell.n}
          </div>
        ))}
        <div style={{ ...totalCol, font: M('400 9px/1'), color: C.mute }}>TOT</div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '7px 0',
          borderTop: `1px solid ${C.line}`,
          borderBottom: `1px solid ${C.line}`,
        }}
      >
        <div style={rowLabel}>PAR</div>
        {cells.map((cell) => (
          <div
            key={cell.n}
            style={{ flex: 1, textAlign: 'center', font: M('400 11px/1'), color: C.mute }}
          >
            {cell.par}
          </div>
        ))}
        <div style={{ ...totalCol, font: M('400 11px/1'), color: C.mute }}>{parTotal}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', paddingTop: 5 }}>
        <div style={rowLabel}>SCORE</div>
        {cells.map((cell) => (
          <div
            key={cell.n}
            className="tap"
            onClick={() => {
              round.goToHole(cell.n)
              onNavigate('card')
            }}
            role="button"
            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
          >
            <div
              style={{
                width: 26,
                height: 30,
                borderRadius: 7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                font: M('500 13px/1'),
                color: cell.color,
                background: cell.bg,
                border: `1px solid ${cell.bd}`,
              }}
            >
              {cell.score}
            </div>
          </div>
        ))}
        <div style={{ ...totalCol, font: M('700 13px/1') }}>{scoreTotal}</div>
      </div>
    </div>
  )

  return (
    <div
      style={{
        padding: '4px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ font: G('600 17px/1') }}>Scorecard</div>
          <div style={{ font: M('400 10px/1'), color: C.mute }}>
            {view.courseName} · THRU {view.thru}
          </div>
        </div>
        <Segmented
          value={mode}
          onChange={onMode}
          options={[
            { value: 'tap', label: 'TAP' },
            { value: 'grid', label: 'GRID' },
          ]}
        />
      </div>

      {mode === 'tap' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              background: C.panel,
              border: `1px solid ${C.line}`,
              borderRadius: 18,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ font: G('600 15px/1') }}>Hole {hole}</div>
              <div
                style={{ font: M('400 10px/1'), letterSpacing: '.1em', color: C.mute }}
              >
                PAR {view.par} · {view.holeYards} {UNIT_LABEL}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
              }}
            >
              <div
                className="tap hov-line"
                onClick={() => round.setScore(hole, Math.max(1, score - 1))}
                role="button"
                aria-label="One fewer stroke"
                style={stepper}
              >
                −
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <div style={{ font: M('700 62px/.85'), color: view.currentColor }}>
                  {score}
                </div>
                <div
                  style={{
                    font: M('400 10px/1'),
                    letterSpacing: '.14em',
                    color: view.currentColor,
                    textTransform: 'uppercase',
                  }}
                >
                  {view.currentLabel}
                </div>
              </div>
              <div
                className="tap hov-line"
                onClick={() => round.setScore(hole, Math.min(12, score + 1))}
                role="button"
                aria-label="One more stroke"
                style={stepper}
              >
                +
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 11,
                borderTop: `1px solid ${C.line}`,
                paddingTop: 16,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{ font: M('400 10px/1'), letterSpacing: '.12em', color: C.mute }}
                >
                  PUTTS
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0, 1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="tap"
                      onClick={() => round.setPutts(hole, n)}
                      role="button"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        font: M('500 12px/1'),
                        ...chipColors(state.putts[view.idx] === n),
                      }}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{ font: M('400 10px/1'), letterSpacing: '.12em', color: C.mute }}
                >
                  TEE SHOT
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {FAIRWAYS.map((fw) => (
                    <div
                      key={fw.value}
                      className="tap"
                      onClick={() => round.setFairway(hole, fw.value)}
                      role="button"
                      style={{
                        padding: '9px 12px',
                        borderRadius: 10,
                        font: M('500 10px/1'),
                        letterSpacing: '.06em',
                        ...chipColors(state.fw[view.idx] === fw.value),
                      }}
                    >
                      {fw.label}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{ font: M('400 10px/1'), letterSpacing: '.12em', color: C.mute }}
                >
                  GREEN IN REG
                </div>
                <div
                  className="tap"
                  onClick={() => round.toggleGir(hole)}
                  role="switch"
                  aria-checked={state.gir[view.idx]}
                  style={{
                    width: 52,
                    height: 30,
                    borderRadius: 15,
                    padding: 3,
                    background: state.gir[view.idx] ? CONFIG.accent : C.well,
                    display: 'flex',
                    justifyContent: state.gir[view.idx] ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: C.text,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div
              className="tap"
              onClick={round.prevHole}
              role="button"
              aria-label="Previous hole"
              style={{
                width: 56,
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                font: M('400 15px'),
                color: C.sub,
              }}
            >
              ‹
            </div>
            <div
              className="tap hov-bright"
              onClick={saveAndAdvance}
              role="button"
              style={{
                flex: 1,
                background: CONFIG.accent,
                color: C.onAccent,
                borderRadius: 12,
                padding: 15,
                textAlign: 'center',
                font: G('600 14px/1'),
              }}
            >
              {hole >= lastHole ? 'Finish round' : `Save · hole ${hole + 1}`}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              background: C.panel,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
            }}
          >
            <div
              style={{ font: M('400 10px/1'), letterSpacing: '.12em', color: C.mute }}
            >
              RUNNING TOTAL
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ font: M('700 20px/1') }}>{view.totalScore}</div>
              <div style={{ font: M('500 12px/1'), color: CONFIG.accent }}>
                {view.deltaText}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {nine('OUT', view.front9, view.parOut, view.scoreOut)}
          {nine('IN', view.back9, view.parIn, view.scoreIn)}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 16px',
              background: C.panel,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
            }}
          >
            <div
              style={{ font: M('400 10px/1'), letterSpacing: '.12em', color: C.mute }}
            >
              TOTAL · THRU {view.thru}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ font: M('700 22px/1') }}>{view.totalScore}</div>
              <div style={{ font: M('500 12px/1'), color: CONFIG.accent }}>
                {view.deltaText}
              </div>
            </div>
          </div>

          <div style={{ font: M('400 9px/1.5'), color: C.dim }}>
            TAP ANY CELL TO JUMP TO THAT HOLE
          </div>
        </div>
      )}
    </div>
  )
}
