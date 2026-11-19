// scripts/prerender.js
//
// Runs after the client build (see package.json "build" / "build:ghpages"):
//   1. bundles src/entry-server.jsx for Node with `vite build --ssr`, using the
//      same mode as the client build so BASE_URL (asset paths, router basename) matches
//   2. renders the app to an HTML string
//   3. inserts it into dist/index.html's empty <div id="root"></div>
// main.jsx then hydrates that markup instead of rendering from scratch.
//
// Usage: node scripts/prerender.js [--mode ghpages]

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const modeFlag = process.argv.indexOf('--mode')
const mode = modeFlag !== -1 ? process.argv[modeFlag + 1] : 'production'

const ssrOutDir = path.join(root, 'node_modules/.prerender')
const htmlPath = path.join(root, 'dist/index.html')
const ROOT_DIV = '<div id="root"></div>'

await build({
  root,
  mode,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-server.jsx',
    outDir: ssrOutDir,
    emptyOutDir: true,
    copyPublicDir: false,
  },
})

const { render } = await import(pathToFileURL(path.join(ssrOutDir, 'entry-server.js')).href)
const appHtml = render()

const html = fs.readFileSync(htmlPath, 'utf8')
if (!html.includes(ROOT_DIV)) {
  throw new Error(`prerender: ${ROOT_DIV} not found in dist/index.html (already prerendered?)`)
}
// No whitespace around appHtml — stray text nodes inside #root break hydration.
fs.writeFileSync(htmlPath, html.replace(ROOT_DIV, `<div id="root">${appHtml}</div>`))
fs.rmSync(ssrOutDir, { recursive: true, force: true })

console.log(`prerender (${mode}): wrote ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`)
