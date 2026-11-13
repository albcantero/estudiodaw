/**
 * @file Abrir y cerrar la Ayuda de cada pregunta del test con la animación de plegado del resto
 * de la web (collapse-motion.ts). El <details> manda: sin JavaScript se abre y se cierra igual.
 * Mientras se cierra sigue abierto (si no, desaparecería de golpe) y lleva data-state="closing".
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { animateClose, animateOpen, clearCollapseStyles } from './collapse-motion';
import { prefersReducedMotion } from './motion';

/**
 * Abre o cierra una Ayuda según su estado real (atributo open), no según el último clic.
 *
 * @param help El <details> de la Ayuda.
 */
function toggleHelp(help: HTMLDetailsElement): void {
  const body = help.querySelector<HTMLElement>('[data-help-body]');
  const opening = !help.open || help.dataset.state === 'closing';
  help.removeAttribute('data-state');

  if (!body || prefersReducedMotion()) {
    help.toggleAttribute('open', opening);
    return;
  }

  if (opening) {
    help.toggleAttribute('open', true);
    animateOpen(body, [...body.children]).then(() => {
      if (help.open && !help.hasAttribute('data-state')) clearCollapseStyles(body);
    });
    return;
  }

  help.setAttribute('data-state', 'closing');
  animateClose(body).then(() => {
    // Si a medias se ha vuelto a abrir, el cierre ya no vale
    if (help.dataset.state !== 'closing') return;
    help.removeAttribute('data-state');
    help.toggleAttribute('open', false);
    clearCollapseStyles(body);
  });
}

document.addEventListener('click', (event) => {
  const summary = (event.target as HTMLElement).closest('[data-help] > summary');
  if (!(summary?.parentElement instanceof HTMLDetailsElement)) return;
  event.preventDefault();
  toggleHelp(summary.parentElement);
});
