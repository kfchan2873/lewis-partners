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
  address: 'Unit 5, 40 Station Street, Bayswater VIC 3153',
  motto: 'Professional accounting and taxation services with integrity and clarity.',
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=40+Station+Street+Bayswater+VIC+3153&output=embed',

  legal: {
    taxAgentNumber: '24251007',
    legalName: 'Lewis Partners Accountants PTY LTD',
  },

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
  linkedin: '#',
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
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
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