/**
 * @file Tarjetas al pasar el ratón (HoverCard.astro): abrirlas, colocarlas y cerrarlas.
 *
 * Los tiempos y el hueco son los de la demo de shadcn (HoverCardTrigger delay={10}
 * closeDelay={100}; HoverCardContent sideOffset={4}): se abre casi al instante y se cierra un poco
 * después de salir, para poder pasar del elemento a la tarjeta (y a sus enlaces).
 *
 * Estados del contenido (los pinta HoverCard.astro):
 * - Cerrada: popover cerrado, fuera de la página.
 * - Abriéndose y abierta: popover abierto; data-open llega en el fotograma siguiente para que el
 *   fundido parta de lo escondido.
 * - Cerrándose: data-closing durante el fundido de salida (100 ms); después se cierra el popover.
 *   Si se vuelve a entrar mientras tanto, vuelve a abrirse sin moverse.
 *
 * Abre: el ratón al entrar (no en pantallas táctiles), el foco de teclado (sin espera) y pulsar el
 * elemento (sin espera; en pantallas táctiles, pulsar otra vez la cierra). Cierra: salir con el
 * ratón, sacar el foco, pulsar fuera, Esc (WCAG 1.4.13) y cambiar de página. Solo hay una abierta
 * a la vez. Con scroll o al cambiar el tamaño de la ventana se recoloca, como los tooltips.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { cssNumber, oncePerFrame } from './dom';
import { placeFloating } from './floating';

/** Espera antes de abrir, con el ratón, en ms (delay) */
const OPEN_DELAY = 10;
/** Espera antes de cerrar al salir, en ms (closeDelay) */
const CLOSE_DELAY = 100;
/** Hueco con el elemento, en px (sideOffset) */
const SIDE_OFFSET = 4;
/** Lo que dura el fundido al cerrar, en ms (duration-100) */
const EXIT_DURATION = 100;

/** Pendientes de cada tarjeta: la espera para abrir o cerrar, el fundido de salida y el fotograma */
const delays = new WeakMap<HTMLElement, number>();
const exits = new WeakMap<HTMLElement, number>();
const frames = new WeakMap<HTMLElement, number>();

/**
 * Tarjeta de la que forma parte un nodo.
 *
 * @param node Nodo del evento.
 * @returns La raíz de la tarjeta, o null si el nodo no está en ninguna.
 */
function cardOf(node: EventTarget | null): HTMLElement | null {
  return node instanceof Element ? node.closest<HTMLElement>('[data-hover-card]') : null;
}

/**
 * Elemento que abre la tarjeta: el primer hijo de la raíz.
 *
 * @param card Raíz de la tarjeta.
 * @returns El elemento, o null si no tiene.
 */
const triggerOf = (card: HTMLElement): HTMLElement | null =>
  card.firstElementChild instanceof HTMLElement ? card.firstElementChild : null;

/**
 * Contenido de una tarjeta.
 *
 * @param card Raíz de la tarjeta.
 * @returns El contenido, o null si no tiene.
 */
const contentOf = (card: HTMLElement): HTMLElement | null =>
  card.querySelector<HTMLElement>(':scope > [data-hover-card-content]');

/**
 * ¿Está a la vista (abierta o abriéndose, no cerrándose)?
 *
 * @param card Raíz de la tarjeta.
 * @returns Si está a la vista.
 */
function isShown(card: HTMLElement): boolean {
  const content = contentOf(card);
  return Boolean(content?.matches(':popover-open') && !content.hasAttribute('data-closing'));
}

/**
 * Todas las tarjetas de la página.
 *
 * @returns Sus raíces.
 */
const allCards = (): HTMLElement[] => [
  ...document.querySelectorAll<HTMLElement>('[data-hover-card]'),
];

/**
 * Anula la espera pendiente de una tarjeta (abrir o cerrar).
 *
 * @param card Raíz de la tarjeta.
 */
function cancelDelay(card: HTMLElement): void {
  window.clearTimeout(delays.get(card));
  delays.delete(card);
}

/**
 * Programa abrir o cerrar una tarjeta, anulando lo que tuviera pendiente.
 *
 * @param card Raíz de la tarjeta.
 * @param run Lo que se hace.
 * @param delay Espera, en ms.
 */
function schedule(card: HTMLElement, run: () => void, delay: number): void {
  cancelDelay(card);
  delays.set(card, window.setTimeout(run, delay));
}

/**
 * Coloca una tarjeta abierta debajo de su elemento (encima si abajo no cabe), centrada y a
 * SIDE_OFFSET.
 *
 * @param card Raíz de la tarjeta.
 */
