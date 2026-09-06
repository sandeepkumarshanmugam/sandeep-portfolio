/**
 * Shown while a lazily-loaded route chunk is in flight.
 *
 * Deliberately not a spinner. A route chunk on a warm connection resolves in
 * well under the ~200ms it takes a spinner to register, so a spinner reads as a
 * flash of noise. This holds the page height steady with a quiet pulse
 * instead — and the delay animation means a fast load shows nothing at all.
 */
export function RouteFallback() {
  return (
    <div
      className="container-page flex min-h-[60vh] items-center justify-center"
      role="status"
      aria-label="Loading page"
    >
      <div className="flex items-center gap-3 text-fg-muted opacity-0 [animation:fade-in-late_0.3s_ease-out_0.25s_forwards]">
        <span
          aria-hidden="true"
          className="size-1.5 animate-pulse rounded-full bg-accent"
        />
        <span className="text-sm">Loading</span>
      </div>
    </div>
  );
}
