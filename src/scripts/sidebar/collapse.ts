/**
 * @file Abrir y cerrar los grupos de la Navegación (Fijado, Primero, Segundo) con animación.
 *
 * El <details> manda: es accesible y sin JavaScript se abre y se cierra igual (el triángulo
 * gira con su atributo open). Aquí solo se anima (collapse-motion.ts, la misma que en los cursos
 * de las colecciones): la altura se desliza con el muelle de la interfaz y, al abrir, las
 * asignaturas aparecen una tras otra. Mientras se cierra, el grupo
 * sigue abierto (si no, desaparecería de golpe): data-state="closing" gira ya el triángulo.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { animateClose, animateOpen, clearCollapseStyles } from '../collapse-motion';
import { prefersReducedMotion } from '../motion';

/**
 * Abre un grupo: despliega la altura y hace aparecer sus asignaturas.
 *
 * @param group El <details> del grupo.
 * @param body Su lista de asignaturas.
 */
function open(group: HTMLDetailsElement, body: HTMLElement): void {
  group.toggleAttribute('open', true);
  animateOpen(body, [...body.querySelectorAll('li')]).then(() => {
    if (group.open && !group.hasAttribute('data-state')) clearCollapseStyles(body);
  });
}

/**
 * Cierra un grupo: pliega la altura y, al terminar, lo cierra de verdad.
 *
 * @param group El <details> del grupo.
 * @param body Su lista de asignaturas.
 */
function close(group: HTMLDetailsElement, body: HTMLElement): void {
  group.setAttribute('data-state', 'closing');
  animateClose(body).then(() => {
    // Si a medias se ha vuelto a abrir, el cierre ya no vale
    if (group.dataset.state !== 'closing') return;
    group.removeAttribute('data-state');
    group.toggleAttribute('open', false);
    clearCollapseStyles(body);
  });
}

/**
 * Abre o cierra un grupo según su estado real (atributo open), no según el último clic:
 * así sigue bien aunque el navegador lo haya abierto por su cuenta (al buscar en la página).
 *
 * @param group El <details> del grupo.
 */
function toggleGroup(group: HTMLDetailsElement): void {
  const body = group.querySelector<HTMLElement>('[data-collapse-body]');
  const opening = !group.open || group.dataset.state === 'closing';

  if (!body || prefersReducedMotion()) {
    group.removeAttribute('data-state');
    group.toggleAttribute('open', opening);
    return;
  }

  group.removeAttribute('data-state');
  if (opening) open(group, body);
  else close(group, body);
}

document.addEventListener('click', (event) => {
  const summary = (event.target as HTMLElement).closest('[data-nav-group] > summary');
  if (!(summary?.parentElement instanceof HTMLDetailsElement)) return;
  event.preventDefault();
  toggleGroup(summary.parentElement);
});
