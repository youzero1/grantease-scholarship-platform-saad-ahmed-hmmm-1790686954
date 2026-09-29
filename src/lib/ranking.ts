import type { Profile, Scholarship } from '@/types/db';
import { daysUntil } from '@/lib/format';

export type Tier = 'Quick win' | 'Strong fit' | 'Stretch';

export interface RankedOpportunity {
  scholarship: Scholarship;
  score: number;
  tier: Tier;
  reason: string;
  expectedValueCents: number;
}

function clamp(v: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Explainable score: combines award size, real odds, effort required,
 * deadline pressure, profile fit, and essay reuse from existing clusters.
 */
export function scoreOpportunity(
  s: Scholarship,
  profile: Profile | null,
  draftedThemes: string[] = [],
): RankedOpportunity {
  const amount = s.amount_cents / 100;
  const amountScore = clamp((Math.log10(Math.max(amount, 100)) - 2) * 40); // $100 → 0, $25k → ~95
  const oddsScore = clamp(s.win_probability * 320);
  const effortScore = clamp(100 - s.effort_score);

  const days = daysUntil(s.deadline);
  const deadlineScore =
    days < 0 ? 0 : days <= 7 ? 55 : days <= 21 ? 85 : days <= 60 ? 70 : 50;

  let fit = 50;
  const tags = s.tags ?? [];
  const major = (profile?.major ?? '').toLowerCase();
  if (major && tags.some((t) => major.includes(t) || t.includes(major))) fit += 25;
  if (profile?.gpa && profile.gpa >= 3.5 && tags.includes('competitive')) fit += 10;
  if (profile?.goal === 'quick_wins' && s.effort_score <= 30) fit += 15;
  if (profile?.goal === 'maximise' && amount >= 5000) fit += 15;
  if (profile?.goal === 'close_gap' && s.win_probability >= 0.15) fit += 12;
  fit = clamp(fit);

  const reuse = s.prompt_theme && draftedThemes.includes(s.prompt_theme) ? 100 : 0;

  const score = clamp(
    Math.round(
      amountScore * 0.24 +
        oddsScore * 0.22 +
        effortScore * 0.22 +
        deadlineScore * 0.12 +
        fit * 0.12 +
        reuse * 0.08,
    ),
  );

  const tier: Tier =
    s.effort_score <= 30 && s.win_probability >= 0.15
      ? 'Quick win'
      : s.win_probability < 0.06 || s.effort_score >= 80
        ? 'Stretch'
        : 'Strong fit';

  const reason = buildReason(s, tier, reuse > 0, days);

  return {
    scholarship: s,
    score,
    tier,
    reason,
    expectedValueCents: Math.round(s.amount_cents * s.win_probability),
  };
}

function buildReason(s: Scholarship, tier: Tier, reused: boolean, days: number): string {
  const parts: string[] = [];
  if (reused) parts.push(`reuses your "${s.prompt_theme}" draft`);
  if (tier === 'Quick win') parts.push('small applicant pool and light form');
  if (tier === 'Stretch') parts.push('big award but long odds');
  if (!s.essay_required) parts.push('no essay required');
  if (s.applicant_pool_estimate && s.applicant_pool_estimate < 800)
    parts.push(`only ~${s.applicant_pool_estimate} applicants`);
  if (days >= 0 && days <= 14) parts.push(`closes in ${days} days`);
  if (parts.length === 0) parts.push('solid award-to-effort balance for your profile');
  const text = parts.slice(0, 3).join(', ');
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

export function rankOpportunities(
  scholarships: Scholarship[],
  profile: Profile | null,
  draftedThemes: string[] = [],
): RankedOpportunity[] {
  return scholarships
    .map((s) => scoreOpportunity(s, profile, draftedThemes))
    .sort((a, b) => b.score - a.score);
}

export const tierTone: Record<Tier, 'success' | 'accent' | 'warn'> = {
  'Quick win': 'success',
  'Strong fit': 'accent',
  Stretch: 'warn',
};
