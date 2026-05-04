import * as Sentry from '@sentry/nextjs';

export async function register() {
  try {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./sentry.edge.config');
    }
  } catch (err) {
    // Never crash request handling because of observability bootstrap.
    console.error('[instrumentation] Sentry register failed', err);
  }
}

/** Server Components, middleware, etc. (Next.js 15 + @sentry/nextjs ≥ 8.28) */
export const onRequestError = (...args: unknown[]) => {
  try {
    if (typeof Sentry.captureRequestError === 'function') {
      return (Sentry.captureRequestError as (...params: unknown[]) => unknown)(...args);
    }
  } catch (err) {
    console.error('[instrumentation] Sentry onRequestError failed', err);
  }
};
