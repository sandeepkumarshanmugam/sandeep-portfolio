import type { EducationEntry, ProfileLink } from './types';

/**
 * Identity and contact details.
 *
 * Sources: Sandeep's résumé (SANDEEP CV.pdf) and his own supplied brief.
 *
 * Note on the home address: the résumé lists a full street address. It is
 * deliberately NOT reproduced here — a public portfolio should expose a city,
 * not a doorstep. `location` is the city only.
 */
export const profile = {
  name: 'Sandeepkumar S',
  shortName: 'Sandeep',
  /** Used in the logo mark and the footer. */
  wordmark: 'Sandeepkumar S',
  roles: ['Undergraduate Student', 'Web Developer', 'AI/ML Enthusiast'],
  tagline: 'Build. Solve. Learn.',
  discipline: 'Information Technology',

  greeting: "Hello! I'm",

  intro:
    "I'm an undergraduate student based in Coimbatore, passionate about building seamless web experiences and exploring the potential of Artificial Intelligence. Currently balancing academics with hands-on development, I enjoy turning complex problems into elegant, user-friendly solutions.",

  email: 'sekarsandeep2006@gmail.com',
  phone: '+91 9443249603',
  phoneHref: '+919443249603',
  location: 'Coimbatore, India',

  resume: {
    /** Served from /public. The download name is what lands in the visitor's
     *  Downloads folder, so it is spelled out properly. */
    href: '/resume/Sandeepkumar-S-Resume.pdf',
    downloadName: 'Sandeepkumar-S-Resume.pdf',
  },

  /** Canonical origin. Update once the production domain is attached; it feeds
   *  the canonical tag, Open Graph URLs and the sitemap. */
  siteUrl: 'https://sandeepkumar.dev',
} as const;

/**
 * Social links.
 *
 * `url: null` means "not supplied yet". The UI skips these entirely rather than
 * rendering a dead link — no invented handles, no placeholder hrefs shipped to
 * production. Fill in the URL and the icon appears everywhere automatically.
 */
export const socialLinks: readonly ProfileLink[] = [
  {
    label: 'GitHub',
    url: 'https://github.com/sandeepkumarshanmugam',
    handle: '@sandeepkumarshanmugam',
    icon: 'github',
  },
  {
    // Taken verbatim from the résumé. The trailing hyphen is part of the slug
    // as printed there; worth confirming once against the live profile.
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/sandeepkumar-s-',
    handle: 'sandeepkumar-s-',
    icon: 'linkedin',
  },
  {
    label: 'Instagram',
    url: null, // TODO(sandeep): supply profile URL.
    icon: 'instagram',
  },
  {
    label: 'Email',
    url: `mailto:${profile.email}`,
    handle: profile.email,
    icon: 'mail',
  },
];

/** Only links with a known destination are ever rendered. */
export const activeSocialLinks = socialLinks.filter(
  (link): link is ProfileLink & { url: string } => link.url !== null,
);

/** Social links minus email — for the footer and contact page, where the email
 *  address already appears in full as its own line item. */
export const activeProfileLinks = activeSocialLinks.filter(
  (link) => link.icon !== 'mail',
);

export const education: readonly EducationEntry[] = [
  {
    qualification: 'B.Tech, Information Technology',
    institution: 'KPR Institute of Engineering and Technology',
    period: '2024 — 2028',
    current: true,
  },
  {
    qualification: 'Senior Higher Secondary',
    institution: 'MS Vidayalya Matric. Hr. Sec. School',
    period: '2020 — 2023',
    current: false,
  },
  {
    qualification: 'Higher Secondary',
    institution: 'Palaniappa Matric. Hr. Sec. School',
    period: '2016 — 2020',
    current: false,
  },
];

/** The "at a glance" grid on the About page. */
export const aboutFacts = [
  { label: 'Education', value: 'B.Tech Information Technology', icon: 'education' },
  { label: 'College', value: 'KPR Institute of Engineering and Technology', icon: 'layers' },
  { label: 'Location', value: 'Coimbatore, India', icon: 'location' },
  { label: 'Current focus', value: 'Web Development + AI/ML', icon: 'code' },
  { label: 'Career goal', value: 'Full-Stack Developer', icon: 'spark' },
  { label: 'Languages', value: 'English, Tamil', icon: 'users' },
] as const;

export const softSkills = [
  'Communication',
  'Problem Solving',
  'Team Collaboration',
  'Analytical Thinking',
  'Adaptability',
] as const;
