/**
 * @file La grúa de la obra (assets/iso/construction.svg): baja la tarjeta colgada del cable y, una
 * vez abajo, la deja meciéndose un pelín sobre su hueco. Sin la bajada, solo se mece desde el
 * principio, ya colgada en su sitio. Pasado de crane-load.js (la carpeta de la ilustración) a las
 * capas de la web (data-layer).
 *
 * El cable crece desde arriba (el carro) mientras la carga baja lo mismo, así siempre cuelga de
 * él. Su largo en el SVG lo trae la capa (data-length).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { FlipControl } from './flip-pages';

/** Lo que baja la carga, en px del SVG */
const DROP = 70;
/** Lo que tarda en bajar y su curva */
const LOWER_MS = 1500;
const LOWER_EASE = 'cubic-bezier(.3, .7, .2, 1)';
/** El vaivén de después: lo que baja de más y lo que dura */
const SWAY_PX = 5;
const SWAY_MS = 2600;

/**
 * Baja la carga de la grúa y la mece.
 *
 * @param layers Capas de la ilustración, por su nombre.
 * @param delay Cuándo empieza, en ms.
 * @param lower Con la bajada (de serie, sí); sin ella, solo el vaivén.
 * @returns Su mando.
 */
export function lowerLoad(layers: Map<string, Element>, delay: number, lower = true): FlipControl {
  const cable = layers.get('cable') as SVGGElement | undefined;
  const load = layers.get('load') as SVGGElement | undefined;
  if (!cable || !load) return { stop: () => {}, pause: () => {}, resume: () => {} };

  const length = Number(cable.dataset.length);
  cable.style.transformBox = 'fill-box';
  cable.style.transformOrigin = '50% 0%';
  /**
   * El cable estirado (o encogido) dy px
   *
   * @param dy Lo que se alarga, en px; negativo, lo que se encoge.
   * @returns La transformación CSS.
   */
  const stretch = (dy: number): string => `scaleY(${((length + dy) / length).toFixed(4)})`;

  const lowering = { duration: LOWER_MS, delay, easing: LOWER_EASE, fill: 'both' } as const;
  const sway = {
    duration: SWAY_MS,
    delay: lower ? delay + LOWER_MS : delay,
    iterations: Infinity,
    easing: 'ease-in-out',
  } as const;
  const animations = [
    ...(lower
      ? [
          cable.animate(
            [
              { opacity: 0, transform: stretch(-DROP) },
              { opacity: 1, offset: 0.1 },
              { opacity: 1, transform: stretch(0) },
            ],
            lowering,
          ),
          load.animate(
            [
              { opacity: 0, transform: `translateY(${-DROP}px)` },
              { opacity: 1, offset: 0.1 },
              { opacity: 1, transform: 'none' },
            ],
            lowering,
          ),
        ]
      : []),
    cable.animate(
      [{ transform: stretch(0) }, { transform: stretch(SWAY_PX) }, { transform: stretch(0) }],
      sway,
    ),
    load.animate(
      [{ transform: 'none' }, { transform: `translateY(${SWAY_PX}px)` }, { transform: 'none' }],
      sway,
    ),
  ];

  return {
    stop: () => {
      animations.forEach((animation) => animation.cancel());
      cable.style.removeProperty('transform-box');
      cable.style.removeProperty('transform-origin');
    },
    pause: () =>
      animations.forEach((animation) => {
        if (animation.playState === 'running') animation.pause();
      }),
    resume: () =>
      animations.forEach((animation) => {
        if (animation.playState === 'paused') animation.play();
      }),
  };
}
