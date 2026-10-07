/**
 * @file Raíles con gancho de la Navegación (NavGroup).
 *
 * Cada lista de asignaturas tiene dos raíles: uno marca la activa y otro, más tenue, sigue
 * al ratón o al foco. Un raíl es una línea discontinua que baja desde arriba de la lista y un
 * gancho (SVG) que gira hacia el centro del enlace.
 *
 * Se animan con el muelle de la interfaz: si el destino cambia a medias, el muelle sale desde
 * donde está y con la velocidad que lleva, así el gancho se desliza bien al pasar rápido por
 * varias asignaturas. El gancho se mueve con transform; la línea, con top y height.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { animate } from 'motion';
import { oncePerFrame } from '../dom';
import { INSTANT, springOrInstant } from '../motion';

type RailKind = 'hover' | 'active';

/**
 * Lo que baja la curva del gancho, en px: la línea termina aquí antes del centro del enlace. Es
 * la del SVG del gancho en NavGroup.astro (que mide 7 para que quepa el trazo).
 */
const CORNER = 6;

/** Filas que cuentan: en Fijado, las asignaturas sin fijar están ocultas (hidden) */
const VISIBLE_ITEMS = 'li:not([hidden])';

/** Listas que ya tienen sus oyentes (el panel persiste: no se repiten al navegar) */
const prepared = new WeakSet<HTMLElement>();

/**
 * Centro vertical de cada enlace visible, relativo a la lista.
 *
 * @param list Lista de asignaturas ([data-hook-list]).
 * @returns Los centros, en px desde arriba de la lista.
 */
const linkCenters = (list: HTMLElement): number[] =>
  [...list.querySelectorAll<HTMLElement>(VISIBLE_ITEMS)].map(
    (li) => li.offsetTop + li.offsetHeight / 2,
  );

/**
 * Posición del enlace activo en la lista; -1 si no hay.
 *
 * @param list Lista de asignaturas.
 * @returns La posición, o -1.
 */
const activeIndex = (list: HTMLElement): number =>
  [...list.querySelectorAll(VISIBLE_ITEMS)].findIndex(
    (item) => item.querySelector('a')?.getAttribute('aria-current') === 'page',
  );

/**
 * Lleva un raíl a su destino. También la usa el árbol de las colecciones agrupadas
 * (scripts/collections/tree-rails.ts), con el mismo marcado (.hook-rail-line y .hook-rail-corner).
 *
 * @param rail Raíl (.hook-rail).
 * @param from Dónde empieza la línea, en px desde arriba de la lista.
 * @param target Centro del enlace al que apunta; null para apagarlo.
 * @param instant Colocarlo sin animar.
 */
export function moveRail(
  rail: HTMLElement,
  from: number,
  target: number | null,
  instant: boolean,
): void {
  const line = rail.querySelector<HTMLElement>('.hook-rail-line');
  const corner = rail.querySelector<SVGElement>('.hook-rail-corner');
  if (!line || !corner) return;

  const travel = springOrInstant(instant);
  const fade = { duration: travel === INSTANT ? 0 : 0.2 };

  // Sin destino (en Inicio no hay asignatura activa): se apaga y, ya oculto, vuelve arriba del
  // todo, para que la próxima vez se dibuje desde el principio de la lista.
  if (target === null) {
    animate(rail, { opacity: 0 }, fade).then(() => {
      if (rail.style.opacity !== '0') return;
      animate(line, { top: 0, height: 0 }, INSTANT);
      animate(corner, { y: -CORNER }, INSTANT);
    });
    return;
  }

  animate(rail, { opacity: 1 }, fade);
  animate(line, { top: from, height: Math.max(0, target - CORNER - from) }, travel);
  animate(corner, { y: target - CORNER }, travel);
}

/**
 * Coloca los dos raíles de una lista.
 *
 * @param list Lista de asignaturas.
 * @param hovered Posición del enlace bajo el ratón o con el foco; null si ninguno.
 * @param instant Colocarlos sin animar.
 */
function updateRails(list: HTMLElement, hovered: number | null = null, instant = false): void {
  /**
   * Raíl de un tipo de la lista.
   *
   * @param kind Tipo de raíl.
   * @returns El raíl, o null si la lista no lo tiene.
   */
  const rail = (kind: RailKind) =>
    list.querySelector<HTMLElement>(`.hook-rail[data-rail="${kind}"]`);
  const centers = linkCenters(list);
  const active = activeIndex(list);
  const activeY = active < 0 ? null : centers[active];

  const activeRail = rail('active');
  if (activeRail) moveRail(activeRail, 0, activeY, instant);

  const hoverY = hovered === null || hovered === active ? null : centers[hovered];
  // Por encima del activo ese tramo ya está pintado: solo se dibuja el gancho
  const aboveActive = activeY !== null && hoverY !== null && hoverY <= activeY;
  const from = aboveActive ? Math.max(0, hoverY - CORNER) : (activeY ?? 0);
  const hoverRail = rail('hover');
  if (hoverRail) moveRail(hoverRail, from, hoverY, instant);
}

/**
 * Posición en la lista del enlace que contiene un elemento.
 *
 * @param list Lista de asignaturas.
 * @param target Elemento del evento.
 * @returns La posición, o null si el elemento no está en un enlace.
 */
function indexOfTarget(list: HTMLElement, target: EventTarget | null): number | null {
  const item = (target as HTMLElement).closest('li');
  return item ? [...list.querySelectorAll(VISIBLE_ITEMS)].indexOf(item) : null;
}

/**
 * Prepara los raíles de todas las listas: la primera vez los coloca sin animar y les pone
 * los oyentes; las siguientes (al navegar) los lleva a la nueva asignatura activa.
 */
export function setupHookRails(): void {
  document.querySelectorAll<HTMLElement>('[data-hook-list]').forEach((list) => {
    if (prepared.has(list)) {
      updateRails(list);
      return;
    }
    prepared.add(list);
    updateRails(list, null, true);

    // Al abrir o cerrar el grupo cambian las medidas (una vez por fotograma mientras se anima)
    new ResizeObserver(oncePerFrame(() => updateRails(list, null, true))).observe(list);
    list.addEventListener('pointerover', (event) =>
      updateRails(list, indexOfTarget(list, event.target)),
    );
    list.addEventListener('pointerleave', () => updateRails(list));
    list.addEventListener('focusin', (event) =>
      updateRails(list, indexOfTarget(list, event.target)),
    );
    list.addEventListener('focusout', () => updateRails(list));
  });
}
