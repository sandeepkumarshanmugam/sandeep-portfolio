/**
 * Content model for the portfolio.
 *
 * Every page renders from the typed data in this folder — no copy is hardcoded
 * inside a component. Adding a project, role, certification or social link is a
 * data edit, never a component rewrite.
 *
 * A deliberate constraint runs through these types: anything that could be
 * mistaken for a claim (metrics, outcomes, proficiency) is either a required
 * literal union with honest options, or optional and simply omitted when it
 * cannot be verified. There is no field for a number nobody measured.
 */

/** A link that may not exist yet. `url: null` renders nothing at all, rather
 *  than a placeholder or an invented address. */
export interface ProfileLink {
  readonly label: string;
  readonly url: string | null;
  readonly icon: IconName;
  /** Shown in `title`/`aria-label` for screen readers and tooltips. */
  readonly handle?: string;
}

export type IconName =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'mail'
  | 'phone'
  | 'location'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-down'
  | 'arrow-left'
  | 'download'
  | 'external'
  | 'menu'
  | 'close'
  | 'code'
  | 'layers'
  | 'brain'
  | 'shield'
  | 'terminal'
  | 'database'
  | 'palette'
  | 'briefcase'
  | 'award'
  | 'certificate'
  | 'education'
  | 'users'
  | 'check'
  | 'spark'
  | 'lock';

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

export type ProjectCategory = 'web' | 'software' | 'ai-ml' | 'other';

/** Repository visibility, checked against GitHub rather than assumed.
 *  A `private` repo intentionally suppresses its own link in the UI so the
 *  site never ships a 404. Flip to `public` and the button appears. */
export type RepoVisibility = 'public' | 'private';

export interface ProjectRepo {
  readonly url: string;
  readonly visibility: RepoVisibility;
}

/** One numbered section of a case study. */
export interface CaseStudySection {
  readonly id: string;
  readonly title: string;
  /** Each string is a paragraph. */
  readonly body: readonly string[];
  /** Optional bullet list rendered under the paragraphs. */
  readonly points?: readonly string[];
}

export interface Project {
  readonly slug: string;
  readonly title: string;
  /** Short label shown on the card, e.g. "Industry Website". */
  readonly category: string;
  readonly categories: readonly ProjectCategory[];
  /** One or two sentences. Verified description only. */
  readonly summary: string;
  /** Technologies read from the repository's own manifest and source. */
  readonly stack: readonly string[];
  readonly repo: ProjectRepo | null;
  /** Public deployment, if one exists. */
  readonly liveUrl: string | null;
  readonly year: string;
  /** Visual identity for the card, since there are no public screenshots. */
  readonly accentIcon: IconName;
  readonly caseStudy: readonly CaseStudySection[];
  /** Rendered as an honest disclosure at the foot of the case study. */
  readonly verificationNote?: string;
}

/* -------------------------------------------------------------------------- */
/*  Experience                                                                */
/* -------------------------------------------------------------------------- */

export type ExperienceKind = 'internship' | 'leadership' | 'society';

export interface ExperienceEntry {
  readonly id: string;
  readonly role: string;
  readonly organisation: string;
  /** e.g. "Internship", "Full-time". */
  readonly employmentType: string;
  readonly period: string;
  /** Sort key: end date as YYYY-MM. */
  readonly endedAt: string;
  readonly location: string;
  /** e.g. "On-site", "Hybrid". */
  readonly workMode: string | null;
  readonly kind: ExperienceKind;
  /** Verified focus areas as recorded. Never invented responsibilities. */
  readonly focus: readonly string[];
  /** Only included where the source material actually documents it. */
  readonly detail?: string;
}

/* -------------------------------------------------------------------------- */
/*  Capabilities / services                                                   */
/* -------------------------------------------------------------------------- */

export interface Capability {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly technologies: readonly string[];
  readonly icon: IconName;
}

export interface Service {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

/* -------------------------------------------------------------------------- */
/*  Skills                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Honest proficiency bands, not percentages.
 *
 * `working`  — used to build something that exists.
 * `familiar` — studied and applied in coursework or exercises.
 * `learning` — actively studying; not yet shipped in a project.
 */
export type SkillLevel = 'working' | 'familiar' | 'learning';

export interface SkillGroupData {
  readonly title: string;
  readonly icon: IconName;
  readonly level: SkillLevel;
  readonly items: readonly string[];
}

/* -------------------------------------------------------------------------- */
/*  Credentials                                                               */
/* -------------------------------------------------------------------------- */

export interface Certification {
  readonly title: string;
  readonly issuer: string;
  /** Omitted when the issue date is not documented — never guessed. */
  readonly date?: string;
}

export interface Achievement {
  readonly title: string;
  readonly detail: string;
  /** e.g. "1st place, Domain 2" — only when verified. */
  readonly highlight?: string;
  readonly icon: IconName;
}

export interface EducationEntry {
  readonly qualification: string;
  readonly institution: string;
  readonly period: string;
  readonly current: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Page metadata                                                             */
/* -------------------------------------------------------------------------- */

export interface PageMeta {
  readonly title: string;
  readonly description: string;
}
