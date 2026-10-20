/**
 * @file Calendario de exámenes (pages/calendario.astro): cuenta atrás de cada examen, filtro por
 * curso (se recuerda en el navegador), buscador y descarga en .ics de lo que se ve. El filtro y el
 * buscador se combinan: un examen se ve si es del curso elegido y contiene todas las palabras
 * escritas (sin tildes ni mayúsculas, con el texto que trae preparado en data-search).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { COURSE_YEARS } from '../data/courses';
import { ACADEMIC_YEAR, CENTRE_NAME } from '../data/site';
import { STORAGE_KEYS } from '../data/storage';
import { daysUntil } from '../lib/exam-time';
import { buildIcs } from '../lib/ics';
import { normalizeSearch } from '../lib/search';
import { highlightPanel } from './collections/highlight';
import { readPreference, writePreference } from './preferences';
import { selectSegment } from './segmented';
import { isShown, refreshLists } from './visibility';

/** Nombre del control segmentado del filtro (data-segmented) */
const FILTER = 'exam-course';

/** Valores del filtro: todos o cada curso */
const COURSE_FILTERS = ['all', ...COURSE_YEARS.map(String)];

/**
 * Filas de examen de la página
 *
 * @returns Las filas de examen.
 */
const examRows = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>('[data-exam]')];

/**
 * Texto de la cuenta atrás de un examen, por días naturales en Madrid (lib/exam-time.ts).
 *
 * @param now Instante actual.
 * @param start Inicio del examen.
 * @param end Fin del examen.
 * @returns El texto: "Hecho", "En curso", "Hoy", "Mañana" o los días que faltan.
 */
function countdown(now: number, start: number, end: number): string {
  if (now >= end) return 'Hecho';
  if (now >= start) return 'En curso';
  const days = daysUntil(now, start);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  return `${days} días`;
}

/** Actualiza la cuenta atrás y atenúa los exámenes ya pasados. */
function refreshCountdowns(): void {
  const now = Date.now();
  examRows().forEach((row) => {
    const start = Date.parse(row.dataset.start ?? '');
    const end = Date.parse(row.dataset.end ?? '');
    row.toggleAttribute('data-past', now >= end);
    row.querySelector('[data-exam-countdown]')?.replaceChildren(countdown(now, start, end));
  });
}

/**
 * Curso guardado en el filtro. Un valor que ya no existe (de una versión anterior) vuelve a
 * "todos".
 *
 * @returns El curso: "all", "1" o "2".
 */
function readCourseFilter(): string {
  const course = readPreference(STORAGE_KEYS.examCourse) ?? 'all';
  return COURSE_FILTERS.includes(course) ? course : 'all';
}

/** Curso elegido en el filtro */
let currentCourse = 'all';

/**
 * Palabras escritas en el buscador, ya normalizadas.
 *
 * @returns Las palabras; ninguna si está vacío.
 */
function searchWords(): string[] {
  const query = document.querySelector<HTMLInputElement>('[data-exam-search]')?.value ?? '';
  return normalizeSearch(query).split(/\s+/).filter(Boolean);
}

/**
 * Deja a la vista los exámenes del curso elegido que contienen lo buscado, resalta lo que
 * coincide y recalcula los meses y días que se quedan vacíos.
 */
function applyFilters(): void {
  const words = searchWords();
  examRows().forEach((row) => {
    const text = row.dataset.search ?? '';
    const inCourse = currentCourse === 'all' || row.dataset.course === currentCourse;
    row.toggleAttribute('hidden', !inCourse || !words.every((word) => text.includes(word)));
  });
  document.querySelectorAll<HTMLElement>('[data-panel]').forEach((panel) => {
    highlightPanel(panel, words);
  });
  refreshLists();
}

/**
 * Elige un curso en el filtro y lo marca.
 *
 * @param course "all", "1" o "2".
 * @param instant Marcarlo sin animar (al cargar la página).
 */
function applyCourseFilter(course: string, instant = false): void {
  currentCourse = course;
  selectSegment(FILTER, course, instant);
  applyFilters();
}

/**
 * Descarga un fichero en el navegador. El enlace temporal se libera en la siguiente vuelta:
 * hacerlo justo después del clic puede cancelar la descarga en algunos navegadores.
 *
 * @param blob Contenido.
 * @param fileName Nombre del fichero.
 */
function downloadBlob(blob: Blob, fileName: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}

/** Descarga un .ics con los exámenes a la vista (filtro y matrícula) que aún no han pasado. */
function downloadIcs(): void {
  const now = Date.now();
  const events = examRows()
    .filter((row) => isShown(row) && Date.parse(row.dataset.end ?? '') > now)
    .map(({ dataset }) => ({
      uid: `${dataset.subject}-${dataset.start}`,
      title: `Examen: ${dataset.title} (${dataset.label})`,
      description: `DAW a distancia, ${CENTRE_NAME}. ${dataset.label}.`,
      start: dataset.start ?? '',
      end: dataset.end ?? '',
    }));
  const calendar = buildIcs(events, `Exámenes DAW ${ACADEMIC_YEAR}`);
  downloadBlob(
    new Blob([calendar], { type: 'text/calendar;charset=utf-8' }),
    `examenes-daw-${ACADEMIC_YEAR}.ics`,
  );
}

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const option = target.closest<HTMLElement>(`[data-segmented="${FILTER}"] [data-segment]`);
  if (option) {
    const course = option.dataset.segment ?? 'all';
    writePreference(STORAGE_KEYS.examCourse, course);
    applyCourseFilter(course);
  } else if (target.closest('[data-exam-ics]')) {
    downloadIcs();
  } else if (target.closest('[data-exam-clear]')) {
    // Borrar la búsqueda: vacía el buscador, vuelve a filtrar y le devuelve el foco
    const input = document.querySelector<HTMLInputElement>('[data-exam-search]');
    if (!input) return;
    input.value = '';
    applyFilters();
    input.focus();
  }
});

document.addEventListener('input', (event) => {
  if ((event.target as HTMLElement).matches('[data-exam-search]')) applyFilters();
});

document.addEventListener('astro:page-load', () => {
  if (examRows().length === 0) return;
  refreshCountdowns();
  applyCourseFilter(readCourseFilter(), true);
});

// Con la página abierta de un día para otro, la cuenta sigue al día. Un solo intervalo para
// toda la sesión: el módulo se ejecuta una vez aunque se navegue.
setInterval(refreshCountdowns, 60_000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refreshCountdowns();
});
