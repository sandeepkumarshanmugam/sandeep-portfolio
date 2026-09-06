import { useCallback, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { navItems } from '@/data/nav';
import { Button } from './Button';
import { Icon } from './Icon';
import { Wordmark } from './Wordmark';
import { MobileMenu } from './MobileMenu';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cx } from '@/lib/cx';

/**
 * Global navigation.
 *
 * Fixed to the top, transparent over the hero, and it grows a background and
 * hairline once the page scrolls so text never collides with content behind
 * it. The active route is marked with a crystal-blue underline that animates
 * between items via a shared `layoutId` — one indicator moving, rather than
 * seven fading in and out.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  // Stable identity: MobileMenu's effects depend on this, and a fresh closure
  // on every scroll-driven re-render would tear them down and set them up
  // again on each frame.
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer on navigation, including browser back/forward.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Lets keyboard and screen-reader users jump the nav entirely. */}
      <a
        href="#main"
        className={cx(
          'sr-only focus-visible:not-sr-only',
          'focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60]',
          'focus-visible:rounded-full focus-visible:bg-accent focus-visible:px-5 focus-visible:py-2.5',
          'focus-visible:text-sm focus-visible:font-medium focus-visible:text-[#02121b]',
        )}
      >
        Skip to content
      </a>

      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          scrolled
            ? 'border-b border-hairline bg-bg/80 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="container-page flex h-16 items-center justify-between gap-6 md:h-[4.5rem]"
        >
          <Wordmark />

          {/* Desktop links. Hidden below lg, where the drawer takes over. */}
          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cx(
                      'relative block rounded-md px-3 py-2 text-[0.8125rem] font-medium transition-colors duration-200',
                      isActive
                        ? 'text-fg'
                        : 'text-fg-secondary hover:text-fg',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      {isActive ? (
                        <motion.span
                          // Shared id makes the underline travel between items.
                          layoutId={reduced ? undefined : 'nav-active'}
                          aria-hidden="true"
                          className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-accent shadow-[0_0_10px_rgb(0_191_255/0.75)]"
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Button
              as="link"
              to="/contact"
              variant="secondary"
              icon="arrow-up-right"
              className="hidden sm:inline-flex"
            >
              Let&rsquo;s Connect
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              // Only reference the panel while it exists. The drawer is
              // unmounted when closed, so a permanent aria-controls would
              // point at a missing id — invalid ARIA. aria-expanded alone
              // conveys the state in the meantime.
              aria-controls={menuOpen ? 'mobile-menu' : undefined}
              className={cx(
                'inline-flex size-11 items-center justify-center rounded-full lg:hidden',
                'border border-hairline-strong text-fg transition-colors duration-200',
                'hover:border-hairline-accent hover:bg-accent/[0.06]',
              )}
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
