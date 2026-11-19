# CLAUDE.md — Lewis Partners Website Project

> This file is the AI context document for the Lewis Partners website project.
> It gives Claude (or any AI assistant) a full understanding of the project
> structure, decisions made, and how to extend or modify the codebase correctly.

---

## 1. Project Overview

**Client:** Lewis Partners Accountants Pty Ltd (ABN 98 152 881 274)
**Principal:** Kenneth Lewis (IPA, Deakin University graduate, Registered Tax Agent #24251007)
**Address:** Unit 5, 40 Station Street, Bayswater VIC 3153
**Phone:** 1300 080 833 — ⚠️ unconfirmed: `siteData.js` has always used 1300, but this file
originally said 1800. Confirm with Kenneth (see §10); it must match his Google Business Profile.
**Email:** admin@lewispartners.com.au
**Domain:** lewispartners.com.au (registered via Crazy Domains / Dreamscape Networks)
**Registrant entity:** Yarra Ranges Taxation Services PTY LTD (ACN 007 294 279) — this is
only the domain registrant on record with Crazy Domains, a separate matter from the
public-facing business entity above. See the "Entity clarification" row in §10 for how
this was confirmed.

**Project type:** Static marketing website — 1 page with anchor-based navigation (SPA feel)
**Tech stack:** Vite + React 18 + JSX · Plain CSS (no Tailwind, no CSS-in-JS) · `react-router-dom`
**Deployment target:** Static files → GitHub Pages (`gh-pages` package, configured and
deploy-ready), or Vercel/Netlify/Crazy Domains hosting (rewrite configs in place for all
four — see §12)

---

## 2. Why Vite + React (not plain HTML)

The client needs:
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
├── index.html                       ← HTML shell; `<!-- seo:head -->` marker filled at build — see §14
├── vite.config.js                   ← Vite config (React plugin, SEO plugin, mode-dependent base path — see §12/§14)
├── vercel.json                      ← Vercel SPA rewrite (app routes only, not static assets — see §12)
├── package.json                     ← Dependencies + build (with prerender), build:ghpages/postbuild:ghpages
├── scripts/
│   └── prerender.js                 ← Bakes the rendered page into dist/index.html — see §14
├── .env                             ← Local secrets (gitignored) — see §6/§8
├── .env.example                     ← Committed template, values intentionally blank
│
├── public/
│   ├── _redirects                   ← Netlify SPA rewrite
│   ├── .htaccess                    ← Apache/Crazy Domains SPA rewrite
│                                       (robots.txt + sitemap.xml are generated at build, not kept here — §14)
│   └── logos/                       ← Bank/org logos for "Useful Links" — see §7
│
└── src/
    ├── main.jsx                     ← hydrateRoot (prerendered build) / createRoot (dev) entry
    ├── App.jsx                      ← Router shell: "/" → HomePage; exports AppRoutes for the prerender
    ├── entry-server.jsx             ← Build-time only: StaticRouter + renderToString — see §14
    ├── App.css                      ← currently empty
    ├── index.css                    ← Global CSS variables, resets, utilities
    │
    ├── data/
    │   └── siteData.js              ← ⭐ SINGLE SOURCE OF TRUTH for all content (incl. SEO text)
    │
    ├── seo/
    │   └── headTags.js              ← Build-time only: <head> tags, JSON-LD, robots/sitemap from siteData — §14
    │
    ├── hooks/
    │   ├── useScrollReveal.js       ← IntersectionObserver fade-up hook
    │   └── useSmoothAnchorScroll.js ← Eased scroll for all in-page `#anchor` links — see §5
    │
    └── components/
        ├── Navbar.jsx / .css        ← Fixed nav, always-opaque, mobile menu
        ├── NavDropdown.jsx / .css   ← "Useful Links" dropdown — see §7
        ├── Hero.jsx / .css          ← Two-column landing: banner (h1) + headline + stats / photo placeholder
        ├── Services.jsx / .css      ← 6-card service grid, hover animations
        ├── About.jsx / .css         ← Bio, floating credential cards, LinkedIn link
        ├── Testimonials.jsx / .css  ← Client testimonial cards
        ├── Feedback.jsx / .css      ← Enquiry form — real send via EmailJS — see §8
        ├── Contact.jsx / .css       ← Hours table, Google Maps iframe, contact items
        └── Footer.jsx / .css        ← 4-column footer
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
| `seo` | `siteUrl`, `title` (≤60 chars), `description`, `locale`, `country` — read at build time only (§14) |
| `hero` | Hero section: `banner` (the page's `<h1>`), badge, headline array, subheading, CTA labels, stats |
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
- **Mobile hamburger breakpoint is `1200px`**, not a more typical `768px`. This was raised
  deliberately: at the original 768px cutoff, the full nav row (logo + links + "Useful
  Links" dropdown + CTA) had no room to breathe between roughly 900–1150px, and both the
  logo and the dropdown's "Useful Links" label would wrap to two lines there. This was
  verified by measuring `.navbar__logo` and `.nav-dropdown__trigger` element heights across
  that range (double-height = wrapped) rather than guessed — the row genuinely doesn't fit
  on one line below ~1150–1200px, so the hamburger now takes over before that zone is ever
  reached instead of patching individual elements with `white-space: nowrap`.
- The `Get in Touch` CTA has `white-space: nowrap` as a belt-and-braces safety net (so it
  never wraps mid-transition even if the row is ever squeezed again), and the same CTA is
  duplicated — properly styled as a button, not a plain link — inside the mobile hamburger
  panel (`.navbar__mobile-menu a.navbar__cta`), so it's still reachable below 1200px.
- **No admin toggle** — the old ⚙ gear icon that toggled an in-page admin overlay was
  removed early on; the `/admin` route it was replaced with has since been removed
  entirely too (§10) — there is no admin surface of any kind on this site any more.

### NavDropdown ("Useful Links")
- Renders `externalLinks` (filtered to `active !== false`) grouped by `category` into a
  dropdown panel.
- Closes on outside click (`mousedown` listener + ref check).
- See §7 for the full data shape and logo-file requirements.

### Hero
- **`hero.banner` ("Your Tax Professionals") is the page's single `<h1>`**, rendered first in
  the left column, above the badge (client request, Nov 2026 — he wants the phrase both
  visible and searchable on Google). The three-line `hero.headline` below it is a
  **`<p className="hero__headline">`, not a heading**; `Hero.css` restates
  `font-family: var(--font-display)` on it so it looks exactly like the old `<h1>`. Don't turn
  the headline back into an `h1` — there must be only one, and it must be the banner.
- **Two-column layout** (`grid-template-columns: 1.2fr 1fr`, collapses to one column
  under 900px): left column has the existing badge/headline/subheading/CTAs/stats, right
  column is a circular photo placeholder for Kenneth.
- Placeholder: gold circle, `clamp(320px, 26vw, 380px)` on desktop down to
  `clamp(220px, 50vw, 320px)` on mobile, containing the text **"Photo placeholder"**. A JSX
  comment marks exactly where to swap in the real `<img>` once the Hero photo is supplied
  — still pending, see §10 (About's photo has been added; Hero's has not).
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
- **One floating credential card** (IPA, gold) — the second "Deakin University" card is
  commented out in `About.jsx` (not deleted), so it can be restored later by uncommenting.
  It was removed because with both cards present, the layout only had room for one at
  narrower widths without them colliding.
- The IPA card's position is adjusted specifically inside the `@media (max-width: 900px)`
  block in `About.css` (`top: 0.5rem`, vs. the desktop default `top: 2rem`) for breathing
  room at that breakpoint.
- **The card intentionally overlaps the photo area** — it always has, at every width,
  including full desktop (`z-index: 2`, above the photo's `z-index: 1`). Don't mistake this
  for a bug to "fix" by eliminating the overlap entirely.
- `about__img-placeholder` now renders `about.jsx`'s photo `<img>` (`.about__img-photo`,
  `object-fit: cover`) instead of the old "KL" watermark + hint text — see §10 (currently a
  temporary stopgap crop, not the client's final photo).
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
- Renders `<section id="contact">` — the target of every "Get in Touch" CTA (Navbar, Hero,
  Footer) and of the nav "Contact" link and Testimonials' consultation button.
- Controlled form via `useState(INITIAL_FORM)`.
- Client-side validation in `validate()` function — returns error object.
- Errors clear on field change; character counter on message textarea.
- Message textarea is `min-height: 220px` / `rows={8}` (was `120px` / `rows={5}`), to fill
  the vertical space in the form card rather than sitting small with unused room below it.
- **Real send via EmailJS** (`@emailjs/browser`) — see §8 for the full integration
  details, required env vars, and template parameter names. No longer a simulated
  `setTimeout`.
- On send failure, shows an inline `form__error--submit` message (with a phone-call
  fallback) instead of always showing success — form data is preserved so the user can
  retry.
- Enquiry types pulled from the `enquiryTypes` export in `siteData.js`.
- **Past bug, now fixed:** `Feedback.css` had its base `.form__input, .form__select,
  .form__textarea` rule (including `width: 100%`) commented out, with an unrelated
  light-theme duplicate ruleset further down the file silently taking over instead — no
  width, wrong border colour, no background/text colour, wrong (blue, not gold) focus
  glow. Every field in the form rendered at browser-default intrinsic width (roughly half
  its grid column) rather than filling it, which is what actually caused the "unused
  space" the textarea sizing request above was about — not the textarea specifically.
  Fixed by restoring the commented-out base rule and deleting the conflicting duplicate.
  **If form fields ever look narrow/unstyled again, check for a duplicate
  `.form__input`-family ruleset before assuming it's a new bug.**

### Contact
- `contactItems` array built from `firm` data, including the now-object `firm.address`.
- Trading hours table from `firm.hours` array.
- Renders `<section id="location">` (the enquiry form in `Feedback` owns `#contact` — see
  Feedback above and §14).
- `getTodayName()` highlights current day's row automatically — **called in a `useEffect`,
  not during render**, because the page is prerendered at build time (§14): a render-time
  value would bake the build day into the HTML and mismatch on hydration.
- Google Maps iframe uses `firm.googleMapsEmbedUrl`.
  **Note:** The embed URL in siteData.js is approximate. For production,
  generate the exact embed URL from Google Maps → Share → Embed a map.
- `position: sticky` on the map column (desktop only).

### Footer
- 4-column: brand/tagline/motto | navigation | Useful Links (mirrors the navbar dropdown,
  same `active`-flag filtering) | contact details.
- Reads from `firm`, `navLinks`, and `externalLinks`.
- Copyright year comes from `new Date().getFullYear()` **in a `useEffect`** (same
  prerender/hydration reason as Contact's today-highlight); the prerendered HTML just omits
  the year until hydration.
- Copyright line: `© {year} {firm.legalName} · Tax Agent #{firm.taxAgentNumber} · ABN {firm.abn}`
  (previously showed a nonexistent `firm.acn`, which always rendered blank).

---

## 6. Routing

`react-router-dom` is still a dependency and `App.jsx` still wraps the site in a
`BrowserRouter`, even though the site is back down to a single `/` route — see §10 for why
(the `/admin` route this was originally built to support has been removed). Left in place
rather than ripped out, since re-adding a route later (or restoring `basename` handling for
GitHub Pages) is easier than re-introducing the router from scratch; flag to the client if
it's worth simplifying away entirely now that nothing depends on it besides `/`.

- `App.jsx` exports `AppRoutes` (the `<Routes>` tree) separately from the default `App`
  (which wraps it in `BrowserRouter`), so the build-time prerender can wrap the same routes
  in a `StaticRouter` instead (§14). Add new routes inside `AppRoutes`.
- **`BrowserRouter`**, not `HashRouter` — this project went through both. `HashRouter` was
  tried first (it needs zero server config on static hosts), but this site's whole nav
  design relies on the URL hash for in-page anchor scrolling (`#services`, `#about`, …
  per CLAUDE.md's own "anchor-based navigation" description). `HashRouter` treats
  everything after `#` as a route path, so `#services` doesn't match any defined route and
  renders blank — a direct collision with the site's core nav mechanism. Switched to
  `BrowserRouter` with `basename={import.meta.env.BASE_URL}`, which only intercepts
  navigation through its own `<Link>`/`navigate()` calls — plain `<a href="#services">`
  tags fall through to normal browser anchor scrolling, untouched by the router.
- The SPA-fallback rewrite configs (`public/_redirects`, `public/.htaccess`,
  `vercel.json`, and the GitHub Pages `postbuild` → `dist/404.html` copy — see §12) exist
  to serve `index.html` for any client-side route reached by hard navigation. They were
  written when `/admin` was that route; with only `/` left, they're currently unexercised
  but harmless to leave in place in case a new route is added.

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

The EmailJS **Public Key is designed to be client-visible** (safe to expose) — it isn't a
secret that needs to stay out of committed files.

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
| Kenneth's photo | ⚠️ Split | `About.jsx` renders `public/kenneth-lewis-about.jpg` (via `${import.meta.env.BASE_URL}kenneth-lewis-about.jpg`) — a stopgap crop, not the client's final headshot. `Hero.jsx` still shows the "Photo placeholder" gold-circle placeholder; its `<img>` was deliberately **not** wired up yet — when that photo arrives, use a distinct filename (e.g. `kenneth-lewis-hero.jpg`), matching the `-about`/`-hero` naming convention. |
| Google Maps embed URL | ⚠️ Approximate | Generate exact URL from Google Maps → Share → Embed |
| Form submission | ✅ Resolved | Wired to EmailJS (`@emailjs/browser`) — see §8 |
| LinkedIn URL | ✅ Resolved | Real profile URL set in `siteData.js` |
| Entity clarification | ✅ Resolved | Public-facing entity is Lewis Partners Accountants Pty Ltd (ABN 98 152 881 274) — confirmed distinct from Yarra Ranges Taxation Services PTY LTD, which is solely the domain registrant on record with Crazy Domains |
| Domain hosting | 🔧 Broken | Crazy Domains account needs hosting renewed/configured |
| Admin CMS layer | 🗑️ Removed | The plain-English admin editing prototype (`AdminGate.jsx`, `AdminPanel.jsx`, the `/admin` route in `App.jsx`) has been deleted entirely, not just gated — there is no admin surface, password-protected or otherwise, on this site any more. If a real content-editing layer is wanted later, it should be designed fresh with server-side auth (§6) rather than resurrecting this prototype. |
| Phone number | ⚠️ TODO | Confirm phone with Kenneth (1300 vs 1800) — must match Google Business Profile. `siteData.js` (and therefore the site + JSON-LD `telephone`) uses **1300 080 833**; this file originally said 1800. |
| Google Search Console / Business Profile | ⏳ Pending (off-site) | Verify the domain in Search Console and submit `https://www.lewispartners.com.au/sitemap.xml`; add "Your Tax Professionals" to the Google Business Profile description. Needs Kenneth's Google account — not doable from this repo. |
| Logo assets | ⏳ Pending | `public/logos/` is empty — "Useful Links" entries reference filenames that don't exist yet on disk (degrades gracefully to text-only) |

---

## 11. Running the Project

```bash
# Install dependencies
npm install

# Development (hot reload at http://localhost:5173)
npm run dev

# Production build (client build + prerender into dist/index.html — see §14)
npm run build

# Preview production build locally
npm run preview
```

### Before pushing to a public repo
`.env` is gitignored and `.env.example` ships with blank values — confirm both stay that
way. None of the EmailJS values (Service ID / Template ID / Public Key) are sensitive on
their own — the **Public Key is meant to be client-visible** — so there's currently no
value in `.env` that must be kept out of committed files. (This was previously
`VITE_ADMIN_PASSWORD`, before the admin route it gated was removed — see §10.)

---

## 12. Deployment

The `dist/` folder after `npm run build` contains static files only. Rewrite/fallback
config for client-side routing is in place for all four options below (currently
unexercised now that `/admin` has been removed — see §6/§10 — but left in place).

### `base` path is mode-dependent — this matters, read before deploying anywhere
`vite.config.js`'s `base` is **`/` by default**, correct for Vercel, Netlify, and Crazy
Domains — all three serve this site from the domain root. GitHub Pages project sites are
the one exception: they're served from a `/<repo-name>/` subpath
(`https://<user>.github.io/lewis-partners/`), so a separate `npm run build:ghpages`
(`vite build --mode ghpages`) builds with `base: '/lewis-partners/'` instead. `predeploy`
already calls `build:ghpages`, so `npm run deploy` (Option A below) does the right thing
automatically — but **`npm run build` alone always produces the root-relative build**,
which is what Vercel/Netlify/Crazy Domains all need.

This used to be hardcoded to `/lewis-partners/` unconditionally, which would have broken
Vercel (and Netlify, and Crazy Domains) outright — every asset reference and the
`BrowserRouter`'s `basename` would have pointed at a `/lewis-partners/` subpath that
doesn't exist on any of those three hosts, producing a blank page with every asset 404ing.
Caught and fixed before the first Vercel deploy. Verified both build outputs directly
(inspected the emitted `<script>`/`<link>` tags in `dist/index.html` for each mode) rather
than assuming the config change worked.

The GitHub-Pages-only `postbuild:ghpages` step (copies `dist/index.html` → `dist/404.html`,
GH Pages' fallback trick since it has no server-side rewrite support) is wired to
`build:ghpages` specifically, not to the plain `build` script — npm's `pre`/`post` script
hooks only fire for an exact name match, so renaming the GH Pages build step without also
renaming its `postbuild` hook would have silently stopped the 404.html copy from running.

Two places read `import.meta.env.BASE_URL` at runtime and adapt automatically to whichever
mode built them — no per-host changes needed to either: the "Useful Links" logo `<img>` src
in `NavDropdown.jsx`/`Footer.jsx`, and `App.jsx`'s `<BrowserRouter basename={...}>`. The
The Kenneth-photo `<img>` in `About.jsx` (see §10) uses the same
`${import.meta.env.BASE_URL}kenneth-lewis-about.jpg` pattern rather than a hardcoded
`/kenneth-lewis-about.jpg`, which would have been wrong for the GitHub Pages build.
`Hero.jsx`'s photo is still a placeholder (§10) — its TODO comment should use the same
`BASE_URL` pattern once wired up.

Both `npm run build` and `npm run build:ghpages` run `scripts/prerender.js` after the client
build, in the matching mode — see §14. For GitHub Pages this happens *before*
`postbuild:ghpages` copies `index.html` → `404.html`, so the 404 copy is prerendered too.
`vercel.json`'s file-extension exclusion already lets `robots.txt` / `sitemap.xml` through
as real files.

**Option A — GitHub Pages:**
```bash
npm run deploy   # runs predeploy (build:ghpages) then gh-pages -d dist
```
`package.json`'s `homepage` field is already set for this.

**Option B — Vercel:**
```bash
npm i -g vercel
vercel deploy
```
Uses the plain `npm run build` (root-relative `base: '/'`). `vercel.json`'s rewrite is
`/((?!.*\.[a-zA-Z0-9]+$).*)` → `/index.html`, **not** a bare `/(.*)` catch-all. A catch-all
rewrite matches asset requests too (`/assets/index-xxx.js`, logo `.svg` files, etc.), so a
first Vercel deploy served `index.html` back for JS module requests — blank page, "Expected
a JavaScript-or-Wasm module script but the server responded with a MIME type of
'text/html'" in the console. The fix excludes any path ending in a file extension from the
rewrite, so real static files are served as themselves and only actual app routes (just
`/` now — see §6/§10) fall through to `index.html`. Deliberately excludes by *file extension*, not by
hardcoding `assets/` — a folder-name exclusion would still break the still-unimplemented
Hero-photo path (`kenneth-lewis-hero.jpg` would land at the `dist/` root, not under
`assets/`, `logos/`, or any other excluded folder, the moment someone adds it). Verified
with a
regex test matrix against the actual `dist/` output and a local server that replicates
Vercel's static-file-then-rewrite routing — real confirmation on Vercel's actual
infrastructure after deploy is still the authoritative check, since Vercel's exact
routing/caching internals can't be fully replicated locally.

**Option C — Netlify:**
Drag and drop the `dist/` folder (from a plain `npm run build`) at netlify.com/drop.
`public/_redirects` (copied into `dist/` by Vite) handles the SPA fallback.

**Option D — Crazy Domains (existing hosting):**
Upload contents of `dist/` (from a plain `npm run build`) to `public_html/` via FTP. Point
lewispartners.com.au DNS to hosting server. `public/.htaccess` (copied into `dist/`)
handles the SPA fallback, assuming Apache + `mod_rewrite` on the hosting account.

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

## 14. SEO & Prerendering

### `<head>` tags — generated, not hand-written
`index.html` has a `<!-- seo:head -->` marker instead of a hardcoded `<title>`/description.
A small plugin in `vite.config.js` (`seoPlugin`) replaces it via `transformIndexHtml` with the
output of `buildHeadTags()` from `src/seo/headTags.js`, in dev and in both build modes:
`<title>`, meta description, canonical, Open Graph + Twitter tags, and an
`AccountingService` JSON-LD block. The same plugin emits `robots.txt` and `sitemap.xml` into
`dist/` (skipped during the SSR prerender build). **Everything comes from `siteData.js`** —
`seo` for the title/description/URL, `firm` for name, legal name, phone, email, address,
ABN and hours, `hero.banner` for the `slogan`, `about` for the founder (name, title, LinkedIn). To change SEO text,
edit `siteData.js`, never `index.html`.

- Title: `seo.title` — "Your Tax Professionals | Lewis Partners, Bayswater" (50 chars). The
  client's preferred "…| Lewis Partners Accountants, Bayswater" is 62 chars, over the 60-char
  limit, so "Accountants" was dropped from the title (it stays in the description, JSON-LD
  `legalName` and on the page). "Secure Accounting" was deliberately removed from the title
  but kept in the description.
- Canonical / `og:url` / sitemap always point at `https://www.lewispartners.com.au/`, even in
  the GitHub Pages build — that copy is a mirror and should defer to the real domain.
- JSON-LD `telephone` is derived as `+61 ` + `firm.phone` (leading `0` stripped for
  geographic numbers; 1300/1800 numbers keep all digits).
- **No `aggregateRating` / `review` markup from the testimonials** — Google treats
  self-published reviews on a business's own site as review spam and can apply a manual
  action. Keep the JSON-LD to facts in `siteData.js` only.
- No `og:image` yet — add one (absolute URL) once a final photo/brand image exists.

### Prerendering
The client-rendered SPA used to ship an empty `<div id="root"></div>`, so crawlers that don't
run JS saw no headings or text at all. After `vite build`, `scripts/prerender.js`:
1. runs a second `vite build --ssr src/entry-server.jsx` (same `--mode`, so `BASE_URL`, asset
   paths and the router basename match the client build) into `node_modules/.prerender/`,
2. calls its `render()` — `renderToString` of `AppRoutes` inside a `StaticRouter`,
3. inserts the HTML into `dist/index.html`'s `<div id="root"></div>` (no surrounding
   whitespace — stray text nodes inside `#root` break hydration), then deletes the temp dir.

`main.jsx` calls `hydrateRoot` when `#root` already has children (production) and
`createRoot` otherwise (`npm run dev`, where nothing is prerendered).

**Rules this imposes on components:**
- **Nothing browser-only or time-dependent during render.** `window`, `document`,
  `IntersectionObserver`, `localStorage`, `new Date()`, `Math.random()` etc. belong in
  `useEffect` / event handlers. Render-time values get frozen at build time and cause
  hydration mismatches (this is why Contact's today-highlight and Footer's year moved into
  effects). Module-scope code is also executed in Node during the prerender.
- `useScrollReveal` elements render *without* `.fade-up` in the prerendered HTML, so they're
  visible to crawlers/no-JS; the animation is applied after hydration as before.
- Each component owns its own `<section id="…">`; `App.jsx` must not wrap them in another
  section (it used to, which put every anchor id on the page twice).

---

*Last updated: November 2026*
*Project managed by: [Your name/agency]*
