import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Sirve el markdown original de cada documento para descargarlo.
export async function getStaticPaths() {
  const docs = await getCollection('docs');
  const temas = await getCollection('temas');

  return docs.map((doc) => {
    const [subject, tema, kind] = doc.id.split('/');
    const temaEntry = temas.find((t) => t.data.subject === subject && t.data.slug === tema);
    const heading = temaEntry ? `${temaEntry.data.title}: ${doc.data.title.toLowerCase()}` : doc.data.title;
    return {
      params: { subject, tema, doc: kind },
      props: { markdown: `# ${heading}\n\n${doc.body ?? ''}` },
    };
  });
}

export const GET: APIRoute = ({ props }) =>
  new Response(props.markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
