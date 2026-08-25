import { useCallback, useEffect, useMemo, useState } from 'react';
import { ACCENT, colors } from '../theme';
import { CLUB_AVERAGES, GROUP_FEED, GROUP_PLAYERS, GROUP_STATS } from '../data';
import { TEES, clubFor, colorForDelta, formatDelta, labelForScore } from '../lib/golf';
import { distance, toUnits } from '../lib/geo';
import { CourseLayout, loadCourseLayout, searchCourses } from '../lib/overpass';
import { emptyRound, freshCard, loadRound, saveRound } from '../lib/storage';
import { useLocation } from './useLocation';
import {
  BoardMode,
  CardMode,
  Course,
  FairwayResult,
  LatLng,
  SavedRound,
  Screen,
  Units,
} from '../types';

export type { Screen, CardMode, BoardMode, Units, FairwayResult };

const SEARCH_IDLE = 'Search a course, or tap NEAR ME.';

/** Shots and hand-placed pins are stored per course and hole. */
const holeKey = (round: SavedRound, hole: number) =>
  `${round.course ? round.course.id : 'none'}:${hole}`;

/** OSM leaves par off plenty of holes; 4 is the honest default. */
const parAt = (round: SavedRound, hole: number) => round.holes[hole]?.par || 4;

/** A pin dropped by hand wins over the green that came from map data. */
const pinAt = (round: SavedRound, hole: number): LatLng | null =>
  round.pins[holeKey(round, hole)] ?? round.holes[hole]?.green ?? null;

