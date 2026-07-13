import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is '/' by default — correct for Vercel, Netlify, and Crazy Domains, which all
// serve this site from the domain root. GitHub Pages project sites are the one exception:
// they're served from a /<repo-name>/ subpath, so `npm run build:ghpages` (used by the
// `predeploy` script below) builds with base: '/lewis-partners/' instead. See CLAUDE.md §12.
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  base: mode === 'ghpages' ? '/lewis-partners/' : '/',

  server: {
    host: "0.0.0.0",
    port: 5173,
  }
}))