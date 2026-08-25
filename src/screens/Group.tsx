import { CONFIG } from '../config'
import Segmented from '../components/Segmented'
import { FEED, buildBoard } from '../lib/leaderboard'
import { C, G, M } from '../theme'
import type { Derived } from '../lib/derive'
import type { BoardMode } from '../types'

interface Props {
  view: Derived
  mode: BoardMode
  onMode: (mode: BoardMode) => void
  onShare: () => void
}

const statCard: React.CSSProperties = {
  flex: 1,
  background: C.panel,
  border: `1px solid ${C.line}`,
  borderRadius: 14,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 7,
}

const statLabel: React.CSSProperties = {
  font: M('400 8px/1.2'),
  letterSpacing: '.12em',
  color: C.mute,
}

export default function Group({ view, mode, onMode, onShare }: Props) {
  const total = typeof view.totalScore === 'number' ? view.totalScore : 0
  const board = buildBoard(mode, view.delta, total, view.thru)

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
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ font: G('600 17px/1') }}>Saturday Group</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: CONFIG.accent,
              }}
            />
            <div
              style={{
                font: M('400 10px/1'),
                letterSpacing: '.1em',
                color: C.mute,
                whiteSpace: 'nowrap',
              }}
            >
              LIVE · 4 PLAYERS
            </div>
          </div>
        </div>
        <Segmented
          value={mode}
          onChange={onMode}
          padY={8}
          options={[
            { value: 'gross', label: 'GROSS' },
            { value: 'net', label: 'NET' },
          ]}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {board.map((player) => (
          <div
            key={player.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 13,
              padding: '14px 15px',
              borderRadius: 14,
              background: player.bg,
              border: `1px solid ${player.bd}`,
            }}
          >
            <div style={{ width: 20, font: M('500 12px/1'), color: C.mute }}>
              {player.pos}
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: C.well,
                border: `1px solid ${C.lineStrong}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                font: M('500 11px/1'),
                color: C.sub,
              }}
            >
              {player.initials}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ font: G('500 13px/1'), color: player.nameColor }}>
                {player.name}
              </div>
              <div style={{ font: M('400 10px/1'), color: C.mute }}>
                THRU {player.thru} · HCP {player.hcp}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 11 }}>
              <div style={{ font: M('500 13px/1'), color: player.relColor }}>
                {player.rel}
              </div>
              <div style={{ font: M('700 17px/1') }}>{player.total}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={statCard}>
          <div style={{ font: M('700 19px/1'), color: CONFIG.accent }}>2</div>
          <div style={statLabel}>SKINS WON</div>
        </div>
        <div style={statCard}>
          <div style={{ font: M('700 19px/1') }}>1 UP</div>
          <div style={statLabel}>MATCH VS DANA</div>
        </div>
        <div style={statCard}>
          <div style={{ font: M('700 19px/1') }}>14</div>
          <div style={statLabel}>TEAM PTS</div>
        </div>
      </div>

      <div
        className="tap hov-panel"
        onClick={onShare}
        role="button"
        style={{
          border: `1px solid ${C.lineBright}`,
          borderRadius: 12,
          padding: 14,
          textAlign: 'center',
          font: G('600 13px/1'),
        }}
      >
        Invite friends to this round
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ font: M('400 9px/1'), letterSpacing: '.16em', color: C.mute }}>
          GROUP FEED
        </div>
        {FEED.map((entry) => (
          <div
            key={entry.text}
            style={{
              display: 'flex',
              gap: 12,
              padding: '12px 0',
              borderTop: `1px solid ${C.line}`,
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                marginTop: 6,
                background: entry.color,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, font: G('400 12px/1.5'), color: C.soft }}>
              {entry.text}
            </div>
            <div style={{ font: M('400 9px/1'), color: C.dim, paddingTop: 3 }}>
              {entry.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
