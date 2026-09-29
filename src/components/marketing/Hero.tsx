import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

const stats = [
  { value: '$100M+', label: 'in aid goes unclaimed every year' },
  { value: '1 draft', label: 'can unlock four or more grants' },
  { value: '0', label: 'spreadsheets you have to maintain' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative mx-auto max-w-6xl px-6 py-24 md:py-32"
      >
        <motion.p
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Financial aid CRM for students
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
        >
          Building the future
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          GrantEase turns the scholarship scramble into one clean pipeline. Enter your profile once,
          get every grant ranked by how winnable it actually is, reuse a single essay across
          overlapping prompts, and watch your tuition gap close in real time.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            to="/signup"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent px-6 text-base font-semibold text-accent-ink transition hover:brightness-110"
          >
            Start closing your gap
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how"
            className="inline-flex h-12 items-center rounded-lg border border-border bg-surface-raised px-6 text-base transition hover:border-accent/50"
          >
            See how it works
          </a>
        </motion.div>

        <motion.dl variants={fadeUp} className="mt-16 grid gap-6 border-t border-border/60 pt-8 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-display text-3xl font-semibold text-accent">{s.value}</dt>
              <dd className="mt-1 text-sm text-muted">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
