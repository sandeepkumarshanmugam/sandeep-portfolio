/** The navigation model. Adding a route here adds it to the desktop nav, the
 *  mobile drawer and the sitemap generator — one edit, three places. */
export interface NavItem {
  readonly label: string;
  readonly path: string;
}

export const navItems: readonly NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'What I Do', path: '/what-i-do' },
  { label: 'Projects', path: '/projects' },
  { label: 'Experience', path: '/experience' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];
