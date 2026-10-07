/**
 * @file Controles segmentados (SegmentedControl.astro): desliza el fondo de la opción elegida.
 *
 * La opción elegida es la que lleva aria-pressed="true" (botones) o aria-current="page"
 * (enlaces). Los scripts que usan un control de botones eligen con selectSegment(); este
 * módulo solo mueve el indicador.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { animate } from 'motion';
import { springOrInstant } from './motion';

/** Opción elegida de un control */
const SELECTED = '[data-segment]:is([aria-pressed="true"], [aria-current="page"])';

/**
 * Lleva el indicador de un control bajo su opción elegida.
 *
 * @param control Raíz del control ([data-segmented]).
 * @param instant Colocarlo sin animar (al cargar la página).
 */
function moveIndicator(control: HTMLElement, instant: boolean): void {
  const selected = control.querySelector<HTMLElement>(SELECTED);
  const indicator = control.querySelector<HTMLElement>('.segmented-indicator');
  if (!selected || !indicator) return;
  // Las opciones no miden lo mismo: se anima también el tamaño
  animate(
    indicator,
    {
      x: selected.offsetLeft,
      y: selected.offsetTop,
      width: selected.offsetWidth,
      height: selected.offsetHeight,
      opacity: 1,
    },
    springOrInstant(instant),
  );
  // A partir de aquí el fondo lo pinta el indicador, no la opción
  control.setAttribute('data-ready', '');
}

/**
 * Coloca los indicadores de todos los controles de la página.
 *
 * @param instant Colocarlos sin animar.
 */
function moveAllIndicators(instant: boolean): void {
  document.querySelectorAll<HTMLElement>('[data-segmented]').forEach((control) => {
    moveIndicator(control, instant);
  });
}

/**
 * Elige una opción en todos los controles de botones con ese nombre y desliza su indicador.
 *
 * @param name Nombre del control (data-segmented).
 * @param value Valor de la opción (data-segment).
 * @param instant Sin animar (al cargar la página).
 */
export function selectSegment(name: string, value: string, instant = false): void {
  document.querySelectorAll<HTMLElement>(`[data-segmented="${name}"]`).forEach((control) => {
    control.querySelectorAll('[data-segment]').forEach((option) => {
      option.setAttribute('aria-pressed', String(option.getAttribute('data-segment') === value));
    });
    moveIndicator(control, instant);
  });
}

document.addEventListener('astro:page-load', () => moveAllIndicators(true));
// El ancho de las opciones depende de la fuente: se recolocan cuando termina de cargar
document.fonts.ready.then(() => moveAllIndicators(true));
