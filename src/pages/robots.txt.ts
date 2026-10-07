/**
 * @file robots.txt: todo se puede rastrear, y el mapa del sitio está en sitemap-index.xml (lo
 * genera la integración de sitemap de Astro). Así lo encuentran los buscadores sin darlo de alta.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { APIRoute } from 'astro';

/**
 * Responde con el robots.txt.
 *
 * @param context Contexto de la ruta; site es el dominio de astro.config.ts.
 * @returns La respuesta con el fichero, en texto plano.
 */
export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${new URL('sitemap-index.xml', site)}`, ''].join(
      '\n',
    ),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
