import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import type { Project } from '@/data/types';
import { cx } from '@/lib/cx';

/**
 * A project card.
 *
 * Neither repository is public and there are no deployed screenshots, so
 * rather than fake a browser mockup the card leads with a generated cover: a
 * technical grid, a soft accent bloom and the project's glyph. It reads as a
 * deliberate identity instead of a missing image.
 *
 * The whole card is one link to the case study. The repository link sits
 * outside that anchor — nesting interactive elements inside a link is invalid
 * and breaks keyboard navigation, so the two live side by side in the footer.
 */
export function ProjectCard({ project }: { readonly project: Project }) {
  const repoIsPublic = project.repo?.visibility === 'public';

  return (
    <li className="group relative flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface/40 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-hairline-accent hover:bg-surface">
      {/* Cover */}
      <Link
        to={`/projects/${project.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[16/9] overflow-hidden border-b border-hairline bg-bg-alt"
      >
        <div
          className="absolute inset-0 opacity-70 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgb(255 255 255 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.045) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_25%,rgb(0_191_255/0.16),transparent_62%)] transition-opacity duration-500 group-hover:opacity-100 md:opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex size-16 items-center justify-center rounded-2xl border border-hairline-accent bg-bg/70 text-accent backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
            <Icon name={project.accentIcon} size={28} />
          </span>
        </div>
        <span className="absolute right-4 top-4 font-mono text-[0.6875rem] text-fg-muted">
          {project.year}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-h3 font-semibold text-fg">
            <Link
              to={`/projects/${project.slug}`}
              className="rounded-sm outline-offset-4 transition-colors duration-200 group-hover:text-fg"
            >
              {/* Stretches the anchor over the whole card so the entire
                  surface is clickable, while the link text stays accessible. */}
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {project.title}
            </Link>
          </h3>
          <span className="shrink-0 text-[0.8125rem] font-medium text-accent/80">
            {project.category}
          </span>
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-secondary">
          {project.summary}
        </p>

        <ul className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 5).map((technology) => (
            <li
              key={technology}
              className="rounded-md border border-hairline bg-white/[0.02] px-2 py-1 text-[0.75rem] text-fg-muted"
            >
              {technology}
            </li>
          ))}
          {project.stack.length > 5 ? (
            <li className="px-1 py-1 text-[0.75rem] text-fg-muted">
              +{project.stack.length - 5}
            </li>
          ) : null}
        </ul>

        {/* Footer actions sit above the stretched overlay via z-20. */}
        <div className="relative z-20 mt-7 flex items-center gap-4 border-t border-hairline pt-5">
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors duration-200 hover:text-accent"
          >
            Case study
            <Icon
              name="arrow-right"
              size={15}
              className="text-accent transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>

          {repoIsPublic && project.repo ? (
            <a
              href={project.repo.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub (opens in a new tab)`}
              className={cx(
                'ml-auto inline-flex items-center gap-2 text-sm text-fg-secondary',
                'transition-colors duration-200 hover:text-accent',
              )}
            >
              <Icon name="github" size={16} />
              GitHub
            </a>
          ) : (
            /* Honest disclosure rather than a link that 404s. */
            <span
              className="ml-auto inline-flex items-center gap-1.5 text-[0.75rem] text-fg-muted"
              title="The source repository for this project is private."
            >
              <Icon name="lock" size={13} />
              Private repo
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
