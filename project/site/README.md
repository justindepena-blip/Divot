# Divot

Free golf GPS, scorecard and shot tracking. One static HTML file — no build step, no server, no fees.

## Deploy on GitHub Pages

1. Copy the contents of this folder into the repo root (or a `docs/` folder) on the `main` branch.
2. Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)` (or `/docs`).
3. Wait for the green check, then open `https://<user>.github.io/Divot/`.
4. On your phone: Share → Add to Home Screen. It launches full screen.

HTTPS is required for geolocation. GitHub Pages is HTTPS by default.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app, self-contained (React, Leaflet and all UI inlined). |
| `manifest.webmanifest` | Home-screen install metadata. |
| `icon.svg` | App icon. |
| `.nojekyll` | Stops Jekyll from touching the files. |

To install as a home-screen app, add this inside `<head>` of `index.html`:

```html
<link rel="manifest" href="./manifest.webmanifest">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

## Data sources

- **Courses, holes, pars, greens** — OpenStreetMap via the Overpass API. Free, no key. Query bounded to NJ/NY.
- **Satellite imagery** — Esri World Imagery tiles. Free with attribution (shown bottom-right).
- **Distances** — haversine from the device's `watchPosition` GPS to the hole's green.
- **Storage** — `localStorage` key `divot.v2` (course, pins, card, shots).

## Not built yet

- Live score sync between players' phones (needs a backend — Supabase free tier is enough).
- Offline tile caching (service worker).
- Handicap index calculation from completed rounds.
