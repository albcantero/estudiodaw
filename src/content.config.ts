import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Asignaturas: un JSON por asignatura (id = nombre del fichero).
const subjects = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/subjects' }),
  schema: z.object({
    name: z.string(),
    short: z.string(),
    description: z.string(),
    order: z.number(),
    color: z.string(),
  }),
});

// Temas: un JSON por tema. Los documentos se buscan por subject/slug.
const temas = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/temas' }),
  schema: z.object({
    subject: z.string(),
    slug: z.string(),
    number: z.number(),
    title: z.string(),
    description: z.string(),
    unit: z.string().optional(),
    downloads: z
      .array(z.object({ label: z.string(), file: z.string() }))
      .default([]),
  }),
});

// Documentos: markdown en docs/<subject>/<slug>/<kind>.md
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['teoria', 'ejercicios', 'soluciones']),
  }),
});

export const collections = { subjects, temas, docs };
