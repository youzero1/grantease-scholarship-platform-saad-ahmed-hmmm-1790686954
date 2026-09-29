import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

const tiers = [
  {
    name: 'Free',
    price: 'Free',
    note: 'For every student, always.',
    features: [
      'Full ranked opportunity list',
      'Up to 10 tracked applications',
      'Deadline timeline and reminders',
      'One essay cluster',
    ],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'In pilot',
    note: 'Pricing being set with our first campus partners.',
    features: [
      'Unlimited applications',
      'Unlimited essay clusters and tailoring notes',
      'Recommender tracking and reminders',
      'Tuition gap burn-down and renewals',
    ],
    cta: 'Start free, upgrade later',
    highlight: true,
  },
  {
    name: 'Scale',
    price: 'Talk to us',
    note: 'For financial aid offices and access programmes.',
    features: [
      'Cohort seats for advised students',
      'Coordinator view of student progress',
      'Workshop and onboarding support',
      'Institutional partnership terms',
    ],
    cta: 'Start a conversation',
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-b border-border/60">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <motion.p variants={fadeUp} className="text-sm font-medium uppercase tracking-widest text-accent">
          Pricing
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-4 font-display text-3xl font-semibold md:text-4xl">
          Free for students. Paid by the people who benefit.
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-muted">
          We are setting Pro and Scale pricing alongside our first campus partners, so it reflects what
          aid offices can actually budget. Students keep a genuinely useful free tier either way.
        </motion.p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className={
                t.highlight
                  ? 'relative rounded-2xl border border-accent/60 bg-surface p-7 ring-1 ring-accent/20'
                  : 'rounded-2xl border border-border bg-surface p-7'
              }
            >
              {t.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-[11px] font-semibold text-accent-ink">
                  Most useful
                </span>
              )}
              <h3 className="font-display text-lg font-semibold">{t.name}</h3>
              <p className="mt-3 font-display text-3xl font-bold text-accent">{t.price}</p>
              <p className="mt-2 text-sm text-muted">{t.note}</p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2 text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={
                  t.highlight
                    ? 'mt-7 inline-flex h-10 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink transition hover:brightness-110'
                    : 'mt-7 inline-flex h-10 w-full items-center justify-center rounded-lg border border-border bg-surface-raised px-4 text-sm transition hover:border-accent/50'
                }
              >
                {t.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
