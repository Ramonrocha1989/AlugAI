/**
 * Espelha o texto da busca livre no query param `city` (igual ao filtro avançado),
 * só quando não parece marca/modelo/número — evita AND (search + city) que zera
 * resultados para termos como "John Deere" ou "trator 7230".
 */
const EQUIP_OR_BRAND_HINT =
  /\d|\b(deere|case\s*ih|case\b|valtra|new\s+holland|john\b|massey|jcb|cat\b|komatsu|kubota|trator|colheit|plantio|pulveriz|implement|seminov|usad[oa]s?|magirus|fendt|claas|stara|versatile)\b/i;

export function shouldMirrorFreeSearchToCity(freeSearch: string): boolean {
  const t = freeSearch.trim();
  if (t.length < 2) return false;
  if (EQUIP_OR_BRAND_HINT.test(t)) return false;
  return true;
}
