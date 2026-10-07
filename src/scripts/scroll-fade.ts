/**
 * @file Degradados en los bordes de una zona con scroll: avisan de que hay más contenido por ese
 * lado. Los llevan el panel lateral, "Mi matrícula" y los bloques de código.
 *
 * La opacidad de cada degradado sigue la distancia recorrida desde su borde, de 0 a 1, en vez
 * de saltar de golpe: llega a 1 justo cuando queda oculto un degradado entero de contenido.
 * Se escribe como variable CSS en el envoltorio ([data-scroll-fade]), que pinta los
 * degradados con ::before y ::after (styles/scroll.css): no hay que tocar el DOM en cada
 * fotograma.
 *
 * El envoltorio dice el eje ("y" o "x") y su zona con scroll es [data-scroll-fade-content]. Los
 * tamaños de los degradados se leen al preparar la zona y al cambiar de tamaño, no en cada
 * scroll; las escrituras van una vez por fotograma.
 *
 * El fundido fijo del pie de la ventana ([data-page-fade], en la plantilla) sigue la misma
 * cuenta con la página: se apaga al acercarse al final, donde ya no queda nada que difuminar.
 * Se recalcula al hacer scroll y cuando la página cambia de alto (filtrar, desplegar).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { clamp, cssNumber, oncePerFrame } from './dom';

/** Una zona preparada: su contenido, los tamaños de sus degradados y su actualización */
interface FadeZone {
  content: HTMLElement;
  startSize: number;
  endSize: number;
  update: () => void;
}

/** Zonas preparadas, por envoltorio (el panel persiste entre páginas: no se repiten) */
const zones = new Map<HTMLElement, FadeZone>();

/**
 * Proporción entre 0 y 1.
 *
 * @param value Valor.
 * @param max Valor con el que se llega a 1.
 * @returns La proporción, entre 0 y 1.
 */
const ratio = (value: number, max: number): number => clamp(value / max, 0, 1);

/**
 * Escribe la opacidad de los dos degradados según lo recorrido desde cada borde.
 *
 * @param wrapper Envoltorio ([data-scroll-fade]).
 * @param zone Su zona.
 */
function paintFades(wrapper: HTMLElement, zone: FadeZone): void {
  const { content } = zone;
  const horizontal = wrapper.dataset.scrollFade === 'x';
  const fromStart = horizontal ? content.scrollLeft : content.scrollTop;
  const fromEnd = horizontal
    ? content.scrollWidth - content.scrollLeft - content.clientWidth
    : content.scrollHeight - content.scrollTop - content.clientHeight;
  wrapper.style.setProperty('--scroll-fade-start', ratio(fromStart, zone.startSize).toFixed(3));
  wrapper.style.setProperty('--scroll-fade-end', ratio(fromEnd, zone.endSize).toFixed(3));
}

/**
 * Lee los tamaños de los degradados de una zona (cambian con el tamaño de la pantalla).
 *
 * @param wrapper Envoltorio.
 * @param zone Su zona.
 */
function measureSizes(wrapper: HTMLElement, zone: FadeZone): void {
  Object.assign(zone, {
    startSize: cssNumber(wrapper, '--scroll-fade-start-size', 1),
    endSize: cssNumber(wrapper, '--scroll-fade-end-size', 1),
  });
}

/** Un solo observador para todas las zonas: al cambiar de tamaño la zona o lo de dentro */
const resizes = new ResizeObserver((entries) => {
  const touched = new Set<HTMLElement>();
  entries.forEach(({ target }) => {
    const wrapper = target.closest<HTMLElement>('[data-scroll-fade]');
    if (wrapper && zones.has(wrapper)) touched.add(wrapper);
  });
  touched.forEach((wrapper) => {
    const zone = zones.get(wrapper);
    if (!zone) return;
    measureSizes(wrapper, zone);
    zone.update();
  });
});

/**
 * Prepara un envoltorio: recalcula al hacer scroll y al cambiar de tamaño la zona o lo de
 * dentro (abrir o cerrar un grupo del panel).
 *
 * @param wrapper Envoltorio ([data-scroll-fade]).
 */
function setupScrollFade(wrapper: HTMLElement): void {
  const content = wrapper.querySelector<HTMLElement>('[data-scroll-fade-content]');
  if (!content) return;
  const zone: FadeZone = { content, startSize: 1, endSize: 1, update: () => {} };
  zone.update = oncePerFrame(() => paintFades(wrapper, zone));
  zones.set(wrapper, zone);
  measureSizes(wrapper, zone);

  content.addEventListener('scroll', zone.update, { passive: true });
  resizes.observe(content);
  [...content.children].forEach((child) => resizes.observe(child));
  zone.update();
}

/** Suelta las zonas que han salido de la página al navegar (sus bloques de código, p. ej.). */
function releaseDetached(): void {
  zones.forEach((zone, wrapper) => {
    if (wrapper.isConnected) return;
    resizes.unobserve(zone.content);
    [...zone.content.children].forEach((child) => resizes.unobserve(child));
    zones.delete(wrapper);
  });
}

/**
 * Opacidad del fundido fijo del pie de la ventana: 1 mientras queda página por debajo y 0 al
 * llegar al final. Empieza a apagarse cuando lo que queda es menos que su propia altura.
 */
const updatePageFade = oncePerFrame(() => {
  const fade = document.querySelector<HTMLElement>('[data-page-fade]');
  if (!fade) return;
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  const fromEnd = scrollHeight - scrollTop - clientHeight;
  fade.style.setProperty('opacity', ratio(fromEnd, fade.offsetHeight || 1).toFixed(3));
});

window.addEventListener('scroll', updatePageFade, { passive: true });
window.addEventListener('resize', updatePageFade);
// La página cambia de alto sin scroll (filtrar la matrícula, desplegar algo)
new ResizeObserver(updatePageFade).observe(document.body);

document.addEventListener('astro:page-load', () => {
  releaseDetached();
  updatePageFade();
  document.querySelectorAll<HTMLElement>('[data-scroll-fade]').forEach((wrapper) => {
    if (!zones.has(wrapper)) setupScrollFade(wrapper);
  });
});
