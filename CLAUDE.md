# CLAUDE.md — Lewis Partners Website Project

> This file is the AI context document for the Lewis Partners website project.
> It gives Claude (or any AI assistant) a full understanding of the project
> structure, decisions made, and how to extend or modify the codebase correctly.

---

## 1. Project Overview

**Client:** Lewis Partners Accountants PTY LTD
**Principal:** Kenneth Lewis (IPA, Deakin University graduate, Registered Tax Agent #24251007)
**Address:** Unit 5, 40 Station Street, Bayswater VIC 3153
**Phone:** 1800 080 833
**Email:** admin@lewispartners.com.au
**Domain:** lewispartners.com.au (registered via Crazy Domains / Dreamscape Networks)
**Registrant entity:** Yarra Ranges Taxation Services PTY LTD (ACN 007 294 279)

**Project type:** Static marketing website — 1 page with anchor-based navigation (SPA feel)
**Tech stack:** Vite + React 18 + JSX · Plain CSS (no Tailwind, no CSS-in-JS)
**Deployment target:** Static files → Crazy Domains hosting, or Vercel/Netlify

---

## 2. Why Vite + React (not plain HTML)

The client needs:
- A plain-English admin content editing layer (requires React state)
- Interactive contact form with validation
- Future interactivity: booking widgets, animations, potential client portal
- Scroll-triggered animations (useScrollReveal hook)

React was chosen over plain HTML to avoid DOM-manipulation spaghetti as the
site grows. Vite produces static output (`dist/`) identical to plain HTML for hosting purposes.

---

## 3. Project File Structure

```
lewis-partners/
├── CLAUDE.md                        ← You are here
├── README.md                        ← Developer quick-start
├── index.html                       ← HTML shell / entry point
├── vite.config.js                   ← Vite config (React plugin)
├── package.json                     ← Dependencies: react, react-dom, vite
│
└── src/
    ├── main.jsx                     ← ReactDOM.createRoot entry
    ├── App.jsx                      ← Root: composes all sections + admin toggle
    ├── App.css                      ← Admin bar styles
    ├── index.css                    ← Global CSS variables, resets, utilities
    │
    ├── data/
    │   └── siteData.js              ← ⭐ SINGLE SOURCE OF TRUTH for all content
    │
    ├── hooks/
    │   └── useScrollReveal.js       ← IntersectionObserver fade-up hook
    │
    └── components/
        ├── Navbar.jsx / .css        ← Fixed nav, scroll-aware active state, mobile menu
        ├── Hero.jsx / .css          ← Full-height landing, animated stats
        ├── Services.jsx / .css      ← 6-card service grid, hover animations
        ├── About.jsx / .css         ← Bio, floating credential cards, LinkedIn link
        ├── Testimonials.jsx / .css  ← Client testimonial cards
        ├── Feedback.jsx / .css      ← Enquiry form with full validation + success state
        ├── Contact.jsx / .css       ← Hours table, Google Maps iframe, contact items
        ├── Footer.jsx / .css        ← 3-column footer
        └── AdminPanel.jsx / .css    ← Plain-English content editor panel (prototype)
```

---

## 4. Content Architecture — siteData.js

**All user-facing text, contact details, services, hours, and testimonials
live exclusively in `src/data/siteData.js`.** Components import from this file
and never hardcode content strings.

### Exported objects:

| Export | Purpose |
|--------|---------|
| `firm` | Business details: name, address, phone, email, hours array, maps URL |
| `hero` | Hero section: badge, headline array, subheading, CTA labels, stats |
| `services` | Array of `{ icon, title, description }` — drives the services grid |
| `about` | Kenneth's bio: name, title, credentials, bio paragraphs array, badges, LinkedIn |
| `testimonials` | Array of `{ stars, text, name, role, initials }` |
| `navLinks` | Array of `{ label, href }` for navigation |

### Trading hours format:
```js
hours: [
  { day: 'Monday',   open: '9:00 AM', close: '5:00 PM' },
  { day: 'Sunday',   open: null,      close: null },  // null = Closed
]
```
The `Contact` component automatically highlights today's row using `new Date()`.

---

## 5. Component Details

### Navbar
- Fixed position, transparent over hero, turns cream/solid on scroll
- `scrolled` state via `window.addEventListener('scroll')`
- Active link highlighted by comparing `window.scrollY` to section offsets
- Mobile hamburger menu (hidden on desktop via CSS)
- Receives `adminMode` boolean and `onAdminToggle` from App

### Hero
- Full viewport height, dark navy background (`var(--ink-dark)`)
- Decorative radial gradient orb + oversized quote mark (CSS pseudo)
- Staggered `fade-up` animations via CSS `animation-delay`
- Scroll indicator with pulsing animation

### Services
- Reads `services` array from siteData — add/remove services there only
- `ServiceCard` sub-component tracks hover state via `useState`
- Arrow icon slides in on hover (CSS transform + opacity)
- Motto banner below grid pulls from `firm.motto`
- `useScrollReveal` applied per-card with staggered delay

### About
- Two floating credential cards: IPA (gold) + Deakin University (blue)
- `about__img-placeholder` should be replaced with `<img>` once photo is supplied
  → Place photo at `public/kenneth-lewis.jpg` and update the JSX comment
- LinkedIn button styled to match LinkedIn brand colour (#0077b5)
- `about.badges` array drives the credential badge strip

### Testimonials
- Three cards, each with `useScrollReveal` + staggered delay
- Star rating rendered from `t.stars` count
- CTA nudge at bottom links to `#contact`

### Feedback (Contact Form)
- Controlled form via `useState(INITIAL_FORM)`
- Client-side validation in `validate()` function — returns error object
- Errors clear on field change
- Character counter on message textarea
- Simulated async submit (1.2s timeout) — **replace with real API call in production**
- `SuccessMessage` sub-component shows personalised confirmation with first name
- Enquiry types pulled from `ENQUIRY_TYPES` constant in the component
  (these could be moved to siteData.js if the client wants to manage them)

### Contact
- `contactItems` array built from `firm` data
- Trading hours table from `firm.hours` array
- `getTodayName()` highlights current day's row automatically
- Google Maps iframe uses `firm.googleMapsEmbedUrl`
  **Note:** The embed URL in siteData.js is approximate. For production,
  generate the exact embed URL from Google Maps → Share → Embed a map.
- `position: sticky` on the map column (desktop only)

### AdminPanel
- Prototype of the plain-English content editing layer
- In production this would POST the instruction to an AI API (e.g. Claude API)
  which modifies siteData.js and triggers a Vite rebuild + deploy
- Currently simulates async processing with a setTimeout
- Shows a change log queue with timestamps
- Includes example instructions to demonstrate the concept to the client

### Footer
- 3-column: brand/motto | navigation | contact details
- Reads from `firm` and `navLinks`
- Dynamically generates copyright year with `new Date().getFullYear()`

---

## 6. Styling System

### CSS Variables (defined in index.css)
```css
--ink:        #1c2fa0   /* Primary blue (brand match) */
--ink-dark:   #0f1a5e   /* Darker navy for backgrounds */
--gold:       #c9a84c   /* Accent gold (from Lewis Partners branding) */
--gold-light: #e8c97a   /* Lighter gold for hover states */
--cream:      #faf8f3   /* Page background */
--warm-grey:  #f0ece3   /* Alternating section background */
--text:       #3d3d4e   /* Body text */
--muted:      #8a8a9a   /* Secondary text, labels */
```

### Typography
- **Display / headings:** Playfair Display (Google Fonts) — serif, italic for emphasis
- **Body:** DM Sans (Google Fonts) — clean, geometric sans-serif
- Font loaded in `index.html` via Google Fonts link tag

### Animation
- `useScrollReveal` hook uses `IntersectionObserver` — triggers once on entry
- `.fade-up` class in `index.css` applies the `fadeUp` keyframe
- Staggered delays via inline `style={{ animationDelay: '0.Xs' }}`
- Hover micro-interactions via CSS `transition` on individual elements

### Section alternating backgrounds
```
Hero         → var(--ink-dark)   dark navy
Services     → var(--cream)      light cream
About        → var(--warm-grey)  warm grey
Testimonials → var(--cream)
Feedback     → var(--ink-dark)   dark (form on dark bg)
Contact      → var(--warm-grey)
Footer       → #080e2e           deep navy
```

---

## 7. Known Items / Pending

| Item | Status | Notes |
|------|--------|-------|
| Kenneth's photo | ⏳ Pending | Replace placeholder in About.jsx — add to `public/` |
| Google Maps embed URL | ⚠️ Approximate | Generate exact URL from Google Maps → Share → Embed |
| Form submission | 🔧 Simulated | Wire to EmailJS, Formspree, or a serverless function |
| LinkedIn URL | ⚠️ Placeholder | Confirm Kenneth's actual LinkedIn URL |
| Entity clarification | ❓ Unconfirmed | Is "Lewis Partners" a trading name of Yarra Ranges Taxation Services PTY LTD? |
| Domain hosting | 🔧 Broken | Crazy Domains account needs hosting renewed/configured |
| Admin CMS layer | 🔭 Prototype | AdminPanel.jsx is a UI prototype — needs AI API backend |

---

## 8. Running the Project

```bash
# Install dependencies
npm install

# Development (hot reload at http://localhost:5173)
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

## 9. Deployment

The `dist/` folder after `npm run build` contains static files only.

**Option A — Vercel (recommended):**
```bash
npm i -g vercel
vercel deploy
```

**Option B — Netlify:**
Drag and drop the `dist/` folder at netlify.com/drop

**Option C — Crazy Domains (existing hosting):**
Upload contents of `dist/` to `public_html/` via FTP.
Point lewispartners.com.au DNS to hosting server.

---

## 10. How to Add New Content

### Add a service:
In `siteData.js`, add to the `services` array:
```js
{ icon: '📑', title: 'Payroll & STP', description: 'Your description here.' }
```

### Add a testimonial:
In `siteData.js`, add to `testimonials`:
```js
{ stars: 5, text: '...', name: 'Jane Smith', role: 'Plumber, Ringwood', initials: 'JS' }
```

### Add a new page:
1. Create `src/components/NewPage.jsx` + `NewPage.css`
2. Add route using React Router (install: `npm i react-router-dom`)
3. Add link to `navLinks` in siteData.js

### Update trading hours:
Edit the `hours` array in `firm` in siteData.js.
Set `open: null, close: null` for closed days.

---

*Last updated: February 2026*
*Project managed by: [Your name/agency]*
