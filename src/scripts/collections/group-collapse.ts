/**
 * @file Plegar y desplegar los cursos de una colección con "Agrupar por curso" (CollectionGroup),
 * con la animación de los grupos de la Navegación del panel lateral (collapse-motion.ts), con su
 * propio ritmo para las filas (ROW_RHYTHM).
 *
 * No se recuerda: al cargar la página o al volver a agrupar, todos los cursos están desplegados.
 * Al buscar se despliegan todos (scripts/collections/search.ts), así no queda nada escondido.
 * Mientras se pliega, el curso sigue a la vista (si no, desaparecería de golpe):
 * data-state="closing" gira ya el triángulo.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import {
  animateClose,
  animateOpen,
  clearCollapseStyles,
  type RevealRhythm,
} from '../collapse-motion';
import { prefersReducedMotion } from '../motion';

/**
 * Ritmo de entrada de las filas al desplegar: más pausado que el de la Navegación (estas filas
 * miden el triple) y subiendo un poco, como la entrada de la portada. Se nota la cascada.
 */
const ROW_RHYTHM: RevealRhythm = { duration: 0.4, stagger: 0.06, rise: 6 };

/**
 * La fila y el cuerpo de un curso.
 *
 * @param section Bloque del curso ([data-group-section]).
 * @returns La fila y el cuerpo, o null si falta alguno.
 */
function partsOf(section: HTMLElement): { row: HTMLElement; body: HTMLElement } | null {
  const row = section.querySelector<HTMLElement>('[data-group-row]');
  const body = section.querySelector<HTMLElement>('[data-group-body]');
  return row && body ? { row, body } : null;
}

/**
 * ¿Está desplegado (o desplegándose)?
 *
 * @param section Bloque del curso.
 * @returns Si está desplegado.
 */
const isOpen = (section: HTMLElement): boolean =>
  section.querySelector('[data-group-row]')?.getAttribute('aria-expanded') === 'true';

/**
 * Despliega o pliega un curso.
 *
 * @param section Bloque del curso.
 * @param open Desplegarlo (true) o plegarlo (false).
 * @param animated Con la animación (de serie, sí).
 */
export function setGroupOpen(section: HTMLElement, open: boolean, animated = true): void {
  const parts = partsOf(section);
  if (!parts) return;
  const { row, body } = parts;
  section.removeAttribute('data-state');
  row.setAttribute('aria-expanded', String(open));

  if (!animated || prefersReducedMotion()) {
    body.hidden = !open;
    clearCollapseStyles(body);
    window.layoutCollections?.();
    return;
  }

  if (open) {
    body.hidden = false;
    window.layoutCollections?.();
    const items = [...body.children].filter((item) => !(item as HTMLElement).hidden);
    animateOpen(body, items, ROW_RHYTHM).then(() => {
      if (isOpen(section) && !section.hasAttribute('data-state')) clearCollapseStyles(body);
    });
    return;
  }

  section.setAttribute('data-state', 'closing');
  animateClose(body).then(() => {
    // Si a medias se ha vuelto a desplegar, el plegado ya no vale
    if (section.dataset.state !== 'closing') return;
    section.removeAttribute('data-state');
    body.hidden = true;
    clearCollapseStyles(body);
    // Las líneas de las filas se recalculan sin lo plegado
    window.layoutCollections?.();
  });
}

/**
 * Despliega todos los cursos plegados de la página.
 *
 * @param animated Con la animación (de serie, sí).
 */
export function expandAllGroups(animated = true): void {
  document.querySelectorAll<HTMLElement>('[data-group-section]').forEach((section) => {
    if (!isOpen(section) || section.dataset.state === 'closing') {
      setGroupOpen(section, true, animated);
    }
  });
}

document.addEventListener('click', (event) => {
  const row = (event.target as HTMLElement).closest('[data-group-row]');
  const section = row?.closest<HTMLElement>('[data-group-section]');
  if (!section) return;
  // Según el estado real: plegándose cuenta como plegado, así un segundo clic lo recupera
  const opening = !isOpen(section) || section.dataset.state === 'closing';
  setGroupOpen(section, opening);
});
