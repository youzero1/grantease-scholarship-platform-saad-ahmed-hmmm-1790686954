import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/motion';

const steps = [
  {
    n: '01',
    title: 'Tell us once who you are',
    body: 'School, year, GPA, major, background, and the tuition gap you need to close. Two minutes, and you never retype it again.',
  },
  {
    n: '02',
    title: 'Work the ranked list',
    body: 'We score the corpus against your profile and hand you a short list worth your evening — quick wins first, stretch awards flagged honestly.',
  },
  {
    n: '03',
    title: 'Ship, track, and close the gap',
    body: 'Write clustered essays once, chase recommenders from the pipeline, and watch the remaining gap fall as awards land.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-b border-border/60">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <motion.p variants={fadeUp} className="text-sm font-medium uppercase tracking-widest text-accent">
          How it works
        </motion.p>
        <motion.h2 variants={fadeUp} className="mt-4 max-w-3xl font-display text-3xl font-semibold md:text-4xl">
          Three steps, then it compounds
        </motion.h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <motion.div key={s.n} variants={fadeUp} className="rounded-2xl border border-border bg-surface p-7">
              <span className="font-display text-4xl font-bold text-accent/30">{s.n}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
