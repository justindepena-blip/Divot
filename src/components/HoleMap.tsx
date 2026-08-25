import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { CONFIG, TILE_ATTRIBUTION, TILE_URL } from '../config'
import { distance, unit, UNIT_SUFFIX } from '../lib/geo'
import type { Course, LatLng, Position } from '../types'

interface Props {
  /** `shot` additionally draws the logged shot chain for the hole. */
  variant: 'play' | 'shot'
  course: Course | null
  hole: number
  pin: LatLng | null
  pos: Position | null
  shots: LatLng[]
  /** A tap on the imagery moves this hole's pin. */
  onPickPin: (at: LatLng) => void
}

/** Fallback view — northern New Jersey, wide enough to orient by. */
const HOME: L.LatLngExpression = [40.75, -74.2]

export default function HoleMap({
  variant,
  course,
  hole,
  pin,
  pos,
  shots,
  onPickPin,
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerRef = useRef<L.LayerGroup | null>(null)
  /** What the last auto-fit was computed from, so we only re-fit on real change. */
  const fitRef = useRef('')
  const pickRef = useRef(onPickPin)
  pickRef.current = onPickPin

  // Create the map once per mount.
  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const map = L.map(host, { zoomControl: false, attributionControl: true })
    L.tileLayer(TILE_URL, { maxZoom: 19, attribution: TILE_ATTRIBUTION }).addTo(map)
    map.setView(course ? [course.lat, course.lng] : HOME, course ? 16 : 9)
    map.on('click', (e: L.LeafletMouseEvent) =>
      pickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng }),
    )

    mapRef.current = map
    layerRef.current = L.layerGroup().addTo(map)

    // The map lives inside a scrolling column, so it is often laid out after
    // Leaflet has measured it.
    const settle = setTimeout(() => map.invalidateSize(), 150)
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(host)

    return () => {
      clearTimeout(settle)
      observer.disconnect()
      map.remove()
      mapRef.current = null
      layerRef.current = null
    }
    // Deliberately mount-only: `course` seeds the initial view here, and the
    // effect below handles every later change to it.
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Recentre when the player switches course.
  useEffect(() => {
    if (!mapRef.current || !course) return
    fitRef.current = ''
    mapRef.current.setView([course.lat, course.lng], 16)
  }, [course])

  // Redraw pin, fix, the line between them, and the shot chain.
  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return

    layer.clearLayers()
    const points: L.LatLngExpression[] = []

    if (pin) {
      L.circleMarker([pin.lat, pin.lng], {
        radius: 8,
        color: CONFIG.accent,
        weight: 2,
        fillColor: CONFIG.accent,
        fillOpacity: 0.3,
      }).addTo(layer)
      points.push([pin.lat, pin.lng])
    }

    if (pos) {
      L.circleMarker([pos.lat, pos.lng], {
        radius: 5,
        color: '#fff',
        weight: 2,
        fillColor: '#fff',
        fillOpacity: 1,
      }).addTo(layer)
      points.push([pos.lat, pos.lng])
    }

    if (pin && pos) {
      const line = L.polyline(
        [
          [pos.lat, pos.lng],
          [pin.lat, pin.lng],
        ],
        { color: CONFIG.accent, weight: 1.5, dashArray: '5 6' },
      ).addTo(layer)
      if (CONFIG.showShotLabels) {
        line
          .bindTooltip(unit(distance(pos, pin)) + UNIT_SUFFIX, {
            permanent: true,
            direction: 'center',
            className: 'dv-tip',
          })
          .openTooltip()
      }
    }

    if (variant === 'shot') {
      shots.forEach((shot, k) => {
        L.circleMarker([shot.lat, shot.lng], {
          radius: 5,
          color: '#F2F5F4',
          weight: 2,
          fillColor: '#0B0D0E',
          fillOpacity: 1,
        })
          .addTo(layer)
          .bindTooltip(String(k + 1), {
            permanent: true,
            direction: 'top',
            className: 'dv-tip',
          })
        points.push([shot.lat, shot.lng])
      })

      if (shots.length > 1 || (shots.length && pin)) {
        const path: L.LatLngExpression[] = shots.map((s) => [s.lat, s.lng])
        if (pin) path.push([pin.lat, pin.lng])
        L.polyline(path, {
          color: '#F2F5F4',
          weight: 1.2,
          dashArray: '3 5',
          opacity: 0.85,
        }).addTo(layer)
      }
    }

    const signature = `${hole}|${points.length}|${pin ? 1 : 0}`
    if (points.length && fitRef.current !== signature) {
      fitRef.current = signature
      if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 18 })
      else map.setView(points[0], 17)
    }
  }, [variant, hole, pin, pos, shots])

  return <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
}
