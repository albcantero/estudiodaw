/**
 * @file Plugin de Shiki: envuelve el <pre> de cada bloque de código en <div class="code-scroll"
 * data-scroll-fade="x">, para los degradados a los lados cuando el código es más ancho que la caja
 * (scripts/scroll-fade.ts). Tienen que ir en un envoltorio y no en el propio <pre>: dentro de la
 * zona con scroll se desplazarían con el código.
 *
 * Va después de code-lang-badge en astro.config.ts: el <pre> puede estar ya dentro de su
 * <figure>, así que se busca en todo el árbol.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { ShikiTransformer } from 'shiki';
import type { Element, ElementContent, Root } from 'hast';

/**
 * Envuelve el primer <pre> que haya entre los hijos de un nodo, o más abajo.
 *
 * @param parent Nodo en el que buscar.
 * @returns Si lo ha encontrado.
 */
function wrapPre(parent: Root | Element): boolean {
  const index = parent.children.findIndex(
    (child) => child.type === 'element' && child.tagName === 'pre',
  );
  if (index === -1) {
    return parent.children.some((child) => child.type === 'element' && wrapPre(child));
  }

  const pre = parent.children[index] as Element;
  pre.properties.dataScrollFadeContent = '';
  const wrapper: ElementContent = {
    type: 'element',
    tagName: 'div',
    properties: { className: ['code-scroll'], dataScrollFade: 'x' },
    children: [pre],
  };
  parent.children.splice(index, 1, wrapper);
  return true;
}

/**
 * Plugin para shikiConfig.transformers en astro.config.ts.
 *
 * @returns El transformador de Shiki.
 */
export function codeScrollFade(): ShikiTransformer {
  return {
    name: 'code-scroll-fade',
    root(root) {
      wrapPre(root);
    },
  };
}
