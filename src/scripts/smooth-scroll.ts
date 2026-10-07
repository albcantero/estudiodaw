/**
 * @file Scroll suave de la página con Lenis: interpola el scroll de la rueda del ratón para que no
 * vaya a saltos (también la del trackpad, que llega igual, como rueda). En pantallas táctiles el
 * scroll es el nativo: Lenis no lo toca.
 *
 * Lenis mueve el scroll real de la página, así que todo lo demás sigue funcionando igual: la
 * barra propia (scripts/scrollbars.ts), las anclas, el teclado y la búsqueda en la página.
 *
 * - Se enciende y se apaga desde los ajustes (SettingsMenu); por defecto, encendido.
 * - Con reducir movimiento (html[data-reduce-motion], del sistema o de la web) no se enciende
 *   nunca: interpolar el scroll es movimiento.
 * - Las zonas con scroll propio ([data-scrollbar]: el panel, "Mi matrícula") se quedan con su
 *   scroll nativo: la rueda encima de ellas las mueve a ellas, no a la página.
 * - Las anclas (#temas, el índice de los apuntes) se recorren suaves. Lenis respeta el
 *   scroll-margin-top del destino (base.css), así que no quedan debajo de la barra fija.
 * - Con un diálogo abierto se detiene (scripts/modal.ts) y sigue al cerrarlo.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { STORAGE_KEYS } from '../data/storage';
import { MODAL_EVENT, type ModalDetail } from './modal';
import { onReducedMotionChange, prefersReducedMotion } from './motion';
import { readPreference } from './preferences';

/** Lo que tarda en llegar el scroll a su destino, en segundos */
const DURATION = 0.9;

let lenis: Lenis | null = null;

/**
 * ¿Lo quiere la persona usuaria? Encendido salvo que lo haya apagado en los ajustes.
 *
 * @returns Si está encendido.
 */
export const smoothScrollWanted = (): boolean =>
  readPreference(STORAGE_KEYS.smoothScroll) !== 'off';

/** Enciende el scroll suave, si no lo estaba. */
function start(): void {
  if (lenis) return;
  lenis = new Lenis({
    duration: DURATION,
    // Su propio bucle de fotogramas, siempre en marcha mientras está encendido (también con la
    // página quieta): es poco trabajo y evita coordinarlo con otro bucle
    autoRaf: true,
    anchors: true,
    prevent: (node) => node.closest('[data-scrollbar]') !== null,
  });
}

/** Apaga el scroll suave: destroy() suelta sus escuchadores y quita sus clases de <html>. */
function stop(): void {
  lenis?.destroy();
  lenis = null;
}

/** Enciende o apaga según los ajustes y reducir movimiento. */
export function syncSmoothScroll(): void {
  if (smoothScrollWanted() && !prefersReducedMotion()) start();
  else stop();
}

syncSmoothScroll();

// Reducir movimiento puede cambiar con la página abierta (sistema, ajustes u otra pestaña), y el
// propio scroll suave, desde otra pestaña
onReducedMotionChange(syncSmoothScroll);
window.addEventListener('storage', syncSmoothScroll);

// Con un diálogo abierto, la página de detrás no se mueve (scripts/modal.ts)
document.addEventListener(MODAL_EVENT, (event) => {
  if ((event as CustomEvent<ModalDetail>).detail.open) lenis?.stop();
  else lenis?.start();
});

// Las transiciones entre páginas mantienen el elemento <html> y esta instancia. Antes de
// astro:after-swap, Astro ya ha puesto el scroll donde toca (arriba, el de la historia al volver
// o el del ancla del enlace): Lenis se pone ahí sin animar, o seguiría hacia su destino de la
// página anterior y la página daría un salto.
document.addEventListener('astro:before-swap', (event) => {
  // Astro pone en <html> los atributos de la página nueva: sin esto se perderían las clases de
  // Lenis (lenis.css) hasta el siguiente scroll
  const lenisClasses = [...document.documentElement.classList].filter((name) =>
    name.startsWith('lenis'),
  );
  event.newDocument.documentElement.classList.add(...lenisClasses);
});

document.addEventListener('astro:after-swap', () => {
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
});
