import type { Achievement, Certification } from './types';

/**
 * Certifications, exactly as documented in the résumé.
 *
 * No issue dates or credential IDs are listed, because none are recorded in the
 * source material. An undated certification is honest; an invented date is not.
 * Add a `date` field per entry once the real ones are to hand.
 */
export const certifications: readonly Certification[] = [
  {
    title: 'Samsung Innovation Campus',
    issuer: 'Samsung',
  },
  {
    title: 'Network Technician Career Path',
    issuer: 'Cisco',
  },
  {
    title: 'Introduction to Cybersecurity',
    issuer: 'Cisco',
  },
  {
    title: 'Network Mastery for Ethical Hackers',
    issuer: 'Udemy',
  },
];

export const achievements: readonly Achievement[] = [
  {
    title: 'International Hackathon — 1st Place, Domain 2',
    detail:
      'Competed in an international-level hackathon conducted by ECLearnix Private Limited with KPR Institute of Engineering and Technology (CSE AI/ML). Won Round 2 and placed first in Domain 2.',
    highlight: '₹3,000 cash prize',
    icon: 'award',
  },
  {
    title: 'Published patent — Artificial Intelligence',
    // No number, title or status is given here on purpose: the source records
    // only that a patent in the AI field was published.
    detail: 'A patent in the field of Artificial Intelligence.',
    icon: 'certificate',
  },
  {
    title: 'DevOps Fundamentals',
    detail: 'Completed a one-week intensive DevOps programme.',
    icon: 'terminal',
  },
];
