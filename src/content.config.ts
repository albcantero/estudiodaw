/**
 * @file Colecciones de contenido: asignaturas, temas y documentos. Astro valida cada fichero con su
 * esquema al compilar; un dato que no encaja para la build con un error claro.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { isCourseYear, type CourseYear } from './data/courses';
import { DOC_KINDS } from './data/doc-kinds';

/** Asignaturas: un JSON por asignatura (id = nombre del fichero) */
const subjects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/subjects' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    /** Posición en la Navegación y en "Mi matrícula" */
    order: z.number(),
    /** Curso: 1 o 2 */
    year: z.custom<CourseYear>(isCourseYear, { message: 'year tiene que ser un curso: 1 o 2' }),
    /** Color propio de la asignatura (punto del calendario) */
    color: z.string(),
    /** Icono de Tabler Icons para la Navegación (nombre, p. ej. "database") */
    icon: z.string(),
  }),
});

/** Temas: un JSON por tema. Sus documentos se buscan por asignatura y slug */
const temas = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/temas' }),
  schema: z.object({
    subject: z.string(),
    slug: z.string(),
    number: z.number(),
    title: z.string(),
    description: z.string(),
    /** UD del temario oficial que cubre ("UD1"…) */
    unit: z.string().optional(),
    /** Ficheros de "Mis soluciones" (en public/downloads) */
    downloads: z.array(z.object({ label: z.string(), file: z.string() })).default([]),
  }),
});

/** Documentos: Markdown en docs/<asignatura>/<tema>/<tipo>.md */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(DOC_KINDS),
  }),
});

export const collections = { subjects, temas, docs };
