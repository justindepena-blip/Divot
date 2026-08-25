import { C } from '../theme'

/** Club carry averages in yards, straight from the design. */
export const CLUBS: readonly (readonly [string, number])[] = [
  ['Driver', 254],
  ['3 wood', 228],
  ['5 wood', 212],
  ['4 iron', 196],
  ['5 iron', 186],
  ['6 iron', 167],
  ['7 iron', 148],
  ['8 iron', 136],
  ['9 iron', 124],
  ['PW', 112],
  ['GW', 96],
  ['SW', 78],
]

/** Tee sets, with the factor each one scales published yardages by. */
export const TEES = [
  { name: 'Red', f: 0.86 },
  { name: 'White', f: 1 },
  { name: 'Blue', f: 1.06 },
  { name: 'Black', f: 1.12 },
] as const

const SCORE_NAMES: Record<string, string> = {
  '-3': 'Albatross',
  '-2': 'Eagle',
  '-1': 'Birdie',
  '0': 'Par',
  '1': 'Bogey',
  '2': 'Double bogey',
  '3': 'Triple bogey',
}

/** The club whose average is closest to the distance left. */
export function clubFor(yards: number): readonly [string, number] {
  let best = CLUBS[0]
  for (const club of CLUBS) {
    if (Math.abs(club[1] - yards) < Math.abs(best[1] - yards)) best = club
  }
  return best
}

/** Birdie and better read accent; par reads plain; bogey warm, worse hot. */
export function colorFor(delta: number): string {
  if (delta <= -1) return C.accent
  if (delta === 0) return C.text
  if (delta === 1) return C.warm
  return C.hot
}

export function scoreLabel(score: number, par: number): string {
  const d = score - par
  return SCORE_NAMES[String(d)] || (d > 0 ? `+${d}` : 'Under')
}

/** `E`, `+3`, `-2` — the way a leaderboard writes a score relative to par. */
export function relToPar(delta: number): string {
  if (delta > 0) return `+${delta}`
  if (delta === 0) return 'E'
  return String(delta)
}
