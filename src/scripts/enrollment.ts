/**
 * @file "Mi matrícula" (EnrollmentDialog): elegir de qué asignaturas se está matriculado.
 *
 * Se guarda en el navegador como una lista de ids. El filtro en sí es un estilo que pinta
 * inline/boot.js (oculta lo que lleva data-subject de una asignatura no marcada), también al
 * cambiar de página; aquí se abre el diálogo, se guarda la elección y se recalculan contadores
 * y colocación.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { STORAGE_KEYS } from '../data/storage';
import { readListPreference, writeListPreference } from './preferences';
import { refreshLists } from './visibility';

/**
 * Asignaturas marcadas.
 *
 * @returns Sus ids; vacío si no hay matrícula guardada.
 */
const readEnrollment = (): string[] => readListPreference(STORAGE_KEYS.enrollment);

/** Recalcula contadores y colocación y marca los botones de abrir (punto azul). */
function refreshEnrollment(): void {
  refreshLists();
  const active = readEnrollment().length > 0;
  document
    .querySelectorAll('[data-enrollment-open]')
    .forEach((button) => button.toggleAttribute('data-active', active));
}

/**
 * Aplica una matrícula recién cambiada (o una sesión recién iniciada o cerrada: la matrícula
 * solo vale con ella): el filtro, los contadores de la Navegación y el resto.
 */
export function applyEnrollment(): void {
  window.applyEnrollmentStyle?.();
  // Los contadores de la Navegación cuentan lo que se ve
  window.applyPins?.();
  refreshEnrollment();
}

/**
 * Abre el diálogo con las casillas como están guardadas. Se marcan los valores por defecto
 * (atributo checked) y se reinicia el formulario, así se descarta lo que se cambiara en una
 * apertura anterior que se canceló.
 *
 * @param dialog Diálogo de la matrícula.
 */
function openDialog(dialog: HTMLDialogElement): void {
  const enrolled = new Set(readEnrollment());
  dialog.querySelectorAll<HTMLInputElement>('input[name="module"]').forEach((input) => {
    input.toggleAttribute('checked', enrolled.has(input.value));
  });
  dialog.querySelector('form')?.reset();
  dialog.showModal();
}

/**
 * Guarda lo marcado, lo aplica y cierra el diálogo.
 *
 * @param dialog Diálogo de la matrícula.
 */
function confirmDialog(dialog: HTMLDialogElement): void {
  const checked = dialog.querySelectorAll<HTMLInputElement>('input[name="module"]:checked');
  // Sin ninguna marcada se borra la matrícula: se ve todo
  writeListPreference(
    STORAGE_KEYS.enrollment,
    [...checked].map((input) => input.value),
  );
  applyEnrollment();
  dialog.close();
}

/** Abre el diálogo de la matrícula desde fuera (el último paso del login: scripts/auth/dialog.ts) */
export function openEnrollment(): void {
  const dialog = document.querySelector<HTMLDialogElement>('[data-enrollment-dialog]');
  if (dialog) openDialog(dialog);
}

/** Dónde empezó la última pulsación: un clic en el fondo solo cierra si también empezó ahí */
let pressTarget: EventTarget | null = null;

document.addEventListener('pointerdown', (event) => {
  pressTarget = event.target;
});

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const dialog = document.querySelector<HTMLDialogElement>('[data-enrollment-dialog]');
  if (!dialog) return;

  // Fondo: fuera de la caja del diálogo, al pulsar y al soltar (arrastrar desde dentro, al
  // seleccionar texto, no lo cierra)
  const onBackdrop = target === dialog && pressTarget === dialog;
  if (target.closest('[data-enrollment-open]')) openDialog(dialog);
  else if (target.closest('[data-enrollment-confirm]')) confirmDialog(dialog);
  else if (target.closest('[data-enrollment-cancel]') || onBackdrop) dialog.close();
});

// Página nueva: el filtro y las fijadas ya los ha aplicado boot.js; falta lo de la página
document.addEventListener('astro:page-load', refreshEnrollment);
