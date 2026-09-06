import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { revealGroup, revealItem, resolveVariants } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cx } from '@/lib/cx';

/**
 * The heading block every inner page opens with.
 *
 * Having one component own the eyebrow / title / subtitle rhythm is what makes
 * seven separate routes read as one site — the vertical spacing above the
 * first heading is identical everywhere, which is the kind of thing that is
 * invisible when right and obvious when wrong.
 */
interface PageHeadingProps {
  /** Small uppercase label above the title. */
  readonly eyebrow?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly children?: ReactNode;
  readonly className?: string;
  /** Constrains the subtitle measure. Wider for pages with a long standfirst. */
  readonly align?: 'left' | 'center';
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
  children,
  className,
  align = 'left',
}: PageHeadingProps) {
  const reduced = usePrefersReducedMotion();
  const group = resolveVariants(reduced, revealGroup(0.08));
  const item = resolveVariants(reduced, revealItem);

  return (
    <motion.header
      variants={group}
      initial="initial"
      animate="animate"
      className={cx(
        'relative',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {eyebrow ? (
        <motion.p
          variants={item}
          className={cx(
            'mb-5 flex items-center gap-3 text-eyebrow font-semibold uppercase text-accent',
            align === 'center' && 'justify-center',
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
          {eyebrow}
        </motion.p>
      ) : null}

      <motion.h1
        variants={item}
        className="text-h1 font-semibold tracking-tight text-fg"
      >
        {title}
      </motion.h1>

      {subtitle ? (
        <motion.p
          variants={item}
          className={cx(
            'mt-5 max-w-2xl text-lead text-fg-secondary',
            align === 'center' && 'mx-auto',
          )}
        >
          {subtitle}
        </motion.p>
      ) : null}

      {children ? <motion.div variants={item}>{children}</motion.div> : null}
    </motion.header>
  );
}
