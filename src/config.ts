/**
 * The three tweakables the design exposed as canvas props. The design has no
 * settings UI, so they stay configuration — change a value here and rebuild.
 */
export const CONFIG = {
  /** Design default. Alternatives explored in the design: #C8FF4D, #F2C230, #8B7CF6. */
  accent: '#2FA9E8',
  /** 'yards' | 'meters' — every distance in the UI follows this. */
  units: 'yards' as 'yards' | 'meters',
  /** Draw the yardage tooltip on the tee→pin line and numbers on shot markers. */
  showShotLabels: true,
}

/** Esri World Imagery — free to use with attribution. */
export const TILE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
export const TILE_ATTRIBUTION = 'Imagery © Esri · Holes © OpenStreetMap'

export const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'
/** Bounding box covering New Jersey and New York, for the course search. */
export const NY_NJ_BBOX = '38.85,-79.80,45.02,-71.85'

export const STORAGE_KEY = 'divot.v2'
