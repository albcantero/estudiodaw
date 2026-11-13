/**
 * @file Descarga en Markdown de cada documento (/<asignatura>/<tema>/<tipo>.md): el fichero de
 * origen tal cual, sin añadirle nada.
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
  return docs.map((doc) => {
    const [subject, tema, kind] = doc.id.split('/');
    return { params: { subject, tema, doc: kind }, props: { markdown: doc.body ?? '' } };
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
