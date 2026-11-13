/**
 * @file Tipos de un test leído de un `TEST tema N.md`. En `Question` y `ParsedTest` los textos
 * son Markdown sin renderizar; en `RenderedQuestion` y `RenderedTest`, HTML listo para la página.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { GradeKey } from './grade.ts';

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

/**
 * Pregunta lista para la página: la misma forma que `Question`, con `statement`, `note`, el texto
 * de cada opción y la columna izquierda de cada pareja ya en HTML (las opciones, sin el `<p>` que
 * las envuelve), más la clave de corrección.
 */
export type RenderedQuestion = (
  | (QuestionBase & { type: 'single'; choices: Choice[]; answer: string })
  | (QuestionBase & { type: 'multiple'; choices: Choice[]; answer: string[] })
  | (QuestionBase & { type: 'text'; answers: string[] })
  | (QuestionBase & {
      type: 'match';
      /** `left` en HTML; `right`, el texto tal cual, que es lo que compara la corrección. */
      pairs: MatchPair[];
      /** Segundas columnas sin repetir y desordenadas, tal cual: el valor de cada opción. */
      options: string[];
      /** Cada opción de `options` en HTML, en el mismo orden: lo que se enseña. */
      optionLabels: string[];
    })
) & { key: GradeKey };

/** Un test listo para la página. */
export interface RenderedTest {
  /** Título del `#`, sin el prefijo `Test tema N:` ni pasar a HTML. */
  title: string;
  /** Introducción en HTML, si la hay. */
  intro?: string;
  questions: RenderedQuestion[];
}
