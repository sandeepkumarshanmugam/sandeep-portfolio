import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { GlassPanel } from '@/components/GlassPanel';
import { projectBySlug, projects } from '@/data/projects';
import { inViewOnce, resolveVariants, revealGroup, revealItem } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * A project case study.
 *
 * Structured as numbered sections so it reads as a technical write-up rather
 * than a gallery entry. The verification note at the foot is deliberate: it
 * states what the write-up is based on and, just as importantly, what is not
 * being claimed.
 */
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? projectBySlug(slug) : undefined;
  const reduced = usePrefersReducedMotion();
  const group = resolveVariants(reduced, revealGroup(0.06));
  const item = resolveVariants(reduced, revealItem);

  // An unknown slug gets a real recovery path, not a bare 404.
  if (!project) {
    return (
      <>
        <Seo
          title="Project not found"
          description="This project could not be found."
          noIndex
        />
        <div className="container-page py-24">
          <p className="text-eyebrow font-semibold uppercase text-accent">404</p>
          <h1 className="mt-5 text-h1 font-semibold text-fg">
            That project doesn&rsquo;t exist.
          </h1>
          <p className="mt-5 max-w-xl text-lead text-fg-secondary">
            The link may be out of date. Here&rsquo;s everything I&rsquo;ve
            written up so far.
          </p>
          <ul className="mt-10 space-y-3">
            {projects.map((candidate) => (
              <li key={candidate.slug}>
                <Link
                  to={`/projects/${candidate.slug}`}
                  className="group inline-flex items-center gap-3 text-fg transition-colors hover:text-accent"
                >
                  <Icon name="arrow-right" size={16} className="text-accent" />
                  <span className="font-medium">{candidate.title}</span>
                  <span className="text-sm text-fg-muted">{candidate.category}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Button as="link" to="/projects" variant="secondary" icon="arrow-left" iconPosition="left" className="mt-10">
            All projects
          </Button>
        </div>
      </>
    );
  }

  const repoIsPublic = project.repo?.visibility === 'public';
  const currentIndex = projects.findIndex((candidate) => candidate.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const hasNext = projects.length > 1 && nextProject.slug !== project.slug;

  return (
    <>
      <Seo
        title={`${project.title} — Case Study`}
        description={project.summary}
        type="article"
      />

      <article className="container-page py-12 lg:py-16">
        {/* Back link, above the title where it is expected. */}
        <Link
          to="/projects"
          className="group inline-flex items-center gap-2 text-sm text-fg-secondary transition-colors duration-200 hover:text-accent"
        >
          <Icon
            name="arrow-left"
            size={15}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          All projects
        </Link>

        {/* ------------------------------------------------------------ Header */}
        <motion.header
          variants={group}
          initial="initial"
          animate="animate"
          className="mt-10"
        >
          <motion.p
            variants={item}
            className="flex items-center gap-3 text-eyebrow font-semibold uppercase text-accent"
          >
            <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
            Project
          </motion.p>

          <motion.h1 variants={item} className="mt-5 text-h1 font-semibold text-fg">
            {project.title}
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-3xl text-lead text-fg-secondary">
            {project.summary}
          </motion.p>

          {/* Metadata strip */}
          <motion.dl
            variants={item}
            className="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-3"
          >
            <div className="bg-bg p-5">
              <dt className="text-eyebrow font-semibold uppercase text-fg-muted">
                Category
              </dt>
              <dd className="mt-2 text-[0.9375rem] font-medium text-fg">
                {project.category}
              </dd>
            </div>
            <div className="bg-bg p-5">
              <dt className="text-eyebrow font-semibold uppercase text-fg-muted">
                Year
              </dt>
              <dd className="mt-2 text-[0.9375rem] font-medium text-fg">
                {project.year}
              </dd>
            </div>
            <div className="bg-bg p-5">
              <dt className="text-eyebrow font-semibold uppercase text-fg-muted">
                Source
              </dt>
              <dd className="mt-2 text-[0.9375rem] font-medium text-fg">
                {repoIsPublic ? (
                  <a
                    href={project.repo?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                  >
                    GitHub
                    <Icon name="arrow-up-right" size={14} className="text-accent" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-fg-secondary">
                    <Icon name="lock" size={14} className="text-fg-muted" />
                    Private
                  </span>
                )}
              </dd>
            </div>
          </motion.dl>

          {/* Stack */}
          <motion.div variants={item} className="mt-8">
            <h2 className="text-eyebrow font-semibold uppercase text-fg-muted">
              Built with
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((technology) => (
                <li
                  key={technology}
                  className="rounded-md border border-hairline bg-white/[0.02] px-2.5 py-1.5 text-[0.8125rem] text-fg-secondary"
                >
                  {technology}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.header>

        <div aria-hidden="true" className="rule-fade my-16" />

        {/* ---------------------------------------------------------- Sections */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
          <div className="min-w-0 space-y-16">
            {project.caseStudy.map((section, index) => (
              <motion.section
                key={section.id}
                id={section.id}
                variants={item}
                initial="initial"
                whileInView="animate"
                viewport={inViewOnce}
                aria-labelledby={`${section.id}-heading`}
                className="scroll-mt-28"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[0.8125rem] tabular-nums text-accent"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2
                    id={`${section.id}-heading`}
                    className="text-h2 font-semibold text-fg"
                  >
                    {section.title}
                  </h2>
                </div>

                <div className="mt-6 space-y-5 pl-0 sm:pl-9">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="text-[1.0625rem] leading-[1.75] text-fg-secondary"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {section.points ? (
                    <ul className="mt-6 space-y-3">
                      {section.points.map((point) => (
                        <li key={point.slice(0, 40)} className="flex gap-3.5">
                          <Icon
                            name="check"
                            size={16}
                            className="mt-1 shrink-0 text-accent"
                          />
                          <span className="text-[0.9375rem] leading-relaxed text-fg-secondary">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Section index. Sticky on desktop, hidden on mobile where the
              document outline is short enough to scroll. */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Case study sections"
              className="sticky top-28"
            >
              <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                Contents
              </p>
              <ol className="mt-5 space-y-1">
                {project.caseStudy.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="group flex items-baseline gap-3 rounded-md px-2 py-1.5 text-sm text-fg-secondary transition-colors duration-200 hover:bg-white/[0.03] hover:text-accent"
                    >
                      <span className="font-mono text-[0.6875rem] tabular-nums text-fg-muted transition-colors group-hover:text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        </div>

        {/* ------------------------------------------------- Verification note */}
        {project.verificationNote ? (
          <motion.div
            variants={item}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
            className="mt-20"
          >
            <GlassPanel className="p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <h2 className="text-[0.875rem] font-semibold text-fg">
                    About this write-up
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-fg-secondary">
                    {project.verificationNote}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        ) : null}

        {/* -------------------------------------------------------- Next / CTA */}
        <div aria-hidden="true" className="rule-fade my-16" />

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          {hasNext ? (
            <Link
              to={`/projects/${nextProject.slug}`}
              className="group min-w-0"
            >
              <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                Next project
              </p>
              <p className="mt-3 flex items-center gap-3 text-h3 font-semibold text-fg transition-colors duration-200 group-hover:text-accent">
                {nextProject.title}
                <Icon
                  name="arrow-right"
                  size={18}
                  className="text-accent transition-transform duration-200 group-hover:translate-x-1"
                />
              </p>
            </Link>
          ) : (
            <div />
          )}

          <div className="flex shrink-0 flex-wrap gap-3">
            {repoIsPublic && project.repo ? (
              <Button
                as="a"
                href={project.repo.url}
                target="_blank"
                variant="secondary"
                icon="github"
                iconPosition="left"
              >
                View source
              </Button>
            ) : null}
            {project.liveUrl ? (
              <Button
                as="a"
                href={project.liveUrl}
                target="_blank"
                icon="arrow-up-right"
              >
                Live demo
              </Button>
            ) : null}
            <Button as="link" to="/contact" variant="secondary" icon="arrow-right">
              Discuss a project
            </Button>
          </div>
        </div>
      </article>
    </>
  );
}
