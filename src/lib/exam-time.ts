/**
 * @file El tiempo de los exámenes, en la hora de Madrid (la de los exámenes), esté donde esté quien
 * mira. Lo usan el calendario y las insignias del próximo examen, en el navegador: cambian con el
 * día, así que no se pueden dejar calculadas en el build.
 *
 * @author Alberto Cantero
 * @license MIT
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Inicio y fin de un examen, en ISO 8601 */
export interface ExamTime {
  start: string;
  end: string;
}

/** Fecha de un instante en Madrid, como AAAA-MM-DD (en-CA da ese formato) */
const madridDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Madrid',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Días naturales que faltan para un instante, en Madrid: "mañana" es mañana aunque falten menos
 * de 24 horas.
 *
 * @param now Instante actual, en milisegundos.
 * @param time Instante que se espera, en milisegundos.
 * @returns Los días que faltan: 0 si es hoy, 1 si es mañana.
 */
export function daysUntil(now: number, time: number): number {
  /**
   * Número del día de un instante en Madrid, contado desde 1970: dos instantes del mismo día dan el
   * mismo número.
   *
   * @param instant Instante, en milisegundos.
   * @returns El número del día.
   */
  const day = (instant: number): number =>
    Date.parse(`${madridDate.format(instant)}T00:00:00Z`) / DAY_MS;
  return day(time) - day(now);
}

/**
 * El próximo examen: el primero que aún no ha terminado (también el que está en curso).
 *
 * @param exams Exámenes, por orden de fecha.
 * @param now Instante actual, en milisegundos.
 * @returns El próximo examen, o undefined si ya han pasado todos.
 */
export const nextExam = <T extends ExamTime>(exams: T[], now: number): T | undefined =>
  exams.find((exam) => Date.parse(exam.end) > now);
