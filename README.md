# Lewis Partners — Website

A Vite + React website for Lewis Partners Accountants PTY LTD.

## Project Structure

```
lewis-partners/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── package.json
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Root component + admin toggle
    ├── App.css
    ├── index.css               # Global styles & CSS variables
    │
    ├── data/
    │   └── siteData.js         # ⭐ ALL CONTENT LIVES HERE
    │                             Edit this file to update any text,
    │                             services, contact details etc.
    │
    ├── hooks/
    │   └── useScrollReveal.js  # Scroll-triggered fade animations
    │
    └── components/
        ├── Navbar.jsx / .css   # Fixed nav with active section tracking
        ├── Hero.jsx / .css     # Full-height landing section
        ├── Services.jsx / .css # 6-service grid with hover animations
        ├── About.jsx / .css    # Kenneth Lewis bio + credentials
        ├── Testimonials.jsx    # Client testimonials grid
        ├── Feedback.jsx / .css # Contact form with validation
        ├── Contact.jsx / .css  # Address, phone, map
        ├── Footer.jsx / .css   # 3-column footer
        └── AdminPanel.jsx      # Plain-English content editing panel
```

## Getting Started

```bash
npm install
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Updating Content

**All content is centralised in `src/data/siteData.js`.**

To update any text, contact details, services, or testimonials —
just edit `siteData.js`. No need to touch individual components.

Examples:
- Change phone number → update `firm.phone`
- Add a service → add an object to the `services` array
- Add a testimonial → add an object to the `testimonials` array
- Change the hero headline → update `hero.headline`

## Adding Real Photos

In `About.jsx`, replace the `.about__img-placeholder` div with:
```jsx
<img src="/kenneth-lewis.jpg" alt="Kenneth Lewis" className="about__photo" />
```
And add the photo to the `public/` folder.

## Deploying

The `npm run build` output in `dist/` is a folder of static files.
Deploy to:
- **Vercel** (recommended): `vercel deploy`
- **Netlify**: drag & drop the `dist/` folder
- **Crazy Domains hosting**: upload `dist/` contents via FTP

## Future Interactivity Ideas (React makes these easy)
- [ ] Online booking widget (Calendly embed or custom)
- [ ] Live chat integration
- [ ] Blog / news section
- [ ] Client portal login
- [ ] Animated tax savings calculator
- [ ] Admin CMS connected to AI content engine
