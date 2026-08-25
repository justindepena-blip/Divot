import { useCallback, useEffect, useRef, useState } from 'react'
import type { GpsState, Position } from '../types'

export interface Gps {
  state: GpsState
  pos: Position | null
  error: string | null
  /** Drop the current watch and start a new one — the RETRY control. */
  retry: () => void
}

/**
 * A continuous watch on the device's location. Needs a secure context (HTTPS or
 * localhost) and a granted permission prompt; both fail loudly rather than
 * silently reporting a stale fix.
 */
export function useGeolocation(): Gps {
  const [state, setState] = useState<GpsState>('locating')
  const [pos, setPos] = useState<Position | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const watchId = useRef<number | null>(null)

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState('error')
      setError('No location on this device')
      return
    }

    setState('locating')
    watchId.current = navigator.geolocation.watchPosition(
      (p) => {
        setState('locked')
        setError(null)
        setPos({
          lat: p.coords.latitude,
          lng: p.coords.longitude,
          acc: Math.max(1, Math.round(p.coords.accuracy)),
        })
      },
      (e) => {
        setState('error')
        setError(
          e.code === e.PERMISSION_DENIED
            ? 'Location permission denied'
            : 'Waiting for a GPS fix',
        )
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 20000 },
    )

    return () => {
      if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { state, pos, error, retry }
}
