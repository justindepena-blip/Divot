import { CONFIG } from '../config'
import Sheet from '../components/Sheet'
import { distance, unit, UNIT_LABEL } from '../lib/geo'
import { TEES } from '../lib/golf'
import { pinnedHoleCount } from '../lib/round'
import { C, G, M, tint } from '../theme'
import type { CourseSearch } from '../state/useCourseSearch'
import type { RoundApi } from '../state/useRound'
import type { Position } from '../types'

interface Props {
  round: RoundApi
  search: CourseSearch
  pos: Position | null
  onClose: () => void
}

const button: React.CSSProperties = {
  padding: '12px 13px',
  borderRadius: 10,
  font: M('500 10px/1'),
  letterSpacing: '.06em',
}

export default function CourseSheet({ round, search, pos, onClose }: Props) {
  const { round: state } = round
  const current = state.course

  return (
    <Sheet title="Where are you playing?" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ font: M('400 9px/1'), letterSpacing: '.16em', color: C.mute }}>
          TEES
        </div>
        <div style={{ display: 'flex', gap: 7 }}>
          {TEES.map((tee, k) => {
            const on = k === state.tee
            return (
              <div
                key={tee.name}
                className="tap"
                onClick={() => round.setTee(k)}
                role="button"
                aria-pressed={on}
                style={{
                  flex: 1,
                  padding: '11px 0',
                  borderRadius: 10,
                  textAlign: 'center',
                  font: M('500 10px/1'),
                  letterSpacing: '.08em',
                  background: on ? CONFIG.accent : C.well,
                  color: on ? C.onAccent : C.sub,
                  border: `1px solid ${on ? tint.borderStrong : 'rgba(255,255,255,.08)'}`,
                }}
              >
                {tee.name.toUpperCase()}
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ font: M('400 9px/1'), letterSpacing: '.16em', color: C.mute }}>
          COURSES IN NJ &amp; NY
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={search.query}
            onChange={(e) => search.setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search.search()}
            placeholder="Search by name"
            enterKeyHint="search"
            autoCorrect="off"
            autoCapitalize="words"
            style={{
              flex: 1,
              minWidth: 0,
              background: C.well,
              border: `1px solid ${C.lineStrong}`,
              borderRadius: 10,
              padding: '12px 13px',
              font: G('400 12px/1'),
              color: C.text,
              outline: 'none',
            }}
          />
          <div
            className="tap"
            onClick={search.search}
            role="button"
            style={{ ...button, background: CONFIG.accent, color: C.onAccent }}
          >
            FIND
          </div>
          <div
            className="tap"
            onClick={search.nearMe}
            role="button"
            style={{ ...button, border: `1px solid ${C.lineBright}`, color: C.sub }}
          >
            NEAR ME
          </div>
        </div>

        <div
          style={{
            font: M('400 9px/1.5'),
            color: search.busy ? CONFIG.accent : C.mute,
          }}
        >
          {search.busy ? 'WORKING…' : search.status.toUpperCase()}
        </div>

        {search.results.map((course) => {
          const on = current?.id === course.id
          return (
            <div
              key={course.id}
              className="tap"
              onClick={() => search.pick(course)}
              role="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '14px 15px',
                borderRadius: 13,
                background: on ? tint.fillRow : C.panel,
                border: `1px solid ${on ? tint.borderRow : C.line}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  minWidth: 0,
                }}
              >
                <div style={{ font: G('500 13px/1.2'), color: on ? CONFIG.accent : C.text }}>
                  {course.name}
                </div>
                <div style={{ font: M('400 10px/1'), color: C.mute }}>
                  {course.city || '—'}
                </div>
              </div>
              <div
                style={{ font: M('500 11px/1'), color: C.sub, whiteSpace: 'nowrap' }}
              >
                {pos ? `${unit(distance(pos, course))} ${UNIT_LABEL}` : ''}
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 15px',
          borderRadius: 13,
          background: tint.fillSoft,
          border: '1px solid rgba(47,169,232,.2)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            style={{ font: M('400 9px/1'), letterSpacing: '.14em', color: CONFIG.accent }}
          >
            PINS FROM MAP DATA
          </div>
          <div style={{ font: M('400 10px/1.4'), color: C.sub }}>
            Tap the satellite map
            <br />
            to adjust any pin.
          </div>
        </div>
        <div style={{ font: M('700 20px/1') }}>
          {pinnedHoleCount(state)}/{state.holeCount}
        </div>
      </div>

      <div style={{ font: M('400 9px/1.5'), color: C.dim }}>
        HOLES · PARS · GREENS FROM OPENSTREETMAP · IMAGERY FROM ESRI WORLD IMAGERY · BOTH
        FREE
      </div>
    </Sheet>
  )
}
