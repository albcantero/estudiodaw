/**
 * @file Resaltado de la búsqueda (scripts/collections/search.ts): marca con <mark data-match> lo
 * que coincide con cada palabra en los textos de un elemento que lo admiten ([data-highlight]: el
 * título y la descripción). Compara igual que el buscador, sin tildes ni mayúsculas, pero marca el
 * texto original: buscar "diseno" resalta "Diseño". Cómo se ve, en layout.css.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { normalizeSearch } from '../../lib/search';

/** Texto original de cada elemento resaltable, antes de marcar nada */
const originals = new WeakMap<Element, string>();

/**
 * El texto normalizado y, para cada carácter suyo, la posición del carácter original del que
 * sale (una tilde suelta desaparece, así que las posiciones no coinciden una a una).
 *
 * @param text Texto original.
 * @returns El texto normalizado y las posiciones de origen.
 */
function normalizeWithMap(text: string): { normalized: string; origin: number[] } {
  let normalized = '';
  const origin: number[] = [];
  let position = 0;
  Array.from(text).forEach((char) => {
    const piece = normalizeSearch(char);
    normalized += piece;
    Array.from(piece).forEach(() => origin.push(position));
    position += char.length;
  });
  return { normalized, origin };
}

/**
 * Tramos del texto original que coinciden con alguna palabra, ordenados y sin solaparse.
 *
 * @param text Texto original.
 * @param words Palabras buscadas, ya normalizadas.
 * @returns Los tramos, como pares de inicio y fin.
 */
function matchRanges(text: string, words: string[]): [number, number][] {
  const { normalized, origin } = normalizeWithMap(text);
  const ranges: [number, number][] = [];
  words.forEach((word) => {
    let from = normalized.indexOf(word);
    while (from !== -1) {
      const start = origin[from];
      const last = origin[from + word.length - 1];
      // Hasta el final del último carácter original (puede ocupar dos posiciones)
      const end = last + Array.from(text.slice(last))[0].length;
      ranges.push([start, end]);
      from = normalized.indexOf(word, from + word.length);
    }
  });
  ranges.sort((a, b) => a[0] - b[0]);
  return ranges.reduce<[number, number][]>((merged, range) => {
    const previous = merged.at(-1);
    if (previous && range[0] <= previous[1]) previous[1] = Math.max(previous[1], range[1]);
    else merged.push([...range]);
    return merged;
  }, []);
}

/**
 * Marca las coincidencias en un elemento, o lo deja como estaba si no se busca nada.
 *
 * @param element Elemento resaltable ([data-highlight]).
 * @param words Palabras buscadas, ya normalizadas.
 */
function highlightElement(element: Element, words: string[]): void {
  if (!originals.has(element)) originals.set(element, element.textContent ?? '');
  const text = originals.get(element) ?? '';
  const ranges = words.length > 0 ? matchRanges(text, words) : [];
  if (ranges.length === 0) {
    if (element.textContent !== text || element.childElementCount > 0)
      element.replaceChildren(text);
    return;
  }
  const pieces: (string | HTMLElement)[] = [];
  let cursor = 0;
  ranges.forEach(([start, end]) => {
    if (start > cursor) pieces.push(text.slice(cursor, start));
    const mark = document.createElement('mark');
    mark.setAttribute('data-match', '');
    mark.textContent = text.slice(start, end);
    pieces.push(mark);
    cursor = end;
  });
  if (cursor < text.length) pieces.push(text.slice(cursor));
  element.replaceChildren(...pieces);
}

/**
 * Resalta lo buscado en los elementos de un panel.
 *
 * @param panel Panel de la colección.
 * @param words Palabras buscadas, ya normalizadas (vacío: se quita el resaltado).
 */
export function highlightPanel(panel: HTMLElement, words: string[]): void {
  panel.querySelectorAll('[data-highlight]').forEach((element) => highlightElement(element, words));
}
