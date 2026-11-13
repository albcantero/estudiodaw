/**
 * @file Ayuda por apartado de un test: de los títulos de la teoría saca los que se pueden citar
 * (por su número, `1.2`) y comprueba que el `**Apartado:**` de cada pregunta apunta a uno. La
 * Ayuda enseña dónde se explica la pregunta, nunca la respuesta.
 *
 * @author Alberto Cantero
 * @license MIT
 */

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
