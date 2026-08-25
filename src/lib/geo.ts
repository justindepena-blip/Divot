import { LatLng, Units } from '../types';

const EARTH_R = 6371000;
const RAD = Math.PI / 180;
const M_TO_YD = 1.09361;
const YD_TO_M = 0.9144;

/** Great-circle distance between two fixes, in **yards** (the app's base unit). */
export function distance(a: LatLng, b: LatLng): number {
  const dLat = (b.lat - a.lat) * RAD;
  const dLng = (b.lng - a.lng) * RAD;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_R * Math.asin(Math.sqrt(h)) * M_TO_YD;
}

/** Yards into the player's chosen display unit, rounded. */
export const toUnits = (yards: number, units: Units) =>
  units === 'meters' ? Math.round(yards * YD_TO_M) : Math.round(yards);

export const metresToYards = (m: number) => m * M_TO_YD;

// ── Web Mercator ────────────────────────────────────────────────────────────
// Enough projection maths to place XYZ raster tiles and turn a tap back into a
// coordinate. Same scheme every slippy-map tile server uses.

export const TILE_SIZE = 256;

export type Point = { x: number; y: number };

/** Latitude/longitude to absolute pixel coordinates at a given zoom. */
export function project(at: LatLng, zoom: number): Point {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const lat = Math.max(-85.05112878, Math.min(85.05112878, at.lat));
  const sin = Math.sin(lat * RAD);
  return {
    x: ((at.lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

/** The inverse — absolute pixel coordinates back to latitude/longitude. */
export function unproject(point: Point, zoom: number): LatLng {
  const scale = TILE_SIZE * Math.pow(2, zoom);
  const lng = (point.x / scale) * 360 - 180;
  const n = Math.PI - 2 * Math.PI * (point.y / scale);
  const lat = (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
  return { lat, lng };
}

/**
 * The highest zoom at which every point still fits inside `width`×`height`
 * with `padding` to spare. Falls back to `maxZoom` for a single point.
 */
export function zoomToFit(
  points: LatLng[],
  width: number,
  height: number,
  padding: number,
  minZoom: number,
  maxZoom: number,
): number {
  if (points.length < 2) return maxZoom;

  const usableW = Math.max(1, width - padding * 2);
  const usableH = Math.max(1, height - padding * 2);

  for (let zoom = maxZoom; zoom > minZoom; zoom--) {
    const projected = points.map((p) => project(p, zoom));
    const xs = projected.map((p) => p.x);
    const ys = projected.map((p) => p.y);
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    if (spanX <= usableW && spanY <= usableH) return zoom;
  }
  return minZoom;
}

/** Midpoint of a set of coordinates, in projected space so it stays true. */
export function centerOf(points: LatLng[], zoom: number): LatLng {
  const projected = points.map((p) => project(p, zoom));
  const xs = projected.map((p) => p.x);
  const ys = projected.map((p) => p.y);
  return unproject(
    { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 },
    zoom,
  );
}
