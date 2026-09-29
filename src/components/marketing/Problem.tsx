import { motion } from 'framer-motion';
import { FileSpreadsheet, MailWarning, Repeat2 } from 'lucide-react';
import { fadeUp, stagger } from '@/lib/motion';

const pains = [
  {
    icon: FileSpreadsheet,
    title: 'A spreadsheet doing a system’s job',
    body: 'Twelve tabs, eight logins, and no reliable answer to the only question that matters: what should I work on tonight?',
  },
  {
    icon: Repeat2,
    title: 'The same essay, written five times',
    body: 'Half of all prompts are the same question in different clothes. Students rewrite from scratch because nothing tells them the overlap exists.',
  },
  {
    icon: MailWarning,
    title: 'Recommendations that arrive too late',
    body: 'One unanswered email from a teacher quietly voids weeks of work. Nobody is tracking the dependency until the deadline has passed.',
  },
];

export function Problem() {
  return (
    <section id="problem" className="border-b border-border/60">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <motion.p variants={fadeUp} className="text-sm font-medium uppercase tracking-widest text-accent">
          The problem
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-4 max-w-3xl font-display text-3xl font-semibold md:text-4xl">
          Money is not the bottleneck. The paperwork is.
        </motion.h2>
        <motion.p variants={fadeUp} className="mt-4 max-w-2xl text-muted">
          Search directories were solved a decade ago. What students still do by hand is everything
          that happens after they find a scholarship — and that is where the money gets left behind.
        </motion.p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {pains.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <p.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
