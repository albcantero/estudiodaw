/**
 * @file Plugin de Shiki (el resaltador de código de Astro): envuelve cada bloque de código en
 * <figure class="code-block"> con una barra de título que dice el lenguaje, con el icono "code" de
 * Tabler delante. Los estilos están en styles/prose.css.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { ShikiTransformer } from 'shiki';
import type { Element } from 'hast';
import { readPackageSvg } from '../lib/svg';

/** Nombre de cada lenguaje en la barra; null para los que no llevan barra (texto plano) */
const LANGUAGE_NAMES: Record<string, string | null> = {
  xml: 'XML',
  xsl: 'XSLT',
  xslt: 'XSLT',
  xquery: 'XQuery',
  sql: 'SQL',
  plsql: 'PL/SQL',
  html: 'HTML',
  css: 'CSS',
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  php: 'PHP',
  json: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  java: 'Java',
  python: 'Python',
  py: 'Python',
  yaml: 'YAML',
  yml: 'YAML',
  dockerfile: 'Docker',
  nginx: 'Nginx',
  diff: 'Diff',
  plaintext: null,
  text: null,
  txt: null,
};

/**
 * Trazos del icono "code" de Tabler, leídos del paquete (sin el rectángulo de caja, que no
 * tiene trazo). Se leen una vez, al cargar el plugin.
 */
const CODE_ICON_PATHS = [
  ...readPackageSvg('@tabler/icons/outline/code.svg').matchAll(/<path d="([^"]+)"/g),
]
  .map((match) => match[1])
  .filter((d) => d !== 'M0 0h24v24H0z');

/**
 * Elemento HTML para el árbol de Shiki (formato hast).
 *
 * @param tagName Etiqueta.
 * @param properties Atributos.
 * @param children Hijos.
 * @returns El elemento.
 */
const element = (
  tagName: string,
  properties: Element['properties'],
  children: Element['children'] = [],
): Element => ({ type: 'element', tagName, properties, children });

/**
 * Icono "code" de Tabler, con el color del texto. Decorativo.
 *
 * @returns El icono, como elemento.
 */
const codeIcon = (): Element =>
  element(
    'svg',
    {
      viewBox: '0 0 24 24',
      width: '16',
      height: '16',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ariaHidden: 'true',
    },
    CODE_ICON_PATHS.map((d) => element('path', { d })),
  );

/**
 * Plugin para shikiConfig.transformers en astro.config.ts.
 *
 * @returns El transformador de Shiki.
 */
export function codeLangBadge(): ShikiTransformer {
  return {
    name: 'code-lang-badge',
    root(root) {
      const { lang } = this.options;
      const name = LANGUAGE_NAMES[lang];
      if (!lang || name === null) return;

      const preIndex = root.children.findIndex(
        (child) => child.type === 'element' && child.tagName === 'pre',
      );
      if (preIndex === -1) return;

      const titleBar = element('div', { className: ['code-lang-badge'] }, [
        codeIcon(),
        { type: 'text', value: name ?? lang },
      ]);
      const figure = element('figure', { className: ['code-block'], dataLanguage: lang }, [
        titleBar,
        root.children[preIndex] as Element,
      ]);
      root.children.splice(preIndex, 1, figure);
    },
  };
}
