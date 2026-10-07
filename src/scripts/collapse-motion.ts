/**
 * @file Animación de plegar y desplegar un grupo, la misma en la Navegación del panel lateral
 * (sidebar/collapse.ts) y en los cursos de las colecciones (collections/group-collapse.ts).
 *
 * Al desplegar, la altura se desliza con el muelle de la interfaz y sus elementos aparecen uno
 * tras otro, de desenfocados a nítidos; al plegar, la altura se recoge con un fundido. Quien la
 * usa decide qué hacer al acabar (cerrar de verdad, quitar los estilos) según el estado que
 * tenga entonces: a mitad se puede haber pulsado otra vez.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { animate, stagger } from 'motion';
import { EASE_SNAPPY, SPRING } from './motion';

/**
 * Ritmo de la entrada de los elementos al desplegar: lo que tarda cada uno (s), la separación
 * entre uno y el siguiente (s) y lo que suben al entrar (px; 0, sin subir)
 */
export interface RevealRhythm {
  duration: number;
  stagger: number;
  rise: number;
}

/** El de la Navegación: filas pequeñas, rápido y sin subir */
const NAV_RHYTHM: RevealRhythm = { duration: 0.25, stagger: 0.03, rise: 0 };

/**
 * Quita los estilos en línea que deja la animación.
 *
 * @param body Cuerpo del grupo.
 */
export function clearCollapseStyles(body: HTMLElement): void {
  body.style.removeProperty('height');
  body.style.removeProperty('opacity');
  body.style.removeProperty('overflow');
}

/**
 * Despliega el cuerpo de un grupo (ya visible): la altura desde 0 y sus elementos uno tras otro,
 * de desenfocados a nítidos (y, si el ritmo lo pide, subiendo un poco).
 *
 * @param body Cuerpo del grupo.
 * @param items Elementos que aparecen.
 * @param rhythm Ritmo de su entrada (de serie, el de la Navegación).
 * @returns Cuando acaba de crecer.
 */
export function animateOpen(
  body: HTMLElement,
  items: Element[],
  rhythm: RevealRhythm = NAV_RHYTHM,
): Promise<unknown> {
  body.style.setProperty('overflow', 'hidden');
  animate(
    items,
    {
      opacity: [0, 1],
      filter: ['blur(3px)', 'blur(0px)'],
      ...(rhythm.rise ? { y: [rhythm.rise, 0] } : {}),
    },
    { duration: rhythm.duration, delay: stagger(rhythm.stagger), ease: EASE_SNAPPY },
  );
  return animate(body, { height: [0, body.scrollHeight] }, SPRING).then(() => undefined);
}

/**
 * Pliega el cuerpo de un grupo: la altura hasta 0, con un fundido. Sigue a la vista: quien la
 * usa lo oculta al acabar.
 *
 * @param body Cuerpo del grupo.
 * @returns Cuando acaba de plegarse.
 */
export function animateClose(body: HTMLElement): Promise<unknown> {
  body.style.setProperty('overflow', 'hidden');
  return animate(body, { height: [body.offsetHeight, 0], opacity: [1, 0] }, SPRING).then(
    () => undefined,
  );
}
