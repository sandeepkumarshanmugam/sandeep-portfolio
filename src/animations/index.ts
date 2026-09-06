import type { Transition, Variants } from 'motion/react';

/**
 * The single source of truth for motion in this project.
 *
 * Every animated component imports from here rather than inlining its own
 * durations and easings, which is what keeps the whole site feeling like one
 * piece of software. Two rules govern the values below:
 *
 *   1. Restraint. Nothing travels far (16–24px), nothing scales much (≤3%),
 *      nothing runs long. Motion should be noticed only in its absence.
 *   2. One easing family. `easeOutSoft` decelerates hard at the end, which
 *      reads as precise rather than bouncy — no springs, no overshoot.
 */

/** Matches --ease-out-soft in index.css so CSS and JS animations agree. */
export const easeOutSoft = [0.22, 1, 0.36, 1] as const;
export const easeInOutSoft = [0.65, 0, 0.35, 1] as const;

export const duration = {
  fast: 0.2,
  base: 0.4,
  /** Page transitions — the 400–600ms band. */
  page: 0.5,
  slow: 0.7,
} as const;

export const transition = {
  base: { duration: duration.base, ease: easeOutSoft },
  fast: { duration: duration.fast, ease: easeOutSoft },
  page: { duration: duration.page, ease: easeOutSoft },
} satisfies Record<string, Transition>;

/* -------------------------------------------------------------------------- */
/*  Page transitions                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Route change: the outgoing page fades and lifts very slightly, the incoming
 * page fades up into place. The exit is quicker than the enter so navigation
 * feels responsive rather than sluggish.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.page, ease: easeOutSoft },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: easeInOutSoft },
  },
};

/** Used when reduced motion is requested: state changes still happen, but
 *  nothing moves and nothing is left mid-fade. */
export const staticVariants: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};

/* -------------------------------------------------------------------------- */
/*  Reveal                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Parent of a staggered group. Children inherit the timing, so a list only
 * needs `revealGroup` on the container and `revealItem` on each child.
 */
export const revealGroup = (stagger = 0.07, delay = 0): Variants => ({
  initial: {},
  animate: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const revealItem: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easeOutSoft },
  },
};

/** For elements entering from the side — used sparingly. */
export const revealFromLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease: easeOutSoft },
  },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.slow, ease: easeOutSoft } },
};

/** Scroll-triggered reveal settings shared by every `whileInView` usage:
 *  fire once, slightly before the element reaches the viewport edge. */
export const inViewOnce = {
  once: true,
  margin: '0px 0px -12% 0px',
} as const;

/* -------------------------------------------------------------------------- */
/*  Interaction                                                               */
/* -------------------------------------------------------------------------- */

/** Card hover: a 3px lift. Deliberately below the threshold of feeling bouncy. */
export const cardHover = {
  rest: { y: 0 },
  hover: { y: -3, transition: transition.fast },
} as const;

/**
 * Returns the variants a component should actually use, given the user's
 * motion preference. Centralising the check here means components read
 * `resolveVariants(reduced, x)` instead of branching on their own.
 */
export function resolveVariants(
  prefersReducedMotion: boolean,
  variants: Variants,
): Variants {
  return prefersReducedMotion ? staticVariants : variants;
}
