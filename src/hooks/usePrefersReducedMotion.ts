import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the OS "reduce motion" setting and reacts to changes at runtime.
 *
 * The CSS in index.css already collapses transitions and hides decorative
 * layers. This hook covers what CSS cannot: Motion-driven animations are
 * skipped outright rather than merely shortened, so an element animating from
 * `opacity: 0` can never be left invisible by a suppressed transition.
 */
export function usePrefersReducedMotion(): boolean {
  // Initialise from the media query itself so the very first render is already
  // correct — no flash of animation before an effect resolves.
  const [prefersReduced, setPrefersReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
}
