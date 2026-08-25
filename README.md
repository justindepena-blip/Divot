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

## Notes

- `expo.experiments.baseUrl` in `app.json` is set to `/Divot` so that asset
  URLs resolve under the GitHub Pages project subpath. If you move the app to
  a root domain, set it back to `""`.
- Expo Snack cannot host this project: Snack supports Expo SDK 50–56 only, and
  this app targets SDK 57.
