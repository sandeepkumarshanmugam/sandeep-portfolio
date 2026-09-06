import { Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { navItems } from '@/data/nav';

/**
 * 404.
 *
 * Marked `noIndex` so a mistyped URL never ends up in search results, and it
 * offers the full navigation rather than a single "go home" button — the
 * visitor was looking for something, so give them the map.
 */
export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="This page could not be found."
        noIndex
      />

      <div className="container-page flex min-h-[70vh] flex-col justify-center py-20">
        <p className="font-mono text-[0.8125rem] tracking-widest text-accent">
          404
        </p>
        <h1 className="mt-6 text-h1 font-semibold text-fg">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-5 max-w-xl text-lead text-fg-secondary">
          The link may be broken or the page may have moved. Here&rsquo;s
          everywhere else you can go.
        </p>

        <ul className="mt-12 grid max-w-2xl gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2">
          {navItems.map((item, index) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="group flex items-center gap-3 bg-bg p-4 transition-colors duration-200 hover:bg-surface"
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-[0.6875rem] tabular-nums text-fg-muted"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[0.9375rem] font-medium text-fg">
                  {item.label}
                </span>
                <Icon
                  name="arrow-right"
                  size={15}
                  className="ml-auto text-fg-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Button as="link" to="/" icon="arrow-left" iconPosition="left">
            Back to home
          </Button>
        </div>
      </div>
    </>
  );
}
