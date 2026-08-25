import { useCallback, useState } from 'react'
import { loadCourseLayout, searchCourses } from '../lib/overpass'
import type { RoundApi } from './useRound'
import type { Course, Position } from '../types'

export interface CourseSearch {
  query: string
  setQuery: (q: string) => void
  results: Course[]
  /** Human-readable state of the last search or load. */
  status: string
  busy: boolean
  search: () => void
  nearMe: () => void
  pick: (course: Course) => void
}

const IDLE = 'Search a course, or tap NEAR ME.'

export function useCourseSearch(round: RoundApi, pos: Position | null): CourseSearch {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Course[]>([])
  const [status, setStatus] = useState(IDLE)
  const [busy, setBusy] = useState(false)

  const run = useCallback(
    async (mode: 'name' | 'near') => {
      const text = query.trim()
      if (mode === 'near' && !pos) {
        setStatus('Waiting for a GPS fix — try again in a moment.')
        return
      }
      if (mode === 'name' && text.length < 3) {
        setStatus('Type at least three letters.')
        return
      }

      setBusy(true)
      setStatus(
        mode === 'near' ? 'Looking for courses within 30 km…' : 'Searching NJ and NY…',
      )
      try {
        const found = await searchCourses(mode, text, pos)
        setResults(found)
        setStatus(
          found.length
            ? `${found.length} course${found.length === 1 ? '' : 's'} found.`
            : 'Nothing found — try a shorter name.',
        )
      } catch {
        setStatus("Couldn't reach the map data service. Check the connection.")
      } finally {
        setBusy(false)
      }
    },
    [query, pos],
  )

  const pick = useCallback(
    async (course: Course) => {
      round.startCourse(course)
      setStatus(`Loading holes for ${course.name}…`)
      try {
        const layout = await loadCourseLayout(course)
        round.applyLayout(layout)
        const loaded = Object.keys(layout.holes).length
        setStatus(
          loaded
            ? `${loaded} holes loaded · ${layout.withGreens} greens located`
            : 'No hole data mapped for this course yet — tap each green on the satellite view to set its pin.',
        )
      } catch {
        setStatus(
          "Loaded the course, but hole data didn't come through. Tap greens on the map to set pins.",
        )
      }
    },
    [round],
  )

  return {
    query,
    setQuery,
    results,
    status,
    busy,
    search: () => void run('name'),
    nearMe: () => void run('near'),
    pick: (course) => void pick(course),
  }
}
