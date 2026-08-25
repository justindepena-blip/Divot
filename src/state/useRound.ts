import { useCallback, useEffect, useMemo, useState } from 'react'
import { freshCard, loadRound, saveRound } from '../lib/storage'
import { holeKey } from '../lib/round'
import type { CourseLayout } from '../lib/overpass'
import type { Course, Fairway, LatLng, RoundState } from '../types'

export interface RoundApi {
  round: RoundState
  goToHole: (hole: number) => void
  nextHole: () => void
  prevHole: () => void
  setTee: (tee: number) => void
  setScore: (hole: number, score: number) => void
  setPutts: (hole: number, putts: number) => void
  setFairway: (hole: number, fw: Fairway) => void
  toggleGir: (hole: number) => void
  /** Move this hole's pin — a tap on the satellite view, or the player's own fix. */
  setPin: (at: LatLng) => void
  /** Log a shot at the given position on the current hole. */
  addShot: (at: LatLng) => void
  /** Switch course: keeps nothing but the tee choice, and starts on hole 1. */
  startCourse: (course: Course) => void
  applyLayout: (layout: CourseLayout) => void
}

export function useRound(): RoundApi {
  const [round, setRound] = useState<RoundState>(loadRound)

  // Every change is durable — a round survives the phone locking mid-fairway.
  useEffect(() => saveRound(round), [round])

  const patch = useCallback(
    (fn: (prev: RoundState) => Partial<RoundState>) =>
      setRound((prev) => ({ ...prev, ...fn(prev) })),
    [],
  )

  /** Immutably write one hole's entry in a per-hole array. */
  const setCell = useCallback(
    <K extends 'scores' | 'putts' | 'fw' | 'gir'>(
      key: K,
      hole: number,
      value: RoundState[K][number],
    ) =>
      patch((prev) => {
        const next = prev[key].slice() as RoundState[K]
        next[hole - 1] = value
        return { [key]: next } as Partial<RoundState>
      }),
    [patch],
  )

  return useMemo<RoundApi>(
    () => ({
      round,
      goToHole: (hole) => patch(() => ({ hole })),
      nextHole: () =>
        patch((prev) => ({ hole: Math.min(prev.holeCount || 18, prev.hole + 1) })),
      prevHole: () => patch((prev) => ({ hole: Math.max(1, prev.hole - 1) })),
      setTee: (tee) => patch(() => ({ tee })),
      setScore: (hole, score) => setCell('scores', hole, score),
      setPutts: (hole, putts) => setCell('putts', hole, putts),
      setFairway: (hole, fw) => setCell('fw', hole, fw),
      toggleGir: (hole) => patch((prev) => {
        const gir = prev.gir.slice()
        gir[hole - 1] = !gir[hole - 1]
        return { gir }
      }),
      setPin: (at) =>
        patch((prev) =>
          prev.course ? { pins: { ...prev.pins, [holeKey(prev, prev.hole)]: at } } : {},
        ),
      addShot: (at) =>
        patch((prev) => {
          const key = holeKey(prev, prev.hole)
          return { shots: { ...prev.shots, [key]: [...(prev.shots[key] ?? []), at] } }
        }),
      startCourse: (course) =>
        patch(() => ({ course, holes: {}, holeCount: 18, ...freshCard() })),
      applyLayout: (layout) =>
        patch(() => ({ holes: layout.holes, holeCount: layout.holeCount })),
    }),
    [round, patch, setCell],
  )
}
