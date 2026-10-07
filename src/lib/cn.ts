/**
 * @file Une clases de Tailwind y resuelve los choques: si dos clases tocan la misma propiedad (px-2
 * y px-2.5), gana la última. Así un componente puede tener sus clases de serie y dejar que quien lo
 * usa las cambie.
 *
 * tailwind-merge no conoce los tokens propios: se le dice que text-ui y text-2xs son tamaños
 * de letra (no colores) y que gutter, inset, surface, page, bar y sidebar son medidas.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { extendTailwindMerge } from 'tailwind-merge';

const merge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['ui', '2xs'],
      spacing: ['gutter', 'inset', 'surface', 'page', 'bar', 'sidebar'],
    },
  },
});

/**
 * Junta clases, ignora las vacías y resuelve los choques.
 *
 * @param classes Clases o valores falsos (para clases condicionales: `activo && 'x'`).
 * @returns Una sola cadena de clases.
 */
export const cn = (...classes: (string | false | null | undefined)[]): string =>
  merge(classes.filter(Boolean).join(' '));
