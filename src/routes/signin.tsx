import { useState, type FormEvent } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input, Label, FieldError } from '@/components/ui/Field';

export const Route = createFileRoute('/signin')({
  component: SignInPage,
});

function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigate({ to: '/app' });
    } catch (e: any) {
      const msg = String(e?.message ?? '');
      setError(
        msg.toLowerCase().includes('invalid')
          ? 'That email and password combination does not match an account.'
          : msg || 'Could not sign you in. Try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Pick up where you left off — your pipeline, deadlines, and drafts are exactly as you left them."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@college.edu"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        <FieldError>{error}</FieldError>
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{' '}
        <Link to="/signup" className="text-accent underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-surface p-12 lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold">GrantEase</span>
        </Link>
        <div>
          <p className="font-display text-4xl font-semibold leading-tight">Building the future</p>
          <p className="mt-5 max-w-sm text-muted">
            One profile. Every grant ranked by effort-to-win. One essay reused across the prompts that
            repeat. A tuition gap you can actually watch close.
          </p>
        </div>
        <p className="text-xs text-muted">Financial aid CRM for students</p>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold">GrantEase</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          <p className="mt-2 mb-8 text-sm text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
