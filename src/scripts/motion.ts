/**
 * @file Movimiento común de la interfaz con Motion (https://motion.dev): un solo muelle y una sola
 * curva para todo, para que la web se mueva como un único sistema.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Muelle de la interfaz: rápido y sin rebote apreciable */
export const SPRING = { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 } as const;

/** Curva de las transiciones: la misma que --ease-snappy de tokens.css */
export const EASE_SNAPPY = [0.23, 1, 0.32, 1] as const;

/** Sin animación: para colocar algo en su sitio de golpe */
export const INSTANT = { duration: 0 } as const;

/**
 * ¿Hay que reducir el movimiento? Lo pide el sistema o el interruptor de la web: los dos acaban
 * en html[data-reduce-motion] (inline/boot.js), que es lo único que se mira.
 *
 * @returns Si hay que reducirlo.
 */
export const prefersReducedMotion = (): boolean =>
  document.documentElement.hasAttribute('data-reduce-motion');

/** Quienes quieren enterarse de los cambios de reducir movimiento */
const reducedMotionListeners = new Set<() => void>();

// Un solo observador para toda la web: el atributo cambia desde el sistema, desde los ajustes,
// desde otra pestaña y al cambiar de página (boot.js lo vuelve a poner)
new MutationObserver(() => reducedMotionListeners.forEach((listener) => listener())).observe(
  document.documentElement,
  { attributeFilter: ['data-reduce-motion'] },
);

/**
 * Avisa cada vez que cambia reducir movimiento con la página abierta.
 *
 * @param listener Lo que se ejecuta.
 */
export function onReducedMotionChange(listener: () => void): void {
  reducedMotionListeners.add(listener);
}

/**
 * El muelle, o ninguna animación si se pide reducir el movimiento o colocar sin animar.
 *
 * @param instant Colocar sin animar (p. ej. al cargar la página).
 * @returns La transición que se usa.
 */
export const springOrInstant = (instant = false): typeof INSTANT | typeof SPRING =>
  instant || prefersReducedMotion() ? INSTANT : SPRING;
