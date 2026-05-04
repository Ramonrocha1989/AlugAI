'use client';

export function SentryExampleClient() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-md space-y-4">
      <h1 className="text-xl font-semibold">Sentry (teste)</h1>
      <p className="text-sm text-muted-foreground">
        Só disponível em desenvolvimento. O botão abaixo dispara um erro de teste
        para o projeto <strong>baitabriq-web</strong> no Sentry.
      </p>
      <button
        type="button"
        className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground"
        onClick={() => {
          throw new Error('Sentry exemplo: erro de teste do Next.js');
        }}
      >
        Lançar erro de teste
      </button>
    </div>
  );
}
