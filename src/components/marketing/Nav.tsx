import { Link } from '@tanstack/react-router';
import { GraduationCap } from 'lucide-react';

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">GrantEase</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#problem" className="transition hover:text-text">
            The problem
          </a>
          <a href="#features" className="transition hover:text-text">
            Product
          </a>
          <a href="#how" className="transition hover:text-text">
            How it works
          </a>
          <a href="#pricing" className="transition hover:text-text">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/signin"
            className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-text"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition hover:brightness-110"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
