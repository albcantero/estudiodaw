/**
 * @file Buscador de las colecciones (CollectionTools): oculta los elementos del mismo panel que no
 * contienen todas las palabras escritas. Compara sin tildes ni mayúsculas, con el texto que cada
 * elemento trae preparado en data-search (lib/collection.ts), y resalta lo que coincide en el
 * título y la descripción. Sin nada que enseñar, el estado vacío ofrece limpiar la búsqueda. Al
 * buscar, los cursos plegados ("Agrupar por curso") se despliegan antes.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { normalizeSearch } from '../../lib/search';
import { refreshLists } from '../visibility';
import { expandAllGroups } from './group-collapse';
import { highlightPanel } from './highlight';

/**
 * Filtra los elementos de un panel.
 *
 * @param panel Panel donde está el buscador ([data-panel]).
 * @param query Lo escrito en el buscador.
 */
function filterPanel(panel: HTMLElement, query: string): void {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  panel.querySelectorAll<HTMLElement>('[data-search]').forEach((item) => {
    const text = item.dataset.search ?? '';
    item.toggleAttribute('hidden', !words.every((word) => text.includes(word)));
  });
  // Lo que coincide, resaltado en el título y la descripción (scripts/collections/highlight.ts)
  highlightPanel(panel, words);
}

// Borrar la búsqueda (la "x" del buscador y "Limpiar búsqueda" del estado vacío): vacía el
// buscador de su panel, vuelve a filtrar y le devuelve el foco
document.addEventListener('click', (event) => {
  const clear = (event.target as HTMLElement).closest('[data-collection-clear]');
  const input = clear
    ?.closest('[data-panel]')
    ?.querySelector<HTMLInputElement>('[data-collection-search]');
  if (!input) return;
  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
});

document.addEventListener('input', (event) => {
  const input = event.target as HTMLInputElement;
  if (!input.matches('[data-collection-search]')) return;
  const panel = input.closest<HTMLElement>('[data-panel]');
  if (!panel) return;
  // Con algo escrito, primero se despliegan los cursos plegados: no queda nada escondido
  if (input.value.trim()) expandAllGroups();
  filterPanel(panel, input.value);
  refreshLists();
});
