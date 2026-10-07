/**
 * @file Eventos del lector paginado de los documentos: botones Anterior / Siguiente, flechas del
 * teclado y enlaces internos (índice, referencias), que abren la página donde está su destino.
 *
 * Las páginas las prepara inline/doc-pages.js antes del primer pintado y deja su control en
 * window.docPager. Este módulo se ejecuta una sola vez y escucha en el documento.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { navigate } from 'astro:transitions/client';
import { isShortcutEvent } from './keyboard';

/**
 * Cambia la URL sin añadir una entrada al historial (cambiar de página no es navegar).
 *
 * @param hash Ancla de la página ("" para la primera).
 */
function replaceHash(hash: string): void {
  const { history, location } = window;
  history.replaceState(history.state, '', `${location.pathname}${hash}`);
}

/**
 * Sube hasta el principio del contenido. Queda por debajo de la barra fija gracias a su
 * scroll-margin-top (base.css), el mismo que usan las anclas.
 */
function scrollToContent(): void {
  document.getElementById('doc-content')?.scrollIntoView({ behavior: 'instant', block: 'start' });
}

/**
 * Muestra una página del documento.
 *
 * @param pager Control del lector.
 * @param index Página (desde 0).
 */
function goToPage(pager: DocPager, index: number): void {
  const shown = pager.show(index);
  replaceHash(shown === 0 ? '' : `#${pager.hashOf(shown)}`);
  scrollToContent();
}

/**
 * Abre la página que contiene el destino de un enlace interno y baja hasta él.
 *
 * @param pager Control del lector.
 * @param link Enlace con href="#…".
 * @returns Si el destino estaba en el documento (y se ha gestionado aquí).
 */
function followInternalLink(pager: DocPager, link: HTMLAnchorElement): boolean {
  const id = decodeURIComponent(link.hash.slice(1));
  const index = pager.indexOfId(id);
  if (index < 0) return false;
  pager.show(index);
  replaceHash(`#${id}`);
  document.getElementById(id)?.scrollIntoView();
  return true;
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const { docPager } = window;

  const button = target.closest<HTMLButtonElement>('[data-pager]');
  if (button) {
    // Al final del documento, el botón lleva al documento anterior o siguiente del tema
    if (button.dataset.href) navigate(button.dataset.href);
    else if (docPager && button.dataset.target) goToPage(docPager, Number(button.dataset.target));
    return;
  }

  const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (link && docPager && followInternalLink(docPager, link)) event.preventDefault();
});

document.addEventListener('keydown', (event) => {
  const { docPager } = window;
  if (!docPager || !isShortcutEvent(event)) return;
  const current = docPager.current();
  if (event.key === 'ArrowRight' && current < docPager.count - 1) goToPage(docPager, current + 1);
  if (event.key === 'ArrowLeft' && current > 0) goToPage(docPager, current - 1);
});

// Al salir de la página del documento, su lector deja de existir
document.addEventListener('astro:before-swap', () => {
  window.docPager = undefined;
});
