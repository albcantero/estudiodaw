/**
 * @file Utilidades pequeñas del DOM que usan varios scripts (flotantes, degradados, barras de
 * scroll).
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * Un valor entre dos límites.
 *
 * @param value Valor.
 * @param min Mínimo.
 * @param max Máximo (si es menor que el mínimo, gana el mínimo).
 * @returns El valor, dentro de los límites.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Un número de una variable CSS: una longitud en px o un tiempo en ms, según se escriba (las
 * registradas en CSS con la regla property ya llegan resueltas, aunque se escriban con calc()).
 *
 * @param element Elemento donde se lee.
 * @param name Variable (p. ej. --floating-gap).
 * @param fallback Valor si no hay o no es un número.
 * @returns El número, o el de reserva.
 */
export function cssNumber(element: Element, name: string, fallback = 0): number {
  const value = parseFloat(getComputedStyle(element).getPropertyValue(name));
  return Number.isNaN(value) ? fallback : value;
}

/**
 * Agrupa las llamadas a una función en una por fotograma: la de scroll o resize, que llegan
 * muchas veces seguidas, se hace una vez antes de pintar.
 *
 * @param run Lo que se hace.
 * @returns La función que se llama tantas veces como haga falta.
 */
export function oncePerFrame(run: () => void): () => void {
  let frame = 0;
  return () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      run();
    });
  };
}
