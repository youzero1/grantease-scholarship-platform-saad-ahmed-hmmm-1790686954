import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Outlet />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-text">
      <p className="font-display text-2xl">That page doesn't exist.</p>
      <Link to="/" className="text-sm text-accent underline underline-offset-4">
        Back to GrantEase
      </Link>
    </div>
  );
}
