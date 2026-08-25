import { useCallback, useMemo, useState } from 'react';
import { ACCENT, colors } from '../theme';
import {
  CLUB_AVERAGES,
  COURSE_NAME,
  DEMO_SHOTS,
  FairwayResult,
  GROUP_FEED,
  GROUP_PLAYERS,
  GROUP_STATS,
  INITIAL_FW,
  INITIAL_GIR,
  INITIAL_PUTTS,
  INITIAL_SCORES,
  PARS,
  SCORE_NAMES,
  YARDS,
} from '../data';

export type Screen = 'play' | 'shots' | 'card' | 'summary' | 'friends';
export type CardMode = 'tap' | 'grid';
export type BoardMode = 'gross' | 'net';
export type Units = 'yards' | 'meters';

const unit = (v: number, units: Units) => (units === 'meters' ? Math.round(v * 0.9144) : v);

const colorForDelta = (d: number) => (d <= -1 ? ACCENT : d === 0 ? colors.text : d === 1 ? colors.warm : colors.hot);

const labelForScore = (score: number, par: number) => {
  const d = score - par;
  return SCORE_NAMES[String(d)] ?? (d > 0 ? `+${d}` : 'Under');
};

const formatDelta = (d: number) => (d > 0 ? `+${d}` : d === 0 ? 'E' : String(d));

