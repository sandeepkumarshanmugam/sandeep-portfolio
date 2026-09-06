import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Icon } from './Icon';
import type { ExperienceEntry, ExperienceKind, IconName } from '@/data/types';
import { inViewOnce, resolveVariants, revealItem } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Vertical timeline for experience entries.
 *
 * The crystal-blue line draws itself as the page scrolls: a static track holds
 * the full height, and a scaled overlay grows to match scroll progress. The
 * progress value is spring-smoothed so the line eases rather than tracking the
 * wheel one-to-one, which would feel mechanical.
 *
 * Under reduced motion the line is simply drawn in full from the start.
 */

const KIND_ICON: Record<ExperienceKind, IconName> = {
  internship: 'briefcase',
  leadership: 'users',
  society: 'award',
};

const KIND_LABEL: Record<ExperienceKind, string> = {
  internship: 'Internship',
  leadership: 'Leadership',
  society: 'Society',
};

export function ExperienceTimeline({
  entries,
}: {
  readonly entries: readonly ExperienceEntry[];
}) {
  const containerRef = useRef<HTMLOListElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start drawing when the list's top reaches 85% down the viewport, finish
    // when its bottom passes the midpoint.
    offset: ['start 0.85', 'end 0.5'],
  });

  const smoothed = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const scaleY = useTransform(smoothed, (value) => (reduced ? 1 : value));
  const item = resolveVariants(reduced, revealItem);

  return (
    <ol ref={containerRef} className="relative space-y-12 pl-11 sm:pl-14">
      {/* Static track */}
      <div
        aria-hidden="true"
        className="absolute left-[0.6875rem] top-2 h-[calc(100%-1rem)] w-px bg-hairline-strong sm:left-[1.0625rem]"
      />
      {/* Drawn progress line */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute left-[0.6875rem] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-accent via-accent to-accent/30 shadow-[0_0_8px_rgb(0_191_255/0.55)] sm:left-[1.0625rem]"
      />

      {entries.map((entry) => (
        <motion.li
          key={entry.id}
          variants={item}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
          className="relative"
        >
          {/* Node */}
          <span
            aria-hidden="true"
            className="absolute -left-11 top-0.5 inline-flex size-6 items-center justify-center rounded-full border border-hairline-accent bg-bg text-accent sm:-left-14 sm:size-[2.125rem]"
          >
            <Icon name={KIND_ICON[entry.kind]} size={13} className="sm:hidden" />
            <Icon name={KIND_ICON[entry.kind]} size={16} className="hidden sm:block" />
          </span>

          <div className="rounded-xl border border-hairline bg-surface/40 p-6 transition-[border-color,background-color] duration-300 hover:border-hairline-accent hover:bg-surface sm:p-7">
            {/* Date + type */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="font-mono text-[0.75rem] tracking-wide text-accent">
                {entry.period}
              </p>
              <span aria-hidden="true" className="h-3 w-px bg-hairline-strong" />
              <p className="text-[0.75rem] text-fg-muted">
                {KIND_LABEL[entry.kind]}
              </p>
            </div>

            <h3 className="mt-4 text-h3 font-semibold text-fg">{entry.role}</h3>
            <p className="mt-1.5 text-[0.9375rem] font-medium text-fg-secondary">
              {entry.organisation}
            </p>

            {/* Location + mode + employment type */}
            <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8125rem] text-fg-muted">
              <li className="flex items-center gap-1.5">
                <Icon name="location" size={13} />
                {entry.location}
              </li>
              {entry.workMode ? (
                <li className="flex items-center gap-1.5">
                  <Icon name="layers" size={13} />
                  {entry.workMode}
                </li>
              ) : null}
              <li className="flex items-center gap-1.5">
                <Icon name="briefcase" size={13} />
                {entry.employmentType}
              </li>
            </ul>

            {/* Verified detail only — omitted entirely when undocumented. */}
            {entry.detail ? (
              <p className="mt-5 text-sm leading-relaxed text-fg-secondary">
                {entry.detail}
              </p>
            ) : null}

            <div className="mt-5 border-t border-hairline pt-4">
              <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                Focus
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {entry.focus.map((area) => (
                  <li
                    key={area}
                    className="rounded-md border border-hairline bg-white/[0.02] px-2.5 py-1 text-[0.8125rem] text-fg-secondary"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