export function useDivotState() {
  const [screen, setScreen] = useState<Screen>('play');
  const [mode, setMode] = useState<CardMode>('tap');
  const [board, setBoard] = useState<BoardMode>('gross');
  const [sheetOpen, setSheetOpen] = useState(false);

  const [round, setRound] = useState<SavedRound>(emptyRound);
  const [hydrated, setHydrated] = useState(false);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Course[]>([]);
  const [searchStatus, setSearchStatus] = useState(SEARCH_IDLE);
  const [busy, setBusy] = useState(false);

  const gps = useLocation();
  const [units] = useState<Units>('yards');
  const unitLabel = units === 'meters' ? 'M' : 'YDS';
  const to = useCallback((v: number) => toUnits(v, units), [units]);

  // Restore the saved card once, then persist every later change.
  useEffect(() => {
    let cancelled = false;
    loadRound().then((saved) => {
      if (cancelled) return;
      setRound(saved);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (hydrated) void saveRound(round);
  }, [round, hydrated]);

  const patch = useCallback(
    (fn: (prev: SavedRound) => Partial<SavedRound>) =>
      setRound((prev) => ({ ...prev, ...fn(prev) })),
    [],
  );

  const setCell = useCallback(
    <K extends 'scores' | 'putts' | 'fw' | 'gir'>(
      key: K,
      hole: number,
      value: SavedRound[K][number],
    ) =>
      patch((prev) => {
        const next = prev[key].slice() as SavedRound[K];
        next[hole - 1] = value;
        return { [key]: next } as Partial<SavedRound>;
      }),
    [patch],
  );

  // ── Derived round values ──────────────────────────────────────────────────

  const hole = round.hole;
  const i = hole - 1;
  const par = parAt(round, hole);
  const pin = pinAt(round, hole);
  const teeFactor = TEES[round.tee].f;
  const holeData = round.holes[hole];
  const shotPoints = round.shots[holeKey(round, hole)] ?? [];

  /** Measured off the live fix where there is one, estimated otherwise. */
  const live = pin && gps.pos ? Math.round(distance(gps.pos, pin)) : null;
  const estimated = holeData?.dist ? Math.max(58, Math.round(holeData.dist * teeFactor) - 268) : null;
  const toPinYards = live != null ? Math.max(1, live) : (estimated ?? 142);
  const club = clubFor(toPinYards);
  const clubDelta = toPinYards - club[1];

  const cur = round.scores[i] ?? par;

  const played = useMemo(
    () =>
      round.scores
        .map((v, k) => ({ v, k }))
        .filter((o): o is { v: number; k: number } => o.v != null),
    [round.scores],
  );
  const totalScore = played.reduce((a, o) => a + o.v, 0);
  const parThru = played.reduce((a, o) => a + parAt(round, o.k + 1), 0);
  const delta = totalScore - parThru;
  const deltaText = played.length === 0 ? 'E' : formatDelta(delta);

  // ── Actions ───────────────────────────────────────────────────────────────

  const prevHole = useCallback(() => patch((p) => ({ hole: Math.max(1, p.hole - 1) })), [patch]);
  const nextHole = useCallback(
    () => patch((p) => ({ hole: Math.min(p.holeCount || 18, p.hole + 1) })),
    [patch],
  );
  const jumpToHole = useCallback(
    (h: number) => {
      patch(() => ({ hole: h }));
      setScreen('card');
    },
    [patch],
  );

  const incScore = useCallback(
    () => setCell('scores', hole, Math.min(12, cur + 1)),
    [setCell, hole, cur],
  );
  const decScore = useCallback(
    () => setCell('scores', hole, Math.max(1, cur - 1)),
    [setCell, hole, cur],
  );
  const setPutt = useCallback((n: number) => setCell('putts', hole, n), [setCell, hole]);
  const setFairway = useCallback(
    (v: FairwayResult) => setCell('fw', hole, v),
    [setCell, hole],
  );
  const toggleGir = useCallback(
    () => setCell('gir', hole, !round.gir[i]),
    [setCell, hole, round.gir, i],
  );

  const lastHole = round.holeCount || 18;
  const saveNext = useCallback(() => {
    setCell('scores', hole, cur);
    if (hole >= lastHole) setScreen('summary');
    else patch(() => ({ hole: hole + 1 }));
  }, [setCell, hole, cur, lastHole, patch]);

  const setPin = useCallback(
    (at: LatLng) =>
      patch((prev) =>
        prev.course ? { pins: { ...prev.pins, [holeKey(prev, prev.hole)]: at } } : {},
      ),
    [patch],
  );

  const addShot = useCallback(() => {
    if (!gps.pos) return;
    const at: LatLng = { lat: gps.pos.lat, lng: gps.pos.lng };
    patch((prev) => {
      const key = holeKey(prev, prev.hole);
      return { shots: { ...prev.shots, [key]: [...(prev.shots[key] ?? []), at] } };
    });
  }, [gps.pos, patch]);

  const setTee = useCallback((tee: number) => patch(() => ({ tee })), [patch]);

  // ── Course search ─────────────────────────────────────────────────────────

  const runSearch = useCallback(
    async (searchMode: 'name' | 'near') => {
      const text = query.trim();
      if (searchMode === 'near' && !gps.pos) {
        setSearchStatus('Waiting for a GPS fix — try again in a moment.');
        return;
      }
      if (searchMode === 'name' && text.length < 3) {
        setSearchStatus('Type at least three letters.');
        return;
      }

      setBusy(true);
      setSearchStatus(
        searchMode === 'near' ? 'Looking for courses within 30 km…' : 'Searching NJ and NY…',
      );
      try {
        const found = await searchCourses(searchMode, text, gps.pos);
        setResults(found);
        setSearchStatus(
          found.length
            ? `${found.length} course${found.length === 1 ? '' : 's'} found.`
            : 'Nothing found — try a shorter name.',
        );
      } catch {
        setSearchStatus("Couldn't reach the map data service. Check the connection.");
      } finally {
        setBusy(false);
      }
    },
    [query, gps.pos],
  );

  const pickCourse = useCallback(
    async (course: Course) => {
      patch(() => ({ course, holes: {}, holeCount: 18, ...freshCard() }));
      setSheetOpen(false);
      setSearchStatus(`Loading holes for ${course.name}…`);
      try {
        const layout: CourseLayout = await loadCourseLayout(course);
        patch(() => ({ holes: layout.holes, holeCount: layout.holeCount }));
        const loaded = Object.keys(layout.holes).length;
        setSearchStatus(
          loaded
            ? `${loaded} holes loaded · ${layout.withGreens} greens located`
            : 'No hole data mapped for this course yet — tap each green on the satellite view to set its pin.',
        );
      } catch {
        setSearchStatus(
          "Loaded the course, but hole data didn't come through. Tap greens on the map to set pins.",
        );
      }
    },
    [patch],
  );

  // ── Presentation ──────────────────────────────────────────────────────────

  const rowFor = useCallback(
    (range: number[]) =>
      range.map((k) => {
        const v = round.scores[k];
        const holePar = parAt(round, k + 1);
        const d = v == null ? null : v - holePar;
        return {
          n: k + 1,
          par: holePar,
          score: v == null ? '–' : String(v),
          onPress: () => jumpToHole(k + 1),
          color: v == null ? colors.faintTrack : colorForDelta(d as number),
          bg:
            k === i
              ? 'rgba(47,169,232,0.16)'
              : d != null && d <= -1
                ? 'rgba(47,169,232,0.10)'
                : 'transparent',
          borderColor: k === i ? 'rgba(47,169,232,0.55)' : colors.border,
        };
      }),
    [round, i, jumpToHole],
  );

  const bars = useMemo(
    () =>
      played.map((o) => {
        const d = o.v - parAt(round, o.k + 1);
        // Par stays muted so the accent means birdie and nothing else.
        return { n: o.k + 1, barH: 28 + Math.min(o.v, 8) * 7, color: d === 0 ? colors.parBar : colorForDelta(d) };
      }),
    [played, round],
  );

  const buildBoard = useCallback(() => {
    const net = board === 'net';
    const raw = [
      { name: 'You', initials: 'JM', hcp: 12, thru: played.length, gross: totalScore, delta, me: true },
      ...GROUP_PLAYERS.map((p) => ({ ...p, me: false })),
    ];
    const rows = raw.map((p) => {
      const adj = net ? Math.round(p.hcp * (p.thru / 18)) : 0;
      return { ...p, total: p.gross - adj, rel: p.delta - adj };
    });
    rows.sort((a, b) => a.rel - b.rel);
    return rows.map((p, k) => ({
      pos: k + 1,
      name: p.name,
      initials: p.initials,
      hcp: p.hcp,
      thru: p.thru,
      total: p.total,
      rel: formatDelta(p.rel),
      relColor: p.rel <= 0 ? ACCENT : colors.muteStrong,
      nameColor: p.me ? ACCENT : colors.text,
      bg: p.me ? 'rgba(47,169,232,0.10)' : colors.surface,
      borderColor: p.me ? 'rgba(47,169,232,0.35)' : colors.border,
    }));
  }, [board, played.length, totalScore, delta]);

  /** Each logged shot, measured to the next point or on to the pin. */
  const shotLegs = useMemo(
    () =>
      shotPoints.map((point, k) => {
        const next = shotPoints[k + 1] ?? pin;
        const d = next ? Math.round(distance(point, next)) : null;
        return {
          n: k + 1,
          club: d != null ? clubFor(d)[0] : 'Shot',
          note: next
            ? shotPoints[k + 1]
              ? 'To next position'
              : 'To the pin'
            : 'Awaiting next point',
          dist: d != null ? to(d) : '–',
          color: k === shotPoints.length - 1 ? ACCENT : colors.text,
        };
      }),
    [shotPoints, pin, to],
  );

  const pars18 = Array.from({ length: 18 }, (_, k) => parAt(round, k + 1));
  const courseYards = Object.keys(round.holes).reduce(
    (a, k) => a + (round.holes[Number(k)].dist ?? 0),
    0,
  );

  /** Holes with a pin from either source — the "n/18" in the course sheet. */
  const pinnedHoles = Array.from({ length: round.holeCount }, (_, k) => k + 1).filter((h) =>
    pinAt(round, h),
  ).length;

  const gpsLabel =
    gps.state === 'error'
      ? (gps.error ?? 'Location unavailable').toUpperCase()
      : gps.pos
        ? `GPS FIX · ±${gps.pos.acc} M`
        : 'ACQUIRING SATELLITES…';

  return {
    accent: ACCENT,
    unitLabel,
    screen,
    setScreen,
    hole,
    par,
    holeYds: holeData?.dist ? to(Math.round(holeData.dist * teeFactor)) : '—',
    prevHole,
    nextHole,
    thru: played.length,
    totalScore: played.length ? totalScore : null,
    parThru,
    deltaText,

    // course
    course: round.course,
    courseName: round.course ? round.course.name : 'Pick a course',
    coursePar: pars18.reduce((a, b) => a + b, 0),
    courseLength: courseYards ? to(Math.round(courseYards * teeFactor)) : '—',
    teeName: TEES[round.tee].name,
    teeIndex: round.tee,
    setTee,
    tees: TEES,
    holeCount: round.holeCount,
    pinnedHoles,

    // course sheet
    sheetOpen,
    openSheet: () => setSheetOpen(true),
    closeSheet: () => setSheetOpen(false),
    query,
    setQuery,
    results,
    searchStatus: busy ? 'WORKING…' : searchStatus.toUpperCase(),
    searchBusy: busy,
    search: () => void runSearch('name'),
    nearMe: () => void runSearch('near'),
    pickCourse: (course: Course) => void pickCourse(course),

    // gps + map
    gpsState: gps.state,
    gpsLabel,
    gpsLocked: gps.state === 'locked',
    retryGps: gps.retry,
    pos: gps.pos,
    pin,
    setPin,
    mapCenter: round.course ? { lat: round.course.lat, lng: round.course.lng } : null,
    mapHint: round.course
      ? pin
        ? `HOLE ${hole} · PIN FROM MAP DATA · TAP TO ADJUST`
        : `HOLE ${hole} · TAP THE GREEN TO SET THE PIN`
      : 'PICK A COURSE TO LOAD SATELLITE VIEW',
    shotHint: round.course
      ? 'TAP "ADD SHOT" AT EACH BALL POSITION'
      : 'PICK A COURSE FIRST',
    pinSource:
      live != null ? 'LIVE GPS TO PIN' : pin ? 'NO GPS FIX YET' : "SET THIS HOLE'S PIN ON THE MAP",
    pinSourceColor: live != null ? ACCENT : colors.mute,
    distanceLabel: live != null ? `${to(live)} ${units === 'meters' ? 'm' : 'yds'}` : null,

    // rangefinder
    toPin: to(toPinYards),
    front: to(Math.max(1, toPinYards - 14)),
    back: to(toPinYards + 16),
    playsLike: to(toPinYards + 4),
    suggestedClub: club[0],
    clubAvg: to(club[1]),
    clubDelta:
      clubDelta === 0
        ? 'dead on'
        : clubDelta > 0
          ? `+${clubDelta} over avg`
          : `${clubDelta} under avg`,

    // shot tracking
    showShotLabels: true,
    shots: shotLegs,
    shotPoints,
    addShot,
    clubAverages: CLUB_AVERAGES.map((c) => ({ ...c, dist: to(c.distYds) })),

    // scorecard
    mode,
    setMode,
    curScore: cur,
    curLabel: labelForScore(cur, par),
    curColor: colorForDelta(cur - par),
    incScore,
    decScore,
    putts: round.putts,
    curPutt: round.putts[i],
    setPutt,
    fw: round.fw,
    curFw: round.fw[i],
    setFairway,
    gir: round.gir,
    curGir: round.gir[i],
    toggleGir,
    saveLabel: hole >= lastHole ? 'Finish round' : `Save · hole ${hole + 1}`,
    saveNext,
    front9: rowFor([0, 1, 2, 3, 4, 5, 6, 7, 8]),
    back9: rowFor([9, 10, 11, 12, 13, 14, 15, 16, 17]),
    parOut: pars18.slice(0, 9).reduce((a, b) => a + b, 0),
    parIn: pars18.slice(9).reduce((a, b) => a + b, 0),
    scoreOut: round.scores.slice(0, 9).reduce((a: number, v) => a + (v || 0), 0) || null,
    scoreIn: round.scores.slice(9).reduce((a: number, v) => a + (v || 0), 0) || null,

    // recap
    bars,
    birdies: played.filter((o) => o.v - parAt(round, o.k + 1) <= -1).length,
    pars: played.filter((o) => o.v === parAt(round, o.k + 1)).length,
    girPct: played.length
      ? Math.round((played.filter((o) => round.gir[o.k]).length / played.length) * 100)
      : 0,
    puttsTotal: round.putts.reduce((a: number, v) => a + (v || 0), 0),

    // leaderboard
    board,
    setBoard,
    leaderboard: buildBoard(),
    feed: GROUP_FEED,
    groupStats: GROUP_STATS,
  };
}

export type DivotState = ReturnType<typeof useDivotState>;
