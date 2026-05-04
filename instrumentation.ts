import * as Sentry from '@sentry/nextjs';

export async function register() {
  try {
    console.log('[instrumentation] register start', {
      runtime: process.env.NEXT_RUNTIME,
      node: process.version,
      env: process.env.NODE_ENV,
      hasSentryDsn: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
    });

    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./sentry.server.config');
      console.log('[instrumentation] loaded sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./sentry.edge.config');
      console.log('[instrumentation] loaded sentry.edge.config');
    }

    console.log('[instrumentation] register done');
  } catch (err) {
    // Never crash request handling because of observability bootstrap.
    console.error('[instrumentation] Sentry register failed', err);
  }
}

/** Server Components, middleware, etc. (Next.js 15 + @sentry/nextjs ≥ 8.28) */
export const onRequestError = (...args: unknown[]) => {
  try {
    console.error('[instrumentation] onRequestError called', {
      argsCount: args.length,
      firstArgType: args.length > 0 ? typeof args[0] : 'none',
    });

    if (typeof Sentry.captureRequestError === 'function') {
      return (Sentry.captureRequestError as (...params: unknown[]) => unknown)(...args);
    }

    console.error('[instrumentation] captureRequestError is not a function');
  } catch (err) {
    console.error('[instrumentation] Sentry onRequestError failed', err);
  }
};
