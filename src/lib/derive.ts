import { CONFIG } from '../config'
import { distance, unit } from './geo'
import { CLUBS, TEES, clubFor, colorFor, relToPar, scoreLabel } from './golf'
import { parFor, pinFor, shotsFor } from './round'
import { C } from '../theme'
import type { LatLng, Position, RoundState } from '../types'

const ACC = CONFIG.accent
const DASH = '–'

export interface ShotLeg {
  n: number
  club: string
  note: string
  dist: number | string
  color: string
}

export interface GridCell {
  n: number
  par: number
  score: number | string
  color: string
  bg: string
  bd: string
}

export interface PlayedHole {
  n: number
  barH: string
  color: string
}

export type Derived = ReturnType<typeof derive>

/**
 * Everything the five screens read, computed from the saved round plus the
 * live fix. Distances are yards internally and display units on the way out.
 */
export function derive(round: RoundState, pos: Position | null) {
  const { hole } = round
  const idx = hole - 1
  const teeFactor = TEES[round.tee].f
  const holeData = round.holes[hole]
  const par = parFor(round, hole)
  const pin: LatLng | null = pinFor(round, hole)

  // Distance to the pin: measured off the live fix where we have one, else
  // estimated from the hole's published length minus a nominal tee shot.
  const live = pin && pos ? Math.round(distance(pos, pin)) : null
  const estimated = holeData?.dist
    ? Math.max(58, Math.round(holeData.dist * teeFactor) - 268)
    : null
  const toPinYards = live != null ? Math.max(1, live) : (estimated ?? 142)

  const club = clubFor(toPinYards)
  const clubDelta = toPinYards - club[1]

  const played = round.scores
    .map((score, k) => ({ score, k }))
    .filter((s): s is { score: number; k: number } => s.score != null)
  const totalScore = played.reduce((sum, s) => sum + s.score, 0)
  const parThru = played.reduce((sum, s) => sum + parFor(round, s.k + 1), 0)
  const delta = totalScore - parThru

  const shots = shotsFor(round, hole)
  const legs: ShotLeg[] = shots.map((point, k) => {
    const next = shots[k + 1] ?? pin
    const d = next ? Math.round(distance(point, next)) : null
    return {
      n: k + 1,
      club: d != null ? clubFor(d)[0] : 'Shot',
      note: next
        ? shots[k + 1]
          ? 'To next position'
          : 'To the pin'
        : 'Awaiting next point',
      dist: d != null ? unit(d) : DASH,
      color: k === shots.length - 1 ? ACC : C.text,
    }
  })

  const gridRow = (holes: number[]): GridCell[] =>
    holes.map((n) => {
      const score = round.scores[n - 1]
      const holePar = parFor(round, n)
      const d = score == null ? null : score - holePar
      return {
        n,
        par: holePar,
        score: score ?? DASH,
        color: score == null ? C.blank : colorFor(d!),
        bg:
          n === hole
            ? 'rgba(47,169,232,.16)'
            : d != null && d <= -1
              ? 'rgba(47,169,232,.10)'
              : 'transparent',
        bd: n === hole ? 'rgba(47,169,232,.55)' : C.line,
      }
    })

  const pars = Array.from({ length: 18 }, (_, k) => parFor(round, k + 1))
  const courseYards = Object.values(round.holes).reduce((sum, h) => sum + (h.dist ?? 0), 0)
  const current = round.scores[idx] ?? par

  return {
    idx,
    hole,
    par,
    pin,
    holeYards: holeData?.dist ? unit(Math.round(holeData.dist * teeFactor)) : '—',

    courseName: round.course ? round.course.name : 'Pick a course',
    teeName: TEES[round.tee].name,
    coursePar: pars.reduce((a, b) => a + b, 0),
    courseLength: courseYards ? unit(Math.round(courseYards * teeFactor)) : '—',

    // Rangefinder numbers.
    toPin: unit(toPinYards),
    front: unit(Math.max(1, toPinYards - 14)),
    back: unit(toPinYards + 16),
    playsLike: unit(toPinYards + 4),
    club: club[0],
    clubAvg: unit(club[1]),
    clubDelta:
      clubDelta === 0
        ? 'dead on'
        : clubDelta > 0
          ? `+${clubDelta} over avg`
          : `${clubDelta} under avg`,
    pinSource:
      live != null
        ? 'LIVE GPS TO PIN'
        : pin
          ? 'NO GPS FIX YET'
          : "SET THIS HOLE'S PIN ON THE MAP",
    pinSourceColor: live != null ? ACC : C.mute,

    // Scorecard.
    currentScore: current,
    currentLabel: scoreLabel(current, par),
    currentColor: colorFor(current - par),
    front9: gridRow([1, 2, 3, 4, 5, 6, 7, 8, 9]),
    back9: gridRow([10, 11, 12, 13, 14, 15, 16, 17, 18]),
    parOut: pars.slice(0, 9).reduce((a, b) => a + b, 0),
    parIn: pars.slice(9).reduce((a, b) => a + b, 0),
    scoreOut: round.scores.slice(0, 9).reduce<number>((a, v) => a + (v ?? 0), 0) || DASH,
    scoreIn: round.scores.slice(9).reduce<number>((a, v) => a + (v ?? 0), 0) || DASH,

    // Totals, shared by the card, the recap and the leaderboard.
    thru: played.length,
    totalScore: played.length ? totalScore : DASH,
    parThru,
    delta,
    deltaText: played.length ? relToPar(delta) : 'E',

    // Recap.
    played: played.map<PlayedHole>((s) => {
      const d = s.score - parFor(round, s.k + 1)
      return {
        n: s.k + 1,
        barH: `${28 + Math.min(s.score, 8) * 7}px`,
        color: d === 0 ? C.parBar : colorFor(d),
      }
    }),
    birdies: played.filter((s) => s.score - parFor(round, s.k + 1) <= -1).length,
    pars: played.filter((s) => s.score === parFor(round, s.k + 1)).length,
    girPct: played.length
      ? Math.round((played.filter((s) => round.gir[s.k]).length / played.length) * 100)
      : 0,
    puttsTotal: round.putts.reduce<number>((sum, v) => sum + (v ?? 0), 0),

    // Shots.
    legs,
    clubAverages: [
      { name: 'DRIVER', dist: unit(CLUBS[0][1]) },
      { name: '5 IRON', dist: unit(186) },
      { name: '7 IRON', dist: unit(148) },
      { name: 'PW', dist: unit(118) },
    ],
  }
}
