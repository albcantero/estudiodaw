/**
 * @file "Mostrar propiedades" de las colecciones (CollectionSettings): enseña u oculta cada
 * propiedad de los elementos (el curso, los temas publicados, el próximo examen, el cronómetro).
 *
 * Se guarda la lista de propiedades ocultas; sin nada guardado, valen las de serie
 * (DEFAULT_HIDDEN_FIELDS y, agrupado por curso, también el curso). El ocultado lo hace el CSS con html[data-hide], que aplica
 * window.applyHiddenFields (inline/boot.js), el mismo código que antes del primer pintado. Aquí
 * se cambia la lista y se ponen en su estado las pastillas, el punto del botón y la franja de
 * restaurar.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { DEFAULT_HIDDEN_FIELDS, STORAGE_KEYS } from '../../data/storage';
import {
  readListPreference,
  readPreference,
  removePreference,
  writePreference,
} from '../preferences';

/**
 * Propiedades ocultas de serie: DEFAULT_HIDDEN_FIELDS y, agrupado por curso, también el curso
 * (ya lo dice la fila de cada curso). Lo mismo que aplica inline/boot.js.
 *
 * @returns Las claves de las propiedades ocultas de serie.
 */
const defaultHidden = (): string[] =>
  document.documentElement.dataset.group === 'course'
    ? [...DEFAULT_HIDDEN_FIELDS, 'course']
    : [...DEFAULT_HIDDEN_FIELDS];

/**
 * Propiedades ocultas ahora mismo.
 *
 * @returns Sus claves (BadgeField): las guardadas o, sin nada guardado, las de serie.
 */
const readHidden = (): string[] =>
  readPreference(STORAGE_KEYS.hiddenFields) === null
    ? defaultHidden()
    : readListPreference(STORAGE_KEYS.hiddenFields);

/**
 * ¿Es lo elegido distinto de lo de serie?
 *
 * @param hidden Propiedades ocultas.
 * @returns Si es distinto.
 */
const differsFromDefault = (hidden: string[]): boolean => {
  const defaults = defaultHidden();
  return hidden.length !== defaults.length || hidden.some((field) => !defaults.includes(field));
};

/** Pone las pastillas, el punto del botón y la franja de restaurar en el estado guardado. */
function refresh(): void {
  const hidden = readHidden();
  const changed = differsFromDefault(hidden);
  document.querySelectorAll<HTMLElement>('[data-show-field]').forEach((pill) => {
    pill.setAttribute('aria-pressed', String(!hidden.includes(pill.dataset.showField ?? '')));
  });
  // Cada desplegable con pastillas: si lo elegido no es lo de serie, su botón lleva el punto de
  // marca (ver ui/Dropdown) y la tarjeta, la franja de restaurar, que solo entonces se alcanza
  document
    .querySelectorAll<HTMLElement>('[data-dropdown]:has([data-show-field])')
    .forEach((panel) => {
      panel.toggleAttribute('data-changed', changed);
      document
        .querySelector(`[data-dropdown-trigger][popovertarget="${panel.id}"]`)
        ?.toggleAttribute('data-changed', changed);
      panel.querySelector('[data-reset-band]')?.toggleAttribute('inert', !changed);
    });
}

/**
 * Enseña u oculta una propiedad.
 *
 * @param field Su clave (BadgeField).
 */
function toggleField(field: string): void {
  const hidden = readHidden();
  const next = hidden.includes(field) ? hidden.filter((f) => f !== field) : [...hidden, field];
  // Siempre como lista, también vacía (se enseña todo): sin nada guardado volverían las de serie
  writePreference(STORAGE_KEYS.hiddenFields, JSON.stringify(next));
  window.applyHiddenFields?.();
  refresh();
}

/**
 * Al agrupar o desagrupar, el curso pasa a lo de serie de la nueva agrupación: oculto agrupado,
 * visible sin agrupar. Si hay propiedades elegidas, solo se toca el curso; el resto se respeta.
 */
export function syncCourseField(): void {
  if (readPreference(STORAGE_KEYS.hiddenFields) !== null) {
    const grouped = document.documentElement.dataset.group === 'course';
    const others = readHidden().filter((field) => field !== 'course');
    writePreference(
      STORAGE_KEYS.hiddenFields,
      JSON.stringify(grouped ? [...others, 'course'] : others),
    );
  }
  window.applyHiddenFields?.();
  refresh();
}

/** Vuelve a lo de serie: se borra lo guardado. */
function resetFields(): void {
  removePreference(STORAGE_KEYS.hiddenFields);
  window.applyHiddenFields?.();
  refresh();
}

document.addEventListener('click', (event) => {
  if ((event.target as HTMLElement).closest('[data-reset-fields]')) {
    resetFields();
    return;
  }
  const field = (event.target as HTMLElement).closest<HTMLElement>('[data-show-field]')?.dataset
    .showField;
  if (field) toggleField(field);
});

document.addEventListener('astro:page-load', refresh);
