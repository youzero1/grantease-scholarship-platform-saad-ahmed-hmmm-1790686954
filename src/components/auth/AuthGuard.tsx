import { useEffect, type ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/Skeleton';

export function AuthGuard({
  children,
  requireOnboarded = true,
}: {
  children: ReactNode;
  requireOnboarded?: boolean;
}) {
  const { session, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: '/signin' });
      return;
    }
    if (requireOnboarded && profile && !profile.onboarded) {
      navigate({ to: '/onboarding' });
    }
  }, [loading, session, profile, requireOnboarded, navigate]);

  if (loading || !session) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-10">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (requireOnboarded && profile && !profile.onboarded) {
    return null;
  }

  return <>{children}</>;
}
