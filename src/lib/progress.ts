/**
 * @file Badge de progreso de una asignatura: temas publicados frente a las UD del temario oficial.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { BadgeData } from './badge';

/** Porcentajes que tienen icono en Tabler (percentage-0 … percentage-100) */
const PERCENT_ICONS = [0, 10, 20, 25, 30, 33, 40, 50, 60, 66, 70, 75, 80, 90, 100];

/**
 * Icono de Tabler más cercano a un porcentaje: 2/8 → percentage-25, 2/6 → percentage-33.
 *
 * @param part Parte hecha.
 * @param total Total.
 * @returns El nombre del icono.
 */
function percentIcon(part: number, total: number): string {
  const percent = (part / total) * 100;
  const nearest = PERCENT_ICONS.reduce((best, candidate) =>
    Math.abs(candidate - percent) < Math.abs(best - percent) ? candidate : best,
  );
  return `percentage-${nearest}`;
}

/**
 * Insignia de progreso: "2/8 temas publicados". Sin total (sin temario oficial, como el TFG, o
 * con el temario aún sin cargar) dice "Sin planificar todavía" o "N temas", y su tooltip explica
 * cuál de los dos casos es.
 *
 * @param published Temas publicados.
 * @param units UD del temario oficial: 0 si no tiene, undefined si aún no está cargado.
 * @returns La insignia: texto, icono y tooltip.
 */
export function progressBadge(published: number, units: number | undefined): BadgeData {
  if (!units) {
    const text =
      published === 0
        ? 'Sin planificar todavía'
        : `${published} ${published === 1 ? 'tema' : 'temas'}`;
    const tooltip =
      units === 0 ? 'No tiene temario oficial' : 'Sus temas aún no están planificados';
    return { text, icon: 'circle-dashed', tooltip };
  }
  return {
    text: `${published}/${units} temas publicados`,
    icon: percentIcon(published, units),
    // En azul, el progreso; sin total (el círculo discontinuo), se queda en gris
    iconTone: 'brand',
    tooltip: `Publicados ${published} de los ${units} temas del temario oficial`,
  };
}