export function useDivotState() {
  const [screen, setScreen] = useState<Screen>('play');
  const [hole, setHole] = useState(7);
  const [mode, setMode] = useState<CardMode>('tap');
  const [board, setBoard] = useState<BoardMode>('gross');
  const [scores, setScores] = useState<(number | null)[]>(INITIAL_SCORES);
  const [putts, setPutts] = useState<(number | null)[]>(INITIAL_PUTTS);
  const [fw, setFw] = useState<(FairwayResult | null)[]>(INITIAL_FW);
  const [gir, setGir] = useState<boolean[]>(INITIAL_GIR);

  const [units] = useState<Units>('yards');
  const unitLabel = units === 'meters' ? 'M' : 'YDS';
  const to = useCallback((v: number) => unit(v, units), [units]);

  const setAt = <T,>(setter: (updater: (prev: T[]) => T[]) => void, i: number, val: T) =>
    setter((prev) => {
      const next = prev.slice();
      next[i] = val;
      return next;
    });

  const prevHole = useCallback(() => setHole((h) => Math.max(1, h - 1)), []);
  const nextHole = useCallback(() => setHole((h) => Math.min(18, h + 1)), []);
  const jumpToHole = useCallback((h: number) => {
    setHole(h);
    setScreen('card');
  }, []);

  const i = hole - 1;
  const par = PARS[i];
  const holeYds = to(YARDS[i]);
  const cur = scores[i] ?? par;

  const incScore = useCallback(() => setAt(setScores, i, Math.min(12, cur + 1)), [i, cur]);
  const decScore = useCallback(() => setAt(setScores, i, Math.max(1, cur - 1)), [i, cur]);
  const setPutt = useCallback((n: number) => setAt(setPutts, i, n), [i]);
  const setFairway = useCallback((v: FairwayResult) => setAt(setFw, i, v), [i]);
  const toggleGir = useCallback(() => setAt(setGir, i, !gir[i]), [i, gir]);

  const saveNext = useCallback(() => {
    setAt(setScores, i, cur);
    if (hole === 18) {
      setScreen('summary');
    } else {
      setHole(hole + 1);
    }
  }, [i, cur, hole]);

  const played = useMemo(
    () => scores.map((v, k) => ({ v, k })).filter((o): o is { v: number; k: number } => o.v != null),
    [scores],
  );
  const totalScore = played.reduce((a, o) => a + o.v, 0);
  const parThru = played.reduce((a, o) => a + PARS[o.k], 0);
  const delta = totalScore - parThru;
  const deltaText = played.length === 0 ? 'E' : formatDelta(delta);

  const rowFor = useCallback(
    (range: number[]) =>
      range.map((k) => {
        const v = scores[k];
        const d = v == null ? null : v - PARS[k];
        return {
          n: k + 1,
          par: PARS[k],
          score: v == null ? '–' : String(v),
          onPress: () => jumpToHole(k + 1),
          color: v == null ? colors.faintTrack : colorForDelta(d as number),
          bg: k === i ? 'rgba(47,169,232,0.16)' : d != null && d <= -1 ? 'rgba(47,169,232,0.10)' : 'transparent',
          borderColor: k === i ? 'rgba(47,169,232,0.55)' : colors.border,
        };
      }),
    [scores, i, jumpToHole],
  );

  const bars = useMemo(
    () =>
      played.map((o) => {
        const d = o.v - PARS[o.k];
        return { n: o.k + 1, barH: 28 + Math.min(o.v, 8) * 7, color: colorForDelta(d) };
      }),
    [played],
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
      rel: p.rel > 0 ? `+${p.rel}` : p.rel === 0 ? 'E' : String(p.rel),
      relColor: p.rel <= 0 ? ACCENT : colors.muteStrong,
      nameColor: p.me ? ACCENT : colors.text,
      bg: p.me ? 'rgba(47,169,232,0.10)' : colors.surface,
      borderColor: p.me ? 'rgba(47,169,232,0.35)' : colors.border,
    }));
  }, [board, played.length, totalScore, delta]);

  const toPin = to(Math.max(58, YARDS[i] - 268));
  const front = to(Math.max(46, YARDS[i] - 284));
  const back = to(YARDS[i] - 252);
  const playsLike = toPin + 4;
  const suggestedClub = par === 3 ? '8 iron' : '7 iron';
  const clubAvg = to(148);

  const front9 = rowFor([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const back9 = rowFor([9, 10, 11, 12, 13, 14, 15, 16, 17]);
  const parOut = PARS.slice(0, 9).reduce((a, b) => a + b, 0);
  const parIn = PARS.slice(9).reduce((a, b) => a + b, 0);
  const scoreOut = scores.slice(0, 9).reduce((a: number, v) => a + (v || 0), 0);
  const scoreIn = scores.slice(9).reduce((a: number, v) => a + (v || 0), 0);

  const birdies = played.filter((o) => o.v - PARS[o.k] <= -1).length;
  const pars = played.filter((o) => o.v === PARS[o.k]).length;
  const girPct = played.length ? Math.round((played.filter((o) => gir[o.k]).length / played.length) * 100) : 0;
  const puttsTotal = putts.reduce((a: number, v) => a + (v || 0), 0);

  return {
    accent: ACCENT,
    courseName: COURSE_NAME,
    unitLabel,
    screen,
    setScreen,
    hole,
    par,
    holeYds,
    prevHole,
    nextHole,
    thru: played.length,
    totalScore: played.length ? totalScore : null,
    parThru,
    deltaText,

    // rangefinder
    toPin,
    front,
    back,
    playsLike,
    suggestedClub,
    clubAvg,

    // shot tracking
    showShotLabels: true,
    shots: DEMO_SHOTS.map((s) => ({ ...s, dist: to(s.distYds) })),
    clubAverages: CLUB_AVERAGES.map((c) => ({ ...c, dist: to(c.distYds) })),

    // scorecard
    mode,
    setMode,
    curScore: cur,
    curLabel: labelForScore(cur, par),
    curColor: colorForDelta(cur - par),
    incScore,
    decScore,
    putts,
    curPutt: putts[i],
    setPutt,
    fw,
    curFw: fw[i],
    setFairway,
    gir,
    curGir: gir[i],
    toggleGir,
    saveLabel: hole === 18 ? 'Finish round' : `Save · hole ${hole + 1}`,
    saveNext,
    front9,
    back9,
    parOut,
    parIn,
    scoreOut: scoreOut || null,
    scoreIn: scoreIn || null,

    // recap
    bars,
    birdies,
    pars,
    girPct,
    puttsTotal,

    // leaderboard
    board,
    setBoard,
    leaderboard: buildBoard(),
    feed: GROUP_FEED,
    groupStats: GROUP_STATS,
  };
}

export type DivotState = ReturnType<typeof useDivotState>;
