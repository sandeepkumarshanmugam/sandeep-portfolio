import type { SkillGroupData } from './types';

/**
 * Skills, grouped and banded — never scored.
 *
 * There are no percentages here by design: "Python 95%" is a number nobody
 * measured. Each group carries an honest band instead:
 *
 *   working  — used to build something that exists
 *   familiar — studied and applied in coursework
 *   learning — actively studying, not yet shipped
 *
 * React sits under 'working' because two shipped projects are built with it.
 * AI/ML and Cloud sit under 'learning', since the exposure is coursework and
 * an internship rather than a delivered project.
 */
export const skillGroups: readonly SkillGroupData[] = [
  {
    title: 'Languages',
    icon: 'terminal',
    level: 'working',
    items: ['Python', 'Java', 'C', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
  },
  {
    title: 'Web',
    icon: 'code',
    level: 'working',
    items: ['React', 'Tailwind CSS', 'Responsive design', 'UI/UX design'],
  },
  {
    title: 'Databases',
    icon: 'database',
    level: 'familiar',
    items: ['MySQL', 'ERD design', 'Database concepts'],
  },
  {
    title: 'Tools & Platforms',
    icon: 'layers',
    level: 'working',
    items: ['Git', 'GitHub', 'VS Code', 'Linux'],
  },
  {
    title: 'Computer Science',
    icon: 'brain',
    level: 'familiar',
    items: ['Data Structures', 'Algorithms', 'OOP'],
  },
  {
    title: 'Currently Learning',
    icon: 'spark',
    level: 'learning',
    items: ['AI/ML', 'Cloud', 'Full-stack architecture', 'DevOps'],
  },
];

export const skillLevelLabel: Record<SkillGroupData['level'], string> = {
  working: 'Working with',
  familiar: 'Familiar',
  learning: 'Learning',
};
