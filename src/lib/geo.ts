import { CONFIG } from '../config'
import type { LatLng } from '../types'

const EARTH_R = 6371000
const RAD = Math.PI / 180
const M_TO_YD = 1.09361
const YD_TO_M = 0.9144

/** Great-circle distance between two fixes, in **yards** (the app's base unit). */
export function distance(a: LatLng, b: LatLng): number {
  const dLat = (b.lat - a.lat) * RAD
  const dLng = (b.lng - a.lng) * RAD
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_R * Math.asin(Math.sqrt(h)) * M_TO_YD
}

/** Yards → the configured display unit, rounded. */
export function unit(yards: number): number {
  return CONFIG.units === 'meters' ? Math.round(yards * YD_TO_M) : Math.round(yards)
}

/** `YDS` or `M`, for the labels that sit beside a number. */
export const UNIT_LABEL = CONFIG.units === 'meters' ? 'M' : 'YDS'
/** Lowercase form used inside the map tooltip. */
export const UNIT_SUFFIX = CONFIG.units === 'meters' ? ' m' : ' yds'

export const metresToYards = (m: number) => m * M_TO_YD
