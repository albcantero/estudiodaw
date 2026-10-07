/**
 * @file Descarga en Markdown de cada documento (/<asignatura>/<tema>/<tipo>.md): el texto original,
 * con el título del tema y del documento como encabezado.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Un fichero por documento
 *
 * @returns Las rutas, con el texto de cada documento.
 */
export async function getStaticPaths() {
  const docs = await getCollection('docs');
  const temas = await getCollection('temas');

  return docs.map((doc) => {
    const [subject, tema, kind] = doc.id.split('/');
    const temaEntry = temas.find(
      (entry) => entry.data.subject === subject && entry.data.slug === tema,
    );
    const heading = temaEntry
      ? `${temaEntry.data.title}: ${doc.data.title.toLowerCase()}`
      : doc.data.title;
    return {
      params: { subject, tema, doc: kind },
      props: { markdown: `# ${heading}\n\n${doc.body ?? ''}` },
    };
  });
}

/**
 * Responde con el Markdown del documento.
 *
 * @param context Contexto de la ruta; sus props traen el texto.
 * @returns La respuesta con el Markdown.
 */
export const GET: APIRoute = ({ props }) =>
  new Response(props.markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
