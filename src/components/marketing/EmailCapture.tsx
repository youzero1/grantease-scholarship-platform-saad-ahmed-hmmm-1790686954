import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fadeUp } from '@/lib/motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';

export function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'duplicate' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus('error');
      setMessage('That email address does not look right.');
      return;
    }
    setStatus('loading');
    const { error } = await supabase
      .from('waitlist_signups')
      .insert({ email: email.trim().toLowerCase(), source: 'landing' });

    if (error) {
      if (error.code === '23505') {
        setStatus('duplicate');
        setMessage('You are already on the list — we will be in touch.');
        return;
      }
      setStatus('error');
      setMessage('Something went wrong saving that. Try again in a moment.');
      return;
    }
    setStatus('done');
    setMessage('You are on the list. We will email you before the next campus cohort opens.');
    setEmail('');
  }

  const settled = status === 'done' || status === 'duplicate';

  return (
    <section className="border-b border-border/60">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto max-w-6xl px-6 py-24"
      >
        <div className="rounded-2xl border border-border bg-surface p-10 md:p-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">
                Bringing GrantEase to your campus?
              </h2>
              <p className="mt-4 text-muted">
                We run financial aid workshops with partner schools and open cohort access to their
                students first. Leave an email and we will send the partnership brief and dates.
              </p>
            </div>

            <div>
              {settled ? (
                <div className="flex items-start gap-3 rounded-xl border border-success/40 bg-success/10 p-5 text-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                  <p className="text-text">{message}</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@college.edu"
                      aria-label="Email address"
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" loading={status === 'loading'} size="md">
                    Get the brief
                  </Button>
                </form>
              )}
              {status === 'error' && <p className="mt-3 text-sm text-danger">{message}</p>}
              {!settled && status !== 'error' && (
                <p className="mt-3 text-xs text-muted">
                  No newsletter. Partnership and cohort dates only.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
