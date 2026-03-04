# Lewis Partners Website
Developer Project Manual

Last Updated: 2026-03-03
Author: Kwai Chan

---

# 1. Project Overview

This project is a modern replacement website for Lewis Partners, replacing an existing broken site.

Current Status:
- Draft v1 complete
- Hosted on GitHub Pages for preview
- Client feedback phase pending
- Email integration pending
- Production hosting migration pending

Primary Objectives:
- Clean professional presentation
- Modern frontend stack
- Scalable deployment model
- Simple maintenance workflow

---

# 2. Technical Stack

Frontend:
- React (Vite)
- CSS component-scoped styling
- Static hosting model

Tooling:
- Node.js
- npm
- gh-pages (GitHub Pages deployment)
- Git / GitHub

Planned Production Hosting:
- Vercel (recommended)

Domain Registrar:
- Crazy Domains

---

# 3. Architecture Overview

## Preview Architecture (GitHub Pages)

Browser
   ↓
GitHub Pages
   ↓
Static Vite Build (dist/)
   ↓
React SPA (anchor-based navigation)

## Production Architecture (Recommended)

Browser
   ↓
Custom Domain
   ↓
Vercel CDN
   ↓
GitHub (source control)
   ↓
Vite build pipeline

---

# 4. Folder Structure

lewis-partners/
│
├── public/
├── src/
│   ├── components/
│   ├── data/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── vite.config.js
├── package.json
└── PROJECT_MANUAL.md

---

# 5. Key Configuration Files

## vite.config.js

Important for GitHub Pages:

base: '/lewis-partners/'

Remove base when deploying to Vercel.

---

## package.json (Deployment)

Scripts:

"predeploy": "npm run build"
"deploy": "gh-pages -d dist"

---

# 6. Startup Commands

Install dependencies:

npm install

Run development server:

npm run dev

Build production:

npm run build

Deploy to GitHub Pages:

npm run deploy

---

# 7. Branch Strategy

main
→ Stable production-ready branch

draft-v1
→ Active working branch

gh-pages
→ Auto-generated deployment branch

Workflow:
- Develop on draft-v1
- Merge to main when stable
- Deploy intentionally

---

# 8. Data Layer Design

All content centralised in:

src/data/siteData.js

Components rely on strict shape consistency.
Do not change property names without updating components.

---

# 9. Email Integration Plan

Current:
- Simulated submission

Planned Options:
- EmailJS (recommended initial solution)
- Vercel serverless function
- Full backend API

---

# 10. Domain & DNS Plan

Domain remains with Crazy Domains.
Hosting recommended: Vercel.

DNS:
- Update A record
- Update CNAME (www)
- Do NOT remove MX records
- Preserve email configuration

---

# 11. Known Constraints

- Static SPA
- No backend validation
- No analytics yet
- No SEO optimisation yet

---

# 12. Risk Notes

- GitHub Pages requires base path
- DNS misconfiguration may disrupt email
- Hosting cancellation timing must be confirmed

---

# 13. Future Enhancements

Phase 2:
- Email wiring
- SEO meta tags
- Google Analytics
- Sitemap.xml

Phase 3:
- Blog capability
- Booking integration
- Client portal

---

# 14. Maintenance Strategy

- Dependency updates quarterly
- Content review bi-annually
- Hosting review annually
- Domain renewal monitoring

---

# 15. Development Philosophy

- Keep data centralised
- Avoid over-engineering
- Prefer static simplicity
- Deploy stable states only
