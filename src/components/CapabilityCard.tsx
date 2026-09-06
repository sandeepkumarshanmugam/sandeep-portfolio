import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';
import type { Capability } from '@/data/types';

/** One of the four capability areas on the What I Do page. */
export function CapabilityCard({ capability }: { readonly capability: Capability }) {
  return (
    <GlassPanel as="li" interactive className="group flex h-full flex-col p-7 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <span
          className="inline-flex size-11 items-center justify-center rounded-lg border border-hairline-accent bg-accent/[0.07] text-accent transition-transform duration-300 group-hover:scale-105"
        >
          <Icon name={capability.icon} size={22} />
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-sm tabular-nums text-fg-muted transition-colors duration-300 group-hover:text-accent"
        >
          {capability.index}
        </span>
      </div>

      <h3 className="mt-7 text-h3 font-semibold text-fg">{capability.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-secondary">
        {capability.description}
      </p>

      <div className="mt-7 border-t border-hairline pt-5">
        <p className="text-eyebrow font-semibold uppercase text-fg-muted">
          Working with
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {capability.technologies.map((technology) => (
            <li
              key={technology}
              className="rounded-md border border-hairline bg-white/[0.02] px-2.5 py-1 text-[0.8125rem] text-fg-secondary"
            >
              {technology}
            </li>
          ))}
        </ul>
      </div>
    </GlassPanel>
  );
}
