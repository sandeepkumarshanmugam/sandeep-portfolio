import type { ExperienceEntry } from './types';

/**
 * Experience, ordered most recent first.
 *
 * Sources: Sandeep's supplied role details and his résumé.
 *
 * On responsibilities: the résumé's Avanzo entry carries two bullets about
 * "cost-control measures" and "financial reporting" with percentage figures.
 * Those are leftover filler from the résumé template — they describe finance
 * work, not a cybersecurity internship — so they are deliberately excluded
 * rather than reproduced as fact. Where a role's actual duties are not
 * documented, `focus` records the verified subject area and nothing more.
 */
export const experience: readonly ExperienceEntry[] = [
  {
    id: 'intopz',
    role: 'Artificial Intelligence Engineer',
    organisation: 'Intopz',
    employmentType: 'Internship',
    period: 'Jun 2026 — Jul 2026',
    endedAt: '2026-07',
    location: 'Bangalore',
    workMode: 'On-site',
    kind: 'internship',
    focus: ['Artificial Intelligence', 'Digital Marketing'],
    detail: 'Worked with AI tools and prompt engineering.',
  },
  {
    id: 'rotaract',
    role: 'Young Leader Contact',
    organisation: 'Rotaract Club of KPR Institute of Engineering and Technology',
    employmentType: 'Full-time',
    period: 'Jul 2025 — May 2026',
    endedAt: '2026-05',
    location: 'Coimbatore, Tamil Nadu, India',
    workMode: 'On-site',
    kind: 'leadership',
    focus: ['Leadership', 'Community Engagement'],
  },
  {
    id: 'avanzo',
    role: 'Cybersecurity Student Intern',
    organisation: 'Avanzo Cyber Security Solutions Pvt Ltd',
    employmentType: 'Internship',
    period: 'Dec 2025 — Jan 2026',
    endedAt: '2026-01',
    location: 'Kerala',
    workMode: 'Hybrid',
    kind: 'internship',
    focus: ['Cybersecurity Tools'],
  },
  {
    id: 'ieee-procomm',
    role: 'Executive Member, PROCOMM Society',
    organisation: 'IEEE KPRIET Student Branch',
    employmentType: 'Member',
    period: 'Jan 2025 — Dec 2025',
    endedAt: '2025-12',
    location: 'Coimbatore, Tamil Nadu, India',
    workMode: null,
    kind: 'society',
    focus: ['Professional Communication', 'Student Activities'],
  },
];
