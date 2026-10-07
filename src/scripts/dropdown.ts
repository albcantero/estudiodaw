/**
 * @file Desplegables (ui/Dropdown.astro): los coloca debajo de su botón, alineados con su borde
 * derecho (scripts/floating.ts: arriba si abajo no cabe, y siempre dentro de la ventana), los
 * mantiene junto al botón al hacer scroll o cambiar el tamaño, y deja el botón pulsado mientras
 * están abiertos.
 *
 * Al abrirse, beforetoggle llega antes de pintar: ahí se marca el botón y se hace una primera
 * colocación que no necesita medir la tarjeta (aún no tiene caja). Con toggle, que llega un
 * instante después, el fondo del botón pasaría por el del hover (un parpadeo). Ya abierta, en
 * toggle, se coloca con sus medidas.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { cssNumber, oncePerFrame } from './dom';
import { placeFloating } from './floating';

/**
 * Botón de un desplegable.
 *
 * @param panel Desplegable.
 * @returns El botón, o null si no lo hay.
 */
const triggerOf = (panel: HTMLElement): HTMLElement | null =>
  document.querySelector(`[data-dropdown-trigger][popovertarget="${panel.id}"]`);

/**
 * Coloca un desplegable abierto junto a su botón.
 *
 * @param panel Desplegable.
 */
function place(panel: HTMLElement): void {
  const trigger = triggerOf(panel);
  if (!trigger) return;
  panel.style.setProperty('right', 'auto');
  placeFloating(panel, trigger, 'bottom', 'end');
}

/** Recoloca los desplegables abiertos, una vez por fotograma (scroll y resize llegan seguidos). */
const replaceOpen = oncePerFrame(() =>
  document.querySelectorAll<HTMLElement>('[data-dropdown]:popover-open').forEach(place),
);

document.addEventListener(
  'beforetoggle',
  (event) => {
    const panel = event.target as HTMLElement;
    if (!panel.matches('[data-dropdown]')) return;
    const trigger = triggerOf(panel);
    if (!trigger) return;
    const opening = event.newState === 'open';
    if (opening) {
      // Primera colocación, sin medir la tarjeta: debajo y pegada al borde derecho del botón
      const box = trigger.getBoundingClientRect();
      const gap = cssNumber(document.documentElement, '--floating-gap');
      panel.style.setProperty('left', 'auto');
      panel.style.setProperty('top', `${box.bottom + gap}px`);
      panel.style.setProperty('right', `${window.innerWidth - box.right}px`);
    }
    // Pulsado mientras está abierto (aria-expanded, ver ui/Button). popovertarget ya lo
    // anuncia a los lectores de pantalla, pero no lo escribe en el HTML.
    trigger.setAttribute('aria-expanded', String(opening));
  },
  { capture: true },
);

document.addEventListener(
  'toggle',
  (event) => {
    const panel = event.target as HTMLElement;
    if (panel.matches('[data-dropdown]:popover-open')) place(panel);
  },
  { capture: true },
);

document.addEventListener('scroll', replaceOpen, { capture: true, passive: true });
window.addEventListener('resize', replaceOpen);
