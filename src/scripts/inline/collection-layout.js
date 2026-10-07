/**
 * @file Colocación de las colecciones (CollectionView): dónde va cada elemento, cuántos se ven de
 * cada curso, quién dibuja las líneas de cada fila del tablero y cuál es la última fila de la
 * lista.
 *
 * Script clásico: CollectionView lo mete en línea justo detrás de su marcado, así todo está en
 * su sitio antes del primer pintado. Deja la función en window.layoutCollections para que los
 * módulos la vuelvan a llamar al agrupar, plegar un curso, buscar o cambiar la matrícula, y
 * inline/boot.js al cambiar de página (Astro no repite un script en línea que ya ha ejecutado).
 *
 * Cada vista agrupa a su manera:
 *  - Lista: cada elemento va al cuerpo de su curso (CollectionGroup), que se puede plegar. Sin
 *    agrupar, todos a la lista y los cursos ocultos (CSS).
 *  - Tablero: cada tarjeta va a la columna de su curso (BoardColumn), tipo kanban. Sin
 *    agrupar, todas al tablero y las columnas ocultas (CSS).
 * Sin agrupar, en el orden original (data-index). Los nodos se mueven de verdad, así el orden
 * del teclado es siempre el que se ve.
 *
 * Líneas del tablero (solo sin agrupar): las dibuja el primer elemento de cada fila
 * (data-row), de lado a lado.
 *
 * Última fila de la lista (data-last-row): la última que se ve, que no lleva línea debajo; la
 * pone el borde del panel o, al final de la página, el pie.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * ¿Se ve el elemento? Lo ocultan el buscador (hidden) y la matrícula (display: none). Es la
 * misma comprobación que isShown de scripts/visibility.ts, repetida porque aquí no se importa.
 *
 * @param {Element} element Elemento de la colección.
 * @returns {boolean} Si se ve.
 */
const isShown = (element) => getComputedStyle(element).display !== 'none';

/**
 * ¿Está en pantalla? Además de verse, que su curso no esté plegado: lo plegado no cuenta para
 * las líneas (sí para el número de su curso).
 *
 * @param {Element} element Elemento de la colección.
 * @returns {boolean} Si está en pantalla.
 */
const isOnScreen = (element) => isShown(element) && !element.closest('[data-group-body][hidden]');

/**
 * Orden original de dos elementos de la colección.
 *
 * @param {HTMLElement} a Un elemento.
 * @param {HTMLElement} b El otro.
 * @returns {number} Negativo si a va antes, positivo si va después.
 */
const byIndex = (a, b) => Number(a.dataset.index) - Number(b.dataset.index);

/**
 * Deja en un contenedor estos nodos, en este orden; solo los mueve si cambia algo (al agrupar o
 * desagrupar): al buscar no, y así no se cierra el tooltip de lo que esté bajo el ratón.
 *
 * @param {Element} container Contenedor.
 * @param {Element[]} nodes Nodos, en el orden en que tienen que quedar.
 */
function place(container, nodes) {
  if (nodes.some((node, index) => container.children[index] !== node)) container.append(...nodes);
}

/**
 * Pone en cada curso cuántos de sus elementos se ven y lo oculta si ninguno.
 *
 * @param {{ section: HTMLElement, items: HTMLElement[] }[]} groups Cursos: cada uno, con su
 *   bloque y sus elementos.
 */
function refreshCounts(groups) {
  groups.forEach(({ section, items }) => {
    const visible = items.filter(isShown).length;
    section.querySelector('[data-group-count]')?.replaceChildren(String(visible));
    section.toggleAttribute('hidden', visible === 0);
  });
}

/**
 * Marca qué elemento dibuja las líneas de cada fila del tablero: el primero de cada pareja de lo
 * que se ve. Agrupado no hay líneas de fila: basta con pasar ningún elemento.
 *
 * @param {HTMLElement} grid Lista del tablero.
 * @param {HTMLElement[]} items Elementos sueltos, en su orden original.
 */
