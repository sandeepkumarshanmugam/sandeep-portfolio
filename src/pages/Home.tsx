import { motion } from 'motion/react';
import { Seo } from '@/components/Seo';
import { Button } from '@/components/Button';
import { Portrait } from '@/components/Portrait';
import { SocialLinks } from '@/components/SocialLinks';
import { ScrollIndicator } from '@/components/ScrollIndicator';
import { Icon } from '@/components/Icon';
import { profile } from '@/data/profile';
import { capabilities } from '@/data/capabilities';
import { projects } from '@/data/projects';
import { revealGroup, revealItem, resolveVariants, inViewOnce } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { Link } from 'react-router-dom';

/**
 * Home — answers one question: who is Sandeep?
 *
 * The hero carries the introduction and the two calls to action. Below it sit
 * two short orientation strips (what he works with, what he has built) that
 * point into the deeper pages rather than duplicating them.
 */
export default function Home() {
  const reduced = usePrefersReducedMotion();
  // 0.09s stagger gives the eight hero elements a clear reading order without
  // the last one arriving late.
  const group = resolveVariants(reduced, revealGroup(0.09, 0.05));
  const item = resolveVariants(reduced, revealItem);

  return (
    <>
      <Seo
        title="Home"
        description="Sandeepkumar S — undergraduate IT student in Coimbatore, building for the web and exploring AI/ML. Selected projects, experience and contact."
      />

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-x-clip">
        {/* Single accent glow, top-left, behind the copy. Contained by the
            section's own clip so it can never widen the page. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-1/4 -top-40 -z-10 size-[38rem] rounded-full bg-[radial-gradient(circle,rgb(0_191_255/0.08),transparent_65%)] blur-3xl"
        />

        <div className="container-page">
          <div className="grid items-center gap-16 py-16 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-24 xl:gap-28">
            {/* Copy */}
            <motion.div variants={group} initial="initial" animate="animate">
              <motion.p
                variants={item}
                className="flex items-center gap-3 text-eyebrow font-semibold uppercase text-accent"
              >
                <span aria-hidden="true" className="h-px w-8 bg-accent/50" />
                {profile.greeting}
              </motion.p>

              <motion.h1
                variants={item}
                className="mt-5 text-display font-bold text-fg"
              >
                {profile.name}
              </motion.h1>

              {/* Roles, separated by hairline dividers rather than pipes. */}
              <motion.p
                variants={item}
                className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-fg-secondary sm:text-[0.9375rem]"
              >
                {profile.roles.map((role, index) => (
                  <span key={role} className="flex items-center gap-3">
                    {index > 0 ? (
                      <span aria-hidden="true" className="h-3.5 w-px bg-hairline-strong" />
                    ) : null}
                    {role}
                  </span>
                ))}
              </motion.p>

              <motion.p
                variants={item}
                className="mt-8 max-w-xl text-lead text-fg-secondary"
              >
                {profile.intro}
              </motion.p>

              <motion.div
                variants={item}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Button as="link" to="/projects" size="lg" icon="arrow-right">
                  View My Work
                </Button>
                <Button
                  as="a"
                  href={profile.resume.href}
                  download={profile.resume.downloadName}
                  variant="secondary"
                  size="lg"
                  icon="download"
                >
                  Download Resume
                </Button>
              </motion.div>

              <motion.div variants={item} className="mt-12">
                <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                  Find me
                </p>
                <SocialLinks className="mt-4" />
              </motion.div>
            </motion.div>

            {/* Portrait — last in the entrance order, so the eye lands on the
                copy first. */}
            <motion.div
              variants={item}
              initial="initial"
              animate="animate"
              transition={{ delay: reduced ? 0 : 0.55 }}
              className="order-first lg:order-last"
            >
              <Portrait />
            </motion.div>
          </div>
        </div>

        {/* Hidden on short viewports where it would crowd the CTAs. */}
        <div className="hidden justify-center pb-10 min-[900px]:flex">
          <ScrollIndicator />
        </div>
      </section>

      {/* -------------------------------------------------------- What I work with */}
      <section aria-labelledby="home-focus" className="container-page py-20">
        <div aria-hidden="true" className="rule-fade mb-20" />

        <motion.div
          variants={group}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
        >
          <motion.div variants={item} className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow font-semibold uppercase text-accent">
                What I work with
              </p>
              <h2 id="home-focus" className="mt-4 text-h2 font-semibold text-fg">
                Four areas, actively
              </h2>
            </div>
            <Link
              to="/what-i-do"
              className="group inline-flex items-center gap-2 text-sm font-medium text-fg-secondary transition-colors hover:text-accent"
            >
              All capabilities
              <Icon
                name="arrow-right"
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>

          <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <motion.li
                key={capability.index}
                variants={item}
                className="group relative bg-bg p-6 transition-colors duration-300 hover:bg-surface"
              >
                <Icon
                  name={capability.icon}
                  size={22}
                  className="text-accent transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="mt-5 text-[0.9375rem] font-semibold text-fg">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {capability.technologies.join(' · ')}
                </p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------- Selected work */}
      <section aria-labelledby="home-work" className="container-page pb-8">
        <motion.div
          variants={group}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
        >
          <motion.div variants={item} className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow font-semibold uppercase text-accent">
                Selected work
              </p>
              <h2 id="home-work" className="mt-4 text-h2 font-semibold text-fg">
                Things I&rsquo;ve built
              </h2>
            </div>
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 text-sm font-medium text-fg-secondary transition-colors hover:text-accent"
            >
              All projects
              <Icon
                name="arrow-right"
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>

          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <motion.li key={project.slug} variants={item}>
                <Link
                  to={`/projects/${project.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-hairline bg-surface/50 p-7 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-hairline-accent hover:bg-surface"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon name={project.accentIcon} size={24} className="text-accent" />
                    <span className="font-mono text-[0.6875rem] text-fg-muted">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="mt-6 text-h3 font-semibold text-fg">{project.title}</h3>
                  <p className="mt-1.5 text-[0.8125rem] font-medium text-accent/80">
                    {project.category}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-secondary">
                    {project.summary}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg">
                    Read the case study
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="text-accent transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <section className="container-page pt-20">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewOnce}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-hairline accent-wash px-8 py-14 text-center sm:px-14"
        >
          <p className="font-mono text-[0.8125rem] tracking-wide text-accent">
            {profile.tagline}
          </p>
          <h2 className="mx-auto mt-6 max-w-2xl text-h2 font-semibold text-fg">
            Looking for someone to build it with?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-fg-secondary">
            I&rsquo;m open to internships, freelance work and collaborations.
            Tell me what you have in mind.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button as="link" to="/contact" size="lg" icon="arrow-right">
              Get in touch
            </Button>
            <Button as="link" to="/about" variant="secondary" size="lg">
              More about me
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
