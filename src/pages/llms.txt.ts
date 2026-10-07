/**
 * @file llms.txt (llmstxt.org): la web resumida para los modelos de lenguaje, en Markdown. Un
 * título, un resumen, las páginas principales y, por asignatura, los documentos publicados
 * enlazados en su versión Markdown (/<asignatura>/<tema>/<tipo>.md), que un modelo lee mejor que el
 * HTML. Al final, los ficheros para máquinas.
 *
 * Se genera al compilar a partir del contenido: cada tema nuevo aparece solo.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CONTENT_LICENSE, SITE_DESCRIPTION, SITE_NAME } from '../data/site';
import { docsOfTema, getSubjects, temaNumber, type Doc, type Tema } from '../lib/content';

/**
 * Línea de la lista de un documento: "- [Tema 01. Título (teoría)](url): descripción". La
 * descripción del tema va solo en la teoría, para no repetirla en cada documento.
 *
 * @param tema Tema.
 * @param doc Documento.
 * @param site Dominio de la web.
 * @returns La línea del documento.
 */
function docLine(tema: Tema, doc: Doc, site: URL): string {
  const name = `Tema ${temaNumber(tema.data.number)}. ${tema.data.title} (${doc.data.title.toLowerCase()})`;
  const url = new URL(`${doc.id}.md`, site);
  const note = doc.data.kind === 'teoria' ? `: ${tema.data.description}` : '';
  return `- [${name}](${url})${note}`;
}

/**
 * Responde con el llms.txt.
 *
 * @param context Contexto de la ruta; site es el dominio de astro.config.ts.
 * @returns La respuesta con el fichero, en texto plano.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL(`https://${SITE_NAME}`);
  const [subjects, temas, docs] = await Promise.all([
    getSubjects(),
    getCollection('temas'),
    getCollection('docs'),
  ]);

  const sections = subjects.flatMap((subject) => {
    const lines = temas
      .filter((tema) => tema.data.subject === subject.id)
      .sort((a, b) => a.data.number - b.data.number)
      .flatMap((tema) =>
        docsOfTema(docs, subject.id, tema.data.slug).map((doc) => docLine(tema, doc, base)),
      );
    // Solo las asignaturas con algo publicado
    return lines.length > 0 ? [`## ${subject.data.name}`, '', ...lines, ''] : [];
  });

  const text = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_DESCRIPTION} Para el ciclo de FP de grado superior Desarrollo de Aplicaciones Web (DAW), escritos por un alumno mientras estudia. No es una web oficial.`,
    '',
    `Cada tema tiene teoría, ejercicios y soluciones, y todos están en Markdown en los enlaces de abajo. Los apuntes tienen licencia ${CONTENT_LICENSE.name} (${CONTENT_LICENSE.url}).`,
    '',
    '## Páginas',
    '',
    `- [Asignaturas](${base}): todas las asignaturas de 1.º y 2.º, con sus temas publicados.`,
    `- [Calendario de exámenes](${new URL('calendario', base)}): fechas de los parciales y finales; la referencia es siempre la plataforma oficial.`,
    `- [Aviso legal](${new URL('aviso-legal', base)}): titular, licencia y condiciones de uso.`,
    `- [Privacidad](${new URL('privacidad', base)}): qué datos se tratan (casi ninguno).`,
    '',
    ...sections,
    '## Para máquinas',
    '',
    `- [Sitemap](${new URL('sitemap-index.xml', base)}): todas las páginas públicas.`,
    `- [Robots](${new URL('robots.txt', base)}): reglas de rastreo; se puede rastrear todo.`,
    '',
  ].join('\n');

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
