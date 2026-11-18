import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {
  buildHeadTags,
  buildRobotsTxt,
  buildSitemapXml,
} from './src/seo/headTags.js'

// Injects SEO <head> tags into index.html (at the <!-- seo:head --> marker) and
// emits robots.txt + sitemap.xml — all generated from src/data/siteData.js.
// See CLAUDE.md §14.
function seoPlugin() {
  let isSsrBuild = false
  return {
    name: 'lewis-partners-seo',
    configResolved(config) {
      isSsrBuild = Boolean(config.build.ssr)
    },
    transformIndexHtml(html) {
      return html.replace('<!-- seo:head -->', buildHeadTags())
    },
    generateBundle() {
      if (isSsrBuild) return
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt() })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml() })
    },
  }
}

// base is '/' by default — correct for Vercel, Netlify, and Crazy Domains, which all
// serve this site from the domain root. GitHub Pages project sites are the one exception:
// they're served from a /<repo-name>/ subpath, so `npm run build:ghpages` (used by the
// `predeploy` script below) builds with base: '/lewis-partners/' instead. See CLAUDE.md §12.
export default defineConfig(({ mode }) => ({
  plugins: [react(), seoPlugin()],

  base: mode === 'ghpages' ? '/lewis-partners/' : '/',

  server: {
    host: "0.0.0.0",
    port: 5173,
  }
}))
