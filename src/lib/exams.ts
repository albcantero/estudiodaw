/**
 * @file Calendario de exámenes: agrupación por meses y fechas para mostrarlas, siempre en la hora
 * de Madrid (la de los exámenes), esté donde esté quien compila o quien mira.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { Exam } from '../data/exams';

const TIME_ZONE = 'Europe/Madrid';

const monthKey = new Intl.DateTimeFormat('es-ES', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
});
const monthName = new Intl.DateTimeFormat('es-ES', {
  timeZone: TIME_ZONE,
  month: 'long',
  year: 'numeric',
});
const dayOfMonth = new Intl.DateTimeFormat('es-ES', { timeZone: TIME_ZONE, day: 'numeric' });
const weekday = new Intl.DateTimeFormat('es-ES', { timeZone: TIME_ZONE, weekday: 'short' });
const clock = new Intl.DateTimeFormat('es-ES', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
});

/** Exámenes de un mes */
export interface ExamMonth {
  /** "Diciembre de 2026" */
  title: string;
  exams: Exam[];
}

/** Partes de la fecha de un examen, ya formateadas */
export interface ExamDate {
  /** Día del mes: "3" */
  day: string;
  /** Día de la semana abreviado, sin punto: "jue" */
  weekday: string;
  /** Hora: "15:00–16:30" */
  time: string;
}

/**
 * Primera letra en mayúscula: "diciembre de 2026" → "Diciembre de 2026".
 *
 * @param text Texto.
 * @returns El texto con la primera letra en mayúscula.
 */
const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Agrupa los exámenes por mes, en orden. Dentro de un mismo momento va primero 1º.
 *
 * @param exams Exámenes, en cualquier orden.
 * @returns Los meses, cada uno con sus exámenes.
 */
export function groupExamsByMonth(exams: Exam[]): ExamMonth[] {
  const sorted = [...exams].sort((a, b) => a.start.localeCompare(b.start) || a.course - b.course);
  const months = sorted.reduce((acc, exam) => {
    const date = new Date(exam.start);
    const key = monthKey.format(date);
    const month = acc.get(key) ?? { title: capitalize(monthName.format(date)), exams: [] };
    return acc.set(key, { ...month, exams: [...month.exams, exam] });
  }, new Map<string, ExamMonth>());
  return [...months.values()];
}

/**
 * Fecha de un examen para mostrarla.
 *
 * @param exam Examen.
 * @returns El día, el mes y las horas, ya escritos.
 */
export function examDate(exam: Exam): ExamDate {
  const start = new Date(exam.start);
  return {
    day: dayOfMonth.format(start),
    weekday: weekday.format(start).replace('.', ''),
    time: `${clock.format(start)}–${clock.format(new Date(exam.end))}`,
  };
}
