import type { Capability } from './types';

/** The four areas on the What I Do page. Technology lists name only what
 *  Sandeep actually works with — not aspirational additions. */
export const capabilities: readonly Capability[] = [
  {
    index: '01',
    title: 'Web Development',
    description:
      'Building modern, responsive and user-friendly web experiences — from layout and interaction through to the components underneath.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React'],
    icon: 'code',
  },
  {
    index: '02',
    title: 'Software Development',
    description:
      'Building applications through programming, problem solving and structured software development.',
    technologies: ['Java', 'Python', 'DSA', 'OOP'],
    icon: 'terminal',
  },
  {
    index: '03',
    title: 'AI / ML',
    description:
      'Exploring Artificial Intelligence and Machine Learning, and understanding where they apply in practice.',
    technologies: ['Python', 'AI/ML concepts', 'Prompt engineering'],
    icon: 'brain',
  },
  {
    index: '04',
    title: 'Automation & Security',
    description:
      'Exploring automation workflows, Linux and security concepts through security-focused technical projects.',
    technologies: ['Linux', 'Networking', 'Security tools'],
    icon: 'shield',
  },
];
