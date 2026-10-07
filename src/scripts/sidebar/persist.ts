/**
 * @file Entrada del panel lateral (Sidebar) solo la primera vez en toda la visita.
 *
 * El panel persiste entre páginas (transition:persist): Astro mueve el mismo nodo al <body>
 * nuevo y el navegador reinicia sus animaciones CSS, así que la entrada escalonada (.rise) se
 * repetiría en cada navegación. Y al volver de una página de lectura (sin panel) llega un panel
 * nuevo, que también la repetiría. Una vez vista, cada panel que llega se marca antes de
 * pintarse (astro:after-swap); layout.css anula la entrada con data-sidebar-entered.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Ya se ha visto la entrada */
let entered = false;

document.addEventListener('astro:page-load', () => {
  if (document.querySelector('[data-sidebar-panel]')) entered = true;
});

document.addEventListener('astro:after-swap', () => {
  if (entered) {
    document.querySelector('[data-sidebar-panel]')?.setAttribute('data-sidebar-entered', '');
  }
});
