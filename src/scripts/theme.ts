/**
 * @file Tema claro / oscuro: botón ThemeToggle y atajo de teclado "D".
 *
 * Los módulos de Astro se ejecutan una sola vez aunque se navegue con ClientRouter y aunque
 * haya varios botones en la página, así que se escucha en el documento y no en cada botón.
 * El tema guardado lo aplica inline/boot.js antes del primer pintado. El color-scheme de los
 * controles nativos lo pone el CSS (.dark en tokens.css).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { STORAGE_KEYS } from '../data/storage';
import { isShortcutEvent } from './keyboard';
import { writePreference } from './preferences';

/** Cambia al tema contrario y lo guarda. */
function toggleTheme(): void {
  const dark = document.documentElement.classList.toggle('dark');
  writePreference(STORAGE_KEYS.theme, dark ? 'dark' : 'light');
}

document.addEventListener('click', (event) => {
  if ((event.target as HTMLElement).closest('[data-theme-toggle]')) toggleTheme();
});

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'd' && isShortcutEvent(event)) toggleTheme();
});
