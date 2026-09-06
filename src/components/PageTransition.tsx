import { useEffect, useRef, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { pageVariants, resolveVariants } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Wraps each route's content for the enter/exit transition.
 *
 * Two things happen here that a plain fade would miss:
 *
 *  - Scroll is reset on navigation, but only for a genuine route change. Using
 *    the browser default would leave a visitor halfway down the new page.
 *  - The route's `<h1>` is announced. A client-side navigation doesn't reload
 *    the document, so screen readers get no signal that the page changed; the
 *    live region below supplies one.
 */
export function PageTransition({ children }: { readonly children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const { pathname } = useLocation();
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // `instant` rather than smooth: a route change should already be at the top
    // when the enter animation begins, not scrolling during it.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Read the new page's title out of the DOM after it has committed.
    const frame = requestAnimationFrame(() => {
      const heading = document.querySelector('main h1');
      if (heading?.textContent && announcerRef.current) {
        announcerRef.current.textContent = `${heading.textContent.trim()} page loaded`;
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <>
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <motion.div
        variants={resolveVariants(reduced, pageVariants)}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </>
  );
}