function markRowLines(grid, items) {
  grid.querySelectorAll('[data-row]').forEach((element) => element.removeAttribute('data-row'));
  items.filter(isShown).forEach((item, index) => {
    if (index % 2 === 0) item.setAttribute('data-row', 'first');
  });
}

/**
 * Coloca el tablero: cada tarjeta en la columna de su curso, o todas sueltas en su orden.
 *
 * @param {HTMLElement} grid Lista del tablero.
 * @param {boolean} groupingOn ¿Está agrupado?
 */
function layoutGrid(grid, groupingOn) {
  const columns = [...grid.querySelectorAll(':scope > [data-board-column]')];
  const items = [...grid.querySelectorAll('[data-index]')].sort(byIndex);
  const groups = columns.map((section) => ({
    section,
    body: section.querySelector('[data-group-body]'),
    items: items.filter((item) => item.dataset.group === section.dataset.boardColumn),
  }));
  // Una colección sin cursos (los temas de una asignatura) se coloca como sin agrupar
  const grouped = groupingOn && groups.length > 0;

  refreshCounts(groups);
  if (grouped) groups.forEach(({ body, items: groupItems }) => place(body, groupItems));
  else place(grid, [...columns, ...items]);
  markRowLines(grid, grouped ? [] : items);
}

/**
 * Marca la última fila de la lista que está en pantalla (un elemento o, agrupado, un curso).
 *
 * @param {HTMLElement[]} all Todo lo que puede llevar la marca, para quitársela.
 * @param {HTMLElement[]} rows Filas, en el orden en que se ven.
 */
function markLastRow(all, rows) {
  all.forEach((row) => row.removeAttribute('data-last-row'));
  rows.findLast(isOnScreen)?.setAttribute('data-last-row', '');
}

/**
 * Marca, en cada curso de la lista, su última fila en pantalla: ahí acaba el tronco del árbol.
 *
 * @param {HTMLElement[][]} runs Elementos de cada curso.
 */
function markTreeEnds(runs) {
  runs.flat().forEach((item) => item.removeAttribute('data-tree-last'));
  runs.forEach((run) => run.findLast(isOnScreen)?.setAttribute('data-tree-last', ''));
}

/**
 * Coloca la lista: cada elemento en el cuerpo de su curso, o todos en la lista.
 *
 * @param {HTMLElement} list Lista.
 * @param {boolean} groupingOn ¿Está agrupado?
 */
function layoutList(list, groupingOn) {
  const sections = [...list.querySelectorAll(':scope > [data-group-section]')];
  const items = [...list.querySelectorAll('[data-index]')].sort(byIndex);
  const groups = sections.map((section) => ({
    section,
    body: section.querySelector('[data-group-body]'),
    items: items.filter((item) => item.dataset.group === section.dataset.groupSection),
  }));
  // Una colección sin cursos (los temas de una asignatura) se coloca como sin agrupar
  const grouped = groupingOn && groups.length > 0;

  refreshCounts(groups);
  if (grouped) groups.forEach(({ body, items: groupItems }) => place(body, groupItems));
  else place(list, [...sections, ...items]);

  const runs = grouped ? groups.map((group) => group.items) : [items];
  // Agrupado, la línea de abajo la lleva cada curso: el último que se ve va sin ella
  markLastRow([...runs.flat(), ...sections], grouped ? sections : runs.flat());
  if (grouped) markTreeEnds(runs);
}

/** Coloca todas las colecciones de la página según la agrupación actual. */
window.layoutCollections = function layoutCollections() {
  const groupingOn = document.documentElement.dataset.group === 'course';
  document.querySelectorAll('[data-collection-part]').forEach((part) => {
    if (part.dataset.collectionPart === 'grid') layoutGrid(part, groupingOn);
    else layoutList(part, groupingOn);
  });
};
