/**
 * @file Colecciones de contenido: asignaturas, temas y documentos. Astro valida cada entrada con su
 * esquema al compilar; un dato que no encaja para la build con un error claro. Los temas y los
 * documentos salen de la copia de los apuntes del DAW (lib/apuntes/loader.ts).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { isCourseYear, type CourseYear } from './data/courses';
import { DOC_KINDS } from './data/doc-kinds';
import { docsLoader, temasLoader } from './lib/apuntes/loader';
import type { RenderedTest } from './lib/tests/types';

/** Copia de los apuntes del DAW que llena `npm run sync` */
const APUNTES_ROOT = 'src/content/apuntes';

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

/**
 * Temas: uno por carpeta `tema N - Título` (o por número, en las asignaturas sin carpetas). Sus
 * documentos se buscan por asignatura y slug
 */
const temas = defineCollection({
  loader: temasLoader(APUNTES_ROOT),
  schema: z.object({
    subject: z.string(),
    slug: z.string(),
    number: z.number(),
    title: z.string(),
    /** Resumen del tema; hoy no se rellena (las fuentes no lo tienen) */
    description: z.string().optional(),
    /** UD del temario oficial que cubre ("UD1"…) */
    unit: z.string().optional(),
    /** Ficheros de "Mis soluciones" (en public/downloads) */
    downloads: z.array(z.object({ label: z.string(), file: z.string() })).default([]),
  }),
});

/** Documentos: cada fichero de un tema (id = <asignatura>/<tema>/<tipo>) */
const docs = defineCollection({
  loader: docsLoader(APUNTES_ROOT),
  schema: z.object({
    title: z.string(),
    kind: z.enum(DOC_KINDS),
    /** Solo en los tests: las preguntas, ya en HTML y con su clave de corrección */
    test: z.custom<RenderedTest>().optional(),
  }),
});

export const collections = { subjects, temas, docs };
