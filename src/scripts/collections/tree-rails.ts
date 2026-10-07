/**
 * @file Raíl del árbol de las colecciones agrupadas (CollectionGroup con tree, en la lista): como
 * el raíl tenue de la Navegación, baja por el tronco con el muelle de la interfaz hasta la fila
 * bajo el ratón o con el foco y se curva hacia ella; al pasar a otra fila, se desliza desde donde
 * está. Al salir del curso se apaga. Lo mueve la misma función que los raíles del panel (moveRail).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { moveRail } from '../sidebar/hook-rails';

/**
 * Lleva el raíl de un curso a la fila que contiene un elemento, o lo apaga.
 *
 * @param host Árbol del curso ([data-tree-host]).
 * @param target Elemento bajo el ratón o con el foco; null para apagarlo.
 */
function point(host: HTMLElement, target: EventTarget | null): void {
  const rail = host.querySelector<HTMLElement>('.tree-rail');
  if (!rail) return;
  const row =
    target instanceof Element ? target.closest<HTMLElement>('[data-group-body] > li') : null;
  // El centro de la fila, que es donde se engancha su rama
  const center = row && host.contains(row) ? row.offsetTop + row.offsetHeight / 2 : null;
  moveRail(rail, 0, center, false);
}

/**
 * Árbol del curso en el que ocurre un evento.
 *
 * @param target Elemento del evento.
 * @returns El árbol, o null si el evento no ocurre en ninguno.
 */
const hostOf = (target: EventTarget | null): HTMLElement | null =>
  target instanceof Element ? target.closest<HTMLElement>('[data-tree-host]') : null;

['pointerover', 'focusin'].forEach((type) => {
  document.addEventListener(type, (event) => {
    const host = hostOf(event.target);
    if (host) point(host, event.target);
  });
});

// Al salir del curso (no al pasar de una fila a otra), se apaga
['pointerout', 'focusout'].forEach((type) => {
  document.addEventListener(type, (event) => {
    const host = hostOf(event.target);
    const next = (event as PointerEvent | FocusEvent).relatedTarget;
    if (host && !(next instanceof Node && host.contains(next))) point(host, null);
  });
});
