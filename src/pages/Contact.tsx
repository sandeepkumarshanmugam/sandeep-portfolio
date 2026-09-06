import { motion } from 'motion/react';
import { Seo } from '@/components/Seo';
import { PageHeading } from '@/components/PageHeading';
import { ContactForm } from '@/components/ContactForm';
import { Icon } from '@/components/Icon';
import { GlassPanel } from '@/components/GlassPanel';
import { profile, activeProfileLinks } from '@/data/profile';
import { inViewOnce, resolveVariants, revealGroup, revealItem } from '@/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

/** Contact — how to reach Sandeep. */
export default function Contact() {
  const reduced = usePrefersReducedMotion();
  const group = resolveVariants(reduced, revealGroup(0.07));
  const item = resolveVariants(reduced, revealItem);

  return (
    <>
      <Seo
        title="Contact"
        description={`Get in touch with Sandeepkumar S about internships, freelance work or collaborations. Email ${profile.email} or use the contact form.`}
      />

      <div className="container-page py-16 lg:py-20">
        <PageHeading
          eyebrow="Contact"
          title="Let's build something."
          subtitle="Have a project, an internship opportunity, a collaboration idea, or something interesting you'd like to discuss? I read everything that comes in."
        />

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* ------------------------------------------------ Direct details */}
          <motion.div
            variants={group}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
            className="space-y-4"
          >
            <motion.a
              variants={item}
              href={`mailto:${profile.email}`}
              className="group block rounded-xl border border-hairline bg-surface/40 p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-hairline-accent hover:bg-surface"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline-accent bg-accent/[0.07] text-accent">
                  <Icon name="mail" size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                    Email
                  </p>
                  <p className="mt-2 break-all text-[0.9375rem] font-medium text-fg transition-colors group-hover:text-accent">
                    {profile.email}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-fg-muted">
                    Best for anything detailed
                  </p>
                </div>
              </div>
            </motion.a>

            <motion.a
              variants={item}
              href={`tel:${profile.phoneHref}`}
              className="group block rounded-xl border border-hairline bg-surface/40 p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-hairline-accent hover:bg-surface"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline-accent bg-accent/[0.07] text-accent">
                  <Icon name="phone" size={18} />
                </span>
                <div>
                  <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                    Phone
                  </p>
                  <p className="mt-2 text-[0.9375rem] font-medium text-fg transition-colors group-hover:text-accent">
                    {profile.phone}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-fg-muted">
                    India Standard Time (GMT+5:30)
                  </p>
                </div>
              </div>
            </motion.a>

            <motion.div variants={item}>
              <GlassPanel className="p-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-hairline bg-white/[0.02] text-fg-secondary">
                    <Icon name="location" size={18} />
                  </span>
                  <div>
                    <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                      Location
                    </p>
                    <p className="mt-2 text-[0.9375rem] font-medium text-fg">
                      {profile.location}
                    </p>
                    <p className="mt-1 text-[0.8125rem] text-fg-muted">
                      Open to remote work
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div variants={item}>
              <GlassPanel className="p-6">
                <p className="text-eyebrow font-semibold uppercase text-fg-muted">
                  Elsewhere
                </p>
                <ul className="mt-4 space-y-1">
                  {activeProfileLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-md py-2 text-sm text-fg-secondary transition-colors duration-200 hover:text-accent"
                      >
                        <Icon name={link.icon} size={17} />
                        <span className="font-medium">{link.label}</span>
                        {link.handle ? (
                          <span className="truncate text-[0.8125rem] text-fg-muted">
                            {link.handle}
                          </span>
                        ) : null}
                        <Icon
                          name="arrow-up-right"
                          size={13}
                          className="ml-auto shrink-0 text-fg-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </GlassPanel>
            </motion.div>
          </motion.div>

          {/* ------------------------------------------------------- The form */}
          <motion.div
            variants={item}
            initial="initial"
            whileInView="animate"
            viewport={inViewOnce}
          >
            <div className="rounded-2xl border border-hairline bg-surface/30 p-7 sm:p-9">
              <h2 className="text-h3 font-semibold text-fg">Send a message</h2>
              <p className="mt-2.5 text-sm text-fg-secondary">
                Fill this in and it comes straight to my inbox.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
