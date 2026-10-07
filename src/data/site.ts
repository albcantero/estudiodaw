/**
 * @file Datos del sitio que se repiten en varias piezas de la interfaz.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Nombre del sitio (también su dominio) */
export const SITE_NAME = 'estudiodaw.dev';

/** Marca: el nombre del sitio sin el dominio (nombre accesible del logo) */
export const [SITE_BRAND] = SITE_NAME.split('.');

export const SITE_DESCRIPTION = 'Apuntes, ejercicios y soluciones de DAW, tema a tema.';

/** Presentación de la web bajo el logo del panel lateral */
export const SITE_TAGLINE =
  'Una colección de apuntes, ejercicios de código con soluciones y recursos para estudiar DAW, organizada por asignaturas y unidades.';

export const GITHUB_URL = 'https://github.com/albcantero/estudiodaw';

/** Autor de la web y de los apuntes (ficha técnica y derechos del pie) */
export const AUTHOR = 'Alberto Cantero';

/** Perfil del autor: su nombre enlaza aquí en el pie */
export const AUTHOR_URL = 'https://x.com/albcantero';

/**
 * Avatar de GitHub del autor, que se descarga al compilar. Es la dirección final:
 * github.com/albcantero.png redirige aquí y Astro no sigue redirecciones al descargar imágenes.
 * Va por el id de usuario, así que siempre es la foto actual.
 */
export const AUTHOR_AVATAR = 'https://avatars.githubusercontent.com/u/73531725';

/** Año de la primera publicación, para el aviso de derechos del pie (© año web) */
export const COPYRIGHT_YEAR = 2026;

/**
 * Licencia de los apuntes: se pueden copiar, compartir y adaptar citando al autor, sin uso
 * comercial y con la misma licencia. El código del repositorio va aparte.
 */
export const CONTENT_LICENSE = {
  name: 'CC BY-NC-SA 4.0',
  /** Sin la versión, para el pie */
  short: 'CC BY-NC-SA',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es',
};

/** Correo de contacto (aviso legal, privacidad y avisos de errores) */
export const CONTACT_EMAIL = 'alb.cantero@gmail.com';

/** Última revisión del aviso legal y de la política de privacidad (AAAA-MM-DD) */
export const LEGAL_UPDATED = '2026-10-04';

/** Ficheros para máquinas (buscadores y modelos de lenguaje), enlazados desde el pie */
export const MACHINE_LINKS = [
  { label: 'sitemap.xml', href: '/sitemap-index.xml' },
  { label: 'robots.txt', href: '/robots.txt' },
  { label: 'llms.txt', href: '/llms.txt' },
];

/** Páginas legales, enlazadas desde el pie */
export const LEGAL_LINKS = [
  { label: 'Aviso legal', href: '/aviso-legal' },
  { label: 'Privacidad', href: '/privacidad' },
];

/** Curso académico de la web (calendario de exámenes, aviso de la portada) */
export const ACADEMIC_YEAR = '2026-27';

/** Centro donde se cursa el ciclo y se hacen los exámenes */
export const CENTRE_NAME = 'CIFP de Ponferrada';

/** Web oficial del centro */
export const CENTRE_URL = 'https://cifpponferrada.centros.educa.jcyl.es';

/** Secciones de la web: barra superior (escritorio), barra de móvil y pie */
export const SECTION_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Exámenes', href: '/calendario' },
];

/**
 * Stack de la web en el pie del panel lateral: cada entrada es una pastilla con uno o varios
 * logos de Simple Icons y su descripción.
 */
export const STACK = [
  { icons: ['astro', 'typescript'], label: 'Desarrollado con Astro y TypeScript' },
  { icons: ['vite'], label: 'Compilado con Vite' },
  { icons: ['supabase'], label: 'Base de datos con PostgreSQL en Supabase' },
  { icons: ['resend'], label: 'Envío de correos con Resend' },
  { icons: ['vercel'], label: 'Desplegado en Vercel' },
];
