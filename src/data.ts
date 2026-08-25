// Course, hole and shot data are now real — loaded from OpenStreetMap and the
// device's GPS (see src/lib/overpass.ts and src/state/useLocation.ts).
//
// What remains here is the group play content, which cannot be real without a
// server to sync scores between players' phones. Replace this file when that
// backend exists; nothing else needs to change.

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

export type GroupPlayer = {
  name: string;
  initials: string;
  hcp: number;
  thru: number;
  gross: number;
  delta: number;
};

export const GROUP_PLAYERS: GroupPlayer[] = [
  { name: 'Dana Whitlock', initials: 'DW', hcp: 8, thru: 7, gross: 31, delta: 3 },
  { name: 'Ray Osei', initials: 'RO', hcp: 16, thru: 6, gross: 29, delta: 5 },
  { name: 'Priya Menon', initials: 'PM', hcp: 21, thru: 7, gross: 36, delta: 8 },
];
