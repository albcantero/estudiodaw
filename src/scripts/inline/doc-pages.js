/**
 * @file Lector paginado de los documentos: una página por cada <h2>.
 *
 * Script clásico: la página del documento lo mete en línea detrás del contenido, así desde el
 * primer pintado solo se ve la página que toca. Los enlaces al documento anterior y siguiente
 * del tema llegan en los data-* de la propia etiqueta <script>. Deja el control del lector en
 * window.docPager; los eventos (botones, flechas, enlaces internos) están en
 * scripts/doc-pager.ts. Sin JavaScript, el documento se lee entero.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/**
 * @typedef {{ title: string, nodes: ChildNode[] }} Page
 * @typedef {{ prevDoc?: string, prevDocLabel?: string, nextDoc?: string, nextDocLabel?: string }} SiblingDocs
 */

/**
 * ¿Es un nodo de texto vacío (saltos de línea entre bloques)?
 *
 * @param {ChildNode} node Nodo del documento.
 * @returns {boolean} Si es un texto vacío.
 */
const isBlank = (node) => node.nodeType === Node.TEXT_NODE && !node.textContent?.trim();

/**
 * Reparte el contenido en páginas: una por <h2> con todo lo que tiene debajo; lo anterior al
 * primer <h2> forma su propia página ("Introducción"). Los <hr> que separaban apartados
 * sobran: ahora separa el cambio de página.
 *
 * @param {HTMLElement} content Contenido del documento.
 * @returns {Page[]} Páginas con contenido.
 */
function splitIntoPages(content) {
  /** @type {Page[]} */
  const pages = [...content.childNodes].reduce((acc, node) => {
    if (node.nodeName === 'H2' || acc.length === 0) {
      const title = node.nodeName === 'H2' ? (node.textContent ?? '').trim() : 'Introducción';
      acc.push({ title, nodes: [] });
    }
    if (node.nodeName !== 'HR') acc[acc.length - 1].nodes.push(node);
    return acc;
  }, /** @type {Page[]} */ ([]));
  return pages.filter((page) => page.nodes.some((node) => !isBlank(node)));
}

/**
 * Envuelve cada página en <section class="doc-section">.
 *
 * @param {Page} page Página.
 * @returns {HTMLElement} La sección con el contenido de la página.
 */
function toSection(page) {
  const section = document.createElement('section');
  section.className = 'doc-section';
  section.setAttribute('data-title', page.title);
  section.append(...page.nodes);
  return section;
}

/**
 * Prepara el lector del documento abierto.
 *
 * @param {SiblingDocs} siblings Documentos anterior y siguiente del tema.
 */
function setupDocPages(siblings) {
  const content = document.getElementById('doc-content');
  const pager = document.getElementById('doc-pager');
  if (!content || !pager) return;

  const pages = splitIntoPages(content);
  // Con una sola página no hay lector: el documento se queda tal cual
  if (pages.length < 2) return;

  const sections = pages.map(toSection);
  content.replaceChildren(...sections);
  const count = sections.length;
  let current = 0;

  /**
   * Ancla de una página: el id de su título.
   *
   * @param {number} index Número de página.
   * @returns {string} El id del título, o vacío si la página no tiene.
   */
  const hashOf = (index) => sections[index].querySelector('h2')?.id ?? '';

  /**
   * Prepara un botón: a otra página del documento, a otro documento del tema o, si no hay
   * adónde ir, oculto.
   *
   * @param {HTMLElement | null} button Botón, si está en la página.
   * @param {number | null} page Página de destino.
   * @param {string | undefined} docHref Documento de destino, si no hay página.
   * @param {string | undefined} docLabel Su nombre.
   */
  const setButton = (button, page, docHref, docLabel) => {
    if (!button) return;
    const label = button.querySelector('[data-pager-title]');
    button.toggleAttribute('hidden', page === null && !docHref);
    if (page !== null) {
      button.setAttribute('data-target', String(page));
      button.removeAttribute('data-href');
      label?.replaceChildren(sections[page].dataset.title ?? '');
    } else if (docHref) {
      button.removeAttribute('data-target');
      button.setAttribute('data-href', docHref);
      label?.replaceChildren(docLabel ?? '');
    }
  };

  /**
   * Muestra una página y actualiza la barra de progreso y los botones.
   *
   * @param {number} index Página pedida (se ajusta al rango válido).
   * @returns {number} Página mostrada.
   */
  const show = (index) => {
    current = Math.max(0, Math.min(count - 1, index));
    sections.forEach((section, i) => section.toggleAttribute('hidden', i !== current));
    pager.querySelector('[data-pager-index]')?.replaceChildren(String(current + 1));
    pager.querySelector('[data-pager-count]')?.replaceChildren(String(count));
    pager
      .querySelector('[data-pager-progress]')
      ?.style.setProperty('width', `${((current + 1) / count) * 100}%`);
    setButton(
      pager.querySelector('[data-pager="prev"]'),
      current > 0 ? current - 1 : null,
      siblings.prevDoc,
      siblings.prevDocLabel,
    );
    setButton(
      pager.querySelector('[data-pager="next"]'),
      current < count - 1 ? current + 1 : null,
      siblings.nextDoc,
      siblings.nextDocLabel,
    );
    return current;
  };

  /**
   * Página que contiene un elemento.
   *
   * @param {string} id Id del elemento.
   * @returns {number} Su página; -1 si no está en el documento.
   */
  const indexOfId = (id) => {
    const element = id ? document.getElementById(id) : null;
    return element ? sections.findIndex((section) => section.contains(element)) : -1;
  };

  window.docPager = { show, indexOfId, hashOf, current: () => current, count };
  content.setAttribute('data-paged', '');
  pager.removeAttribute('hidden');
  const fromHash = indexOfId(decodeURIComponent(window.location.hash.slice(1)));
  show(fromHash < 0 ? 0 : fromHash);
}

setupDocPages(document.currentScript?.dataset ?? {});
