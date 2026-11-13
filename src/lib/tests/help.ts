/**
 * @file Ayuda por apartado de un test: de los títulos de la teoría saca los que se pueden citar
 * (por su número, `1.2`) y comprueba que el `**Apartado:**` de cada pregunta apunta a uno. La
 * Ayuda enseña dónde se explica la pregunta, nunca la respuesta: si el título la contiene, la
 * Ayuda cita solo el número del apartado.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { normalizeAnswer } from './grade.ts';
import type { Question, RenderedQuestion } from './types.ts';

/** Largo mínimo (normalizado) de una opción correcta para buscarla en el título. */
const MIN_CHOICE_LENGTH = 4;

/** Número del principio de un título (`2.3 `, `1. `). */
const HEADING_NUMBER = /^\d+(?:\.\d+)*\.?\s+/;

/** Entidades que puede dejar el render de Markdown en el texto de una opción. */
const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

/** Título de la teoría al que apunta la Ayuda. */
export interface HelpTarget {
  /** Id del título en la página de la teoría. */
  slug: string;
  /** Texto del título, con su número. */
  text: string;
}

/**
 * Títulos de la teoría que una pregunta puede citar: los de nivel 2 a 4 que empiezan por un
 * número (`1.2 Elementos conceptuales`).
 *
 * @param headings Títulos de la teoría renderizada.
 * @returns Número inicial del título → título.
 */
export function helpTargets(
  headings: { depth: number; slug: string; text: string }[],
): Map<string, HelpTarget> {
  const targets = new Map<string, HelpTarget>();
  headings.forEach(({ depth, slug, text }) => {
    if (depth < 2 || depth > 4) return;
    const match = /^(\d+(?:\.\d+)*)\.?\s/.exec(text);
    if (match && !targets.has(match[1])) targets.set(match[1], { slug, text });
  });
  return targets;
}

/**
 * Comprueba los apartados de las preguntas. Sin ninguno, el test sale sin Ayuda (con un aviso);
 * con alguno, todas las preguntas lo necesitan y tiene que existir en la teoría.
 *
 * @param questions Preguntas del test.
 * @param targets Títulos citables de la teoría; `undefined` si el tema no tiene teoría.
 * @param source Nombre del test, para los mensajes.
 * @returns `ok` si todas tienen Ayuda; `none` si el test sale sin ella.
 * @throws {Error} Si falta un apartado o apunta a un título que no existe.
 */
export function checkHelp(
  questions: { number: number; apartado?: string }[],
  targets: Map<string, HelpTarget> | undefined,
  source: string,
): 'none' | 'ok' {
  if (!targets) return 'none';
  if (questions.every((question) => !question.apartado)) {
    // eslint-disable-next-line no-console -- aviso de build, una vez por test
    console.warn(`${source}: sin apartados, el test sale sin Ayuda`);
    return 'none';
  }
  questions.forEach(({ number, apartado }) => {
    if (!apartado) throw new Error(`${source}, pregunta ${number}: falta el apartado`);
    if (!targets.has(apartado)) {
      throw new Error(`${source}, pregunta ${number}: apartado ${apartado} no está en la teoría`);
    }
  });
  return 'ok';
}

/**
 * Texto plano de una opción: sin etiquetas HTML y con las entidades más comunes deshechas.
 *
 * @param html Texto de la opción, en HTML o Markdown corto.
 * @returns El texto plano.
 */
function plain(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|#39);/g, (e) => ENTITIES[e]);
}

/**
 * Textos de la respuesta correcta de una pregunta: las opciones correctas (si tienen al menos
 * cuatro caracteres; las más cortas se encuentran dentro de cualquier palabra), las respuestas
 * escritas y la segunda columna de cada pareja. Ya normalizados y sin vacíos.
 *
 * @param question Pregunta, leída o ya renderizada.
 * @returns Los textos normalizados.
 */
export function answerTexts(question: Question | RenderedQuestion): string[] {
  let texts: string[];
  switch (question.type) {
    case 'single':
    case 'multiple': {
      const correct = new Set([question.answer].flat());
      texts = question.choices
        .filter((choice) => correct.has(choice.letter))
        .map((choice) => normalizeAnswer(plain(choice.text)))
        .filter((text) => text.length >= MIN_CHOICE_LENGTH);
      break;
    }
    case 'text':
      texts = question.answers.map(normalizeAnswer);
      break;
    default:
      texts = question.pairs.map((pair) => normalizeAnswer(pair.right));
  }
  return texts.filter(Boolean);
}

/**
 * Texto del enlace de la Ayuda: el título de la teoría o, si el título contiene la respuesta
 * correcta, solo `apartado <n>`. El número del título no cuenta: no delata nada.
 *
 * @param target Título de la teoría que cita la pregunta.
 * @param apartado Número del apartado (`2.3`).
 * @param question Pregunta, para conocer su respuesta.
 * @returns El texto del enlace.
 */
export function helpLabel(
  target: HelpTarget,
  apartado: string,
  question: Question | RenderedQuestion,
): string {
  const heading = normalizeAnswer(target.text.replace(HEADING_NUMBER, ''));
  const leaks = answerTexts(question).some((answer) => heading.includes(answer));
  return leaks ? `apartado ${apartado}` : target.text;
}
