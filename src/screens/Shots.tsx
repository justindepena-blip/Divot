import { CONFIG } from '../config'
import { UNIT_LABEL } from '../lib/geo'
import HoleMap from '../components/HoleMap'
import HoleStepper from '../components/HoleStepper'
import MapFrame from '../components/MapFrame'
import { C, G, M } from '../theme'
import type { Derived } from '../lib/derive'
import type { Gps } from '../state/useGeolocation'
import type { RoundApi } from '../state/useRound'
import type { LatLng } from '../types'

interface Props {
  round: RoundApi
  view: Derived
  gps: Gps
  shots: LatLng[]
}

export default function Shots({ round, view, gps, shots }: Props) {
  const { round: state } = round
  const locked = gps.state === 'locked'

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <HoleStepper
        title={`Shots · hole ${view.hole}`}
        par={view.par}
        yards={view.holeYards}
        unitLabel={UNIT_LABEL}
        onPrev={round.prevHole}
        onNext={round.nextHole}
      />

      <MapFrame
        hint={state.course ? 'TAP "ADD SHOT" AT EACH BALL POSITION' : 'PICK A COURSE FIRST'}
      >
        <HoleMap
          variant="shot"
          course={state.course}
          hole={view.hole}
          pin={view.pin}
          pos={gps.pos}
          shots={shots}
          onPickPin={round.setPin}
        />
      </MapFrame>

      <div
        style={{
          padding: '18px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {view.legs.map((leg) => (
            <div
              key={leg.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '13px 0',
                borderTop: `1px solid ${C.line}`,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  border: `1px solid ${C.lineBright}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: M('500 10px/1'),
                  color: C.sub,
                }}
              >
                {leg.n}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ font: G('500 13px/1') }}>{leg.club}</div>
                <div style={{ font: M('400 10px/1'), color: C.mute }}>{leg.note}</div>
              </div>
              <div style={{ font: M('700 15px/1'), color: leg.color }}>{leg.dist}</div>
              <div style={{ font: M('400 9px/1'), color: C.dim }}>{UNIT_LABEL}</div>
            </div>
          ))}

          {view.legs.length === 0 && (
            <div
              style={{
                padding: '16px 0',
                borderTop: `1px solid ${C.line}`,
                font: M('400 10px/1.6'),
                color: C.mute,
              }}
            >
              NO SHOTS ON THIS HOLE YET. STAND OVER THE BALL AND TAP BELOW — EACH TAP
              DROPS A GPS POINT AND MEASURES THE LEG.
            </div>
          )}
        </div>

        {/* Disabled until there is a fix to attach the shot to. */}
        <div
          className="tap hov-panel"
          onClick={() => gps.pos && round.addShot(gps.pos)}
          role="button"
          aria-disabled={!locked}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 9,
            border: `1px solid ${C.lineBright}`,
            borderRadius: 12,
            padding: 14,
            font: G('600 13px/1'),
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: locked ? CONFIG.accent : C.gpsWarn,
            }}
          />
          {locked ? 'Add shot at my position' : 'Waiting for GPS…'}
        </div>

        <div
          style={{
            background: C.panel,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: 15,
            display: 'flex',
            flexDirection: 'column',
            gap: 13,
          }}
        >
          <div style={{ font: M('400 9px/1'), letterSpacing: '.16em', color: C.mute }}>
            YOUR CLUB AVERAGES
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {view.clubAverages.map((club) => (
              <div
                key={club.name}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                <div style={{ font: M('500 15px/1') }}>{club.dist}</div>
                <div style={{ font: M('400 9px/1'), color: C.mute }}>{club.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
