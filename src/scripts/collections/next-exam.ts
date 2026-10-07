/**
 * @file Insignias del próximo examen de cada asignatura (Badge con nextExam): su fecha ("18 ene") y
 * lo que falta, el cronómetro ("Quedan 15 días y 4 horas", "En curso"). Llegan del build con los
 * exámenes de la asignatura (data-exams) y escondidas; aquí se elige el próximo según la hora
 * actual, se escribe el texto y se enseñan. Sin exámenes pendientes, se quedan escondidas.
 *
 * Se recalculan al cargar cada página, cada minuto y al volver a la pestaña.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { nextExam, type ExamTime } from '../../lib/exam-time';

const HOUR_MS = 60 * 60 * 1000;

/** Cada cuánto se recalcula el cronómetro: cambia de hora en hora, pero sin quedarse atrás */
const REFRESH_MS = 60 * 1000;

/** Fecha corta en Madrid: "18 ene" */
const shortDate = new Intl.DateTimeFormat('es-ES', {
  timeZone: 'Europe/Madrid',
  day: 'numeric',
  month: 'short',
});

/**
 * Una cantidad con su palabra, en singular o en plural: "1 día", "3 horas".
 *
 * @param count Cantidad.
 * @param one Palabra en singular.
 * @param other Palabra en plural.
 * @returns La cantidad con su palabra.
 */
const counted = (count: number, one: string, other: string): string =>
  `${count} ${count === 1 ? one : other}`;

/**
 * Texto del cronómetro: días y horas que faltan, sin contar las que no llegan a una entera.
 *
 * @param now Instante actual.
 * @param exam Próximo examen.
 * @returns El texto del cronómetro.
 */
function countdownText(now: number, exam: ExamTime): string {
  const start = Date.parse(exam.start);
  if (now >= start) return 'En curso';
  const hoursLeft = Math.floor((start - now) / HOUR_MS);
  if (hoursLeft === 0) return 'Queda menos de una hora';
  const days = Math.floor(hoursLeft / 24);
  const hours = hoursLeft % 24;
  const parts = [
    days > 0 && counted(days, 'día', 'días'),
    hours > 0 && counted(hours, 'hora', 'horas'),
  ].filter((part): part is string => Boolean(part));
  // "Queda 1 día", pero "Quedan 2 días" y "Quedan 1 día y 3 horas"
  const verb =
    parts.length === 1 && (days === 1 || (days === 0 && hours === 1)) ? 'Queda' : 'Quedan';
  return `${verb} ${parts.join(' y ')}`;
}

/**
 * Exámenes de una insignia; ninguno si el dato no vale.
 *
 * @param badge Insignia ([data-next-exam]).
 * @returns Los exámenes de la insignia.
 */
function examsOf(badge: HTMLElement): ExamTime[] {
  try {
    const exams: unknown = JSON.parse(badge.dataset.exams ?? '[]');
    return Array.isArray(exams) ? (exams as ExamTime[]) : [];
  } catch {
    return [];
  }
}

/** Escribe y enseña las insignias del próximo examen. */
function refreshNextExams(): void {
  const now = Date.now();
  document.querySelectorAll<HTMLElement>('[data-next-exam]').forEach((badge) => {
    const exam = nextExam(examsOf(badge), now);
    badge.toggleAttribute('hidden', !exam);
    if (!exam) return;
    const text =
      badge.dataset.nextExam === 'date'
        ? shortDate.format(Date.parse(exam.start)).replace('.', '')
        : countdownText(now, exam);
    const label = badge.querySelector('[data-badge-text]');
    if (label && label.textContent !== text) label.replaceChildren(text);
  });
}

document.addEventListener('astro:page-load', refreshNextExams);
window.setInterval(() => {
  if (document.visibilityState === 'visible') refreshNextExams();
}, REFRESH_MS);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') refreshNextExams();
});
