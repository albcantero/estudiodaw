/**
 * @file Texto comparable para el buscador: en minúsculas y sin tildes, así "Diseño" casa con
 * "diseno". Lo usan el servidor (texto de cada elemento, en data-search) y el navegador (lo que
 * se escribe), para que los dos lados normalicen exactamente igual.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * Normaliza un texto para compararlo: en minúsculas y sin tildes.
 *
 * @param text Texto original.
 * @returns El texto normalizado.
 */
export const normalizeSearch = (text: string): string =>
  text
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
