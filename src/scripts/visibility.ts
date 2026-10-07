/**
 * @file Qué queda a la vista en los paneles cuando se combinan el buscador (atributo hidden), los
 * filtros del calendario y "Mi matrícula" (estilo de inline/boot.js). Una sola función lo recalcula
 * todo, la llame quien la llame.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * ¿Se ve el elemento? No lo está si lo oculta el buscador (hidden) o la matrícula
 * (display: none). Mira solo el propio elemento: estar en la vista que no se muestra (lista o
 * tablero) no cuenta como oculto.
 *
 * @param element Elemento de una lista.
 * @returns Si se ve.
 */
export const isShown = (element: Element): boolean => getComputedStyle(element).display !== 'none';

/**
 * Cambia el texto de un elemento solo si es distinto: así no se toca el DOM (ni se anuncia una
 * región de estado) en cada tecla del buscador si el número no cambia.
 *
 * @param element Elemento.
 * @param text Texto nuevo.
 */
function setText(element: Element | null, text: string): void {
  if (element && element.textContent !== text) element.replaceChildren(text);
}

/**
 * Barra de lo oculto bajo la colección: cuántos elementos no se ven y por qué (la búsqueda o la
 * matrícula), con su salida. Solo si hay algo oculto y algo a la vista.
 *
 * @param panel Panel de la colección.
 * @param hidden Elementos ocultos.
 * @param shown Elementos a la vista.
 */
function refreshHiddenBar(panel: HTMLElement, hidden: number, shown: number): void {
  const bar = panel.querySelector<HTMLElement>('[data-collection-hidden]');
  if (!bar) return;
  bar.toggleAttribute('hidden', hidden === 0 || shown === 0);
  if (hidden === 0 || shown === 0) return;

  const searching = Boolean(
    panel.querySelector<HTMLInputElement>('[data-collection-search]')?.value.trim(),
  );
  // El nombre de lo que se cuenta es el del panel ("asignatura", "tema")
  const status = panel.querySelector<HTMLElement>('[data-panel-status]');
  const noun = hidden === 1 ? status?.dataset.nounOne : status?.dataset.nounOther;
  let reason = 'fuera de tu matrícula';
  if (searching)
    reason = hidden === 1 ? 'no coincide con la búsqueda' : 'no coinciden con la búsqueda';
  setText(bar.querySelector('[data-hidden-count]'), `${hidden} ${noun ?? ''}`.trim());
  setText(bar.querySelector('[data-hidden-reason]'), reason);
  bar.querySelectorAll<HTMLElement>('[data-hidden-action]').forEach((action) => {
    action.toggleAttribute(
      'hidden',
      action.dataset.hiddenAction !== (searching ? 'search' : 'enrollment'),
    );
  });
}

/**
 * Actualiza el contador, su anuncio para lectores de pantalla y el aviso de vacío de cada
 * panel. Cuenta un elemento por entrada (data-count-item), aunque la colección se pinte dos
 * veces (tablero y lista). Primero se mide todo y luego se escribe, para no recalcular estilos
 * entre medias.
 */
function refreshPanels(): void {
  const panels = [...document.querySelectorAll<HTMLElement>('[data-panel]')]
    .map((panel) => ({ panel, items: [...panel.querySelectorAll('[data-count-item]')] }))
    .filter(({ items }) => items.length > 0)
    .map(({ panel, items }) => ({
      panel,
      total: items.length,
      shown: items.filter(isShown).length,
    }));

  panels.forEach(({ panel, total, shown }) => {
    setText(panel.querySelector('[data-panel-count]'), `(${shown})`);
    const status = panel.querySelector<HTMLElement>('[data-panel-status]');
    if (status) {
      const noun = shown === 1 ? status.dataset.nounOne : status.dataset.nounOther;
      setText(status, `${shown} ${noun}`);
    }

    const empty = panel.querySelector<HTMLElement>('[data-collection-empty]');
    if (empty) {
      // Vacío por la búsqueda (con su texto) o por la matrícula: cambian el mensaje y la salida
      const query = panel.querySelector<HTMLInputElement>('[data-collection-search]')?.value.trim();
      const reason = query ? 'search' : 'enrollment';
      const notice = query
        ? (empty.dataset.emptySearch ?? '').replace('{query}', query)
        : (empty.dataset.emptyEnrollment ?? '');
      empty.toggleAttribute('hidden', shown > 0);
      setText(empty.querySelector('[data-empty-text]'), notice);
      empty.querySelectorAll<HTMLElement>('[data-empty-action]').forEach((action) => {
        action.toggleAttribute('hidden', action.dataset.emptyAction !== reason);
      });
      // El anuncio, siempre en la página (es una región de estado): vacío si hay algo
      setText(panel.querySelector('[data-collection-status]'), shown > 0 ? '' : notice);
    }

    refreshHiddenBar(panel, total - shown, shown);
  });
}

/** Oculta los grupos del calendario (meses) que se han quedado sin exámenes a la vista. */
function refreshGroups(): void {
  const groups = [...document.querySelectorAll<HTMLElement>('[data-subject-group]')];
  // Primero se mide y luego se escribe
  const isEmpty = groups.map(
    (group) => ![...group.querySelectorAll('[data-count-item]')].some(isShown),
  );
  groups.forEach((group, index) => group.toggleAttribute('hidden', isEmpty[index]));
  const anyShown = isEmpty.includes(false);
  document
    .querySelectorAll('[data-groups-empty]')
    .forEach((notice) => notice.toggleAttribute('hidden', anyShown));
}

/** Recalcula contadores, avisos, grupos y colocación de las colecciones. */
export function refreshLists(): void {
  refreshPanels();
  refreshGroups();
  window.layoutCollections?.();
}
