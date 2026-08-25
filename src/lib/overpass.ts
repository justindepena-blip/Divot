import { distance, metresToYards } from './geo';
import { Course, HoleData, LatLng, Position } from '../types';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
/** Bounding box covering New Jersey and New York. */
const NY_NJ_BBOX = '38.85,-79.80,45.02,-71.85';

type OverpassElement = {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

async function query(body: string): Promise<{ elements?: OverpassElement[] }> {
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: 'data=' + encodeURIComponent(body),
  });
  if (!res.ok) throw new Error('map data service returned ' + res.status);
  return res.json();
}

/** `center` for ways and relations, the element itself for nodes. */
function pointOf(el: OverpassElement): LatLng | null {
  if (el.center) return { lat: el.center.lat, lng: el.center.lon };
  if (el.lat != null && el.lon != null) return { lat: el.lat, lng: el.lon };
  return null;
}

/**
 * Golf courses by name across NJ/NY, or everything within 30 km of a fix.
 * Sorted by distance from the player when a fix is available.
 */
export async function searchCourses(
  mode: 'name' | 'near',
  text: string,
  pos: Position | null,
): Promise<Course[]> {
  const q =
    mode === 'near' && pos
      ? `[out:json][timeout:25];nwr["leisure"="golf_course"](around:30000,${pos.lat},${pos.lng});out center tags 40;`
      : `[out:json][timeout:25];nwr["leisure"="golf_course"]["name"~"${text.replace(
          /["\\]/g,
          '',
        )}",i](${NY_NJ_BBOX});out center tags 40;`;

  const data = await query(q);
  const seen = new Set<string>();
  const found: Course[] = [];

  for (const el of data.elements ?? []) {
    const point = pointOf(el);
    const name = el.tags?.name;
    if (!name || !point || seen.has(name)) continue;
    seen.add(name);
    const tags = el.tags ?? {};
    found.push({
      id: `${el.type}/${el.id}`,
      name,
      lat: point.lat,
      lng: point.lng,
      city: (tags['addr:city'] || tags['addr:state'] || tags.operator || '').slice(0, 34),
    });
  }

  found.sort((a, b) => (pos ? distance(pos, a) - distance(pos, b) : a.name.localeCompare(b.name)));
  return found;
}

export type CourseLayout = {
  holes: Record<number, HoleData>;
  holeCount: number;
  /** How many loaded holes came back with a green attached. */
  withGreens: number;
};

/**
 * Holes, pars, lengths and greens for one course. OSM rarely links a hole to
 * its green, so each hole takes the nearest mapped green inside 700 yards.
 */
export async function loadCourseLayout(course: Course): Promise<CourseLayout> {
  const around = `(around:1800,${course.lat},${course.lng})`;
  const data = await query(
    `[out:json][timeout:30];nwr["golf"="hole"]${around};out center tags;` +
      `nwr["golf"="green"]${around};out center tags;`,
  );

  const rawHoles: { n: number; par: number | null; dist: number | null; at: LatLng }[] = [];
  const greens: LatLng[] = [];

  for (const el of data.elements ?? []) {
    const point = pointOf(el);
    const tags = el.tags ?? {};
    if (!point) continue;
    if (tags.golf === 'hole') {
      rawHoles.push({
        n: parseInt(tags.ref, 10),
        par: parseInt(tags.par, 10) || null,
        dist: tags.dist ? Math.round(metresToYards(parseFloat(tags.dist))) : null,
        at: point,
      });
    } else if (tags.golf === 'green') {
      greens.push(point);
    }
  }

  const holes: Record<number, HoleData> = {};
  let holeCount = 0;

  rawHoles.forEach((hole, idx) => {
    const n = hole.n || idx + 1;
    if (!n || n > 18) return;
    holeCount = Math.max(holeCount, n);

    let green: LatLng | null = null;
    let best = Infinity;
    for (const candidate of greens) {
      const d = distance(hole.at, candidate);
      if (d < best && d < 700) {
        best = d;
        green = candidate;
      }
    }
    holes[n] = { par: hole.par, dist: hole.dist, green, tee: hole.at };
  });

  return {
    holes,
    holeCount: holeCount || 18,
    withGreens: Object.keys(holes).filter((k) => holes[Number(k)].green).length,
  };
}
