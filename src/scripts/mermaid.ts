/**
 * @file Diagramas Mermaid de los apuntes. Astro deja cada bloque como <pre><code
 * class="language-mermaid"> (astro.config.ts los excluye de Shiki); aquí se sustituyen por el SVG
 * que dibuja Mermaid, con el tema claro u oscuro de la web.
 *
 * Mermaid pesa mucho: solo se importa (import dinámico) si la página tiene algún bloque. El
 * código original queda en data-mermaid-code para volver a dibujar al cambiar el tema (se observa
 * la clase `dark` de <html>). Si un diagrama falla, su código sigue a la vista.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Bloques de código Mermaid tal como los emite Astro. */
const SOURCE_SELECTOR = 'pre > code.language-mermaid';

/** Contenedor de un diagrama: guarda el código y, tras dibujarlo, el SVG junto al <pre>. */
const DIAGRAM_SELECTOR = '[data-mermaid-code]';

/** Ancho del contenedor fuera de pantalla: evita que los diagramas anchos salgan comprimidos. */
const OFFSCREEN_WIDTH = 800;

type MermaidApi = typeof import('mermaid').default;

let mermaidPromise: Promise<MermaidApi> | undefined;
let observing = false;
let themeInUse: string | undefined;
let queue: Promise<void> = Promise.resolve();
let counter = 0;

/**
 * Tema actual de la web.
 *
 * @returns Si el tema actual de la web es el oscuro.
 */
function isDark(): boolean {
  return document.documentElement.classList.contains('dark');
}

/**
 * Carga Mermaid una sola vez.
 *
 * @returns La API de Mermaid.
 */
function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= import('mermaid').then((module) => module.default);
  return mermaidPromise;
}

/**
 * Ajusta el SVG al ancho del texto: sin width/height fijos, pero sin pasar de su tamaño natural.
 *
 * @param svg SVG recién dibujado.
 */
function fitSvg(svg: SVGSVGElement): void {
  const natural = parseFloat(svg.getAttribute('width') ?? '') || undefined;
  if (!svg.getAttribute('viewBox')) return;
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('style', `width:100%;height:auto;${natural ? `max-width:${natural}px` : ''}`);
}

/**
 * Dibuja un diagrama en su contenedor. Si falla, deja el código a la vista.
 *
 * @param mermaid API de Mermaid, ya inicializada con el tema.
 * @param host Contenedor con el código en data-mermaid-code.
 */
async function drawDiagram(mermaid: MermaidApi, host: HTMLElement): Promise<void> {
  const source = host.querySelector('pre');
  const offscreen = document.createElement('div');
  offscreen.style.cssText = `position:absolute;left:-9999px;top:-9999px;visibility:hidden;width:${OFFSCREEN_WIDTH}px`;
  document.body.append(offscreen);
  counter += 1;
  try {
    const { svg } = await mermaid.render(
      `mermaid-${counter}`,
      host.dataset.mermaidCode ?? '',
      offscreen,
    );
    host.querySelector('[data-mermaid-svg]')?.remove();
    const figure = document.createElement('div');
    figure.dataset.mermaidSvg = '';
    figure.className = 'my-6 flex justify-center overflow-x-auto';
    figure.innerHTML = svg;
    const drawn = figure.querySelector('svg');
    if (drawn) fitSvg(drawn);
    host.append(figure);
    if (source) source.hidden = true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[Mermaid]', error);
    host.querySelector('[data-mermaid-svg]')?.remove();
    if (source) source.hidden = false;
  } finally {
    offscreen.remove();
  }
}

/**
 * Dibuja todos los diagramas de una raíz, de uno en uno (Mermaid no admite renders a la vez).
 *
 * @param root Raíz donde buscar los contenedores.
 * @returns Promesa que se cumple al terminar de dibujar.
 */
function drawAll(root: ParentNode): Promise<void> {
  queue = queue.then(async () => {
    const hosts = [...root.querySelectorAll<HTMLElement>(DIAGRAM_SELECTOR)];
    if (hosts.length === 0) return;
    const mermaid = await loadMermaid();
    const theme = isDark() ? 'dark' : 'neutral';
    mermaid.initialize({
      startOnLoad: false,
      theme,
      fontFamily: getComputedStyle(document.body).fontFamily,
    });
    themeInUse = theme;
    await hosts.reduce(
      (previous, host) => previous.then(() => drawDiagram(mermaid, host)),
      Promise.resolve(),
    );
  });
  return queue;
}

/** Vuelve a dibujar todo el documento cuando cambia la clase `dark` de <html>. */
function watchTheme(): void {
  if (observing) return;
  observing = true;
  new MutationObserver(() => {
    if (themeInUse !== (isDark() ? 'dark' : 'neutral')) drawAll(document);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

/**
 * Sustituye los bloques Mermaid de una raíz por sus diagramas. Se puede llamar varias veces
 * sobre la misma raíz: los bloques ya preparados no se duplican.
 *
 * @param root Raíz donde buscar los bloques.
 */
export async function renderDiagrams(root: ParentNode): Promise<void> {
  const codes = root.querySelectorAll<HTMLElement>(SOURCE_SELECTOR);
  if (codes.length === 0) return;
  codes.forEach((code) => {
    const pre = code.parentElement as HTMLElement;
    const host = document.createElement('div');
    host.dataset.mermaidCode = (code.textContent ?? '').trim();
    pre.replaceWith(host);
    host.append(pre);
  });
  watchTheme();
  await drawAll(root);
}
