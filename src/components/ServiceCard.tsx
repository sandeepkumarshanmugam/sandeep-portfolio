import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';
import type { Service } from '@/data/types';

/**
 * A single service. Hover is a 2px lift plus a border shift — the numeral
 * brightens rather than the whole card glowing.
 */
export function ServiceCard({ service }: { readonly service: Service }) {
  return (
    <GlassPanel as="li" interactive className="group flex h-full flex-col p-7">
      <div className="flex items-start justify-between gap-4">
        <Icon
          name={service.icon}
          size={22}
          className="text-accent transition-transform duration-300 group-hover:scale-110"
        />
        <span
          aria-hidden="true"
          className="font-mono text-[0.6875rem] tabular-nums text-fg-muted transition-colors duration-300 group-hover:text-accent"
        >
          {service.index}
        </span>
      </div>

      <h3 className="mt-6 text-h3 font-semibold text-fg">{service.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-fg-secondary">
        {service.description}
      </p>
    </GlassPanel>
  );
}
