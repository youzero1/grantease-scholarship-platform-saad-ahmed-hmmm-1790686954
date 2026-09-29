import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warn' | 'danger';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-raised text-muted border-border',
  accent: 'bg-accent-soft text-accent border-accent/40',
  success: 'bg-success/12 text-success border-success/35',
  warn: 'bg-warn/12 text-warn border-warn/35',
  danger: 'bg-danger/12 text-danger border-danger/35',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
