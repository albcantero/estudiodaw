/**
 * @file Datos de una insignia (componente ui/Badge.astro), para pasarlas como props o en listas.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { ExamTime } from './exam-time';

/** Color del punto de una insignia: el de cada curso */
export type BadgeDot = 'first' | 'second';

/**
 * Qué dato de una colección es la insignia, para poder ocultarlo desde "Mostrar propiedades"
 * (CollectionSettings): el curso, los temas publicados, la fecha del próximo examen o lo que
 * falta para él (el cronómetro). Cada insignia, su ajuste.
 */
export type BadgeField = 'course' | 'notes' | 'exam' | 'countdown';

export interface BadgeData {
  text: string;
  /** Punto de color delante (el curso de la asignatura) */
  dot?: BadgeDot;
  /** Icono de Tabler delante (nombre, p. ej. "calendar-event") */
  icon?: string;
  /**
   * Color del icono; sin él, el gris del texto. brand: el azul de marca (el progreso de los
   * temas); attention: el amarillo de aviso (el próximo examen).
   */
  iconTone?: 'brand' | 'attention';
  /** Qué dato es (se oculta con "Mostrar") */
  field?: BadgeField;
  /** Tooltip: lo que significa, en una frase */
  tooltip?: string;
  /**
   * Insignia del próximo examen: su texto lo pone el navegador (scripts/collections/next-exam.ts)
   * según la fecha de hoy, a partir de los exámenes de la asignatura, en orden. date: la fecha;
   * countdown: lo que falta.
   */
  nextExam?: { show: 'date' | 'countdown'; exams: ExamTime[] };
}
