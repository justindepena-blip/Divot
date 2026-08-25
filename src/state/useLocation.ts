import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { GpsState, Position } from '../types';

export type Gps = {
  state: GpsState;
  pos: Position | null;
  error: string | null;
  /** Drop the current watch and ask again — the RETRY control. */
  retry: () => void;
};

/**
 * A continuous watch on the device's location. On web this needs a secure
 * context; on iOS and Android it needs the foreground permission, which is
 * requested here on first mount.
 */
export function useLocation(): Gps {
  const [state, setState] = useState<GpsState>('locating');
  const [pos, setPos] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const subscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState('locating');

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (cancelled) return;
        if (status !== Location.PermissionStatus.GRANTED) {
          setState('error');
          setError('Location permission denied');
          return;
        }

        const watch = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            // A golfer walks; recompute the yardage every few metres.
            distanceInterval: 3,
            timeInterval: 2000,
          },
          (reading) => {
            if (cancelled) return;
            setState('locked');
            setError(null);
            setPos({
              lat: reading.coords.latitude,
              lng: reading.coords.longitude,
              acc: Math.max(1, Math.round(reading.coords.accuracy ?? 0)),
            });
          },
        );

        if (cancelled) {
          watch.remove();
          return;
        }
        subscription.current = watch;
      } catch {
        if (cancelled) return;
        setState('error');
        setError('Waiting for a GPS fix');
      }
    })();

    return () => {
      cancelled = true;
      subscription.current?.remove();
      subscription.current = null;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { state, pos, error, retry };
}
