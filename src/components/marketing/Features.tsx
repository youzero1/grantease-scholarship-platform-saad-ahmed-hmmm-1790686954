import { motion } from 'framer-motion';
import { Target, Layers, CalendarCheck } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

const features = [
  {
    icon: Target,
    title: 'Ranked by effort-to-win',
    body: 'Every grant in the corpus is scored on award size, real odds, work required, and how well it fits your profile — then explained in one plain sentence.',
    points: ['Quick win / Strong fit / Stretch tiers', 'Deadline pressure factored in', 'No black-box score'],
  },
  {
    icon: Layers,
    title: 'One draft, many grants',
    body: 'GrantEase clusters overlapping prompts by theme, so a single strong essay is submitted — with tailored notes — across every grant that asks the same question.',
    points: ['Automatic theme clustering', 'Master draft with autosave', 'Per-application tailoring notes'],
  },
  {
    icon: CalendarCheck,
    title: 'Nothing slips',
    body: 'Deadlines, recommendation letters, and external portal steps all live in one pipeline, with a live burn-down of the tuition gap you are actually trying to close.',
    points: ['30-day deadline timeline', 'Recommender chase-ups', 'Tuition gap burn-down'],
  },
];

export function Features() {
  return (
    <section id="features" className="border-b border-border/60">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <motion.p variants={fadeUp} className="text-sm font-medium uppercase tracking-widest text-accent">
          The product
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-4 max-w-3xl font-display text-3xl font-semibold md:text-4xl">
          A CRM for the money you are owed
        </motion.h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-border bg-surface p-7 transition hover:border-accent/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
              <ul className="mt-5 space-y-2 border-t border-border/60 pt-4 text-sm text-muted">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
