import type { Service } from './types';

/**
 * Services, positioned at the level Sandeep can genuinely deliver today.
 * No enterprise language, no team-scale promises, no guarantees about
 * outcomes that would depend on work he has not done yet.
 */
export const services: readonly Service[] = [
  {
    index: '01',
    title: 'Web Development',
    description:
      'Responsive websites and modern web interfaces, built to work properly on every screen size.',
    icon: 'code',
  },
  {
    index: '02',
    title: 'Landing Pages',
    description:
      'Clean, fast, single-purpose pages for a product, an event or a campaign.',
    icon: 'layers',
  },
  {
    index: '03',
    title: 'Freelance Projects',
    description:
      'Web and technical development work, taken on alongside my degree.',
    icon: 'briefcase',
  },
  {
    index: '04',
    title: 'Digital Marketing Support',
    description:
      'Support on digital presence and the web side of getting something in front of people.',
    icon: 'spark',
  },
  {
    index: '05',
    title: 'Security-Focused Projects',
    description:
      'Security-oriented learning projects and small technical solutions, drawing on my cybersecurity internship and networking coursework.',
    icon: 'shield',
  },
  {
    index: '06',
    title: 'Technical Assistance',
    description:
      'Helping turn a technical idea into something practical and working — scoping it, then building it.',
    icon: 'users',
  },
];
