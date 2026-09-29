import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-display text-3xl text-accent">GrantEase — Building the future</p>
    </div>
  );
}
