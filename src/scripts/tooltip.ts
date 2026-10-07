/**
 * @file Tooltips (Tooltip.astro): su colocación, la espera y cerrarlos.
 *
 * Apertura: el tooltip es un popover manual (capa superior). La primera vez que entran el
 * ratón o el foco se abre y se queda abierto: lo muestra o lo esconde el CSS. data-open llega
 * después de abrirlo, para que el CSS parta del estado escondido (con su espera y su fundido).
 * Si el elemento sale del documento (al cambiar de página), el navegador lo cierra y se vuelve
 * a abrir la próxima vez.
 *
 * Colocación: la de scripts/floating.ts, al entrar el ratón o el foco. La flecha apunta al
 * centro del elemento. Se recoloca al hacer scroll y al cambiar el tamaño de la ventana.
 *
 * Espera: el primero tarda --delay-tooltip en salir (CSS); una vez visto uno, html lleva
 * data-tooltip-warm y los siguientes salen al instante, hasta que el ratón pasa
 * --delay-tooltip-skip fuera de todos.
 *
 * Cerrar: con Esc (WCAG 1.4.13: lo que aparece al pasar el ratón tiene que poder quitarse sin
 * moverlo) y al pulsar el elemento. Se marca data-tooltip-dismissed hasta que el ratón o el
 * foco salen.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { cssNumber, oncePerFrame } from './dom';
import { placeFloating, type FloatingSide } from './floating';

/** Temporizadores de la espera: hasta que se ve el primero, y hasta que se vuelve a esperar */
let warmTimer = 0;
let coolTimer = 0;

/**
 * Un tiempo de los tokens, en ms.
 *
 * @param name Variable CSS (p. ej. --delay-tooltip).
 * @returns El tiempo, en ms.
 */
const cssTime = (name: string): number => cssNumber(document.documentElement, name);

/**
 * Marca o desmarca que ya se ha visto un tooltip (los siguientes, sin espera).
 *
 * @param warm Si se ha visto.
 */
function setWarm(warm: boolean): void {
  document.documentElement.toggleAttribute('data-tooltip-warm', warm);
}

/**
 * Coloca un tooltip junto a su elemento, abriéndolo si hace falta. Al abrirlo va escondido (sin
 * data-open): medirlo obliga a calcular ese estado y la transición parte de ahí, así el primer
 * hover también espera y entra con fundido.
 *
 * @param tooltip Raíz del tooltip ([data-tooltip]).
 */
function placeTooltip(tooltip: HTMLElement): void {
  const trigger = tooltip.firstElementChild;
  const content = tooltip.querySelector<HTMLElement>(':scope > [data-tooltip-content]');
  if (!trigger || !content) return;
  if (!content.matches(':popover-open')) {
    content.removeAttribute('data-open');
    content.showPopover();
  }
  // El lado que pide se guarda la primera vez: data-side cambia si no cabe
  content.dataset.preferredSide ??= content.dataset.side;
  const placed = placeFloating(content, trigger, content.dataset.preferredSide as FloatingSide);
  content.dataset.side = placed.side;
  content.style.setProperty('--tooltip-arrow-x', `${placed.anchorX}px`);
  content.style.setProperty('--tooltip-arrow-y', `${placed.anchorY}px`);
  content.setAttribute('data-open', '');
}

/**
 * Cierra un tooltip hasta que el ratón o el foco salgan de su elemento. Lo primero que pase
 * quita los dos oyentes, así no se acumulan.
 *
 * @param tooltip Raíz del tooltip ([data-tooltip]).
 */
function dismiss(tooltip: HTMLElement): void {
  if (tooltip.hasAttribute('data-tooltip-dismissed')) return;
  tooltip.setAttribute('data-tooltip-dismissed', '');
  const controller = new AbortController();
  /**
   * Vuelve a dejar que el tooltip aparezca y deja de escuchar.
   */
  const restore = () => {
    tooltip.removeAttribute('data-tooltip-dismissed');
    controller.abort();
  };
  tooltip.addEventListener('pointerleave', restore, { signal: controller.signal });
  tooltip.addEventListener('focusout', restore, { signal: controller.signal });
}

/**
 * Tooltip del que forma parte un nodo.
 *
 * @param node Nodo del evento.
 * @returns El tooltip, o null si el nodo no está en ninguno.
 */
function tooltipOf(node: EventTarget | null): HTMLElement | null {
  return node instanceof Element ? node.closest<HTMLElement>('[data-tooltip]') : null;
}

/**
 * Los tooltips que pueden estar a la vista: con el ratón o el foco de teclado
 *
 * @returns Los tooltips con el ratón o el foco.
 */
function activeTooltips(): NodeListOf<HTMLElement> {
  return document.querySelectorAll<HTMLElement>(
    '[data-tooltip]:hover, [data-tooltip]:has(:focus-visible)',
  );
}

/** Recoloca los que están a la vista, una vez por fotograma (scroll y resize llegan seguidos). */
const replaceActive = oncePerFrame(() => activeTooltips().forEach(placeTooltip));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') activeTooltips().forEach(dismiss);
});

// Al pulsar el elemento (no el propio tooltip): se va, porque ya se ha elegido lo que decía
document.addEventListener('pointerdown', (event) => {
  const tooltip = tooltipOf(event.target);
  if (tooltip && !(event.target as Element).closest('[data-tooltip-content]')) dismiss(tooltip);
});

// Al llegar con el teclado: se coloca antes de que se vea
document.addEventListener('focusin', (event) => {
  const tooltip = tooltipOf(event.target);
  if (tooltip) placeTooltip(tooltip);
});

// Al entrar el ratón (no al moverse entre sus hijos): se coloca y empieza la espera
document.addEventListener('pointerover', (event) => {
  const tooltip = tooltipOf(event.target);
  if (!tooltip || tooltip === tooltipOf(event.relatedTarget)) return;
  placeTooltip(tooltip);
  window.clearTimeout(coolTimer);
  window.clearTimeout(warmTimer);
  const delay = tooltip.hasAttribute('data-instant') ? 0 : cssTime('--delay-tooltip');
  warmTimer = window.setTimeout(() => setWarm(true), delay);
});

// Al salir: si no se llegó a ver, se cancela; si se vio, se vuelve a esperar pasado un rato
document.addEventListener('pointerout', (event) => {
  const tooltip = tooltipOf(event.target);
  if (!tooltip || tooltip === tooltipOf(event.relatedTarget)) return;
  window.clearTimeout(warmTimer);
  coolTimer = window.setTimeout(() => setWarm(false), cssTime('--delay-tooltip-skip'));
});

// Fijo en la ventana: al hacer scroll (la página o un panel) o cambiar el tamaño, se recoloca
document.addEventListener('scroll', replaceActive, { capture: true, passive: true });
window.addEventListener('resize', replaceActive);