function place(card: HTMLElement): void {
  const trigger = triggerOf(card);
  const content = contentOf(card);
  if (!trigger || !content?.matches(':popover-open')) return;
  const placed = placeFloating(content, trigger, 'bottom');
  // placeFloating deja el hueco de los tooltips (--floating-gap); aquí va el de shadcn
  const shift = SIDE_OFFSET - cssNumber(document.documentElement, '--floating-gap');
  const top = parseFloat(content.style.top) + (placed.side === 'top' ? -shift : shift);
  content.style.top = `${top}px`;
  content.dataset.side = placed.side;
  content.style.setProperty('--hover-card-origin-x', `${placed.anchorX}px`);
}

/**
 * Cierra una tarjeta: se desvanece y después se quita. Sin fundido, de golpe (al cambiar de
 * página).
 *
 * @param card Raíz de la tarjeta.
 * @param animated Con fundido.
 */
function close(card: HTMLElement, animated = true): void {
  cancelDelay(card);
  window.cancelAnimationFrame(frames.get(card) ?? 0);
  const content = contentOf(card);
  if (!content?.matches(':popover-open')) return;
  triggerOf(card)?.setAttribute('aria-expanded', 'false');
  /**
   * Quita la tarjeta del todo.
   */
  const remove = () => {
    content.removeAttribute('data-open');
    content.removeAttribute('data-closing');
    content.hidePopover();
  };
  if (!animated) {
    window.clearTimeout(exits.get(card));
    remove();
    return;
  }
  if (content.hasAttribute('data-closing')) return;
  content.removeAttribute('data-open');
  content.setAttribute('data-closing', '');
  exits.set(card, window.setTimeout(remove, EXIT_DURATION));
}

/**
 * Abre una tarjeta y cierra las demás. Se mide abierta pero sin data-open, y data-open llega en
 * el fotograma siguiente: así el fundido parte de lo escondido.
 *
 * @param card Raíz de la tarjeta.
 */
function open(card: HTMLElement): void {
  cancelDelay(card);
  const trigger = triggerOf(card);
  const content = contentOf(card);
  if (!trigger || !content) return;
  allCards().forEach((other) => {
    if (other !== card) close(other);
  });
  trigger.setAttribute('aria-expanded', 'true');

  // Se estaba desvaneciendo: vuelve donde estaba
  if (content.hasAttribute('data-closing')) {
    window.clearTimeout(exits.get(card));
    content.removeAttribute('data-closing');
    content.setAttribute('data-open', '');
    return;
  }
  if (content.matches(':popover-open')) return;

  content.removeAttribute('data-open');
  content.showPopover();
  place(card);
  frames.set(
    card,
    window.requestAnimationFrame(() => content.setAttribute('data-open', '')),
  );
}

// El popover es necesario (navegadores de 2024 en adelante); sin él, el elemento sigue funcionando
// como es y la tarjeta no sale
if ('showPopover' in HTMLElement.prototype) {
  // Ratón: entrar en el elemento o en la tarjeta (no moverse entre sus hijos)
  document.addEventListener('pointerover', (event) => {
    const card = cardOf(event.target);
    if (!card || event.pointerType === 'touch' || card === cardOf(event.relatedTarget)) return;
    if (isShown(card)) cancelDelay(card);
    else schedule(card, () => open(card), OPEN_DELAY);
  });

  document.addEventListener('pointerout', (event) => {
    const card = cardOf(event.target);
    if (!card || event.pointerType === 'touch' || card === cardOf(event.relatedTarget)) return;
    // Con el foco de teclado dentro, sigue abierta hasta que salga el foco
    if (card.matches(':has(:focus-visible)')) return;
    schedule(card, () => close(card), CLOSE_DELAY);
  });

  // Teclado: al llegar al elemento, sin espera; al irse el foco fuera de la tarjeta, se cierra
  document.addEventListener('focusin', (event) => {
    const card = cardOf(event.target);
    if (card && (event.target as Element).matches(':focus-visible')) open(card);
  });

  document.addEventListener('focusout', (event) => {
    const card = cardOf(event.target);
    if (card && card !== cardOf(event.relatedTarget) && !card.matches(':hover')) close(card);
  });

  // Pulsar el elemento: abre sin esperar (en pantallas táctiles, una segunda vez la cierra).
  // Pulsar fuera de la tarjeta: se cierra
  document.addEventListener('click', (event) => {
    const card = cardOf(event.target);
    const onTrigger = card && triggerOf(card)?.contains(event.target as Node);
    if (card && onTrigger) {
      const touch = event.pointerType === 'touch';
      if (touch && isShown(card)) close(card);
      else open(card);
    }
    allCards().forEach((other) => {
      if (other !== card) close(other);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') allCards().forEach((card) => close(card));
  });

  // Al cambiar de página, fuera sin fundido
  document.addEventListener('astro:before-swap', () =>
    allCards().forEach((card) => close(card, false)),
  );

  // Fija en la ventana: al hacer scroll (la página o un panel) o cambiar el tamaño, se recoloca
  const replaceOpen = oncePerFrame(() => allCards().filter(isShown).forEach(place));
  document.addEventListener('scroll', replaceOpen, { capture: true, passive: true });
  window.addEventListener('resize', replaceOpen);
}
