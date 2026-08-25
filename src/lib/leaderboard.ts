import { CONFIG } from '../config'
import { relToPar } from './golf'
import { C } from '../theme'
import type { BoardMode } from '../types'

/**
 * The group screen is the one part of the design that cannot be real without a
 * server: live score sync between phones needs a backend. Everything below is
 * the design's placeholder data, isolated here so swapping in a real feed later
 * touches this file and nothing else.
 */
const PLAYERS = [
  { name: 'Dana Whitlock', initials: 'DW', hcp: 8, thru: 7, gross: 31, delta: 3 },
  { name: 'Ray Osei', initials: 'RO', hcp: 16, thru: 6, gross: 29, delta: 5 },
  { name: 'Priya Menon', initials: 'PM', hcp: 21, thru: 7, gross: 36, delta: 8 },
]

export const ROUND_CODE = 'KR-4821'

export const PARTNERS = [
  { name: 'Dana Whitlock', initials: 'DW' },
  { name: 'Ray Osei', initials: 'RO' },
  { name: 'Priya Menon', initials: 'PM' },
  { name: 'Tomas Beck', initials: 'TB' },
  { name: 'Sam Iyer', initials: 'SI' },
]

export const FEED = [
  { text: 'Dana holed a 12-footer on 6 for birdie.', time: '2M', color: CONFIG.accent },
  { text: 'You won hole 5 — skin carried from 4.', time: '14M', color: C.text },
  { text: 'Ray joined the round from the 3rd tee.', time: '41M', color: C.dim },
]

export interface BoardRow {
  pos: number
  name: string
  initials: string
  hcp: number
  thru: number
  total: number
  rel: string
  relColor: string
  nameColor: string
  bg: string
  bd: string
}

/**
 * The player's own card, ranked against the group. In NET mode each player's
 * handicap is pro-rated across the holes they have finished.
 */
export function buildBoard(
  mode: BoardMode,
  myDelta: number,
  myTotal: number,
  myThru: number,
): BoardRow[] {
  const net = mode === 'net'
  const raw = [
    {
      name: 'You',
      initials: 'JM',
      hcp: 12,
      thru: myThru,
      gross: myTotal || 0,
      delta: myDelta,
      me: true,
    },
    ...PLAYERS.map((p) => ({ ...p, me: false })),
  ]

  return raw
    .map((p) => {
      const adj = net ? Math.round(p.hcp * (p.thru / 18)) : 0
      return { ...p, total: p.gross - adj, rel: p.delta - adj }
    })
    .sort((a, b) => a.rel - b.rel)
    .map((p, k) => ({
      pos: k + 1,
      name: p.name,
      initials: p.initials,
      hcp: p.hcp,
      thru: p.thru,
      total: p.total,
      rel: relToPar(p.rel),
      relColor: p.rel <= 0 ? CONFIG.accent : C.sub,
      nameColor: p.me ? CONFIG.accent : C.text,
      bg: p.me ? 'rgba(47,169,232,.10)' : C.panel,
      bd: p.me ? 'rgba(47,169,232,.35)' : C.line,
    }))
}
