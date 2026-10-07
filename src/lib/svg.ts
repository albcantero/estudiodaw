/**
 * @file Lectura de SVG en el build, para pintarlos en línea (sin peticiones ni JavaScript) y que
 * tomen el color del texto. Lo usan Icon, BrandIcon y Logo, y el plugin de bloques de código.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Lee un SVG de un paquete de npm.
 *
 * @param specifier Ruta dentro de node_modules, p. ej. "@tabler/icons/outline/code.svg".
 * @returns El fichero tal cual.
 */
export const readPackageSvg = (specifier: string): string =>
  readFileSync(require.resolve(specifier), 'utf8');

/**
 * Contenido de un SVG sin la etiqueta <svg> que lo envuelve: el componente pone la suya, con
 * sus clases y atributos.
 *
 * @param source Fichero SVG completo.
 * @returns El contenido del SVG.
 */
export const svgInner = (source: string): string =>
  source
    .slice(source.indexOf('>', source.indexOf('<svg')) + 1, source.lastIndexOf('</svg>'))
    .trim();

/**
 * viewBox de un SVG.
 *
 * @param source Fichero SVG completo.
 * @param fallback El que se usa si no trae.
 * @returns El viewBox del SVG, o el de reserva.
 */
export const svgViewBox = (source: string, fallback = '0 0 24 24'): string =>
  source.match(/viewBox="([^"]+)"/)?.[1] ?? fallback;

/** SVG con ids pintados hasta ahora en el build, para que cada uno tenga los suyos */
let idInstances = 0;

/**
 * Hace únicos los ids de un SVG (y sus url(#…)) para pintarlo varias veces en una página: con
 * ids repetidos, url(#id) apunta siempre al primero, aunque esté oculto (el logo del panel en
 * móvil).
 *
 * @param inner Contenido del SVG.
 * @returns El contenido con los ids renombrados.
 */
export function uniqueSvgIds(inner: string): string {
  idInstances += 1;
  const suffix = `-${idInstances}`;
  return inner
    .replace(/\bid="([^"]+)"/g, (_, id: string) => `id="${id}${suffix}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${id}${suffix})`);
}
