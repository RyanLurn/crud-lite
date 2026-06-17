import { createRouter } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen";

export function getRouter() {
  const router = createRouter({
    defaultNotFoundComponent: DefaultNotFoundPage,
    defaultErrorComponent: DefaultErrorPage,
    scrollRestoration: true,
    routeTree,
  });

  return router;
}

function DefaultNotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <p className="text-xl font-semibold text-destructive">404 Not Found</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or doesn't exist.
        </p>
      </div>
    </div>
  );
}

function DefaultErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  function handleReset() {
    reset();
    void router.invalidate();
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col gap-6">
        {/* Copy */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            An unexpected error occurred. If this keeps happening, try
            refreshing the page or come back later.
          </p>
        </div>

        {/* Error message (dev-friendly) */}
        {import.meta.env.DEV && error.message && (
          <div className="rounded-lg border border-border bg-muted/50 px-3.5 py-3">
            <p className="font-mono text-xs leading-relaxed break-all text-muted-foreground">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={handleReset}
          >
            Try again
          </button>
          <button
            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={() => void router.navigate({ to: "/" })}
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
