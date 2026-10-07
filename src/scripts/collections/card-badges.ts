/**
 * @file Insignias de las tarjetas del tablero (Card): van por encima de la capa del enlace que
 * cubre la tarjeta, para que el ratón llegue a su tooltip. Un clic en una de ellas abre la tarjeta
 * igual que en cualquier otro punto, con las mismas teclas (Ctrl/⌘ para otra pestaña).
 *
 * @author Alberto Cantero
 * @license MIT
 */
document.addEventListener('click', (event) => {
  const badge = (event.target as Element).closest('[data-card] [data-tooltip]');
  const link = badge?.closest('[data-card]')?.querySelector<HTMLAnchorElement>('a[href]');
  if (!link) return;
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
    }),
  );
});
