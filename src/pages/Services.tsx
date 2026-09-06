import { motion } from 'motion/react';
import { Seo } from '@/components/Seo';
import { PageHeading } from '@/components/PageHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { services } from '@/data/services';
import { inViewOnce, resolveVariants, revealGroup, revealItem } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/**
 * Services — what Sandeep can help build.
 *
 * Positioned honestly for a student freelancer. The note below the grid states
 * the working arrangement plainly rather than implying agency capacity: being
 * upfront about scope is more useful to a prospective client than overstating
 * it, and it is the difference between this page and a template.
 */
export default function Services() {
  const reduced = usePrefersReducedMotion();
  const group = resolveVariants(reduced, revealGroup(0.07));
  const item = resolveVariants(reduced, revealItem);

  return (
    <>
      <Seo
        title="Services"
        description="Web development, landing pages, freelance projects and technical assistance — what Sandeepkumar S can help build."
      />

      <div className="container-page py-16 lg:py-20">
        <PageHeading
          eyebrow="Services"
          title="What I can help build."
          subtitle="Work I take on alongside my degree — scoped honestly, on timelines we agree up front."
        />

        <section aria-labelledby="services-list">
          <h2 id="services-list" className="sr-only">
            Services offered
          </h2>
          <motion.ul
            variants={group}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
            className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3"
          >
            {services.map((service) => (
              <ServiceCard key={service.index} service={service} />
            ))}
          </motion.ul>
        </section>

        <motion.div
          variants={item}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
          className="mt-16 rounded-xl border border-hairline-accent bg-accent/[0.04] p-7 sm:p-8"
        >
          <div className="flex items-start gap-4">
            <Icon name="spark" size={20} className="mt-0.5 shrink-0 text-accent" />
            <div>
              <h2 className="text-[0.9375rem] font-semibold text-fg">
                Worth being clear about
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-secondary">
                I&rsquo;m an undergraduate student, and I fit projects around my
                coursework. That makes me a good fit for focused, well-defined
                work — a site, a landing page, a dashboard, a specific technical
                problem — and I&rsquo;ll say directly if something is outside
                what I can do well or deliver on time. I&rsquo;d rather turn a
                project down than take it on and disappoint you.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          initial="initial"
          whileInView="animate"
          viewport={inViewOnce}
          className="mt-14"
        >
          <div aria-hidden="true" className="rule-fade mb-14" />
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-h2 font-semibold text-fg">
                Have something in mind?
              </h2>
              <p className="mt-3 text-fg-secondary">
                Tell me what you&rsquo;re building and I&rsquo;ll tell you
                honestly whether I can help.
              </p>
            </div>
            <Button
              as="link"
              to="/contact"
              size="lg"
              icon="arrow-right"
              className="shrink-0"
            >
              Start a conversation
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
