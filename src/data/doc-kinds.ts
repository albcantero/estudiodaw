// Tipos de documento de un tema, en el orden en que se leen. Aparte de content.ts porque
// lo importa content.config.ts, que no puede depender de astro:content.
export const DOC_KINDS = ['teoria', 'ejercicios', 'soluciones'] as const;
export type DocKind = (typeof DOC_KINDS)[number];

export const DOC_LABELS: Record<DocKind, string> = {
  teoria: 'Teoría',
  ejercicios: 'Ejercicios',
  soluciones: 'Soluciones',
};
