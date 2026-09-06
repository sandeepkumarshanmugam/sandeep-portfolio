import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';

/**
 * The application shell.
 *
 * Navbar and footer live outside `AnimatePresence`, so only the route content
 * transitions — the chrome stays put, which is what makes seven routes feel
 * like one application rather than seven pages.
 *
 * `mode="wait"` holds the incoming page until the outgoing one has left,
 * preventing the two from overlapping mid-fade.
 */
export function MainLayout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Fixed decorative backdrop, painted once for the whole app. Marked as
          decorative so reduced-motion users lose nothing but the noise. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-technical-grid"
      />

      <Navbar />

      <main id="main" className="flex-1 pt-16 md:pt-[4.5rem]">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
