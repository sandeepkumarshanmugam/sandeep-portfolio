import { useCallback, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { navItems } from '@/data/nav';
import { profile, activeProfileLinks } from '@/data/profile';
import { Icon } from './Icon';
import { Wordmark } from './Wordmark';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cx } from '@/lib/cx';

/**
 * Full-height navigation drawer for small screens.
 *
 * This is a modal dialog, so it behaves like one: Escape closes it, focus moves
 * into the panel on open and returns to the trigger on close, Tab is trapped
 * inside while it is open, background scrolling is locked, and the rest of the
 * page is hidden from assistive technology via `aria-modal`. That behaviour is
 * the reason this is hand-written rather than a styled `<div>` — a drawer that
 * looks right but leaks focus is broken for anyone navigating by keyboard.
 */
interface MobileMenuProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const reduced = usePrefersReducedMotion();

  /** Every tabbable element currently inside the panel, in document order. */
  const focusablesInPanel = useCallback((): HTMLElement[] => {
    const panel = panelRef.current;
    if (!panel) return [];
    return Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(
      // getClientRects() is the reliable visibility test here: unlike
      // offsetParent it is not confused by the panel's fixed-position
      // ancestor or by an in-flight transform.
      (el) => el.getClientRects().length > 0,
    );
  }, []);

  /*
   * Scroll lock and the key handler.
   *
   * Kept separate from focus management below, because this effect must be
   * free to re-run without touching focus. `onClose` is stabilised by the
   * parent, but even so: conflating the two meant a re-run restored focus to
   * the trigger and undid the focus-into-dialog, which is exactly the bug
   * this split removes.
   */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const items = focusablesInPanel();
      if (items.length === 0) return;

      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement;
      const focusEscaped = !panelRef.current?.contains(active);

      // Wrap at both ends so focus can never leave the open dialog.
      if (event.shiftKey && (active === first || focusEscaped)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || focusEscaped)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [open, onClose, focusablesInPanel]);

  /*
   * Focus management, deliberately keyed on `open` alone.
   *
   * The panel and its children are already in the DOM by the time an effect
   * runs, so focus moves synchronously — no requestAnimationFrame, which was
   * the other half of the original bug: a re-run cancelled the pending frame
   * before it ever fired.
   */
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Prefer the close button, so the first Tab lands on a navigation link.
    const target = closeButtonRef.current ?? focusablesInPanel()[0] ?? panelRef.current;
    target?.focus();

    return () => {
      // Only take focus back if it is still inside the panel being torn down.
      // If the user has already clicked elsewhere, stealing it would be wrong.
      const active = document.activeElement;
      const focusStillTrapped =
        !active || active === document.body || panelRef.current?.contains(active);

      if (focusStillTrapped) previouslyFocused.current?.focus();
    };
  }, [open, focusablesInPanel]);

  const panelTransition = reduced
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const };

  return (
    /*
     * The scrim and the panel are sibling children of AnimatePresence, each
     * with its own key, rather than the panel being nested inside an animated
     * wrapper. Nesting meant AnimatePresence had to coordinate a child's exit
     * through a parent's, and the panel could finish animating without ever
     * being unmounted — leaving an `aria-modal` element in the DOM, which
     * hides the whole page from assistive technology. Two flat children each
     * own one animation and are removed independently.
     */
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-menu-scrim"
          className="fixed inset-0 z-[55] bg-bg/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        />
      ) : null}

      {open ? (
        <motion.div
          key="mobile-menu-panel"
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          initial={{ x: reduced ? 0 : '100%' }}
          animate={{ x: 0 }}
          exit={{ x: reduced ? 0 : '100%' }}
          transition={panelTransition}
          className={cx(
            'fixed inset-y-0 right-0 z-[56] flex w-full max-w-sm flex-col lg:hidden',
            'border-l border-hairline bg-bg-alt',
            'shadow-[-24px_0_60px_-24px_rgb(0_0_0/0.8)]',
          )}
        >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-hairline px-6">
              <Wordmark onNavigate={onClose} />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className={cx(
                  'inline-flex size-10 items-center justify-center rounded-full',
                  'border border-hairline-strong text-fg transition-colors duration-200',
                  'hover:border-hairline-accent hover:bg-accent/[0.06]',
                )}
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <nav aria-label="Primary (mobile)" className="flex-1 overflow-y-auto px-6 py-8">
              <ul className="space-y-1">
                {navItems.map((item, index) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cx(
                          'flex items-baseline gap-4 rounded-lg px-3 py-3.5 transition-colors duration-200',
                          isActive
                            ? 'bg-accent/[0.08] text-fg'
                            : 'text-fg-secondary hover:bg-white/[0.03] hover:text-fg',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            aria-hidden="true"
                            className={cx(
                              'font-mono text-[0.6875rem] tabular-nums',
                              isActive ? 'text-accent' : 'text-fg-muted',
                            )}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-lg font-medium tracking-tight">
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="shrink-0 border-t border-hairline px-6 py-6">
              <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                Elsewhere
              </p>
              <div className="mt-4 flex items-center gap-2">
                {activeProfileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} (opens in a new tab)`}
                    className={cx(
                      'inline-flex size-10 items-center justify-center rounded-full',
                      'border border-hairline text-fg-secondary transition-colors duration-200',
                      'hover:border-hairline-accent hover:text-accent',
                    )}
                  >
                    <Icon name={link.icon} size={18} />
                  </a>
                ))}
              </div>
              <a
                href={`mailto:${profile.email}`}
                className="mt-5 block truncate text-sm text-fg-secondary transition-colors hover:text-accent"
              >
                {profile.email}
              </a>
            </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
