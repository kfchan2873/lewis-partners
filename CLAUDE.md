# CLAUDE.md — Lewis Partners Website Project

> This file is the AI context document for the Lewis Partners website project.
> It gives Claude (or any AI assistant) a full understanding of the project
> structure, decisions made, and how to extend or modify the codebase correctly.

---

## 1. Project Overview

**Client:** Lewis Partners Accountants Pty Ltd (ABN 98 152 881 274)
**Principal:** Kenneth Lewis (IPA, Deakin University graduate, Registered Tax Agent #24251007)
**Address:** Unit 5, 40 Station Street, Bayswater VIC 3153
**Phone:** 1800 080 833
**Email:** admin@lewispartners.com.au
**Domain:** lewispartners.com.au (registered via Crazy Domains / Dreamscape Networks)
**Registrant entity:** Yarra Ranges Taxation Services PTY LTD (ACN 007 294 279) — this is
only the domain registrant on record with Crazy Domains, a separate matter from the
public-facing business entity above. See the "Entity clarification" row in §10 for how
this was confirmed.

**Project type:** Static marketing website — 1 page with anchor-based navigation (SPA feel),
plus a separate password-gated `/admin` route
**Tech stack:** Vite + React 18 + JSX · Plain CSS (no Tailwind, no CSS-in-JS) · `react-router-dom`
**Deployment target:** Static files → GitHub Pages (`gh-pages` package, configured and
deploy-ready), or Vercel/Netlify/Crazy Domains hosting (rewrite configs in place for all
four — see §12)

---

## 2. Why Vite + React (not plain HTML)

The client needs:
- A plain-English admin content editing layer (requires React state) — now scoped behind
  a password-gated `/admin` route rather than exposed in the public nav (see §6)
- Interactive contact form with validation — now wired to a real send via EmailJS (see §8)
- Future interactivity: booking widgets, animations, potential client portal
- Scroll-triggered animations (`useScrollReveal` hook) and eased in-page navigation
  (`useSmoothAnchorScroll` hook)

React was chosen over plain HTML to avoid DOM-manipulation spaghetti as the
site grows. Vite produces static output (`dist/`) identical to plain HTML for hosting purposes.

---

## 3. Project File Structure

```
lewis-partners/
├── CLAUDE.md                        ← You are here
├── README.md                        ← Developer quick-start
├── index.html                       ← HTML shell / entry point
├── vite.config.js                   ← Vite config (React plugin, base path)
├── vercel.json                      ← Vercel SPA rewrite (all paths → index.html)
├── package.json                     ← Dependencies + postbuild GH Pages 404 step
├── .env                             ← Local secrets (gitignored) — see §6/§8
├── .env.example                     ← Committed template, values intentionally blank
│
├── public/
│   ├── _redirects                   ← Netlify SPA rewrite
│   ├── .htaccess                    ← Apache/Crazy Domains SPA rewrite
│   └── logos/                       ← Bank/org logos for "Useful Links" — see §7
│
└── src/
    ├── main.jsx                     ← ReactDOM.createRoot entry
    ├── App.jsx                      ← Router shell: "/" → HomePage, "/admin" → AdminGate
    ├── App.css                      ← (currently empty — see §5, AdminPanel note)
    ├── index.css                    ← Global CSS variables, resets, utilities
    │
    ├── data/
    │   └── siteData.js              ← ⭐ SINGLE SOURCE OF TRUTH for all content
    │
    ├── hooks/
    │   ├── useScrollReveal.js       ← IntersectionObserver fade-up hook
    │   └── useSmoothAnchorScroll.js ← Eased scroll for all in-page `#anchor` links — see §5
    │
    └── components/
        ├── Navbar.jsx / .css        ← Fixed nav, always-opaque, mobile menu
        ├── NavDropdown.jsx / .css   ← "Useful Links" dropdown — see §7
        ├── Hero.jsx / .css          ← Two-column landing: headline+stats / photo placeholder
        ├── Services.jsx / .css      ← 6-card service grid, hover animations
        ├── About.jsx / .css         ← Bio, floating credential cards, LinkedIn link
        ├── Testimonials.jsx / .css  ← Client testimonial cards
        ├── Feedback.jsx / .css      ← Enquiry form — real send via EmailJS — see §8
        ├── Contact.jsx / .css       ← Hours table, Google Maps iframe, contact items
        ├── Footer.jsx / .css        ← 4-column footer
        ├── AdminGate.jsx / .css     ← Password gate in front of AdminPanel — see §6
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
| `firm` | Business/legal details — see shape below |
| `hero` | Hero section: badge, headline array, subheading, CTA labels, stats |
| `services` | Array of `{ icon, title, description }` — drives the services grid |
| `about` | Kenneth's bio: name, title, credentials array, bio paragraphs array, badges, LinkedIn |
| `testimonials` | Array of `{ stars, text, name, role, initials }` |
| `navLinks` | Array of `{ label, href }` for navigation (currently: Home, Services, About, Testimonials, Contact) |
| `externalLinks` | Array of bank/government links for "Useful Links" — see §7 for shape and the `active` flag |
| `enquiryTypes` | Array of strings populating the enquiry form's topic `<select>` |

### `firm` shape:
```js
firm: {
  name, brandPrimary, brandSecondary,   // for the two-tone navbar logo
  phone, email,
  address: { street, suburb, state, postcode },   // an object, not a flat string
  motto,      // used in Services banner + Footer (italic line)
  tagline,    // used in Footer (bold line, above the motto)
  website,    // bare domain, e.g. "lewispartners.com.au" — Footer builds the https:// link from this
  legalName, taxAgentNumber, abn,   // Footer copyright line
  googleMapsEmbedUrl,
  hours: [ ... ],
}
```
`address` was originally a single string and `legalName`/`taxAgentNumber` were nested
under an unused `legal: {}` wrapper — both `Footer.jsx` and `Contact.jsx` always expected
the flat/object shape shown above, so the mismatch silently rendered several fields blank
(empty address lines, `"© 2026  · Tax Agent # · ACN "`) until it was caught and fixed.
**When adding new `firm` fields, always check both `Footer.jsx` and `Contact.jsx` render
them — this exact class of bug has happened once already.**

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
- Fixed position, **always opaque** (`var(--cream)` background, permanent — no longer
  transparent-over-hero or scroll-triggered colour swap). There is no `scrolled` state in
  `Navbar.jsx` any more; removing it also let a documented `!important` workaround in
  `NavDropdown.css` be removed, since the scroll-state colour conflict it existed for is
  now structurally impossible.
- Height set via `--navbar-height` (currently `96px`) in `index.css` — referenced by the
  navbar itself, `.navbar__mobile-menu`'s `top` offset, and `Hero.css`'s top padding, so
  these three can't drift out of sync the way they did earlier in development.
- Inner content (`.navbar__inner`) is a `max-width: 1400px` centered container with
  `padding: 0 4rem` — logo anchored left, links anchored right, generous but
  screen-proportional margins rather than a flat percentage that would look absurd on an
  ultrawide monitor.
- Logo: two-tone "Lewis" (`var(--ink-dark)`) / "Partners" (`var(--gold)`).
- Nav links: `Home, Services, About, Testimonials, Contact`, then the `NavDropdown`
  ("Useful Links"), then the `Get in Touch` CTA button (visually distinct — extra margin
  before it, not just another link in the row).
- Active link highlighted by comparing `window.scrollY` to section offsets.
- Mobile hamburger menu (hidden on desktop via CSS).
- **No admin toggle** — the old ⚙ gear icon that toggled an in-page admin overlay has been
  removed entirely; admin access is now only via the `/admin` route (§6).

### NavDropdown ("Useful Links")
- Renders `externalLinks` (filtered to `active !== false`) grouped by `category` into a
  dropdown panel.
- Closes on outside click (`mousedown` listener + ref check).
- See §7 for the full data shape and logo-file requirements.

### Hero
- **Two-column layout** (`grid-template-columns: 1.2fr 1fr`, collapses to one column
  under 900px): left column has the existing badge/headline/subheading/CTAs/stats, right
  column is a circular photo placeholder for Kenneth.
- Placeholder: gold circle, `clamp(320px, 26vw, 380px)` on desktop down to
  `clamp(220px, 50vw, 320px)` on mobile, containing the text **"Photo placeholder"** (DM
  Sans, small uppercase label style — deliberately *not* initials or a serif treatment, so
  it can't be mistaken for finished branding). A JSX comment marks exactly where to swap
  in `<img src="/kenneth-lewis.jpg" alt="Kenneth Lewis" />` once the real photo is
  supplied.
- Top padding is `calc(var(--navbar-height) + 40px)` so hero content clears the now-opaque
  fixed navbar (this used to be a flat `120px`, which happened to still work after the
  navbar redesign, but was made explicit/derived rather than left as a coincidence).
- Decorative radial gradient orb (repositioned top-left, was top-right, to stay clear of
  the new photo column) + oversized quote mark (CSS pseudo).
- Staggered `fade-up` animations via CSS `animation-delay`.

### Services
- Reads `services` array from siteData — add/remove services there only.
- `ServiceCard` sub-component tracks hover state via `useState`.
- Arrow icon slides in on hover (CSS transform + opacity).
- Motto banner below grid pulls from `firm.motto`.
- `useScrollReveal` applied per-card with staggered delay.

### About
- Two floating credential cards: IPA (gold) + Deakin University (blue).
- `about__img-placeholder` shows "KL" initials + a "Photo to be supplied" hint (its own,
  separate placeholder from the Hero one — not yet reworded, since the hint text already
  makes it unambiguous as a placeholder). Replace with `<img src="/kenneth-lewis.jpg" />`
  once photo is supplied — same target path Hero.jsx's TODO comment expects.
- LinkedIn button (real URL now in `siteData.js`) styled to match LinkedIn brand colour
  (#0077b5).
- Credentials line: `about.credentials` is an **array** of three strings — always render
  it as `about.credentials.join(' · ')`, not `{about.credentials}` directly. React
  concatenates array-of-string children with no separator, which previously produced a
  run-on string with no spacing between phrases.
- `about.badges` array drives the credential badge strip.

### Testimonials
- Three cards, each with `useScrollReveal` + staggered delay.
- Star rating rendered from `t.stars` count.
- CTA nudge at bottom links to `#contact`.

### Feedback (Contact Form)
- Controlled form via `useState(INITIAL_FORM)`.
- Client-side validation in `validate()` function — returns error object.
- Errors clear on field change; character counter on message textarea.
- **Real send via EmailJS** (`@emailjs/browser`) — see §8 for the full integration
  details, required env vars, and template parameter names. No longer a simulated
  `setTimeout`.
- On send failure, shows an inline `form__error--submit` message (with a phone-call
  fallback) instead of always showing success — form data is preserved so the user can
  retry.
- Enquiry types pulled from the `enquiryTypes` export in `siteData.js`.

### Contact
- `contactItems` array built from `firm` data, including the now-object `firm.address`.
- Trading hours table from `firm.hours` array.
- `getTodayName()` highlights current day's row automatically.
- Google Maps iframe uses `firm.googleMapsEmbedUrl`.
  **Note:** The embed URL in siteData.js is approximate. For production,
  generate the exact embed URL from Google Maps → Share → Embed a map.
- `position: sticky` on the map column (desktop only).

### AdminGate + AdminPanel
- `AdminGate.jsx` is a standalone page rendered at `/admin` (see §6): a password form
  gates access; on success it renders `AdminPanel` in place.
- `AdminPanel.jsx` itself is unchanged in behaviour (still a prototype — simulates async
  processing with a `setTimeout`, shows a change-log queue, includes example instructions)
  but its CSS was reworked from a `position: fixed` bottom-right floating widget (which
  made sense when it overlaid the live site) to a normal centered block, since it now
  owns the entire `/admin` page rather than floating over other content.
- In production this would POST the instruction to an AI API (e.g. Claude API) which
  modifies `siteData.js` and triggers a rebuild + deploy — still not built.

### Footer
- 4-column: brand/tagline/motto | navigation | Useful Links (mirrors the navbar dropdown,
  same `active`-flag filtering) | contact details.
- Reads from `firm`, `navLinks`, and `externalLinks`.
- Dynamically generates copyright year with `new Date().getFullYear()`.
- Copyright line: `© {year} {firm.legalName} · Tax Agent #{firm.taxAgentNumber} · ABN {firm.abn}`
  (previously showed a nonexistent `firm.acn`, which always rendered blank).

---

## 6. Routing & Admin Access

Client-side routing was added (`react-router-dom`) specifically to move admin access from
an in-page toggle (a ⚙ gear icon in the public nav, togglable by any visitor) to a
separate, password-gated `/admin` route.

- **`BrowserRouter`**, not `HashRouter` — this project went through both. `HashRouter` was
  tried first (it needs zero server config on static hosts), but this site's whole nav
  design relies on the URL hash for in-page anchor scrolling (`#services`, `#about`, …
  per CLAUDE.md's own "anchor-based navigation" description). `HashRouter` treats
  everything after `#` as a route path, so `#services` doesn't match any defined route and
  renders blank — a direct collision with the site's core nav mechanism. Switched to
  `BrowserRouter` with `basename={import.meta.env.BASE_URL}`, which only intercepts
  navigation through its own `<Link>`/`navigate()` calls — plain `<a href="#services">`
  tags fall through to normal browser anchor scrolling, untouched by the router.
- Because `/admin` is only reachable by hard navigation (typed URL, bookmark, refresh —
  there's no in-app link to it any more), every documented static host needs a rewrite
  rule so it serves `index.html` for that path instead of 404ing:
  - **Netlify** — `public/_redirects`
  - **Crazy Domains / Apache-style hosting** — `public/.htaccess`
  - **Vercel** — `vercel.json` rewrites
  - **GitHub Pages** (no rewrite support at all — needs an actual `404.html` file) —
    `postbuild` npm script copies the built `index.html` to `dist/404.html`
- **`AdminGate.jsx`** — password-only form (no username). Correct password comes from
  `import.meta.env.VITE_ADMIN_PASSWORD`, so it isn't hardcoded in committed source. Auth
  state is plain `useState` — **not** persisted to localStorage/sessionStorage, so it
  resets on refresh or a new tab, by design.
- **Not real security.** Any `VITE_...` env var is bundled into the client JS at build
  time, so the password is readable in plain text by anyone who opens dev tools on the
  built `dist/` bundle. This is fine for keeping casual visitors out of a prototype, but
  it is not a real access-control boundary. If `AdminPanel` ever gets wired to a real
  content-editing backend, replace this with server-side auth before that ships.
- `.env` (gitignored, holds real values) / `.env.example` (committed, values intentionally
  blank) — see §8 for the EmailJS variables that live alongside `VITE_ADMIN_PASSWORD` in
  the same files. **Never put a real value from `.env` into this file or any other
  committed file** — see the checklist in §11.

---

## 7. Useful Links / External Links System

The navbar's "Useful Links" dropdown (`NavDropdown.jsx`) and the Footer's matching
"Useful Links" column both read from the same `externalLinks` export in `siteData.js`.

### Data shape:
```js
{ label: 'CBA', url: 'https://www.commbank.com.au/', logo: 'cba.svg', category: 'Banking', active: true }
```
- `category` groups entries under subheadings (currently `Banking` and `Government & Other`).
- `logo` is a filename resolved against `public/logos/<logo>` at render time
  (`${import.meta.env.BASE_URL}logos/${link.logo}`); both `NavDropdown` and `Footer` hide
  the `<img>` on a 404 via `onError`, so a missing logo file degrades to text-only rather
  than a broken-image icon.

### The `active` flag
Toggling a link on/off is a one-word edit — flip `active` to `false`/`true` — **not** a
comment/uncomment of the array entry. This replaced an earlier comment-out approach after
it caused real confusion (a "commented out" entry that was believed to be commented out
turned out not to be, because the edit never actually landed).

Both `NavDropdown.jsx` and `Footer.jsx` derive an `activeLinks = externalLinks.filter(link
=> link.active)` array at module scope, and compute their `category` list **from that
filtered array**, not from the raw `externalLinks` — this matters, because deriving
categories from the unfiltered list would let a fully-toggled-off category still render an
empty subheading with no items under it.

### Logo files
`public/logos/` is where real logo assets belong (SVG preferred, PNG fallback) — it is
currently **empty**. The `logo` filenames in `siteData.js` are placeholders for files that
haven't been supplied yet.

---

## 8. EmailJS Integration

The enquiry form (`Feedback.jsx`) sends via `@emailjs/browser` rather than a simulated
timeout. Chosen over Formspree specifically because EmailJS connects to a real email
account (Gmail/Outlook/SMTP) rather than routing through a third-party branded
inbox — it maps onto the client's own business email setup and is more likely to remain
the right tool long-term rather than a throwaway proof-of-concept.

### Required env vars (in `.env`, template in `.env.example`):
```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```
One-time setup (not doable by an AI assistant — needs an actual EmailJS account):
1. Create a free EmailJS account and connect it to the destination inbox.
2. Create an email template using the parameter names below.
3. Copy the Service ID / Template ID / Public Key from the EmailJS dashboard into `.env`.

The EmailJS **Public Key is designed to be client-visible** (safe to expose) — unlike
`VITE_ADMIN_PASSWORD`, it isn't a secret that needs to stay out of committed files.

### Template parameter names
`Feedback.jsx`'s `handleSubmit` builds this exact object and passes it to `emailjs.send()`
— the EmailJS template must reference these keys (e.g. `{{first_name}}`) for the mapping
to work:
```js
{ first_name, last_name, email, phone, enquiry_type, message }
```

### Failure handling
`emailjs.send(...).then(...).catch(...)` — on failure, `Feedback.jsx` sets a
`submitError` state and shows an inline message with a phone-number fallback, rather than
unconditionally showing the success screen. Form data is preserved on failure so the user
doesn't have to retype anything to retry.

---

## 9. Styling System

### CSS Variables (defined in `index.css`)
```css
--ink:            #3344a5   /* Primary blue */
--ink-dark:       #444eb6   /* Secondary blue, used for logo/headings/some backgrounds */
--gold:           #c9a84c   /* Accent gold (brand match) */
--gold-light:     #e8c97a   /* Lighter gold for hover states */
--cream:          #faf8f3   /* Page background, also the permanent navbar background */
--warm-grey:      #f0ece3   /* Alternating section background */
--text:           #3d3d4e   /* Body text */
--muted:          #8a8a9a   /* Secondary text, labels */
--white:          #ffffff
--border:         rgba(201,168,76,0.2)
--font-display:   'Playfair Display', Georgia, serif
--font-body:      'DM Sans', system-ui, sans-serif
--transition:     0.25s ease
--radius:         4px
--shadow:         0 12px 40px rgba(0,0,0,0.10)
--navbar-height:  96px   /* referenced by Navbar, mobile menu offset, and Hero's top padding */
```

### Typography
- **Display / headings:** Playfair Display (Google Fonts) — serif, italic for emphasis.
- **Body:** DM Sans (Google Fonts) — clean, geometric sans-serif.
- Font loaded in `index.html` via Google Fonts link tag.

### Scroll behaviour
- **In-page anchor navigation** (`#services`, `#about`, etc.) is handled entirely by the
  `useSmoothAnchorScroll` hook (`src/hooks/`), not CSS. `html { scroll-behavior: smooth }`
  was **removed** from `index.css` — it actively fought the hook's own
  `requestAnimationFrame` easing (every frame's `window.scrollTo()` call was itself being
  smooth-animated by the browser, causing the scroll to undershoot and stall). The hook
  intercepts any click on `a[href^="#"]` site-wide, computes the target offset accounting
  for the fixed navbar height, and runs a ~700ms cubic ease-in-out.
- `useScrollReveal` hook uses `IntersectionObserver` — triggers once on entry, drives the
  `.fade-up` class/keyframe for section reveal animations (unrelated to the anchor-scroll
  hook above — this one is for elements fading in as they scroll into view, not for the
  scrolling itself).

### Section alternating backgrounds
```
Navbar       → var(--cream)      always opaque, no longer scroll-dependent
Hero         → var(--ink-dark)   dark navy
Services     → var(--cream)      light cream
About        → var(--warm-grey)  warm grey
Testimonials → var(--cream)
Feedback     → var(--ink-dark)   dark (form on dark bg)
Contact      → var(--warm-grey)
Footer       → #080e2e           deep navy
```

---

## 10. Known Items / Pending

| Item | Status | Notes |
|------|--------|-------|
| Kenneth's photo | ⏳ Pending | Both `Hero.jsx` and `About.jsx` show clearly-labeled placeholders ("Photo placeholder" / "Photo to be supplied") rather than anything that could pass for real branding. Swap both once the photo is supplied — target path `/kenneth-lewis.jpg` in both. |
| Google Maps embed URL | ⚠️ Approximate | Generate exact URL from Google Maps → Share → Embed |
| Form submission | ✅ Resolved | Wired to EmailJS (`@emailjs/browser`) — see §8 |
| LinkedIn URL | ✅ Resolved | Real profile URL set in `siteData.js` |
| Entity clarification | ✅ Resolved | Public-facing entity is Lewis Partners Accountants Pty Ltd (ABN 98 152 881 274) — confirmed distinct from Yarra Ranges Taxation Services PTY LTD, which is solely the domain registrant on record with Crazy Domains |
| Domain hosting | 🔧 Broken | Crazy Domains account needs hosting renewed/configured |
| Admin CMS layer | 🔭 Prototype | `AdminPanel.jsx` is still a UI prototype (no AI API backend), but is no longer exposed via a public nav toggle — it now lives behind a password-gated `/admin` route (§6). The password gate itself is a prototype-level deterrent, not real security. |
| Logo assets | ⏳ Pending | `public/logos/` is empty — "Useful Links" entries reference filenames that don't exist yet on disk (degrades gracefully to text-only) |

---

## 11. Running the Project

```bash
# Install dependencies
npm install

# Development (hot reload at http://localhost:5173)
npm run dev

# Production build (outputs to dist/, then copies index.html → 404.html for GitHub Pages)
npm run build

# Preview production build locally
npm run preview
```

### Before pushing to a public repo
`.env` is gitignored and `.env.example` ships with blank values — confirm both stay that
way. Specifically check that no committed file (including this one) ever contains the
literal value of `VITE_ADMIN_PASSWORD`. The EmailJS Service ID / Template ID are not
sensitive on their own, and the EmailJS **Public Key is meant to be client-visible** —
none of the three need to be secret — but the admin password is the one value in `.env`
that must never appear in plain text anywhere in the repo.

---

## 12. Deployment

The `dist/` folder after `npm run build` contains static files only. Rewrite/fallback
config for client-side routing (`/admin`) is already in place for all four options below.

**Option A — GitHub Pages:**
```bash
npm run deploy   # runs predeploy (build) then gh-pages -d dist
```
`vite.config.js`'s `base: '/lewis-partners/'` and `package.json`'s `homepage` field are
already set for this. The `postbuild` script's `dist/index.html` → `dist/404.html` copy is
what makes a hard-refreshed `/admin` URL work here, since GitHub Pages has no server-side
rewrite support at all.

**Option B — Vercel:**
```bash
npm i -g vercel
vercel deploy
```
`vercel.json` at the project root already rewrites all paths to `index.html`.

**Option C — Netlify:**
Drag and drop the `dist/` folder at netlify.com/drop. `public/_redirects` (copied into
`dist/` by Vite) handles the SPA fallback.

**Option D — Crazy Domains (existing hosting):**
Upload contents of `dist/` to `public_html/` via FTP. Point lewispartners.com.au DNS to
hosting server. `public/.htaccess` (copied into `dist/`) handles the SPA fallback,
assuming Apache + `mod_rewrite` on the hosting account.

---

## 13. How to Add New Content

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

### Toggle a Useful Link on/off:
In `siteData.js`, flip that entry's `active` field — `true`/`false` — in the
`externalLinks` array. See §7 for why this replaced a comment-out approach.

### Add a new page:
1. Create `src/components/NewPage.jsx` + `NewPage.css`
2. Add a `<Route>` in `App.jsx` (React Router is already installed and configured — see §6)
3. Add link to `navLinks` in siteData.js if it belongs in the main nav

### Update trading hours:
Edit the `hours` array in `firm` in siteData.js.
Set `open: null, close: null` for closed days.

---

*Last updated: July 2026*
*Project managed by: [Your name/agency]*
