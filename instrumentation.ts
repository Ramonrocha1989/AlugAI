/**
 * Produção: SENTRY_NETLIFY_LITE=1 em .env.production + netlify.toml — não carrega o SDK Node
 * do Sentry no servidor (evita OpenTelemetry/Prisma pesado e 502 no runtime Netlify).
 */
const sentryNetlifyLite = process.env.SENTRY_NETLIFY_LITE === '1';

export async function register() {
  if (sentryNetlifyLite) {
    console.log('[instrumentation] Sentry lite (Netlify): skipping server SDK bootstrap');
    return;
  }

  const { registerSentry } = await import('./instrumentation.sentry');
  await registerSentry();
}

export const onRequestError = sentryNetlifyLite
  ? (...args: unknown[]) => {
      console.error('[instrumentation] onRequestError (lite mode)', {
        argsCount: args.length,
        firstArgType: args.length > 0 ? typeof args[0] : 'none',
      });
    }
  : (...args: unknown[]) => {
      void import('./instrumentation.sentry')
        .then((m) => m.forwardRequestError(...args))
        .catch((err) => console.error('[instrumentation] failed to load instrumentation.sentry', err));
    };
