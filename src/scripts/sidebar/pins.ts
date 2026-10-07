/**
 * @file Fijar y soltar asignaturas con la chincheta de la Navegación (NavGroup).
 *
 * Se guarda en el navegador la lista de ids en el orden en que se fijaron. La lectura y el
 * pintado son los del script en línea (scripts/inline/pins.js: window.readPins y
 * window.applyPins), el mismo código que antes del primer pintado.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { STORAGE_KEYS } from '../../data/storage';
import { writeListPreference } from '../preferences';
import { setupHookRails } from './hook-rails';

/**
 * Lo que recibe el foco cuando desaparece la fila que lo tenía (al soltar desde Fijado): el
 * enlace de la fila visible de al lado o, si no queda ninguna, la cabecera del grupo.
 *
 * @param row Fila que va a desaparecer.
 * @returns Lo que recibe el foco, o null.
 */
function focusFallback(row: HTMLElement): HTMLElement | null {
  const siblings = [...(row.parentElement?.children ?? [])].filter(
    (sibling): sibling is HTMLElement => sibling instanceof HTMLElement && !sibling.hidden,
  );
  const index = siblings.indexOf(row);
  const neighbour = siblings[index + 1] ?? siblings[index - 1];
  const target = neighbour && neighbour !== row ? neighbour : null;
  return (
    target?.querySelector<HTMLElement>('.nav-link') ??
    row.closest('details')?.querySelector<HTMLElement>('summary') ??
    null
  );
}

/**
 * Fija una asignatura (al final de las fijadas) o la suelta si ya lo estaba.
 *
 * @param id Id de la asignatura.
 */
function togglePin(id: string): void {
  if (!window.readPins || !window.applyPins) return;
  const pins = window.readPins();
  const next = pins.includes(id) ? pins.filter((pin) => pin !== id) : [...pins, id];
  writeListPreference(STORAGE_KEYS.pinned, next);
  window.applyPins();
  // Fijado ha cambiado de filas: sus raíles van a la nueva posición de la activa
  setupHookRails();
}

document.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-pin]');
  const id = button?.dataset.pin;
  if (!button || !id) return;

  // Soltar desde Fijado hace desaparecer la fila con el foco dentro: se pasa a la de al lado
  const row = button.closest<HTMLElement>('[data-pin-item]');
  const fallback = row && button.matches(':focus-visible') ? focusFallback(row) : null;
  togglePin(id);
  fallback?.focus();

  // Con el ratón, bajo el puntero se queda el icono de fijada hasta que sale: si cambiara a la
  // "x" nada más fijar, parecería que el clic ha hecho lo contrario. Con el teclado (detail 0),
  // no hay puntero que espere.
  if (event.detail === 0 || button.hasAttribute('data-just-toggled')) return;
  button.setAttribute('data-just-toggled', '');
  button.addEventListener('pointerleave', () => button.removeAttribute('data-just-toggled'), {
    once: true,
  });
});
