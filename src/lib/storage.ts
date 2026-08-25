import AsyncStorage from '@react-native-async-storage/async-storage';
import { FairwayResult, LatLng, SavedRound } from '../types';

/** Same key the design's prototype used, so an existing card carries over. */
const KEY = 'divot.v2';

export const emptyRound = (): SavedRound => ({
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
});

/** A clean card on a new course — everything but the tee choice resets. */
export const freshCard = () => ({
  hole: 1,
  scores: Array(18).fill(null) as (number | null)[],
  putts: Array(18).fill(null) as (number | null)[],
  fw: Array(18).fill(null) as (FairwayResult | null)[],
  gir: Array(18).fill(false) as boolean[],
  shots: {} as Record<string, LatLng[]>,
});

export async function loadRound(): Promise<SavedRound> {
  const base = emptyRound();
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return base;
    // Merge rather than trust — a card written by an older build may be
    // missing keys this one reads.
    return { ...base, ...saved };
  } catch {
    return base;
  }
}

export async function saveRound(round: SavedRound): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(round));
  } catch {
    // Out of quota or storage unavailable — the round still works in memory.
  }
}
