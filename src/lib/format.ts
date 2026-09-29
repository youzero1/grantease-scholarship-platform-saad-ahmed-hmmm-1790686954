export function formatCurrency(cents: number | null | undefined): string {
  const value = (cents ?? 0) / 100;
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
}

export function daysUntil(date: string | null | undefined): number {
  if (!date) return Number.POSITIVE_INFINITY;
  const target = new Date(`${date}T00:00:00`).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

export function formatDeadline(date: string | null | undefined): string {
  if (!date) return 'No deadline';
  const d = daysUntil(date);
  if (d < 0) return 'Closed';
  if (d === 0) return 'Due today';
  if (d === 1) return 'Due tomorrow';
  if (d < 30) return `${d} days left`;
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
