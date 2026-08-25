export type Screen = 'play' | 'shots' | 'card' | 'summary' | 'friends';
export type CardMode = 'tap' | 'grid';
export type BoardMode = 'gross' | 'net';
export type Units = 'yards' | 'meters';
export type FairwayResult = 'left' | 'hit' | 'right' | '-';
export type GpsState = 'locating' | 'locked' | 'error';

export type LatLng = {
  lat: number;
  lng: number;
};

export type Position = LatLng & {
  /** Reported fix accuracy, in metres. */
  acc: number;
};

export type Course = {
  /** OSM element identity, e.g. `way/12345`. */
  id: string;
  name: string;
  lat: number;
  lng: number;
  city: string;
};

export type HoleData = {
  par: number | null;
  /** Hole length in yards, from the OSM `dist` tag (metres) where present. */
  dist: number | null;
  green: LatLng | null;
  tee: LatLng;
};

/** Everything that survives a restart, stored under `divot.v2`. */
export type SavedRound = {
  course: Course | null;
  holes: Record<number, HoleData>;
  holeCount: number;
  /** Pins placed by hand, keyed `<courseId>:<hole>`. */
  pins: Record<string, LatLng>;
  tee: number;
  hole: number;
  scores: (number | null)[];
  putts: (number | null)[];
  fw: (FairwayResult | null)[];
  gir: boolean[];
  /** Logged shot positions, keyed `<courseId>:<hole>`. */
  shots: Record<string, LatLng[]>;
};
