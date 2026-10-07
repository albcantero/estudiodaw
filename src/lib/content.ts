/**
 * @file Consultas al contenido (asignaturas, temas y documentos) que usan varias páginas.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { COURSES, COURSE_YEARS, type Course, type CourseYear } from '../data/courses';
import { DOC_KINDS } from '../data/doc-kinds';

export type Subject = CollectionEntry<'subjects'>;
export type Tema = CollectionEntry<'temas'>;
export type Doc = CollectionEntry<'docs'>;

/** Un curso con sus asignaturas */
export type CourseWithSubjects = Course & { year: CourseYear; subjects: Subject[] };

/**
 * Número de tema a dos cifras: 1 → "01".
 *
 * @param n Número del tema.
 * @returns El número a dos cifras.
 */
export const temaNumber = (n: number): string => String(n).padStart(2, '0');

/**
 * Asignaturas en su orden del ciclo (campo `order`): el del panel lateral y el calendario.
 *
 * @returns Las asignaturas, ordenadas.
 */
export async function getSubjects(): Promise<Subject[]> {
  return (await getCollection('subjects')).sort((a, b) => a.data.order - b.data.order);
}

/**
 * Asignaturas agrupadas por curso, en su orden del ciclo.
 *
 * @returns Los cursos, cada uno con sus asignaturas.
 */
export async function getSubjectsByCourse(): Promise<CourseWithSubjects[]> {
  const subjects = await getSubjects();
  return COURSE_YEARS.map((year) => ({
    ...COURSES[year],
    year,
    subjects: subjects.filter((subject) => subject.data.year === year),
  }));
}

/**
 * Temas publicados de cada asignatura.
 *
 * @returns Mapa id de asignatura → número de temas publicados.
 */
export async function getTemaCounts(): Promise<Map<string, number>> {
  const temas = await getCollection('temas');
  return temas.reduce(
    (counts, tema) => counts.set(tema.data.subject, (counts.get(tema.data.subject) ?? 0) + 1),
    new Map<string, number>(),
  );
}

/**
 * Documentos de un tema, en orden de lectura (teoría, ejercicios, soluciones).
 *
 * @param docs Todos los documentos (colección docs).
 * @param subject Id de la asignatura.
 * @param slug Slug del tema.
 * @returns Los documentos del tema, ordenados.
 */
export function docsOfTema(docs: Doc[], subject: string, slug: string): Doc[] {
  return docs
    .filter((doc) => doc.id.startsWith(`${subject}/${slug}/`))
    .sort((a, b) => DOC_KINDS.indexOf(a.data.kind) - DOC_KINDS.indexOf(b.data.kind));
}
