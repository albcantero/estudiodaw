/**
 * @file Calendario de exámenes: agrupación por meses y fechas para mostrarlas, siempre en la hora
 * de Madrid (la de los exámenes), esté donde esté quien compila o quien mira.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { Exam } from '../data/exams';
import { syllabus, type Parcial } from '../data/syllabus';

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
  /** Hora: "De 15:00 h. a 16:30 h." */
  time: string;
}

/** Una unidad del temario, con su número (el de la UD oficial) */
export interface ExamUnit {
  n: number;
  title: string;
}

/** Unidades que entran en un examen */
export interface ExamUnits {
  /** Una a una, en los parciales y en el examen único */
  items: ExamUnit[];
  /** Resumen, en las convocatorias finales: "Unidades 1, 2, 3, 5 y 6: solo las no superadas en los parciales" */
  summary?: string;
}

/** Valores de Parcial que se examinan en el centro (el resto va a prácticas o no entra) */
const EXAMINED: Parcial[] = [1, 2, 'unico'];

const andList = new Intl.ListFormat('es-ES', { style: 'long', type: 'conjunction' });

/**
 * Primera letra en mayúscula: "diciembre de 2026" → "Diciembre de 2026".
 *
 * @param text Texto.
 * @returns El texto con la primera letra en mayúscula.
 */
const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * Agrupa los exámenes por mes, en orden. Dentro de un mismo momento va primero 1.º.
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

/** Día del mes de un instante en Madrid, para agrupar: "22" */
const dayKey = new Intl.DateTimeFormat('es-ES', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Agrupa por día los exámenes de un mes, en el orden en que vienen (ya ordenados por
 * groupExamsByMonth): cada día sale una vez, con sus exámenes debajo.
 *
 * @param exams Exámenes del mes, en orden.
 * @returns Los días, cada uno con sus exámenes.
 */
export function groupExamsByDay(exams: Exam[]): Exam[][] {
  const days = exams.reduce((acc, exam) => {
    const key = dayKey.format(new Date(exam.start));
    return acc.set(key, [...(acc.get(key) ?? []), exam]);
  }, new Map<string, Exam[]>());
  return [...days.values()];
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
    time: `De ${clock.format(start)} h. a ${clock.format(new Date(exam.end))} h.`,
  };
}

/**
 * Temas que entran en un examen, según el reparto del temario (data/syllabus.ts). En un parcial,
 * los de ese parcial; en un módulo sin parciales, todos los del examen único; en las finales, un
 * resumen, porque a la 1.ª convocatoria solo se va con lo no superado.
 *
 * @param exam Examen.
 * @returns Los temas, o undefined si el temario no tiene el reparto de ese examen.
 */
export function examUnits(exam: Exam): ExamUnits | undefined {
  const numbered = (syllabus[exam.subject] ?? []).map((unit, index) => ({ ...unit, n: index + 1 }));
  const examined = numbered.filter((unit) => unit.parcial && EXAMINED.includes(unit.parcial));
  if (examined.length === 0) return undefined;

  /**
   * Unidades listadas una a una, con su número.
   *
   * @param units Unidades que entran.
   * @returns Las unidades.
   */
  const items = (units: typeof examined): ExamUnits => ({
    items: units.map(({ n, title }) => ({ n, title })),
  });
  if (exam.kind === 1 || exam.kind === 2) {
    const own = examined.filter((unit) => unit.parcial === exam.kind);
    return own.length > 0 ? items(own) : undefined;
  }
  // Sin parciales, la 1.ª convocatoria es el examen único del módulo
  const singleExam = examined.every((unit) => unit.parcial === 'unico');
  if (singleExam && exam.kind === 'final-1') return items(examined);

  const numbers = andList.format(examined.map((unit) => String(unit.n)));
  return {
    items: [],
    summary:
      exam.kind === 'final-1'
        ? `Unidades ${numbers}: solo las no superadas en los parciales`
        : `Todas las unidades que se examinan: ${numbers}`,
  };
}
