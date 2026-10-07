/**
 * @file Rutas de la web: comparar la página actual con los enlaces de navegación. Lo usan el
 * servidor (al pintar las barras) y el navegador (enlace activo del panel lateral).
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * Ruta sin barra final, para comparar con los enlaces: "/guia/" → "/guia"; "/" se queda.
 *
 * @param pathname Ruta de una URL.
 * @returns La ruta sin barra final.
 */
export const normalizePath = (pathname: string): string => pathname.replace(/\/$/, '') || '/';

/**
 * Primer segmento de una ruta: "/bd/01-introduccion/teoria" → "bd"; "" en la portada.
 *
 * @param pathname Ruta de una URL.
 * @returns El primer segmento.
 */
export const firstSegment = (pathname: string): string => pathname.split('/')[1] ?? '';

/**
 * ¿Pertenece la ruta actual a una sección? Inicio solo en la portada; el resto, también en
 * sus subpáginas.
 *
 * @param path Ruta actual, normalizada (normalizePath).
 * @param href Enlace de la sección.
 * @returns Si la ruta es de la sección.
 */
export const isSectionActive = (path: string, href: string): boolean =>
  href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);
