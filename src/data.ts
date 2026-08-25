export const PARS = [4, 5, 4, 3, 4, 4, 4, 3, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5];
export const YARDS = [398, 512, 425, 168, 441, 388, 412, 192, 538, 405, 377, 205, 545, 418, 392, 158, 436, 521];

export const SCORE_NAMES: Record<string, string> = {
  '-3': 'Albatross',
  '-2': 'Eagle',
  '-1': 'Birdie',
  '0': 'Par',
  '1': 'Bogey',
  '2': 'Double bogey',
  '3': 'Triple bogey',
};

export const COURSE_NAME = 'Kestrel Ridge GC';

export type FairwayResult = 'left' | 'hit' | 'right' | '-';

export const INITIAL_SCORES: (number | null)[] = [4, 5, 3, 3, 5, 4, null, null, null, null, null, null, null, null, null, null, null, null];
export const INITIAL_PUTTS: (number | null)[] = [2, 2, 1, 2, 3, 2, 2, null, null, null, null, null, null, null, null, null, null, null];
export const INITIAL_FW: (FairwayResult | null)[] = ['hit', 'left', 'hit', '-', 'right', 'hit', null, null, null, null, null, null, null, null, null, null, null, null];
export const INITIAL_GIR: boolean[] = [true, false, true, true, false, true, false, false, false, false, false, false, false, false, false, false, false, false];

// Static demo content — placeholders the way the design left them (drop real
// shot-tracking / group data in later).
export const DEMO_SHOTS = [
  { n: 1, club: 'Driver', note: 'Fairway · left centre', distYds: 268 },
  { n: 2, club: '7 iron', note: 'Green · 24 ft past', distYds: 152 },
  { n: 3, club: 'Putter', note: 'Holed', distYds: 8 },
];

export const CLUB_AVERAGES = [
  { name: 'DRIVER', distYds: 254 },
  { name: '5 IRON', distYds: 186 },
  { name: '7 IRON', distYds: 148 },
  { name: 'PW', distYds: 118 },
];

export const GROUP_FEED = [
  { text: 'Dana holed a 12-footer on 6 for birdie.', time: '2M', kind: 'accent' as const },
  { text: 'You won hole 5 — skin carried from 4.', time: '14M', kind: 'text' as const },
  { text: 'Ray joined the round from the 3rd tee.', time: '41M', kind: 'mute' as const },
];

export const GROUP_STATS = [
  { value: '2', label: 'SKINS WON', accent: true },
  { value: '1 UP', label: 'MATCH VS DANA', accent: false },
  { value: '14', label: 'TEAM PTS', accent: false },
];

export type GroupPlayer = { name: string; initials: string; hcp: number; thru: number; gross: number; delta: number };

export const GROUP_PLAYERS: GroupPlayer[] = [
  { name: 'Dana Whitlock', initials: 'DW', hcp: 8, thru: 7, gross: 31, delta: 3 },
  { name: 'Ray Osei', initials: 'RO', hcp: 16, thru: 6, gross: 29, delta: 5 },
  { name: 'Priya Menon', initials: 'PM', hcp: 21, thru: 7, gross: 36, delta: 8 },
];
