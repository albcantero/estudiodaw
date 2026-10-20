/**
 * @file Calendario oficial de exámenes del curso (presentación del centro). El ciclo es DAW a
 * distancia, pero los exámenes son presenciales.
 *
 * Cada módulo se copia como una fila de las tablas del PDF: 1.º parcial, 2.º parcial, final de
 * 1.ª convocatoria y final de 2.ª. Las horas son peninsulares (Europe/Madrid).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { CourseYear } from './courses';
import { PARCIAL_LABELS } from './syllabus';

/** Qué examen es: un parcial o una de las dos convocatorias finales */
export type ExamKind = 1 | 2 | 'final-1' | 'final-2';

export interface Exam {
  /** Id de la asignatura (colección subjects) */
  subject: string;
  course: CourseYear;
  kind: ExamKind;
  /** "1.º parcial", "Final, 2.ª convocatoria"… */
  label: string;
  /** Inicio, en ISO 8601 con el desfase de Madrid */
  start: string;
  /** Fin, en ISO 8601 con el desfase de Madrid */
  end: string;
}

/** [fecha, hora de inicio, hora de fin]; null donde el PDF pone "---" */
type Slot = [date: string, from: string, to: string] | null;

/** Las cuatro columnas de las tablas del PDF, en orden */
const COLUMNS: { kind: ExamKind; label: string }[] = [
  { kind: 1, label: PARCIAL_LABELS[1] },
  { kind: 2, label: PARCIAL_LABELS[2] },
  { kind: 'final-1', label: 'Final, 1.ª convocatoria' },
  { kind: 'final-2', label: 'Final, 2.ª convocatoria' },
];

/** Da el desfase de Madrid de un instante ("GMT+01:00" en invierno, "GMT+02:00" en verano) */
const madridOffset = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Madrid',
  timeZoneName: 'longOffset',
});

/**
 * Fecha y hora de Madrid en ISO 8601, con su desfase. El desfase sale de las reglas de
 * horario de verano del propio sistema, no de una tabla de meses a mano.
 *
 * @param date Fecha, AAAA-MM-DD.
 * @param hour Hora, HH:MM.
 * @returns La fecha en ISO 8601, con el desfase de Madrid ese día.
 */
function madridIso(date: string, hour: string): string {
  const zone = madridOffset
    .formatToParts(new Date(`${date}T${hour}:00Z`))
    .find((part) => part.type === 'timeZoneName')?.value;
  const offset = zone?.replace('GMT', '') || '+00:00';
  return `${date}T${hour}:00${offset}`;
}

/**
 * Exámenes de un módulo: una fila de las tablas del PDF.
 *
 * @param subject Id de la asignatura.
 * @param course Curso al que pertenece.
 * @param slots Las cuatro columnas de la fila.
 * @returns Los exámenes de la fila; las columnas vacías no dan ninguno.
 */
function row(subject: string, course: CourseYear, slots: [Slot, Slot, Slot, Slot]): Exam[] {
  return slots.flatMap((slot, column) => {
    if (!slot) return [];
    const [date, from, to] = slot;
    return [
      {
        subject,
        course,
        ...COLUMNS[column],
        start: madridIso(date, from),
        end: madridIso(date, to),
      },
    ];
  });
}

export const exams: Exam[] = [
  // 1.º DAW
  ...row('lm', 1, [
    ['2027-01-20', '15:00', '17:00'],
    ['2027-04-14', '15:00', '17:00'],
    ['2027-05-28', '16:00', '19:00'],
    ['2027-06-18', '17:30', '20:30'],
  ]),
  ...row('si', 1, [
    ['2027-01-18', '17:00', '18:30'],
    ['2027-04-12', '17:00', '18:30'],
    ['2027-05-31', '17:00', '18:30'],
    ['2027-06-21', '17:00', '18:30'],
  ]),
  ...row('bd', 1, [
    ['2027-01-20', '17:30', '19:00'],
    ['2027-04-15', '17:00', '18:30'],
    ['2027-06-02', '16:00', '17:30'],
    ['2027-06-16', '17:30', '19:00'],
  ]),
  ...row('prog', 1, [
    ['2027-01-19', '17:00', '18:30'],
    ['2027-04-14', '17:30', '19:00'],
    ['2027-06-01', '17:00', '18:30'],
    ['2027-06-17', '17:00', '18:30'],
  ]),
  ...row('ed', 1, [
    ['2027-01-18', '15:00', '16:30'],
    ['2027-04-12', '15:00', '16:30'],
    ['2027-05-31', '15:00', '16:30'],
    ['2027-06-21', '15:00', '16:30'],
  ]),
  ...row('ingles', 1, [
    ['2027-01-15', '15:00', '17:00'],
    ['2027-04-13', '17:00', '18:30'],
    ['2027-06-02', '18:00', '20:00'],
    ['2027-06-22', '18:00', '20:00'],
  ]),
  ...row('cid1', 1, [
    null,
    null,
    ['2027-01-15', '17:30', '18:30'],
    ['2027-06-17', '15:00', '16:00'],
  ]),
  ...row('ipe1', 1, [
    ['2027-01-19', '15:00', '16:30'],
    ['2027-04-13', '15:00', '16:30'],
    ['2027-06-01', '16:00', '17:30'],
    ['2027-06-18', '17:30', '19:00'],
  ]),

  // 2.º DAW
  ...row('diw', 2, [
    ['2026-12-02', '15:00', '16:30'],
    ['2027-01-26', '15:00', '16:30'],
    ['2027-06-07', '17:00', '18:30'],
    ['2027-06-21', '17:00', '18:30'],
  ]),
  ...row('dwes', 2, [
    ['2026-12-03', '17:00', '18:30'],
    ['2027-01-26', '17:00', '18:30'],
    ['2027-06-03', '17:30', '19:00'],
    ['2027-06-18', '15:00', '16:30'],
  ]),
  ...row('dwec', 2, [
    ['2026-12-01', '15:00', '17:00'],
    ['2027-01-27', '15:00', '17:00'],
    ['2027-06-03', '15:00', '17:00'],
    ['2027-06-16', '15:00', '17:00'],
  ]),
  ...row('dpl', 2, [
    ['2026-12-01', '17:30', '19:00'],
    ['2027-01-28', '15:00', '16:30'],
    ['2027-06-07', '15:00', '16:30'],
    ['2027-06-17', '15:00', '16:30'],
  ]),
  ...row('ipe', 2, [
    ['2026-12-03', '15:00', '16:30'],
    ['2027-01-22', '15:00', '16:30'],
    ['2027-06-04', '15:00', '16:30'],
    ['2027-06-17', '17:00', '18:30'],
  ]),
  ...row('cid', 2, [
    null,
    null,
    ['2027-01-28', '17:00', '18:00'],
    ['2027-06-22', '19:30', '20:30'],
  ]),
  ...row('sasp', 2, [
    ['2026-12-02', '17:00', '18:00'],
    ['2027-01-22', '17:00', '18:00'],
    ['2027-06-07', '19:00', '20:00'],
    ['2027-06-21', '19:00', '20:00'],
  ]),
  ...row('dasp', 2, [
    ['2026-12-02', '18:30', '19:30'],
    ['2027-01-27', '17:30', '18:30'],
    ['2027-06-04', '17:00', '18:00'],
    ['2027-06-17', '19:00', '20:00'],
  ]),
];
