import { activeSocialLinks } from '@/data/profile';
import { Icon } from './Icon';
import { cx } from '@/lib/cx';

/**
 * Renders only the social links that have a real destination.
 *
 * `activeSocialLinks` filters out any entry whose `url` is still null, so an
 * unsupplied profile produces no icon at all — never a dead link or a visible
 * placeholder.
 */
export function SocialLinks({
  size = 'md',
  className,
}: {
  readonly size?: 'sm' | 'md';
  readonly className?: string;
}) {
  const dimension = size === 'sm' ? 'size-9' : 'size-10';
  const glyph = size === 'sm' ? 16 : 18;

  return (
    <ul className={cx('flex items-center gap-2', className)}>
      {activeSocialLinks.map((link) => {
        const isMail = link.icon === 'mail';
        return (
          <li key={link.label}>
            <a
              href={link.url}
              {...(isMail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              aria-label={
                isMail
                  ? `Email ${link.handle}`
                  : `${link.label} profile (opens in a new tab)`
              }
              title={link.handle ?? link.label}
              className={cx(
                dimension,
                'inline-flex items-center justify-center rounded-full',
                'border border-hairline text-fg-secondary',
                'transition-[color,border-color,background-color,transform] duration-200',
                'hover:-translate-y-px hover:border-hairline-accent hover:bg-accent/[0.06] hover:text-accent',
              )}
            >
              <Icon name={link.icon} size={glyph} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
