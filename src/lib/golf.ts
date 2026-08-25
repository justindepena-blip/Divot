import { ACCENT, colors } from '../theme';

const SCORE_NAMES: Record<string, string> = {
  '-3': 'Albatross',
  '-2': 'Eagle',
  '-1': 'Birdie',
  '0': 'Par',
  '1': 'Bogey',
  '2': 'Double bogey',
  '3': 'Triple bogey',
};

/** Club carry averages in yards, from the design. */
export const CLUBS: [string, number][] = [
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
];

/** Tee sets, and the factor each scales published yardages by. */
export const TEES = [
  { name: 'Red', f: 0.86 },
  { name: 'White', f: 1 },
  { name: 'Blue', f: 1.06 },
  { name: 'Black', f: 1.12 },
];

/** The club whose average carry is closest to the distance left. */
export function clubFor(yards: number): [string, number] {
  let best = CLUBS[0];
  for (const club of CLUBS) {
    if (Math.abs(club[1] - yards) < Math.abs(best[1] - yards)) best = club;
  }
  return best;
}

/** Birdie or better reads accent, par plain, bogey warm, worse hot. */
export const colorForDelta = (d: number) =>
  d <= -1 ? ACCENT : d === 0 ? colors.text : d === 1 ? colors.warm : colors.hot;

export const labelForScore = (score: number, par: number) => {
  const d = score - par;
  return SCORE_NAMES[String(d)] ?? (d > 0 ? `+${d}` : 'Under');
};

/** `E`, `+3`, `-2` — how a leaderboard writes a score against par. */
export const formatDelta = (d: number) => (d > 0 ? `+${d}` : d === 0 ? 'E' : String(d));
