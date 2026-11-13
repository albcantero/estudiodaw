/**
 * @file Corrección de las respuestas de un test. Módulo puro, sin Node ni Astro: lo usan tanto los
 * tests como el script del navegador.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import type { Question } from './types.ts';

/**
 * Respuesta del alumno: letra (`single`), letras (`multiple`), textos por hueco (`text`) u opción
 * elegida por fila (`match`).
 */
export type Response = string | string[];

/** Lo mínimo de una pregunta que viaja a la página para poder corregirla. */
export type GradeKey =
  | { type: 'single'; answer: string }
  | { type: 'multiple'; answer: string[] }
  | { type: 'text'; answers: string[] }
  | { type: 'match'; rights: string[] };

/**
 * Normaliza una respuesta escrita para compararla: NFC, minúsculas, sin tildes, sin comillas
 * invertidas, extremos recortados y espacios repetidos juntados. Los espacios de dentro se
 * conservan (`table#nuevo` no es `table #nuevo`).
 *
 * @param text Texto tal como lo escribió el alumno o aparece en la clave.
 * @returns Texto listo para comparar.
 */
export function normalizeAnswer(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extrae de una pregunta solo lo necesario para corregirla.
 *
 * @param question Pregunta ya leída del Markdown.
 * @returns Clave de corrección.
 */
export function gradeKey(question: Question): GradeKey {
  switch (question.type) {
    case 'single':
      return { type: 'single', answer: question.answer };
    case 'multiple':
      return { type: 'multiple', answer: [...question.answer] };
    case 'text':
      return { type: 'text', answers: [...question.answers] };
    default:
      return { type: 'match', rights: question.pairs.map((pair) => pair.right) };
  }
}

/**
 * Compara dos listas posición a posición con una función de normalización.
 *
 * @param expected Lista esperada.
 * @param given Lista dada.
 * @param normalize Normalización aplicada a cada elemento.
 * @returns `true` si tienen la misma longitud y cada posición coincide.
 */
function sameList(expected: string[], given: string[], normalize: (s: string) => string): boolean {
  return (
    expected.length === given.length &&
    expected.every((item, index) => normalize(item) === normalize(given[index]))
  );
}

/**
 * Normaliza una letra de opción para compararla.
 *
 * @param letter Letra tal cual.
 * @returns Letra recortada y en minúscula.
 */
function lower(letter: string): string {
  return letter.trim().toLowerCase();
}

/**
 * Dice si una respuesta es correcta. `multiple`: mismo conjunto, sin importar el orden. `text`:
 * cada hueco normalizado. `match`: cada fila igual a su pareja.
 *
 * @param key Clave de corrección.
 * @param response Respuesta del alumno; si su forma no encaja con el tipo, es incorrecta.
 * @returns `true` si acierta.
 */
export function isCorrect(key: GradeKey, response: Response): boolean {
  switch (key.type) {
    case 'single':
      return typeof response === 'string' && lower(response) === lower(key.answer);
    case 'multiple': {
      if (!Array.isArray(response)) return false;
      const given = new Set(response.map(lower));
      const expected = new Set(key.answer.map(lower));
      return given.size === expected.size && [...expected].every((letter) => given.has(letter));
    }
    case 'text':
      return Array.isArray(response) && sameList(key.answers, response, normalizeAnswer);
    default:
      return Array.isArray(response) && sameList(key.rights, response, (s) => s);
  }
}
