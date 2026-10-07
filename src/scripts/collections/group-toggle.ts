/**
 * @file "Agrupar por curso" (GroupToggle): alterna html[data-group] entre "course" y "none", lo
 * guarda y recoloca las colecciones. La agrupación guardada la aplica inline/boot.js antes del
 * primer pintado.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { expandAllGroups } from './group-collapse';
import { readRootChoice, setRootChoice } from './root-choice';
import { syncCourseField } from './show-fields';

/**
 * ¿Están agrupadas las colecciones?
 *
 * @returns Si están agrupadas por curso.
 */
const isGrouped = (): boolean => readRootChoice('group') === 'course';

/** Deja cada botón pulsado o sin pulsar según el estado actual. */
function syncButtons(): void {
  document.querySelectorAll('[data-group-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(isGrouped()));
  });
}

document.addEventListener('click', (event) => {
  if (!(event.target as HTMLElement).closest('[data-group-toggle]')) return;
  setRootChoice('group', isGrouped() ? 'none' : 'course');
  syncButtons();
  // El plegado no se recuerda: al volver a agrupar, todos los cursos desplegados
  if (isGrouped()) expandAllGroups(false);
  // La pastilla de curso: oculta agrupado (lo dice la fila del curso), visible sin agrupar
  syncCourseField();
  window.layoutCollections?.();
});

document.addEventListener('astro:page-load', syncButtons);
