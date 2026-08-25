# Divot

Free golf GPS, scorecard and shot tracking. Real device location, real
OpenStreetMap course data for New Jersey and New York, real satellite imagery.
No accounts, no paywalls, no fees.

React + TypeScript + Vite. Builds to a static site you can host anywhere and add
to your phone's home screen.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the built output
```

Geolocation needs a **secure context**: `localhost` in development, HTTPS in
production. Opened over plain `http://` from another device, the app loads but
never gets a fix.

## Deploy

`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to
`main`. Turn it on once: **Settings → Pages → Source: GitHub Actions**. The app
then lives at `https://<user>.github.io/<repo>/`.

The build uses a relative base, so the same `dist/` also works on Netlify Drop,
Cloudflare Pages, or any static host without reconfiguring.

On your phone: open the URL → **Share → Add to Home Screen**. It launches full
screen, and the round persists on the device.

## The five screens

| Screen | What it does |
| --- | --- |
| **PLAY** | Rangefinder. Live distance to the pin, front/back, plays-like, and a club suggestion computed per hole from your averages. |
| **SHOTS** | Drops a GPS point at each ball position and measures every leg, over satellite imagery. |
| **CARD** | Scorecard, two ways: `TAP` (one hole at a time, with putts, tee shot and GIR) or `GRID` (all 18 at once). |
| **RECAP** | Totals versus par, hole-by-hole bars, birdies, pars, greens in regulation, putts. |
| **GROUP** | Live leaderboard, gross or net, plus share-a-round. **Mocked** — see below. |

Tapping the course bar on PLAY opens course search: any course in NJ or NY by
name, or `NEAR ME` for everything within 30 km.

## How it works

| Concern | Source |
| --- | --- |
| Courses, holes, pars, greens | OpenStreetMap via the Overpass API. Free, no key. Search is bounded to the NJ/NY box. |
| Satellite imagery | Esri World Imagery tiles, drawn with Leaflet. Free with attribution, shown bottom-right. |
| Distances | Haversine from the device's `watchPosition` fix to the hole's green. |
| Storage | `localStorage`, key `divot.v2` — course, pins, card, putts, fairways, GIR, shots. |

OSM hole coverage across NJ/NY is good but not universal. Where a green is
missing, tap it once on the satellite view and that pin is saved for the hole.

## Layout

```
src/
  App.tsx              screen switching, sheets, wiring
  config.ts            accent, units, tile + Overpass endpoints
  theme.ts             design tokens from the source design
  screens/             Rangefinder, Shots, Scorecard, Recap, Group
  sheets/              CourseSheet (search), ShareSheet
  components/          HoleMap, TabBar, HoleStepper, MapFrame, Segmented, Sheet
  lib/                 geo, golf, overpass, round, derive, leaderboard, storage
  state/               useRound, useGeolocation, useCourseSearch
```

`lib/derive.ts` turns the saved round plus the current fix into everything the
screens render — every distance, colour and total lives there rather than in the
components.

### Settings

`src/config.ts` holds the three tweakables the design exposed: `accent`,
`units` (`yards` | `meters`), and `showShotLabels`. The design has no settings
screen, so they stay configuration — change the value and rebuild.

## Not real yet

- **Live score sync between players' phones.** Needs a server. The GROUP screen
  and the round-share sheet render the design's placeholder group; the data
  lives in `src/lib/leaderboard.ts` so a real feed replaces one file. Supabase's
  free tier covers round codes and score sync.
- **Offline tile caching.** Map tiles need signal. A service worker would fix it.
- **Handicap index** from completed rounds — the leaderboard's HCP values are
  fixed placeholders.

## Design source

The design this implements lives in `project/`, exported from Claude Design:
`project/Divot Golf.dc.html` is the authored design, `chats/` is the
conversation it came out of, and `docs/handoff.md` is the original handoff note.
`project/site/` and `project/divot-app.html` are the older single-file prototype
export — superseded by this app, kept for reference.
