import { cx } from '@/lib/cx';

/**
 * Small scroll hint at the foot of the hero.
 *
 * Purely decorative and hidden from assistive technology — a screen-reader
 * user gains nothing from being told the page scrolls. Hidden on short
 * viewports, where it would overlap the content it is pointing at.
 */
export function ScrollIndicator({ className }: { readonly className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx(
        'pointer-events-none flex flex-col items-center gap-2.5',
        className,
      )}
    >
      <span className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-fg-muted">
        Scroll
      </span>
      <span className="relative flex h-9 w-px overflow-hidden bg-hairline-strong">
        <span
          data-decorative="motion"
          className="absolute inset-x-0 top-0 h-3 bg-accent [animation:scroll-hint_2.1s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        />
      </span>
    </div>
  );
}
