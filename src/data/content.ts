// Consultas y formatos del contenido que se repetían en varias páginas.
import { getCollection, type CollectionEntry } from 'astro:content';
import { DOC_KINDS } from './doc-kinds';

export { DOC_KINDS, DOC_LABELS, type DocKind } from './doc-kinds';

/** Número de tema a dos cifras: 1 → "01" */
export const temaNumber = (n: number) => String(n).padStart(2, '0');

/** Asignaturas en el orden de la web */
export async function getSubjects() {
  return (await getCollection('subjects')).sort((a, b) => a.data.order - b.data.order);
}

/** Temas publicados por asignatura */
export async function getTemaCounts() {
  const counts = new Map<string, number>();
  for (const t of await getCollection('temas')) counts.set(t.data.subject, (counts.get(t.data.subject) ?? 0) + 1);
  return counts;
}

/** Documentos de un tema, en orden de lectura */
export function docsOfTema(docs: CollectionEntry<'docs'>[], subject: string, slug: string) {
  return docs
    .filter((d) => d.id.startsWith(`${subject}/${slug}/`))
    .sort((a, b) => DOC_KINDS.indexOf(a.data.kind) - DOC_KINDS.indexOf(b.data.kind));
}
