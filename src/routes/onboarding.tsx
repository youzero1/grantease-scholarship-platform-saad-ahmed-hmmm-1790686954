import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, GraduationCap } from 'lucide-react';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldError } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/onboarding')({
  component: OnboardingRoute,
});

const goals = [
  {
    id: 'close_gap',
    title: 'Cover a specific tuition gap',
    body: 'You know the number you need. We work backwards from it.',
  },
  {
    id: 'maximise',
    title: 'Win as much as possible',
    body: 'Cast wide, prioritise award size, and stack everything you qualify for.',
  },
  {
    id: 'quick_wins',
    title: 'Find low-effort quick wins',
    body: 'Short forms, small pools, strong odds. Momentum first.',
  },
];

const useCases = [
  {
    id: 'track',
    title: 'Track applications and deadlines',
    body: 'Kill the spreadsheet. One pipeline for everything in flight.',
  },
  {
    id: 'essays',
    title: 'Write fewer essays',
    body: 'Cluster the prompts that repeat and reuse one strong draft.',
  },
  {
    id: 'recommenders',
    title: 'Chase recommendation letters',
    body: 'Keep third-party dependencies from quietly sinking applications.',
  },
];

function OnboardingRoute() {
  return (
    <AuthGuard requireOnboarded={false}>
      <Onboarding />
    </AuthGuard>
  );
}

function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [tuition, setTuition] = useState('');
  const [covered, setCovered] = useState('');
  const [useCase, setUseCase] = useState('');
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [gpa, setGpa] = useState('');
  const [major, setMajor] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function next() {
    setError('');
    if (!goal) {
      setError('Pick the goal that fits best — you can change it later in settings.');
      return;
    }
    if (!tuition || Number(tuition) <= 0) {
      setError('Enter the tuition figure you are working against.');
      return;
    }
    setStep(2);
  }

  async function finish() {
    setError('');
    if (!useCase) {
      setError('Pick what you want GrantEase to do for you first.');
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      const { error: pErr } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim() || null,
          school: school.trim() || null,
          graduation_year: gradYear ? Number(gradYear) : null,
          gpa: gpa ? Number(gpa) : null,
          major: major.trim() || null,
          goal,
          primary_use_case: useCase,
          onboarded: true,
        })
        .eq('id', user.id);
      if (pErr) throw pErr;

      const { error: gErr } = await supabase.from('funding_goals').upsert(
        {
          user_id: user.id,
          tuition_cents: Math.round(Number(tuition) * 100),
          already_covered_cents: Math.round(Number(covered || 0) * 100),
          academic_year: `${new Date().getFullYear()}–${new Date().getFullYear() + 1}`,
        },
        { onConflict: 'user_id' },
      );
      if (gErr) throw gErr;

      await refreshProfile();
      toast('You are set up. Here is your pipeline.');
      navigate({ to: '/app' });
    } catch (e: any) {
      setError(e?.message ?? 'Could not save your answers. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold">GrantEase</span>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
          <span className="text-xs text-muted">Step {step} of 2</span>
        </div>

        <motion.div key={step} variants={fadeUp} initial="hidden" animate="visible" className="mt-10">
          {step === 1 ? (
            <div>
              <h1 className="font-display text-3xl font-semibold">What are you trying to win?</h1>
              <p className="mt-3 text-muted">
                This sets how we rank opportunities for you — award size versus effort versus odds.
              </p>

              <div className="mt-8 grid gap-3">
                {goals.map((g) => (
                  <ChoiceCard
                    key={g.id}
                    selected={goal === g.id}
                    title={g.title}
                    body={g.body}
                    onSelect={() => setGoal(g.id)}
                  />
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="tuition">Tuition this year (USD)</Label>
                  <Input
                    id="tuition"
                    type="number"
                    min="0"
                    value={tuition}
                    onChange={(e) => setTuition(e.target.value)}
                    placeholder="24000"
                  />
                </div>
                <div>
                  <Label htmlFor="covered">Already covered (USD)</Label>
                  <Input
                    id="covered"
                    type="number"
                    min="0"
                    value={covered}
                    onChange={(e) => setCovered(e.target.value)}
                    placeholder="9000"
                  />
                </div>
              </div>

              <FieldError>{error}</FieldError>

              <div className="mt-8 flex justify-end">
                <Button onClick={next} size="lg">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-display text-3xl font-semibold">What should we take off your plate?</h1>
              <p className="mt-3 text-muted">
                We will open your workspace on whatever matters most — and the rest is one click away.
              </p>

              <div className="mt-8 grid gap-3">
                {useCases.map((u) => (
                  <ChoiceCard
                    key={u.id}
                    selected={useCase === u.id}
                    title={u.title}
                    body={u.body}
                    onSelect={() => setUseCase(u.id)}
                  />
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jordan Reyes" />
                </div>
                <div>
                  <Label htmlFor="school">School</Label>
                  <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} placeholder="Riverbend State" />
                </div>
                <div>
                  <Label htmlFor="grad">Graduation year</Label>
                  <Input
                    id="grad"
                    type="number"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    placeholder="2027"
                  />
                </div>
                <div>
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    type="number"
                    step="0.01"
                    max="4"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    placeholder="3.60"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="major">Major</Label>
                  <Input id="major" value={major} onChange={(e) => setMajor(e.target.value)} placeholder="Nursing" />
                </div>
              </div>

              <FieldError>{error}</FieldError>

              <div className="mt-8 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={finish} loading={saving} size="lg">
                  Open my workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function ChoiceCard({
  selected,
  title,
  body,
  onSelect,
}: {
  selected: boolean;
  title: string;
  body: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-5 text-left transition',
        selected ? 'border-accent bg-accent-soft' : 'border-border bg-surface hover:border-accent/40',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-accent bg-accent text-accent-ink' : 'border-border',
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </span>
      <span>
        <span className="block font-medium text-text">{title}</span>
        <span className="mt-1 block text-sm text-muted">{body}</span>
      </span>
    </button>
  );
}
