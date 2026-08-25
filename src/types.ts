export type Screen = 'play' | 'shots' | 'card' | 'summary' | 'friends'
export type CardMode = 'tap' | 'grid'
export type BoardMode = 'gross' | 'net'
export type Fairway = 'left' | 'hit' | 'right'
export type GpsState = 'locating' | 'locked' | 'error'

export interface LatLng {
  lat: number
  lng: number
}

export interface Position extends LatLng {
  /** Reported fix accuracy, metres. */
  acc: number
}

export interface Course {
  /** OSM element identity, e.g. `way/12345`. */
  id: string
  name: string
  lat: number
  lng: number
  city: string
}

export interface HoleData {
  par: number | null
  /** Hole length in yards, from OSM `dist` (metres) where present. */
  dist: number | null
  green: LatLng | null
  tee: LatLng
}

/** Everything that survives a reload, under `localStorage['divot.v2']`. */
export interface RoundState {
  course: Course | null
  holes: Record<number, HoleData>
  holeCount: number
  /** Manually placed pins, keyed `<courseId>:<hole>`. */
  pins: Record<string, LatLng>
  tee: number
  hole: number
  scores: (number | null)[]
  putts: (number | null)[]
  fw: (Fairway | null)[]
  gir: boolean[]
  /** Logged shot positions, keyed `<courseId>:<hole>`. */
  shots: Record<string, LatLng[]>
}
