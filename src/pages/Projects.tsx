import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Seo } from '@/components/Seo';
import { PageHeading } from '@/components/PageHeading';
import { ProjectCard } from '@/components/ProjectCard';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { projectFilters, projects } from '@/data/projects';
import type { ProjectCategory } from '@/data/types';
import { inViewOnce, resolveVariants, revealGroup, revealItem } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cx } from '@/lib/cx';

/**
 * Projects — what Sandeep has built.
 *
 * Two projects, both verified against their repositories. The filter is
 * rendered only when it would actually do something: with two projects and
 * overlapping categories, a filter bar that never changes the result is noise,
 * so it appears once there are enough projects to warrant it.
 */
export default function Projects() {
  const reduced = usePrefersReducedMotion();
  const group = resolveVariants(reduced, revealGroup(0.08));
  const item = resolveVariants(reduced, revealItem);

  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'all'>('all');

  const visibleProjects = useMemo(
    () =>
      activeFilter === 'all'
        ? projects
        : projects.filter((project) => project.categories.includes(activeFilter)),
    [activeFilter],
  );

  // Only worth showing once there is more than one non-"all" option AND enough
  // projects for filtering to change what you see.
  const showFilter = projectFilters.length > 2 && projects.length > 3;

  return (
    <>
      <Seo
        title="Projects"
        description="Selected work by Sandeepkumar S — a multi-page industry website for PEPS and a companion product dashboard for a solar phone case concept."
      />

      <div className="container-page py-16 lg:py-20">
        <PageHeading
          eyebrow="Selected work"
          title="Things I've built."
          subtitle="Two projects, described from what the code actually does. Each has a full case study covering the problem, the approach and what I got wrong along the way."
        />

        {showFilter ? (
          <div
            role="group"
            aria-label="Filter projects by category"
            className="mt-12 flex flex-wrap gap-2"
          >
            {projectFilters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={isActive}
                  className={cx(
                    'rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-200',
                    isActive
                      ? 'border-hairline-accent bg-accent/[0.1] text-accent'
                      : 'border-hairline text-fg-secondary hover:border-hairline-strong hover:text-fg',
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <h2 id="projects-list" className="sr-only">
          Selected projects
        </h2>
        <motion.ul
          aria-labelledby="projects-list"
          variants={group}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
          className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-2"
        >
          {visibleProjects.map((project) => (
            <motion.div key={project.slug} variants={item} className="contents">
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.ul>

        {/* Empty state — only reachable if a filter excludes everything. */}
        {visibleProjects.length === 0 ? (
          <div className="mt-14 rounded-xl border border-dashed border-hairline-strong p-12 text-center">
            <Icon name="layers" size={24} className="mx-auto text-fg-muted" />
            <p className="mt-4 text-fg-secondary">
              No projects in this category yet.
            </p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => setActiveFilter('all')}
            >
              Show all projects
            </Button>
          </div>
        ) : null}

        {/* More is coming, said without inventing what. */}
        <motion.div
          variants={item}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
          className="mt-16 rounded-xl border border-dashed border-hairline-strong p-8 sm:p-10"
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <Icon name="terminal" size={20} className="mt-0.5 shrink-0 text-accent" />
              <div>
                <h2 className="text-[0.9375rem] font-semibold text-fg">
                  More in progress
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-secondary">
                  I&rsquo;m mid-degree, so this list grows a few times a year.
                  The fastest way to see current work is GitHub — or ask me
                  directly what I&rsquo;m building at the moment.
                </p>
              </div>
            </div>
            <Button
              as="link"
              to="/contact"
              variant="secondary"
              icon="arrow-right"
              className="shrink-0"
            >
              Ask me
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
