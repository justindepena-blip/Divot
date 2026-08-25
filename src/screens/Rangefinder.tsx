import { CONFIG } from '../config'
import { UNIT_LABEL } from '../lib/geo'
import HoleMap from '../components/HoleMap'
import HoleStepper from '../components/HoleStepper'
import MapFrame from '../components/MapFrame'
import { C, G, M, tint } from '../theme'
import type { Derived } from '../lib/derive'
import type { Gps } from '../state/useGeolocation'
import type { RoundApi } from '../state/useRound'
import type { LatLng, Screen } from '../types'

interface Props {
  round: RoundApi
  view: Derived
  gps: Gps
  shots: LatLng[]
  onOpenSheet: () => void
  onNavigate: (screen: Screen) => void
}

const stat: React.CSSProperties = {
  flex: 1,
  background: C.panel,
  border: `1px solid ${C.line}`,
  borderRadius: 12,
  padding: 11,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
}

const statLabel = (color: string): React.CSSProperties => ({
  font: M('400 8px/1'),
  letterSpacing: '.12em',
  color,
})

export default function Rangefinder({
  round,
  view,
  gps,
  shots,
  onOpenSheet,
  onNavigate,
}: Props) {
  const { round: state } = round
  const locked = gps.state === 'locked'
  const gpsColor = locked ? CONFIG.accent : C.gpsWarn

  const gpsLabel =
    gps.state === 'error'
      ? (gps.error ?? 'Location unavailable').toUpperCase()
      : gps.pos
        ? `GPS FIX · ±${gps.pos.acc} M`
        : 'ACQUIRING SATELLITES…'

  const mapHint = state.course
    ? view.pin
      ? `HOLE ${view.hole} · PIN FROM MAP DATA · TAP TO ADJUST`
      : `HOLE ${view.hole} · TAP THE GREEN TO SET THE PIN`
    : 'PICK A COURSE TO LOAD SATELLITE VIEW'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Course bar — opens the search sheet. */}
      <div
        className="tap hov-accent-border"
        onClick={onOpenSheet}
        role="button"
        style={{
          margin: '4px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: C.panel,
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 12,
          padding: '11px 14px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ font: G('500 13px/1') }}>{view.courseName}</div>
          <div style={{ font: M('400 9px/1'), letterSpacing: '.1em', color: C.mute }}>
            {view.teeName} TEES · PAR {view.coursePar} · {view.courseLength} {UNIT_LABEL}
          </div>
        </div>
        <div style={{ font: M('400 11px/1'), color: CONFIG.accent }}>CHANGE</div>
      </div>

      {/* Live GPS status. */}
      <div
        style={{
          margin: '0 20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 13px',
          borderRadius: 11,
          background: locked ? tint.fillSoft : 'rgba(217,169,74,.07)',
          border: `1px solid ${locked ? tint.border : 'rgba(217,169,74,.24)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div
            style={{ width: 6, height: 6, borderRadius: '50%', background: gpsColor }}
          />
          <div
            style={{ font: M('400 9px/1'), letterSpacing: '.1em', color: gpsColor }}
          >
            {gpsLabel}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            className="tap hov-accent-text"
            onClick={() => gps.pos && round.setPin(gps.pos)}
            role="button"
            style={{
              font: M('500 9px/1'),
              letterSpacing: '.08em',
              color: CONFIG.accent,
            }}
          >
            {view.pin ? 'PIN SET' : 'TAP MAP FOR PIN'}
          </div>
          <div
            className="tap hov-soft"
            onClick={gps.retry}
            role="button"
            style={{ font: M('400 9px/1'), letterSpacing: '.08em', color: C.mute }}
          >
            RETRY
          </div>
        </div>
      </div>

      <HoleStepper
        title={`Hole ${view.hole}`}
        titleSpacing=".02em"
        par={view.par}
        yards={view.holeYards}
        unitLabel={UNIT_LABEL}
        onPrev={round.prevHole}
        onNext={round.nextHole}
      />

      <MapFrame hint={mapHint}>
        <HoleMap
          variant="play"
          course={state.course}
          hole={view.hole}
          pin={view.pin}
          pos={gps.pos}
          shots={shots}
          onPickPin={round.setPin}
        />
        <div
          style={{
            position: 'absolute',
            right: 12,
            bottom: 26,
            zIndex: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 5,
            background: 'rgba(11,13,14,.82)',
            border: `1px solid ${C.lineStrong}`,
            borderRadius: 8,
            padding: '7px 9px',
          }}
        >
          <div style={{ font: M('400 8px/1'), letterSpacing: '.12em', color: C.mute }}>
            PLAYS LIKE
          </div>
          <div style={{ font: M('500 12px/1'), color: CONFIG.accent }}>
            {view.playsLike} {UNIT_LABEL}
          </div>
        </div>
      </MapFrame>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* The number you actually look at, mid-fairway, at arm's length. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <div style={{ font: M('700 82px/.8'), letterSpacing: '-.04em' }}>
            {view.toPin}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
              paddingBottom: 8,
            }}
          >
            <div
              style={{ font: M('400 11px/1'), letterSpacing: '.16em', color: C.mute }}
            >
              {UNIT_LABEL} TO PIN
            </div>
            <div
              style={{
                font: M('400 8px/1.3'),
                letterSpacing: '.1em',
                color: view.pinSourceColor,
                maxWidth: 120,
              }}
            >
              {view.pinSource}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={stat}>
            <div style={{ font: M('500 16px/1') }}>{view.front}</div>
            <div style={statLabel(C.mute)}>FRONT</div>
          </div>
          <div style={stat}>
            <div style={{ font: M('500 16px/1') }}>{view.toPin}</div>
            <div style={statLabel(CONFIG.accent)}>PIN</div>
          </div>
          <div style={stat}>
            <div style={{ font: M('500 16px/1') }}>{view.back}</div>
            <div style={statLabel(C.mute)}>BACK</div>
          </div>
        </div>

        {/* Club pick follows the distance left, so it changes hole to hole. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: tint.fill,
            border: `1px solid ${tint.border}`,
            borderRadius: 12,
            padding: '13px 15px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div
              style={{
                font: M('400 8px/1'),
                letterSpacing: '.14em',
                color: CONFIG.accent,
              }}
            >
              SUGGESTED CLUB
            </div>
            <div style={{ font: G('600 15px/1') }}>{view.club}</div>
          </div>
          <div style={{ font: M('400 10px/1.5'), color: C.sub, textAlign: 'right' }}>
            avg {view.clubAvg} {UNIT_LABEL}
            <br />
            <span style={{ color: C.mute }}>{view.clubDelta}</span>
          </div>
        </div>

        <div
          className="tap hov-panel"
          onClick={() => onNavigate('card')}
          role="button"
          style={{
            border: `1px solid ${C.lineBright}`,
            borderRadius: 12,
            padding: 14,
            textAlign: 'center',
            font: G('600 14px/1'),
          }}
        >
          Enter score for hole {view.hole}
        </div>
      </div>
    </div>
  )
}
