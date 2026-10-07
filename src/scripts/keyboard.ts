/**
 * @file Atajos de teclado: cuándo una tecla es un atajo y no texto que se escribe.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Campos donde las teclas escriben o mueven el cursor, y diálogos abiertos */
const TYPING_TARGETS = 'input, textarea, select, dialog[open]';

/**
 * ¿Debe tratarse esta pulsación como atajo? No, si se mantiene pulsada (se repetiría), si va
 * con Ctrl, Alt o Cmd (son atajos del navegador) o si se está escribiendo en un campo.
 *
 * @param event Evento de teclado.
 * @returns Si es un atajo.
 */
export function isShortcutEvent(event: KeyboardEvent): boolean {
  if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return false;
  const target = event.target as HTMLElement;
  // isContentEditable cubre todas las formas de contenteditable ("", "true", "plaintext-only")
  return !target.isContentEditable && !target.closest(TYPING_TARGETS);
}
