export function Progress({ value, tone = 'accent' }: { value: number; tone?: 'accent' | 'success' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
      <div
        className={tone === 'accent' ? 'h-full rounded-full bg-accent' : 'h-full rounded-full bg-success'}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
