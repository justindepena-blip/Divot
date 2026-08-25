import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built app works from any path — a GitHub Pages project
// site (/Divot/), a user site, Netlify Drop, or a plain file server.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: 'assets' },
})
