import { Link } from 'react-router-dom';
import { profile } from '@/data/profile';
import { cx } from '@/lib/cx';

/**
 * The logo: name plus a `</>` mark.
 *
 * The mark is built from two spans rather than an icon so it inherits the type
 * scale and can pick up the accent colour on hover — a small thing, but it
 * makes the wordmark feel drawn for this site rather than dropped into it.
 */
export function Wordmark({
  className,
  onNavigate,
}: {
  readonly className?: string;
  readonly onNavigate?: () => void;
}) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      aria-label={`${profile.name} — home`}
      className={cx(
        'group inline-flex items-baseline gap-2 rounded-sm text-[0.9375rem] font-semibold tracking-tight text-fg',
        'transition-colors duration-200 hover:text-fg',
        className,
      )}
    >
      <span>{profile.wordmark}</span>
      <span
        aria-hidden="true"
        className="font-mono text-[0.8125rem] font-normal text-accent/70 transition-colors duration-200 group-hover:text-accent"
      >
        &lt;/&gt;
      </span>
    </Link>
  );
}
