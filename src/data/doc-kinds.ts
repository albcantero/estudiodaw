/**
 * @file Tipos de documento de un tema, en el orden en que se leen.
 *
 * Va aparte de lib/content.ts porque también lo importa content.config.ts, que no puede
 * depender de astro:content.
 *
 * @author Alberto Cantero
 * @license MIT
 */
export const DOC_KINDS = ['teoria', 'ejercicios', 'soluciones'] as const;

export type DocKind = (typeof DOC_KINDS)[number];

/** Nombre de cada tipo de documento en la interfaz */
export const DOC_LABELS: Record<DocKind, string> = {
  teoria: 'Teoría',
  ejercicios: 'Ejercicios',
  soluciones: 'Soluciones',
};
