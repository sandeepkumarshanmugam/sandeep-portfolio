import type { SVGProps } from 'react';
import type { IconName } from '@/data/types';

/**
 * The project's icon set, drawn inline.
 *
 * This exists instead of an icon dependency. The site needs roughly two dozen
 * glyphs; shipping a library for that means either a runtime dependency or a
 * build-time tree-shaking gamble, and neither is worth it at this scale. Every
 * path below is on a 24x24 grid with a 1.6 stroke so the whole set reads as one
 * family, and brand marks (GitHub, LinkedIn, Instagram) are filled paths since
 * that is how those logos are specified.
 *
 * Icons here are decorative by default — `aria-hidden` — because they sit
 * beside a text label almost everywhere. Pass a `title` only when an icon is
 * genuinely the sole content of a control.
 */

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  readonly name: IconName;
  readonly size?: number | string;
  /** Accessible name. Supplying this un-hides the icon from assistive tech. */
  readonly title?: string;
};

/** Stroked glyphs: `d` attributes only, so the shared stroke config applies. */
const STROKE_PATHS: Partial<Record<IconName, readonly string[]>> = {
  mail: ['M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z', 'm3.5 7.5 8.5 6 8.5-6'],
  phone: [
    'M6.5 3.5h2.2l1.5 4-1.9 1.4a11 11 0 0 0 5.4 5.4l1.4-1.9 4 1.5v2.2a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z',
  ],
  location: ['M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z', 'M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'],
  'arrow-right': ['M4 12h15', 'm13 6 6 6-6 6'],
  'arrow-up-right': ['M7 17 17 7', 'M8.5 7H17v8.5'],
  'arrow-down': ['M12 4.5v15', 'm6 13.5 6 6 6-6'],
  'arrow-left': ['M20 12H5', 'm11 18-6-6 6-6'],
  download: ['M12 3.5v11', 'm7.5 10 4.5 4.5 4.5-4.5', 'M4.5 19.5h15'],
  external: ['M14 4.5h5.5V10', 'M19 5 11 13', 'M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V8A1.5 1.5 0 0 1 6 6.5h4.5'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['m6 6 12 12', 'm18 6-12 12'],
  code: ['m9 8-4 4 4 4', 'm15 8 4 4-4 4', 'm13.5 5.5-3 13'],
  layers: ['m12 3.5 8 4.25-8 4.25-8-4.25 8-4.25Z', 'm4 12.25 8 4.25 8-4.25', 'm4 16.5 8 4.25 8-4.25'],
  brain: [
    'M12 5.5a3 3 0 0 0-5.7-1.3A2.8 2.8 0 0 0 4 9.4a3 3 0 0 0 .6 5A2.8 2.8 0 0 0 9 17.3a2.6 2.6 0 0 0 3 1.9Z',
    'M12 5.5a3 3 0 0 1 5.7-1.3A2.8 2.8 0 0 1 20 9.4a3 3 0 0 1-.6 5A2.8 2.8 0 0 1 15 17.3a2.6 2.6 0 0 1-3 1.9Z',
    'M12 5.5v13.7',
  ],
  shield: ['M12 3.5 5 6v5.5c0 4.4 3 7.5 7 9 4-1.5 7-4.6 7-9V6l-7-2.5Z', 'm9 12 2.2 2.2L15.5 10'],
  terminal: ['M3.5 5.5h17v13h-17z', 'm7 10 2.5 2.5L7 15', 'M12.5 15h4.5'],
  database: ['M12 7.5c4.1 0 7.5-1.1 7.5-2.5S16.1 2.5 12 2.5 4.5 3.6 4.5 5 7.9 7.5 12 7.5Z', 'M19.5 5v7c0 1.4-3.4 2.5-7.5 2.5S4.5 13.4 4.5 12V5', 'M19.5 12v7c0 1.4-3.4 2.5-7.5 2.5S4.5 20.4 4.5 19v-7'],
  palette: ['M12 20.5a8.5 8.5 0 1 1 8.5-8.5c0 2.5-2 3.5-3.8 3.5h-1.4a1.9 1.9 0 0 0-1.4 3.2 1.6 1.6 0 0 1-1.9 1.8Z', 'M8 10.5h.01', 'M12 8h.01', 'M15.5 10.5h.01'],
  briefcase: ['M4 8.5h16v10a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-10Z', 'M9 8.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v2.5', 'M4 13h16'],
  award: ['M12 14.5a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z', 'm8.5 13.8-1.3 6.2 4.8-2.6 4.8 2.6-1.3-6.2'],
  certificate: ['M6 3.5h12v13H6z', 'M9 7.5h6', 'M9 11h4', 'm9.5 16.5-1 4 3.5-1.8 3.5 1.8-1-4'],
  education: ['m12 4 9 4.5-9 4.5L3 8.5 12 4Z', 'M7 11v4.2c0 1.6 2.2 2.8 5 2.8s5-1.2 5-2.8V11', 'M21 8.5V14'],
  users: ['M9.5 11a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Z', 'M3.5 19.5c0-3 2.7-5.2 6-5.2s6 2.2 6 5.2', 'M16 5.2a3.2 3.2 0 0 1 0 5.9', 'M17.5 14.8c1.8.7 3 2.4 3 4.7'],
  check: ['m5 12.5 4.5 4.5L19 7.5'],
  spark: ['M12 3.5 13.7 9l5.5 1.7L13.7 12.4 12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z', 'M18.5 16.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z'],
  lock: ['M6 10.5h12v9H6z', 'M9 10.5V7.5a3 3 0 0 1 6 0v3', 'M12 14v2.5'],
};

/** Filled glyphs: brand marks, drawn at their specified proportions. */
const FILL_PATHS: Partial<Record<IconName, string>> = {
  github:
    'M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5.01 0c1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.49A10.05 10.05 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z',
  linkedin:
    'M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM21 14.02c0-3.4-1.82-4.98-4.24-4.98-1.95 0-2.83 1.08-3.32 1.83V8.5H9.5c.04.95 0 12.5 0 12.5h3.94v-6.98c0-.35.02-.7.13-.96.27-.7.9-1.43 1.97-1.43 1.4 0 1.96 1.06 1.96 2.62V21H21v-6.98Z',
  instagram:
    'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.96.24 2.65.5.71.28 1.31.65 1.91 1.25.6.6.97 1.2 1.25 1.91.27.69.45 1.48.5 2.65.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.23 1.96-.5 2.65-.28.71-.65 1.31-1.25 1.91-.6.6-1.2.97-1.91 1.25-.69.27-1.48.45-2.65.5-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.96-.23-2.65-.5a5.15 5.15 0 0 1-1.91-1.25 5.15 5.15 0 0 1-1.25-1.91c-.27-.69-.45-1.48-.5-2.65C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.23-1.96.5-2.65.28-.71.65-1.31 1.25-1.91.6-.6 1.2-.97 1.91-1.25.69-.26 1.48-.45 2.65-.5C8.42 2.17 8.8 2.16 12 2.16Zm0 1.98c-3.15 0-3.5.01-4.74.07-.9.04-1.38.19-1.7.32-.43.16-.73.36-1.05.68-.32.32-.52.62-.69 1.05-.12.32-.27.8-.31 1.7-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.04.9.19 1.38.31 1.7.17.43.37.73.69 1.05.32.32.62.52 1.05.69.32.12.8.27 1.7.31 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.7-.31.43-.17.73-.37 1.05-.69.32-.32.52-.62.68-1.05.13-.32.28-.8.32-1.7.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.32-1.7a2.82 2.82 0 0 0-.68-1.05 2.82 2.82 0 0 0-1.05-.68c-.32-.13-.8-.28-1.7-.32-1.24-.06-1.59-.07-4.74-.07Zm0 3.37a5.05 5.05 0 1 1 0 10.1 5.05 5.05 0 0 1 0-10.1Zm0 8.33a3.28 3.28 0 1 0 0-6.56 3.28 3.28 0 0 0 0 6.56Zm6.43-8.55a1.18 1.18 0 1 1-2.36 0 1.18 1.18 0 0 1 2.36 0Z',
};

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  const filled = FILL_PATHS[name];
  const accessible = title !== undefined;

  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    // Decorative unless explicitly given a name.
    'aria-hidden': accessible ? undefined : (true as const),
    role: accessible ? ('img' as const) : undefined,
    focusable: 'false' as const,
    ...rest,
  };

  if (filled) {
    return (
      <svg {...shared} fill="currentColor">
        {accessible ? <title>{title}</title> : null}
        <path d={filled} />
      </svg>
    );
  }

  const paths = STROKE_PATHS[name] ?? [];

  return (
    <svg
      {...shared}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {accessible ? <title>{title}</title> : null}
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
