// Transformer de Shiki: envuelve cada <pre> en <figure class="code-block"> con la etiqueta
// del lenguaje. Misma idea que en 100cosas.dev, sin iconos externos.
const LANGS = {
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

export function codeLangBadge() {
  return {
    name: 'code-lang-badge',
    root(node) {
      const lang = this.options.lang;
      if (!lang) return;

      const name = LANGS[lang];
      if (name === null) return;

      const preIndex = node.children.findIndex(
        (child) => child.type === 'element' && child.tagName === 'pre',
      );
      if (preIndex === -1) return;

      const pre = node.children[preIndex];
      // Barra de título con icono de fichero, como el data-rehype-pretty-code-title de chanhdai
      // Icono "code" de Tabler Icons
      const path = (d) => ({ type: 'element', tagName: 'path', properties: { d }, children: [] });
      const icon = {
        type: 'element',
        tagName: 'svg',
        properties: {
          viewBox: '0 0 24 24',
          width: 16,
          height: 16,
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true',
        },
        children: [path('M7 8l-4 4l4 4'), path('M17 8l4 4l-4 4'), path('M14 4l-4 16')],
      };
      const badge = {
        type: 'element',
        tagName: 'div',
        properties: { class: 'code-lang-badge' },
        children: [icon, { type: 'text', value: name ?? lang }],
      };
      const figure = {
        type: 'element',
        tagName: 'figure',
        properties: { class: 'code-block', 'data-language': lang },
        children: [badge, pre],
      };

      node.children.splice(preIndex, 1, figure);
    },
  };
}
