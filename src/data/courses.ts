/**
 * @file Los dos cursos de DAW y cómo se nombran en cada sitio de la web. Las asignaturas de cada
 * curso salen de su campo `year` (ver getSubjectsByCourse en lib/content.ts).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { BadgeDot } from '../lib/badge';

/** Curso del ciclo */
export type CourseYear = 1 | 2;

/** Cursos en orden */
export const COURSE_YEARS: CourseYear[] = [1, 2];

export interface Course {
  /** Grupo de la Navegación y de "Agrupar por curso": "Primero" */
  name: string;
  /** Columna de "Mi matrícula": "Primer curso" */
  title: string;
  /** Texto corrido: "1º curso" */
  label: string;
  /** Filtro del calendario: "1º" */
  short: string;
  /** Color del punto de su badge */
  dot: BadgeDot;
}

export const COURSES: Record<CourseYear, Course> = {
  1: { name: 'Primero', title: 'Primer curso', label: '1º curso', short: '1º', dot: 'first' },
  2: { name: 'Segundo', title: 'Segundo curso', label: '2º curso', short: '2º', dot: 'second' },
};

/**
 * ¿Es un número de curso válido? (para validar datos de fuera, como el contenido)
 *
 * @param value Valor que se comprueba.
 * @returns Si es 1 o 2.
 */
export const isCourseYear = (value: unknown): value is CourseYear =>
  COURSE_YEARS.some((year) => year === value);
