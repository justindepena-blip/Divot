# Divot

A golf round-tracking app built with Expo SDK 57 and React Native 0.86.

## Play it in a browser

The app is exported as a static site and deployed to GitHub Pages on every push
to `main`:

**https://justindepena-blip.github.io/Divot/**

> **One-time setup:** GitHub Pages must be enabled before the first deploy
> succeeds. Go to **Settings -> Pages -> Build and deployment** and set
> **Source** to **GitHub Actions**, then re-run the "Deploy web to GitHub
> Pages" workflow. The workflow token can deploy to Pages but is not
> permitted to create the Pages site itself, so this step cannot be
> automated.

Nothing to install — open the link on a phone or desktop. On iOS Safari or
Android Chrome, use *Share → Add to Home Screen* for a full-screen, app-like
launcher.

## Run it locally

```bash
npm install
npm start          # Metro bundler — press w for web, or scan the QR code
```

Individual platforms:

```bash
npm run web        # browser
npm run ios        # iOS simulator (macOS only)
npm run android    # Android emulator
```

## Build the static site yourself

```bash
npm run export:web   # outputs to dist/
```

`dist/` is a plain folder of static files. It can be served from any static
host; `npx serve dist` works for a quick local check.

## What's real

| Concern | Source |
| --- | --- |
| Your position | `expo-location`, watched continuously. Permission is requested on first launch. |
| Courses, holes, pars, greens | OpenStreetMap via the Overpass API. Free, no API key. Search is bounded to a New Jersey / New York box. |
| Satellite imagery | Esri World Imagery raster tiles. Free with the attribution shown on the map. |
| Distance to the pin | Haversine from your live fix to the hole's green, recomputed every few metres. |
| Suggested club | Your distance left matched against the club averages in `src/lib/golf.ts`. It changes hole to hole. |
| Storage | `AsyncStorage`, key `divot.v2` — course, pins, card, putts, fairways, GIR and logged shots. |

Tap the course bar on **PLAY** to search any course in NJ or NY by name, or
**NEAR ME** for everything within 30 km. Picking a course loads its holes, pars
and greens and starts a fresh card on hole 1.

OSM hole coverage across NJ/NY is good but not universal. Where a green is
missing, tap it once on the satellite view — that pin is saved for the hole,
and the course sheet tracks progress as "n/18".

### The map

`src/components/SatelliteMap.tsx` places raster tiles directly rather than
wrapping a native maps SDK. The design needs a fixed panel framing one hole,
not a pan-and-zoom map, so computing the tile window by hand keeps one code
path across iOS, Android and the static web export — with no API key and no
native module to configure.

## Still mocked

Live score syncing between players' phones needs a server, so the **GROUP**
screen is still placeholder data. It lives in `src/data.ts`; a real feed
replaces that one file. Supabase's free tier covers round codes and score sync.

Also not built yet: offline tile caching, and a handicap index computed from
completed rounds.

## Notes

- Location needs a secure context. That means HTTPS in production — GitHub
  Pages is HTTPS by default — or `localhost` in development. Over plain
  `http://` from another device the app loads but never gets a fix.
- `expo.experiments.baseUrl` in `app.json` is set to `/Divot` so that asset
  URLs resolve under the GitHub Pages project subpath. If you move the app to
  a root domain, set it back to `""`.
- Expo Snack cannot host this project: Snack supports Expo SDK 50–56 only, and
  this app targets SDK 57.
