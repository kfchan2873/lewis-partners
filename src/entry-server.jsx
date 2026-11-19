// src/entry-server.jsx
//
// Build-time only: scripts/prerender.js bundles this with `vite build --ssr`
// and calls render() to bake the page's HTML into dist/index.html, so search
// engines get real content without running JS. main.jsx then hydrates it.

import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App.jsx'

export function render() {
  const base = import.meta.env.BASE_URL
  return renderToString(
    <StrictMode>
      <StaticRouter location={base} basename={base}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>,
  )
}
