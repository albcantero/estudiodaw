// Datos del sitio que se repiten en varias piezas de la interfaz.

export const GITHUB_URL = 'https://github.com/albcantero/estudiodaw';

/** Secciones de la barra superior (escritorio) y de la barra de móvil */
export const sectionLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Exámenes', href: '/calendario' },
  { label: 'Guía', href: '/guia' },
];

/** ¿La ruta actual pertenece a esta sección? `path` sin barra final. */
export const isSectionActive = (path: string, href: string) =>
  href === '/' ? path === '/' : path === href || path.startsWith(`${href}/`);

/** Ruta de la página sin barra final, para comparar con los enlaces */
export const normalizePath = (pathname: string) => pathname.replace(/\/$/, '') || '/';
