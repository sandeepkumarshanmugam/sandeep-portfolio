import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';
import { skillLevelLabel } from '@/data/skills';
import type { SkillGroupData } from '@/data/types';
import { cx } from '@/lib/cx';

/**
 * One group of skills, with an honest proficiency band instead of a bar.
 *
 * The band is a label because a percentage would be a fabricated measurement.
 * Colour carries the distinction: blue for things actually built with, neutral
 * for coursework familiarity, outlined for what's still being learned.
 */
const LEVEL_STYLES: Record<SkillGroupData['level'], string> = {
  working: 'border-hairline-accent bg-accent/[0.09] text-accent',
  familiar: 'border-hairline-strong bg-white/[0.03] text-fg-secondary',
  learning: 'border-dashed border-hairline-strong text-fg-muted',
};

export function SkillGroup({ group }: { readonly group: SkillGroupData }) {
  return (
    <GlassPanel className="flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Icon name={group.icon} size={18} className="text-accent" />
          <h3 className="text-[0.9375rem] font-semibold text-fg">{group.title}</h3>
        </div>
        <span
          className={cx(
            'shrink-0 rounded-full border px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-wider',
            LEVEL_STYLES[group.level],
          )}
        >
          {skillLevelLabel[group.level]}
        </span>
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <li
            key={item}
            className="rounded-md border border-hairline bg-white/[0.02] px-2.5 py-1 text-[0.8125rem] text-fg-secondary"
          >
            {item}
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
