import { motion } from 'motion/react';
import { Seo } from '@/components/Seo';
import { PageHeading } from '@/components/PageHeading';
import { CapabilityCard } from '@/components/CapabilityCard';
import { Button } from '@/components/Button';
import { GlassPanel } from '@/components/GlassPanel';
import { Icon } from '@/components/Icon';
import { capabilities } from '@/data/capabilities';
import { inViewOnce, resolveVariants, revealGroup, revealItem } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { IconName } from '@/data/types';

/** The working habits shown below the capability grid. */
const PRINCIPLES: readonly {
  icon: IconName;
  title: string;
  body: string;
}[] = [
  {
    icon: 'layers',
    title: 'Structure before styling',
    body: 'Getting the data model and component boundaries right first. Every time I have skipped this, I have paid for it later in the same project.',
  },
  {
    icon: 'check',
    title: 'Build it, then read about it',
    body: 'I learn a technology by shipping something small and imperfect with it, then going back to the documentation with actual questions.',
  },
  {
    icon: 'users',
    title: 'Write for the next reader',
    body: 'Clear naming, and a comment where the reasoning is non-obvious — usually for my own benefit, three weeks later.',
  },
];

/** What I Do — the four areas Sandeep is actively working in. */
export default function WhatIDo() {
  const reduced = usePrefersReducedMotion();
  const group = resolveVariants(reduced, revealGroup(0.08));
  const item = resolveVariants(reduced, revealItem);

  return (
    <>
      <Seo
        title="What I Do"
        description="The four areas Sandeepkumar S is actively building and learning in: web development, software development, AI/ML, and automation and security."
      />

      <div className="container-page py-16 lg:py-20">
        <PageHeading
          eyebrow="What I do"
          title="Areas I'm actively working in."
          subtitle="Four threads, running in parallel — what I build with, what I'm studying, and where the two overlap."
        />

        {/* The card titles are h3, so the grid needs an h2 above them to keep
            the document outline continuous. A visible one would just restate
            the page title, so it is available to assistive tech only. */}
        <section aria-labelledby="capability-areas">
          <h2 id="capability-areas" className="sr-only">
            Capability areas
          </h2>
          <motion.ul
            variants={group}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
            className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20"
          >
            {capabilities.map((capability) => (
              <CapabilityCard key={capability.index} capability={capability} />
            ))}
          </motion.ul>
        </section>

        <section aria-labelledby="how-i-work" className="mt-24 lg:mt-28">
          <div aria-hidden="true" className="rule-fade mb-16" />
          <motion.div
            variants={group}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
          >
            <motion.div variants={item}>
              <p className="text-eyebrow font-semibold uppercase text-accent">
                How I work
              </p>
              <h2 id="how-i-work" className="mt-4 text-h2 font-semibold text-fg">
                Habits I&rsquo;ve picked up so far
              </h2>
            </motion.div>

            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {PRINCIPLES.map((principle) => (
                <motion.li key={principle.title} variants={item}>
                  <GlassPanel className="h-full p-6">
                    <Icon name={principle.icon} size={20} className="text-accent" />
                    <h3 className="mt-5 text-[0.9375rem] font-semibold text-fg">
                      {principle.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-fg-secondary">
                      {principle.body}
                    </p>
                  </GlassPanel>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        <motion.div
          variants={item}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
          className="mt-20 flex flex-wrap items-center gap-3"
        >
          <Button as="link" to="/projects" icon="arrow-right">
            See it applied
          </Button>
          <Button as="link" to="/services" variant="secondary">
            What I can help build
          </Button>
        </motion.div>
      </div>
    </>
  );
}
