/**
 * @file Asignatura activa en la Navegación (NavGroup).
 *
 * El panel lateral persiste entre páginas y no se vuelve a renderizar, así que el enlace
 * activo (aria-current) se marca en el navegador según la URL, en cada cambio de página.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { firstSegment } from '../../lib/routes';

/** Marca con aria-current el enlace de la asignatura en la que se está. */
export function markActiveLink(): void {
  const current = firstSegment(window.location.pathname);
  document.querySelectorAll<HTMLAnchorElement>('[data-nav-group] a').forEach((link) => {
    const isActive = current !== '' && firstSegment(new URL(link.href).pathname) === current;
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
