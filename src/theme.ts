/**
 * Design tokens lifted verbatim from `project/Divot Golf.dc.html`.
 * Every hex here appears in the source design; nothing is invented.
 */

export const C = {
  /** App background — the phone screen. */
  bg: '#0B0D0E',
  /** Page behind the app (letterboxing on wide viewports). */
  page: '#08090A',
  /** Raised panel / card. */
  panel: '#14181A',
  /** Control chip / avatar well. */
  well: '#1C2124',
  /** Sheet background. */
  sheet: '#0E1113',

  text: '#F2F5F4',
  /** Body copy inside feed rows. */
  soft: '#DCE3E4',
  /** Secondary labels, stepper chevrons. */
  sub: '#9AA4A7',
  /** Muted mono labels. */
  mute: '#6E7A7D',
  /** Dimmest supporting text. */
  dim: '#596366',
  /** Empty scorecard cell. */
  blank: '#3E4749',

  accent: '#2FA9E8',
  /** Text/icons drawn on top of the accent fill. */
  onAccent: '#06181F',

  /** Bogey. */
  warm: '#E8894D',
  /** Double bogey or worse. */
  hot: '#E8574D',
  /** Par column in the recap chart — deliberately not the accent. */
  parBar: '#495356',
  /** GPS still acquiring / errored. */
  gpsWarn: '#D9A94A',

  line: 'rgba(255,255,255,.07)',
  lineStrong: 'rgba(255,255,255,.1)',
  lineBright: 'rgba(255,255,255,.14)',
} as const

/** `font` shorthand builders — keeps the design's `font:500 13px/1 …` form. */
export const G = (spec: string) => `${spec} 'Space Grotesk', system-ui, sans-serif`
export const M = (spec: string) => `${spec} 'JetBrains Mono', ui-monospace, monospace`

/** Accent-tinted surfaces used for selected states and highlight cards. */
export const tint = {
  fill: 'rgba(47,169,232,.08)',
  fillSoft: 'rgba(47,169,232,.07)',
  fillRow: 'rgba(47,169,232,.10)',
  fillCell: 'rgba(47,169,232,.16)',
  border: 'rgba(47,169,232,.22)',
  borderRow: 'rgba(47,169,232,.35)',
  borderStrong: 'rgba(47,169,232,.5)',
} as const
