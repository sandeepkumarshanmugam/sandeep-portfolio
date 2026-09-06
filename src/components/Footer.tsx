import { Link } from 'react-router-dom';
import { navItems } from '@/data/nav';
import { profile, activeProfileLinks } from '@/data/profile';
import { Icon } from './Icon';
import { Wordmark } from './Wordmark';
import { cx } from '@/lib/cx';

export function Footer() {
  // Derived, so the copyright never silently goes stale.
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-32 border-t border-hairline bg-bg-alt">
      <div className="container-page py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-4 font-mono text-[0.8125rem] tracking-wide text-accent/80">
              {profile.tagline}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-fg-secondary">
              Undergraduate IT student in {profile.location}, building for the web
              and exploring AI/ML.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <nav aria-label="Footer">
              <h2 className="text-eyebrow font-semibold uppercase text-fg-muted">
                Navigate
              </h2>
              <ul className="mt-4 space-y-2.5">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm text-fg-secondary transition-colors duration-200 hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <h2 className="text-eyebrow font-semibold uppercase text-fg-muted">
                Contact
              </h2>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="break-all text-sm text-fg-secondary transition-colors duration-200 hover:text-accent"
                  >
                    {profile.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${profile.phoneHref}`}
                    className="text-sm text-fg-secondary transition-colors duration-200 hover:text-accent"
                  >
                    {profile.phone}
                  </a>
                </li>
                <li className="text-sm text-fg-secondary">{profile.location}</li>
              </ul>

              <div className="mt-6 flex items-center gap-2">
                {activeProfileLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} (opens in a new tab)`}
                    className={cx(
                      'inline-flex size-9 items-center justify-center rounded-full',
                      'border border-hairline text-fg-secondary transition-colors duration-200',
                      'hover:border-hairline-accent hover:text-accent',
                    )}
                  >
                    <Icon name={link.icon} size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-hairline pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-fg-muted">
            © {year} {profile.name}. All rights reserved.
          </p>
          <p className="text-xs text-fg-muted">
            Built with React, TypeScript &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
