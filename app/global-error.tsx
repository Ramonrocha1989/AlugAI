'use client';

import NextError from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Evita importar @sentry/nextjs aqui: o pacote puxa @sentry/node + OpenTelemetry e pode
    // estourar memória / quebrar o runtime serverless da Netlify. Erros globais ainda vão
    // para o Sentry via instrumentation / boundary server quando aplicável.
    console.error('[global-error]', error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
