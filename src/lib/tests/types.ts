/**
 * @file Tipos de un test leído de un `TEST tema N.md`. Todos los textos son Markdown sin
 * renderizar.
 *
 * @author Alberto Cantero
 * @license MIT
 */

/** Lo común a todas las preguntas. */
export interface QuestionBase {
  /** Número de la pregunta en el fichero (`**N.**`). */
  number: number;
  /** Texto del último `##` antes de la pregunta, si lo hay. */
  section?: string;
  /** Enunciado, con los bloques de código y párrafos que lo siguen. */
  statement: string;
  /** Nota `**Ojo…:**` y lo que la sigue; se enseña al corregir, nunca antes. */
  note?: string;
  /** Número del título de la teoría que explica la pregunta (`**Apartado:** 1.2`). */
  apartado?: string;
}

/** Opción de una pregunta de elegir (`- a) …`). */
export interface Choice {
  letter: string;
  text: string;
}

/** Pareja de una pregunta de relacionar: una fila de la tabla. */
export interface MatchPair {
  left: string;
  right: string;
}

export type Question =
  | (QuestionBase & { type: 'single'; choices: Choice[]; answer: string })
  | (QuestionBase & { type: 'multiple'; choices: Choice[]; answer: string[] })
  | (QuestionBase & { type: 'text'; answers: string[] })
  | (QuestionBase & { type: 'match'; pairs: MatchPair[] });

/** Un test entero. */
export interface ParsedTest {
  /** Título del `#`, sin el prefijo `Test tema N:`. */
  title: string;
  /** Texto entre el `#` y el primer apartado o pregunta, si lo hay. */
  intro?: string;
  questions: Question[];
}
