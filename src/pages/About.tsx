import { motion } from 'motion/react';
import { Seo } from '@/components/Seo';
import { PageHeading } from '@/components/PageHeading';
import { GlassPanel } from '@/components/GlassPanel';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { SkillGroup } from '@/components/SkillGroup';
import { aboutFacts, education, profile, softSkills } from '@/data/profile';
import { skillGroups } from '@/data/skills';
import { certifications } from '@/data/credentials';
import { inViewOnce, resolveVariants, revealGroup, revealItem } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { IconName } from '@/data/types';

/**
 * About — who Sandeep is and what drives him.
 *
 * Written as prose rather than a résumé dump: the narrative carries the page,
 * and the structured facts sit alongside it in a grid for anyone scanning.
 */
export default function About() {
  const reduced = usePrefersReducedMotion();
  const group = resolveVariants(reduced, revealGroup(0.07));
  const item = resolveVariants(reduced, revealItem);

  return (
    <>
      <Seo
        title="About"
        description="Sandeepkumar S is an undergraduate Information Technology student at KPR Institute of Engineering and Technology, focused on web development and AI/ML."
      />

      <div className="container-page py-16 lg:py-20">
        <PageHeading
          eyebrow="About me"
          title="Get to know me."
          subtitle="I'm an Information Technology undergraduate who learns by building. Here's the longer version."
        />

        {/* ------------------------------------------------------------ Story */}
        <motion.div
          variants={group}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
          className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
        >
          <div className="space-y-6 text-[1.0625rem] leading-[1.75] text-fg-secondary">
            <motion.p variants={item}>
              I&rsquo;m studying Information Technology at{' '}
              <strong className="font-medium text-fg">
                KPR Institute of Engineering and Technology
              </strong>{' '}
              in Coimbatore. Most of what I know beyond the syllabus came from
              building things and breaking them — which is still how I prefer to
              learn.
            </motion.p>
            <motion.p variants={item}>
              What holds my attention is the gap between an idea and a working
              product. Writing a function is straightforward; deciding what the
              function should do, where it belongs, and how someone will
              actually use it is the interesting part. That&rsquo;s the thinking
              I want to get good at.
            </motion.p>
            <motion.p variants={item}>
              Right now that means two threads running in parallel. On the web
              side, I build interfaces with React and TypeScript — I&rsquo;ve
              shipped a multi-page industry site and a product dashboard, and
              each one taught me more about structure than any tutorial did. On
              the other side, I&rsquo;m working through AI/ML, Java, Python and
              data structures, and I spent an internship on cybersecurity
              tooling and another on AI tools and prompt engineering.
            </motion.p>
            <motion.p variants={item}>
              The goal is to become a{' '}
              <strong className="font-medium text-fg">full-stack developer</strong>{' '}
              who can take something from concept to a running product — the
              interface, the API behind it, the database under that, plus
              authentication, deployment and the unglamorous business of keeping
              it working. I&rsquo;m not there yet. I know reasonably well which
              parts I haven&rsquo;t learned, and I&rsquo;m working through them
              in order.
            </motion.p>
            <motion.p variants={item}>
              Outside coursework I&rsquo;ve been the Young Leader Contact for my
              college&rsquo;s Rotaract Club and an executive member of the IEEE
              PROCOMM Society — both of which taught me that shipping anything
              with other people is a communication problem at least as much as a
              technical one.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3 pt-4">
              <Button as="link" to="/projects" icon="arrow-right">
                See what I&rsquo;ve built
              </Button>
              <Button
                as="a"
                href={profile.resume.href}
                download={profile.resume.downloadName}
                variant="secondary"
                icon="download"
              >
                Download resume
              </Button>
            </motion.div>
          </div>

          {/* --------------------------------------------------- Facts + education */}
          <div className="space-y-5">
            <motion.dl variants={item} className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-1">
              {aboutFacts.map((fact) => (
                <div key={fact.label} className="bg-bg p-5">
                  <dt className="flex items-center gap-2.5 text-eyebrow font-semibold uppercase text-fg-muted">
                    <Icon name={fact.icon as IconName} size={14} className="text-accent" />
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] font-medium leading-snug text-fg">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.div variants={item}>
              <GlassPanel className="p-6">
                <h2 className="flex items-center gap-2.5 text-eyebrow font-semibold uppercase text-fg-muted">
                  <Icon name="education" size={14} className="text-accent" />
                  Education
                </h2>
                <ol className="mt-5 space-y-5">
                  {education.map((entry) => (
                    <li key={entry.qualification} className="relative pl-4">
                      <span
                        aria-hidden="true"
                        className={
                          entry.current
                            ? 'absolute left-0 top-1.5 size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgb(0_191_255/0.8)]'
                            : 'absolute left-0 top-1.5 size-1.5 rounded-full bg-fg-muted/50'
                        }
                      />
                      <p className="text-sm font-medium text-fg">
                        {entry.qualification}
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-snug text-fg-secondary">
                        {entry.institution}
                      </p>
                      <p className="mt-1 font-mono text-[0.6875rem] text-fg-muted">
                        {entry.period}
                        {entry.current ? ' · Current' : ''}
                      </p>
                    </li>
                  ))}
                </ol>
              </GlassPanel>
            </motion.div>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------- Skills */}
        <section aria-labelledby="about-skills" className="mt-24 lg:mt-28">
          <div aria-hidden="true" className="rule-fade mb-16" />
          <motion.div
            variants={group}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
          >
            <motion.div variants={item}>
              <p className="text-eyebrow font-semibold uppercase text-accent">
                Toolkit
              </p>
              <h2 id="about-skills" className="mt-4 text-h2 font-semibold text-fg">
                What I work with
              </h2>
              <p className="mt-4 max-w-2xl text-fg-secondary">
                Grouped by how I actually use them — not scored out of a hundred.
                &ldquo;Working with&rdquo; means I&rsquo;ve built something real
                with it; &ldquo;learning&rdquo; means I&rsquo;m still getting
                there.
              </p>
            </motion.div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skillGroups.map((skillGroup) => (
                <motion.li key={skillGroup.title} variants={item}>
                  <SkillGroup group={skillGroup} />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* --------------------------------------------- Certifications + soft skills */}
        <section aria-labelledby="about-credentials" className="mt-24 lg:mt-28">
          <div aria-hidden="true" className="rule-fade mb-16" />
          <motion.div
            variants={group}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
            className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16"
          >
            <div>
              <motion.h2
                id="about-credentials"
                variants={item}
                className="text-h2 font-semibold text-fg"
              >
                Certifications
              </motion.h2>
              <motion.ul variants={item} className="mt-8 space-y-px overflow-hidden rounded-xl border border-hairline bg-hairline">
                {certifications.map((certification) => (
                  <li
                    key={`${certification.issuer}-${certification.title}`}
                    className="flex items-start gap-4 bg-bg p-5"
                  >
                    <Icon
                      name="certificate"
                      size={18}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                    <div>
                      <p className="text-[0.9375rem] font-medium text-fg">
                        {certification.title}
                      </p>
                      <p className="mt-0.5 text-[0.8125rem] text-fg-secondary">
                        {certification.issuer}
                        {certification.date ? ` · ${certification.date}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </motion.ul>
            </div>

            <div>
              <motion.h2 variants={item} className="text-h2 font-semibold text-fg">
                Beyond code
              </motion.h2>
              <motion.div variants={item} className="mt-8">
                <GlassPanel className="p-6">
                  <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                    Strengths
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {softSkills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full border border-hairline px-3 py-1.5 text-[0.8125rem] text-fg-secondary"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-7 text-eyebrow font-semibold uppercase text-fg-muted">
                    Languages
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {['English', 'Tamil'].map((language) => (
                      <li
                        key={language}
                        className="rounded-full border border-hairline-accent bg-accent/[0.06] px-3 py-1.5 text-[0.8125rem] text-fg"
                      >
                        {language}
                      </li>
                    ))}
                  </ul>
                </GlassPanel>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
}
