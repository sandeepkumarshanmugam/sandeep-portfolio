import { Link } from 'react-router-dom';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from '@/data/types';
import { cx } from '@/lib/cx';

/**
 * The project's only button.
 *
 * It renders as whichever element is semantically correct — `<button>` for
 * actions, `<Link>` for internal routes, `<a>` for external URLs — while
 * keeping one visual definition. That distinction is the accessibility
 * requirement "buttons must actually be buttons, links must actually be links",
 * enforced by the type signature rather than by convention.
 */

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

interface CommonProps {
  readonly children: ReactNode;
  readonly variant?: Variant;
  readonly size?: Size;
  readonly icon?: IconName;
  /** Icon placement. Trailing arrows sit right; download glyphs sit right too. */
  readonly iconPosition?: 'left' | 'right';
  readonly className?: string;
  readonly fullWidth?: boolean;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof CommonProps> & {
    readonly as?: 'button';
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps | 'href'> & {
    readonly as: 'link';
    readonly to: string;
  };

type ButtonAsAnchor = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof CommonProps> & {
    readonly as: 'a';
    readonly href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;

const BASE =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-[color,background-color,border-color,box-shadow,transform] duration-200 ' +
  'ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  // The lift is 1px. Enough to feel responsive, not enough to be a bounce.
  'hover:-translate-y-px active:translate-y-0 ' +
  'disabled:pointer-events-none disabled:opacity-55';

const VARIANTS: Record<Variant, string> = {
  // Crystal blue reserved for the single most important action on a view.
  primary:
    'bg-accent text-[#02121b] hover:bg-accent-bright ' +
    'shadow-[0_0_0_1px_rgb(0_191_255/0.5),0_6px_24px_-8px_rgb(0_191_255/0.5)] ' +
    'hover:shadow-[0_0_0_1px_rgb(53_217_255/0.65),0_10px_32px_-8px_rgb(0_191_255/0.6)]',
  secondary:
    'border border-hairline-strong bg-white/[0.02] text-fg ' +
    'hover:border-hairline-accent hover:bg-accent/[0.06] hover:text-fg',
  ghost:
    'text-fg-secondary hover:text-fg hover:bg-white/[0.04]',
};

const SIZES: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-[3.25rem] px-7 text-[0.9375rem]',
};

/** Arrow glyphs nudge in the direction they point on hover. */
const ICON_MOTION: Partial<Record<IconName, string>> = {
  'arrow-right': 'transition-transform duration-200 group-hover:translate-x-0.5',
  'arrow-up-right':
    'transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
  'arrow-down': 'transition-transform duration-200 group-hover:translate-y-0.5',
  'arrow-left': 'transition-transform duration-200 group-hover:-translate-x-0.5',
  download: 'transition-transform duration-200 group-hover:translate-y-0.5',
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'right',
    className,
    fullWidth,
  } = props;

  const classes = cx(
    BASE,
    VARIANTS[variant],
    SIZES[size],
    fullWidth && 'w-full',
    className,
  );

  const glyph = icon ? (
    <Icon name={icon} size={16} className={ICON_MOTION[icon]} />
  ) : null;

  const content = (
    <>
      {icon && iconPosition === 'left' ? glyph : null}
      <span>{children}</span>
      {icon && iconPosition === 'right' ? glyph : null}
    </>
  );

  if (props.as === 'link') {
    const { as: _as, to, variant: _v, size: _s, icon: _i, iconPosition: _ip, fullWidth: _fw, className: _c, children: _ch, ...anchorProps } = props;
    return (
      <Link to={to} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  if (props.as === 'a') {
    const { as: _as, href, variant: _v, size: _s, icon: _i, iconPosition: _ip, fullWidth: _fw, className: _c, children: _ch, target, rel, ...anchorProps } = props;
    // Any link opening a new tab gets noopener/noreferrer — the target window
    // must never reach back into this one via window.opener.
    const isBlank = target === '_blank';
    return (
      <a
        href={href}
        target={target}
        rel={isBlank ? (rel ?? 'noopener noreferrer') : rel}
        className={classes}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  const { as: _as, variant: _v, size: _s, icon: _i, iconPosition: _ip, fullWidth: _fw, className: _c, children: _ch, type, ...buttonProps } = props;
  return (
    <button type={type ?? 'button'} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
