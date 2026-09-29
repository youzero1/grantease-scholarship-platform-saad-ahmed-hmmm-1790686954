import { Link } from '@tanstack/react-router';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-ink">
                <GraduationCap className="h-4 w-4" />
              </span>
              <span className="font-display text-lg font-semibold">GrantEase</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The end-to-end financial aid CRM for students. Built with campus aid offices, access
              programmes, and the students doing the applying.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <p className="font-medium text-text">Product</p>
              <ul className="mt-3 space-y-2 text-muted">
                <li>
                  <a href="#features" className="transition hover:text-text">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how" className="transition hover:text-text">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="transition hover:text-text">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-text">Account</p>
              <ul className="mt-3 space-y-2 text-muted">
                <li>
                  <Link to="/signup" className="transition hover:text-text">
                    Create account
                  </Link>
                </li>
                <li>
                  <Link to="/signin" className="transition hover:text-text">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-text">Campus</p>
              <ul className="mt-3 space-y-2 text-muted">
                <li>Financial aid workshops</li>
                <li>Access programme cohorts</li>
                <li>Institutional partnerships</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} GrantEase. Building the future.</p>
          <p>Made for students who are tired of the spreadsheet.</p>
        </div>
      </div>
    </footer>
  );
}
