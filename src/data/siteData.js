// src/data/siteData.js

/* ===============================
   FIRM DETAILS
================================= */

export const firm = {
  name: 'Lewis Partners',
  brandPrimary: 'Lewis',
  brandSecondary: 'Partners',
  phone: '1800 080 833',
  email: 'admin@lewispartners.com.au',
  address: {
    street: 'Unit 5, 40 Station Street',
    suburb: 'Bayswater',
    state: 'VIC',
    postcode: '3153',
  },
  motto: 'Professional accounting and taxation services with integrity and clarity.',
  tagline: 'Trusted accounting for individuals and business.',
  website: 'lewispartners.com.au',
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=40+Station+Street+Bayswater+VIC+3153&output=embed',

  legalName: 'Lewis Partners Accountants Pty Ltd',
  taxAgentNumber: '24251007',
  abn: '98 152 881 274',

  hours: [
    { day: 'Monday', open: '9:00 AM', close: '5:00 PM' },
    { day: 'Tuesday', open: '9:00 AM', close: '5:00 PM' },
    { day: 'Wednesday', open: '9:00 AM', close: '5:00 PM' },
    { day: 'Thursday', open: '9:00 AM', close: '5:00 PM' },
    { day: 'Friday', open: '9:00 AM', close: '5:00 PM' },
    { day: 'Saturday', open: null, close: null },
    { day: 'Sunday', open: null, close: null },
  ],
}

/* ===============================
   HERO SECTION
================================= */

export const hero = {
  badge: 'Registered Tax Agent · IPA Member',

  headline: [
    'Clear Advice.',
    'Practical Solutions.',
    'Trusted Accounting.',
  ],

  subheading:
    'Professional accounting and taxation services for individuals and businesses across Melbourne.',

  cta: {
    primary: 'Get in Touch',
    secondary: 'View Services',
  },

  stats: [
    { number: '15+', label: 'Years Experience' },
    { number: '500+', label: 'Clients Supported' },
    { number: '1000+', label: 'Tax Returns Lodged' },
  ],
}
/* ===============================
   SERVICES
================================= */

export const services = [
  {
    icon: '📊',
    title: 'Business Accounting',
    description: 'Complete accounting solutions tailored for small and medium businesses.',
  },
  {
    icon: '🧾',
    title: 'Business Tax Returns',
    description: 'Accurate and compliant tax returns prepared with attention to detail.',
  },
  {
    icon: '👤',
    title: 'Individual Tax Returns',
    description: 'Maximise deductions and ensure compliance with expert guidance.',
  },
  {
    icon: '📑',
    title: 'GST & BAS Returns',
    description: 'Reliable preparation and lodgement of GST and BAS obligations.',
  },
  {
    icon: '📈',
    title: 'Business Tax Planning',
    description: 'Strategic tax planning to support long-term business growth.',
  },
  {
    icon: '🏦',
    title: 'Super Fund Tax Returns',
    description: 'Professional SMSF and superannuation tax reporting services.',
  },
]

/* ===============================
   ABOUT
================================= */

export const about = {
  name: 'Kenneth Lewis',
  title: 'Principal Accountant',
  credentials: [
    'Registered Tax Agent',
    'Member – Institute of Public Accountants',
    'Deakin University Graduate',
  ],
  bio: [
    'Kenneth Lewis has over 15 years of experience supporting individuals and businesses with practical accounting and taxation advice.',
    'His approach is straightforward, transparent, and focused on long-term client success.',
  ],
  badges: ['IPA Member', 'Registered Tax Agent'],
  linkedin: 'https://www.linkedin.com/in/kenneth-lewis2201/',
}

/* ===============================
   TESTIMONIALS
================================= */

export const testimonials = [
  {
    stars: 5,
    text: 'Kenneth provides clear, reliable advice and makes tax time stress-free.',
    name: 'Michael T.',
    role: 'Small Business Owner',
    initials: 'MT',
  },
  {
    stars: 5,
    text: 'Professional, responsive and knowledgeable. Highly recommended.',
    name: 'Sarah L.',
    role: 'Consultant',
    initials: 'SL',
  },
  {
    stars: 5,
    text: 'We’ve trusted Lewis Partners for years — excellent service every time.',
    name: 'David R.',
    role: 'Property Investor',
    initials: 'DR',
  },
]

/* ===============================
   NAVIGATION
================================= */

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

/* ===============================
   EXTERNAL LINKS ("Useful Links")
================================= */

// `logo` filenames are placeholders — actual assets go in public/logos/
// (SVG preferred, PNG fallback). NavDropdown/Footer hide the <img> on 404
// until real files are supplied.
export const externalLinks = [
  // Banking
  { label: 'CBA', url: 'https://www.commbank.com.au/', logo: 'cba.svg', category: 'Banking', active: true },
  { label: 'NAB', url: 'https://www.nab.com.au/', logo: 'nab.svg', category: 'Banking', active: true },
  { label: 'HSBC', url: 'https://www.hsbc.com.au/', logo: 'hsbc.svg', category: 'Banking', active: true },
  { label: 'Westpac', url: 'https://www.westpac.com.au/', logo: 'westpac.svg', category: 'Banking', active: true },
  { label: 'Bendigo Bank', url: 'https://www.bendigobank.com.au/', logo: 'bendigo-bank.svg', category: 'Banking', active: true },
  { label: 'Bank of Melbourne', url: 'https://www.bankofmelbourne.com.au/', logo: 'bank-of-melbourne.svg', category: 'Banking', active: true },

  // Government & Other
  { label: 'Centrelink', url: 'https://www.servicesaustralia.gov.au/centrelink', logo: 'centrelink.svg', category: 'Government & Other', active: true },
  { label: 'MyGov', url: 'https://my.gov.au/', logo: 'mygov.svg', category: 'Government & Other', active: true },
  { label: 'Momentum Wealth', url: 'https://momentumwm.com.au/', logo: 'momentum-wealth.svg', category: 'Government & Other', active: true },
]

/* ===============================
   ENQUIRY TYPES
================================= */

export const enquiryTypes = [
  'Business Tax Returns',
  'Business Accounting',
  'Individual Tax Returns',
  'GST & BAS Returns',
  'Business Tax Planning',
  'Super Fund Tax Returns',
  'General Enquiry',
  'Feedback / Compliment',
]