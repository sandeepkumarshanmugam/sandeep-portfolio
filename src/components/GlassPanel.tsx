import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

/**
 * The project's surface primitive.
 *
 * Restrained on purpose: a near-black fill, one hairline border, and no blur
 * unless asked for. "Glass" here means a faint lift off the background, not a
 * frosted panel — overused backdrop blur is the fastest way to make a dark
 * interface look generic.
 */
interface GlassPanelProps {
  readonly children: ReactNode;
  readonly className?: string;
  /** Adds the subtle blue radial wash. For panels that need emphasis. */
  readonly accent?: boolean;
  /** Enables the hover lift. Only for panels that are themselves interactive. */
  readonly interactive?: boolean;
  readonly as?: 'div' | 'li' | 'article' | 'section';
}

export function GlassPanel({
  children,
  className,
  accent = false,
  interactive = false,
  as: Tag = 'div',
}: GlassPanelProps) {
  return (
    <Tag
      className={cx(
        'rounded-xl border border-hairline',
        accent ? 'accent-wash' : 'bg-surface/45',
        interactive &&
          'transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-hairline-accent hover:bg-surface',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
