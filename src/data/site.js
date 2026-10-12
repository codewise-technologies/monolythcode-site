// ---------------------------------------------------------------
// Company details used across the site. Edit these in one place.
// ---------------------------------------------------------------
export const SITE = {
  name: 'Monolyth Code',
  tagline: 'Software engineering · Digital systems',
  url: 'https://www.monolythcode.com',
  email: 'hello@monolythcode.com',      // change to the mailbox you created in Zoho
  phone: null,                          // e.g. '+94 77 123 4567' — null hides it
  location: 'Sri Lanka',
  serving: 'Clients in Sri Lanka and internationally',
  hours: 'Monday – Friday, 9:00 – 18:00 (Sri Lanka time, UTC+5:30)',
  replyPromise: 'one business day',
  erpDemoUrl: 'https://demo.monolythcode.com', // set to null until the demo is live
  social: {
    linkedin: null,                     // e.g. 'https://www.linkedin.com/company/monolythcode'
    github: null,
  },
}

export const PROCESS = [
  {
    step: 'Discover',
    text: 'We map how your business actually runs — the processes, the people, the data and the problems worth solving.',
    output: 'Scope document and fixed quote',
    typical: '1–2 weeks',
  },
  {
    step: 'Design',
    text: 'Architecture, data model and user flows, turned into a clickable prototype you approve before any code is written.',
    output: 'Approved prototype and technical plan',
    typical: '2–3 weeks',
  },
  {
    step: 'Build',
    text: 'Delivery in two-week sprints. You see working software at the end of every sprint on your own staging environment.',
    output: 'Working releases every sprint',
    typical: 'Project-dependent',
  },
  {
    step: 'Launch',
    text: 'Data migration, user training and a planned go-live, with our engineers on hand through the first weeks of real use.',
    output: 'Live system and trained team',
    typical: '1–2 weeks',
  },
  {
    step: 'Support',
    text: 'Monitoring, security updates and continuous improvement under a support plan that matches how critical the system is.',
    output: 'Agreed response times',
    typical: 'Ongoing',
  },
]

export const STANDARDS = [
  {
    title: 'You own what we build',
    text: 'Full source code, documentation and intellectual property are handed over to you. No lock-in to us or to a licence you cannot leave.',
  },
  {
    title: 'Security from the first commit',
    text: 'Role-based access, encrypted connections, audited dependencies and automated backups are part of the build — not an add-on. Our roots are in security engineering.',
  },
  {
    title: 'Fixed milestones, clear pricing',
    text: 'Work is scoped into milestones with defined deliverables and agreed prices, so you always know what you are paying for and when.',
  },
  {
    title: 'Documented and handed over',
    text: 'Admin guides, technical documentation and hands-on training, so your team can run the system with confidence.',
  },
  {
    title: 'Built to grow with you',
    text: 'Modular architecture and APIs from day one, so new branches, users and integrations do not mean starting again.',
  },
  {
    title: 'One accountable team',
    text: 'A single point of contact, weekly progress updates and direct access to the engineers working on your system.',
  },
]

export const ENGAGEMENTS = [
  {
    name: 'Fixed-scope project',
    best: 'Best for a defined system with a clear goal',
    points: ['Scope, timeline and price agreed upfront', 'Milestone-based payments', 'Ideal for ERP, hotel systems and websites'],
  },
  {
    name: 'Dedicated team',
    best: 'Best for ongoing product development',
    points: ['Engineers assigned to your product', 'Monthly capacity you can re-prioritise', 'Works alongside your in-house team'],
  },
  {
    name: 'Support & maintenance',
    best: 'Best for systems already in production',
    points: ['Monitoring, updates and security patches', 'Agreed response times', 'Available for systems we did not build'],
  },
]

export const INDUSTRIES = [
  { name: 'Hospitality & tourism', text: 'Hotels, resorts, villas and tour operators.' },
  { name: 'Retail & distribution', text: 'Multi-branch stock, POS and wholesale.' },
  { name: 'Manufacturing', text: 'Production planning, costing and inventory.' },
  { name: 'Professional services', text: 'Projects, time, billing and client portals.' },
  { name: 'Education & training', text: 'Student records, fees and learning portals.' },
  { name: 'Healthcare & clinics', text: 'Appointments, patient records and billing.' },
]

export const TECH = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'Flutter', 'Kotlin', 'Swift', 'PostgreSQL', 'Docker', 'Linux', 'Cloud & on-premise']
