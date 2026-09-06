/**
 * Minimal class-name joiner.
 *
 * Tailwind projects usually reach for clsx + tailwind-merge here. Neither is
 * needed: nothing in this codebase composes conflicting utilities at runtime,
 * so joining truthy values is the whole requirement. Two fewer dependencies.
 */
export type ClassValue = string | false | null | undefined;

export function cx(...values: ClassValue[]): string {
  let out = '';
  for (const value of values) {
    if (!value) continue;
    out = out ? `${out} ${value}` : value;
  }
  return out;
}
