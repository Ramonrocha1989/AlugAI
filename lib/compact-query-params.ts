/**
 * Remove chaves com undefined, null ou string só com espaços.
 * Evita enviar query params vazios que alguns backends rejeitam com 400.
 */
export function compactQueryParams(
  params: Record<string, unknown>
): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    out[key] = value as string | number | boolean;
  }
  return out;
}
