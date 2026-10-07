/**
 * @file Colocar algo que flota junto a otro elemento (tooltips y desplegables): al lado que se
 * pide, metido en la ventana y, si por ese lado no cabe, por el contrario. Un solo cálculo para los
 * dos, con el mismo hueco (--floating-gap, tokens.css) y el mismo margen con los bordes.
 *
 * Lo flotante va en la capa superior (popover) con position: fixed, así que se coloca con
 * coordenadas de la ventana.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { clamp, cssNumber } from './dom';

/** Lado del elemento por el que sale */
export type FloatingSide = 'top' | 'bottom' | 'right';

/** Alineación a lo largo de ese lado: centrado, o pegado al borde derecho del elemento */
export type FloatingAlign = 'center' | 'end';

/** Margen con los bordes de la ventana, en px */
const EDGE_MARGIN = 8;

/**
 * Coloca un elemento flotante junto a otro. Lo flotante tiene que estar abierto (con caja) para
 * medirlo.
 *
 * @param floating Elemento flotante.
 * @param anchor Elemento al que acompaña.
 * @param side Lado que se pide.
 * @param align Alineación a lo largo del lado (arriba o abajo).
 * @returns El lado en el que ha quedado y dónde cae el centro del elemento en lo flotante (para
 *   una flecha).
 */
export function placeFloating(
  floating: HTMLElement,
  anchor: Element,
  side: FloatingSide,
  align: FloatingAlign = 'center',
): { side: FloatingSide; anchorX: number; anchorY: number } {
  const box = anchor.getBoundingClientRect();
  const width = floating.offsetWidth;
  const height = floating.offsetHeight;
  const gap = cssNumber(document.documentElement, '--floating-gap');
  const maxX = window.innerWidth - EDGE_MARGIN;
  const maxY = window.innerHeight - EDGE_MARGIN;

  // Arriba o abajo: por el contrario si por el que se pide no cabe y por el otro sí
  let placed = side;
  const fitsAbove = box.top - gap - height >= EDGE_MARGIN;
  const fitsBelow = box.bottom + gap + height <= maxY;
  if (side === 'top' && !fitsAbove && fitsBelow) placed = 'bottom';
  else if (side === 'bottom' && !fitsBelow && fitsAbove) placed = 'top';

  let x: number;
  let y: number;
  if (placed === 'right') {
    x = box.right + gap;
    y = clamp(box.top + box.height / 2 - height / 2, EDGE_MARGIN, maxY - height);
  } else {
    const start = align === 'end' ? box.right - width : box.left + box.width / 2 - width / 2;
    x = clamp(start, EDGE_MARGIN, maxX - width);
    y = placed === 'top' ? box.top - gap - height : box.bottom + gap;
  }

  floating.style.setProperty('left', `${x}px`);
  floating.style.setProperty('top', `${y}px`);
  return {
    side: placed,
    anchorX: box.left + box.width / 2 - x,
    anchorY: box.top + box.height / 2 - y,
  };
}
