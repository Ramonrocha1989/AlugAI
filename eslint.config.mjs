import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'playwright-report/**',
      'test-results/**',
      'playwright/.cache/**',
      'next-env.d.ts',
    ],
  },
  // core-web-vitals: regras Next + React essenciais (sem preset "typescript" estrito,
  // que exigiria eliminar centenas de `any` antes de ligar na CI).
  ...compat.extends('next/core-web-vitals'),
  {
    rules: {
      // Evita falha na CI por `import/no-anonymous-default-export` no próprio eslint.config.
      'import/no-anonymous-default-export': 'off',
    },
  },
];

export default config;
