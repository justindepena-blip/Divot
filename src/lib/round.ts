import type { LatLng, RoundState } from '../types'

/** Shots and manual pins are stored per course *and* hole. */
export const holeKey = (round: RoundState, hole: number) =>
  `${round.course ? round.course.id : 'none'}:${hole}`

/** OSM omits par on plenty of holes; 4 is the honest default. */
export const parFor = (round: RoundState, hole: number) => round.holes[hole]?.par || 4

/** A pin the player dropped wins over the green that came from map data. */
export const pinFor = (round: RoundState, hole: number): LatLng | null =>
  round.pins[holeKey(round, hole)] ?? round.holes[hole]?.green ?? null

export const shotsFor = (round: RoundState, hole: number): LatLng[] =>
  round.shots[holeKey(round, hole)] ?? []

/** Holes with a pin from either source — what "PINS FROM MAP DATA n/18" counts. */
export function pinnedHoleCount(round: RoundState): number {
  let n = 0
  for (let hole = 1; hole <= round.holeCount; hole++) if (pinFor(round, hole)) n++
  return n
}
