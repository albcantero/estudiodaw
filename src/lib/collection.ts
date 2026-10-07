/**
 * @file Modelo de una colección (asignaturas de la portada, temas de una asignatura) y lo que
 * comparten sus dos vistas, CollectionGrid y CollectionList.
 *
 * Cada dato de un elemento está una sola vez; cada vista decide qué enseña y dónde. Las
 * propiedades (insignias) salen todas en la lista y, en la tarjeta del tablero, arriba o abajo
 * según su `place`. "Mostrar propiedades" oculta las que tienen `field`.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { BadgeData } from './badge';
import { normalizeSearch } from './search';

/** Propiedad de un elemento: una insignia y su sitio en la tarjeta */
export interface CollectionProperty extends BadgeData {
  place: 'header' | 'footer';
}

export interface CollectionItem {
  /** Sin href: elemento pendiente, se muestra sin enlace */
  href?: string;
  /** Número a dos cifras (los temas) */
  number?: string;
  title: string;
  description?: string;
  properties: CollectionProperty[];
  /** Texto al pie de la tarjeta, además de sus propiedades (p. ej. los documentos del tema) */
  note?: string;
  /** Id del módulo: lo filtra "Mi matrícula" */
  subject?: string;
  /** Grupo para "Agrupar por curso" (p. ej. "Primero") */
  group?: string;
}

/** Columnas de la lista, además del título (que va siempre) */
export interface CollectionColumns {
  /** El número del elemento (los temas) */
  number?: boolean;
  /** Las propiedades */
  properties?: boolean;
}

/**
 * Texto en el que busca el buscador, ya normalizado: título, descripción, nota y propiedades.
 * Van todas, también las que oculte "Mostrar propiedades" o la vista (la nota solo sale en el
 * tablero): así "primero" encuentra las asignaturas de primero aunque no se vea el curso.
 *
 * @param item Elemento de la colección.
 * @returns El texto normalizado.
 */
const searchText = (item: CollectionItem): string =>
  normalizeSearch(
    [item.title, item.description, item.note, ...item.properties.map(({ text }) => text)]
      .filter(Boolean)
      .join(' '),
  );

/**
 * Grupos de la colección: en el orden dado o, si no, en el que aparecen.
 *
 * @param items Elementos.
 * @param order Orden de los grupos.
 * @returns Los nombres de los grupos, en orden.
 */
export const groupsOf = (items: CollectionItem[], order?: string[]): string[] =>
  order ?? [...new Set(items.map((item) => item.group).filter((group) => group !== undefined))];

/**
 * Número de elementos de cada grupo.
 *
 * @param items Elementos.
 * @returns Mapa grupo → número de elementos.
 */
export const countByGroup = (items: CollectionItem[]): Map<string, number> =>
  items.reduce(
    (counts, { group }) => (group ? counts.set(group, (counts.get(group) ?? 0) + 1) : counts),
    new Map<string, number>(),
  );

/** Posición de entrada (--i de .rise) de la primera fila: justo después de las herramientas */
const FIRST_ROW_RISE = 3;
/** Separación entre filas al entrar, en pasos de --stagger: más juntas que los bloques */
const ROW_RISE_STEP = 0.3;
/** Filas que entran una tras otra; las siguientes, a la vez que la última */
const RISING_ROWS = 8;

/**
 * Posición de entrada de una fila o tarjeta (--i de .rise, layout.css).
 *
 * @param index Su posición original.
 * @returns El valor de --i.
 */
export const riseIndex = (index: number): number =>
  FIRST_ROW_RISE + Math.min(index, RISING_ROWS) * ROW_RISE_STEP;

/**
 * Atributos de un elemento, iguales en la tarjeta y en la fila: su posición de entrada (--i)
 * y los que leen el buscador
 * (data-search), "Mi matrícula" (data-subject) y la colocación
 * (scripts/inline/collection-layout.js: data-index, data-group).
 *
 * @param item Elemento.
 * @param index Su posición original.
 * @returns Los atributos, para esparcirlos en la etiqueta.
 */
export const itemAttributes = (item: CollectionItem, index: number) => ({
  style: `--i: ${riseIndex(index)}`,
  'data-index': index,
  'data-search': searchText(item),
  'data-subject': item.subject,
  'data-group': item.group,
});
