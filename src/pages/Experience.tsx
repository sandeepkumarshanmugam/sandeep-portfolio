import { motion } from 'motion/react';
import { Seo } from '@/components/Seo';
import { PageHeading } from '@/components/PageHeading';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { GlassPanel } from '@/components/GlassPanel';
import { Icon } from '@/components/Icon';
import { Button } from '@/components/Button';
import { experience } from '@/data/experience';
import { achievements, certifications } from '@/data/credentials';
import { inViewOnce, resolveVariants, revealGroup, revealItem } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Experience — internships, leadership roles and credentials.
 *
 * Ordered most recent first. Where a role's specific duties are not documented
 * anywhere, the entry shows its verified focus areas and stops there: an
 * accurate short entry beats an invented long one.
 */
export default function Experience() {
  const reduced = usePrefersReducedMotion();
  const group = resolveVariants(reduced, revealGroup(0.07));
  const item = resolveVariants(reduced, revealItem);

  return (
    <>
      <Seo
        title="Experience"
        description="Internships in AI and cybersecurity, leadership with Rotaract and IEEE PROCOMM, plus certifications and achievements — the record so far for Sandeepkumar S."
      />

      <div className="container-page py-16 lg:py-20">
        <PageHeading
          eyebrow="Experience & journey"
          title="The record so far."
          subtitle="Two internships, two leadership roles, and the certifications and results that came with them."
        />

        {/* --------------------------------------------------------- Timeline */}
        <section aria-labelledby="experience-timeline" className="mt-16 lg:mt-20">
          <h2 id="experience-timeline" className="sr-only">
            Experience timeline
          </h2>
          <ExperienceTimeline entries={experience} />
        </section>

        {/* ----------------------------------------------------- Achievements */}
        <section aria-labelledby="experience-achievements" className="mt-24 lg:mt-28">
          <div aria-hidden="true" className="rule-fade mb-16" />
          <motion.div
            variants={group}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
          >
            <motion.div variants={item}>
              <p className="text-eyebrow font-semibold uppercase text-accent">
                Achievements
              </p>
              <h2
                id="experience-achievements"
                className="mt-4 text-h2 font-semibold text-fg"
              >
                Results worth recording
              </h2>
            </motion.div>

            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {achievements.map((achievement) => (
                <motion.li key={achievement.title} variants={item}>
                  <GlassPanel className="flex h-full flex-col p-6">
                    <Icon name={achievement.icon} size={22} className="text-accent" />
                    <h3 className="mt-5 text-[0.9375rem] font-semibold leading-snug text-fg">
                      {achievement.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-secondary">
                      {achievement.detail}
                    </p>
                    {achievement.highlight ? (
                      <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-hairline-accent bg-accent/[0.08] px-3 py-1.5 text-[0.75rem] font-medium text-accent">
                        <Icon name="spark" size={12} />
                        {achievement.highlight}
                      </p>
                    ) : null}
                  </GlassPanel>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* ---------------------------------------------------- Certifications */}
        <section aria-labelledby="experience-certifications" className="mt-24 lg:mt-28">
          <div aria-hidden="true" className="rule-fade mb-16" />
          <motion.div
            variants={group}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
          >
            <motion.div variants={item}>
              <p className="text-eyebrow font-semibold uppercase text-accent">
                Credentials
              </p>
              <h2
                id="experience-certifications"
                className="mt-4 text-h2 font-semibold text-fg"
              >
                Certifications
              </h2>
            </motion.div>

            <ul className="mt-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2">
              {certifications.map((certification) => (
                <motion.li
                  key={`${certification.issuer}-${certification.title}`}
                  variants={item}
                  className="flex items-start gap-4 bg-bg p-6"
                >
                  <Icon
                    name="certificate"
                    size={18}
                    className="mt-0.5 shrink-0 text-accent"
                  />
                  <div>
                    <p className="text-[0.9375rem] font-medium leading-snug text-fg">
                      {certification.title}
                    </p>
                    <p className="mt-1 text-[0.8125rem] text-fg-secondary">
                      {certification.issuer}
                      {certification.date ? ` · ${certification.date}` : ''}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* ------------------------------------------------------------- CTA */}
        <motion.div
          variants={item}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
          className="mt-20"
        >
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-h2 font-semibold text-fg">
                Hiring for an internship?
              </h2>
              <p className="mt-3 max-w-xl text-fg-secondary">
                I&rsquo;m looking for roles where I can build alongside people
                more experienced than me.
              </p>
            </div>
            <Button as="link" to="/contact" size="lg" icon="arrow-right" className="shrink-0">
              Get in touch
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
