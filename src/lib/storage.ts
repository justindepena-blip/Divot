import { STORAGE_KEY } from '../config'
import type { RoundState } from '../types'

export const emptyRound = (): RoundState => ({
  course: null,
  holes: {},
  holeCount: 18,
  pins: {},
  tee: 1,
  hole: 1,
  scores: Array(18).fill(null),
  putts: Array(18).fill(null),
  fw: Array(18).fill(null),
  gir: Array(18).fill(false),
  shots: {},
})

/** A fresh card on the same course — used when a new course is picked. */
export const freshCard = () => ({
  hole: 1,
  scores: Array(18).fill(null) as (number | null)[],
  putts: Array(18).fill(null) as (number | null)[],
  fw: Array(18).fill(null) as RoundState['fw'],
  gir: Array(18).fill(false) as boolean[],
  shots: {} as RoundState['shots'],
})

export function loadRound(): RoundState {
  const base = emptyRound()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw)
    if (!saved || typeof saved !== 'object') return base
    // Merge rather than trust: a card saved by an older build may be short a key.
    return { ...base, ...saved }
  } catch {
    return base
  }
}

export function saveRound(state: RoundState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private browsing or a full quota — the round still works in memory.
  }
}
