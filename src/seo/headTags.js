// src/seo/headTags.js
//
// Build-time only — imported by vite.config.js, never by the React app.
// Generates everything SEO-related from siteData.js so that file stays the
// single source of truth: <head> tags, JSON-LD, robots.txt and sitemap.xml.

import { firm, seo, about } from '../data/siteData.js'

const escapeHtml = str =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// "1300 080 833" → "+61 1300 080 833"; "03 9123 4567" → "+61 3 9123 4567"
const toInternationalPhone = phone => `+61 ${phone.replace(/^0/, '')}`

// "9:00 AM" → "09:00"
function to24h(time) {
  const [, h, m, period] = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  let hours = Number(h) % 12
  if (period.toUpperCase() === 'PM') hours += 12
  return `${String(hours).padStart(2, '0')}:${m}`
}

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AccountingService',
    name: firm.name,
    legalName: firm.legalName,
    url: seo.siteUrl,
    telephone: toInternationalPhone(firm.phone),
    email: firm.email,
    taxID: firm.abn,
    slogan: firm.tagline,
    description: seo.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: firm.address.street,
      addressLocality: firm.address.suburb,
      addressRegion: firm.address.state,
      postalCode: firm.address.postcode,
      addressCountry: seo.country,
    },
    openingHoursSpecification: firm.hours
      .filter(h => h.open && h.close)
      .map(h => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.day,
        opens: to24h(h.open),
        closes: to24h(h.close),
      })),
    founder: {
      '@type': 'Person',
      name: about.name,
      jobTitle: about.title,
      sameAs: [about.linkedin],
    },
  }
}

export function buildHeadTags() {
  // `<` is escaped so the JSON can never close the <script> tag early.
  const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c')

  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
    `<link rel="canonical" href="${seo.siteUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(firm.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
    `<meta property="og:url" content="${seo.siteUrl}" />`,
    `<meta property="og:locale" content="${seo.locale}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ')
}

export function buildRobotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${seo.siteUrl}sitemap.xml\n`
}

export function buildSitemapXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${seo.siteUrl}</loc>
  </url>
</urlset>
`
}
