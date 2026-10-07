/**
 * @file Comportamiento de los grupos de la Navegación (NavGroup): abrir y cerrar con animación,
 * enlace activo y raíles con gancho.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { markActiveLink } from './active-link';
import { setupHookRails } from './hook-rails';
import './collapse';

// Primero el enlace activo y luego los raíles: al navegar, el gancho viaja a la nueva
// asignatura
document.addEventListener('astro:page-load', () => {
  markActiveLink();
  setupHookRails();
});
