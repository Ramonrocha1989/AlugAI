import { STATES_BRAZIL } from '@/lib/constants';

const UF_SET = new Set<string>(STATES_BRAZIL.map((s) => s.value));

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '');
}

/**
 * Interpreta o texto da busca principal: UFs e nomes de estado viram filtro `state`
 * (evita full-text com 2 letras ou nomes que não batem no índice).
 * Demais textos seguem como `search`.
 */
export function parseMachineSearchBox(term: string): {
  search?: string;
  stateFromSearch?: string;
} {
  const t = term.trim();
  if (!t) return {};

  if (t.length === 2 && /^[A-Za-z]{2}$/.test(t)) {
    const uf = t.toUpperCase();
    if (UF_SET.has(uf)) {
      return { stateFromSearch: uf };
    }
  }

  const folded = stripAccents(t.toLowerCase());
  for (const s of STATES_BRAZIL) {
    if (stripAccents(s.label.toLowerCase()) === folded) {
      return { stateFromSearch: s.value };
    }
  }

  return { search: t };
}
