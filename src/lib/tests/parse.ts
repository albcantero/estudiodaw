/**
 * @file Lector de los `TEST tema N.md`: los convierte en preguntas y valida cada una, para que una
 * pregunta mal escrita haga fallar el build con su fichero y su número en lugar de salir rota.
 * El formato está descrito en docs/superpowers/specs/2026-11-13-tests-design.md.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { titleFromHeading } from '../apuntes/sources.ts';
import type { Choice, MatchPair, ParsedTest, Question } from './types.ts';

/** Error de formato de un test. Junta todos los problemas del fichero, uno por línea. */
export class TestFormatError extends Error {
  /** Cada problema por separado, con la forma `"<source>, pregunta <n>: <motivo>"`. */
  readonly problems: string[];

  /**
   * Crea el error con todos los problemas del fichero.
   *
   * @param problems Problemas encontrados, al menos uno.
   */
  constructor(problems: string[]) {
    super(problems.join('\n'));
    this.name = 'TestFormatError';
    this.problems = problems;
  }
}

/**
 * Problema dentro de una pregunta, solo con el motivo: `parseTest` lo recoge y le pone delante el
 * fichero y el número.
 *
 * @param reason Motivo.
 * @returns El error, para lanzarlo.
 */
function problem(reason: string): TestFormatError {
  return new TestFormatError([reason]);
}

const FENCE = /^\s*(`{3,}|~{3,})/;
const HEADING = /^(#{1,6})\s+(.+?)\s*$/;
const QUESTION = /^\*\*(\d+)\.\*\*\s*(.*)$/;
const CHOICE = /^- ([a-z])\)\s*(.*)$/;
const ANSWER = /^\*\*Respuesta:\*\*\s*(.*)$/;
const APARTADO = /^\*\*Apartado:\*\*\s*(.*)$/;
const NOTE = /^\*\*Ojo\b/;
const TABLE_ROW = /^\s*\|/;
const BLANK = /_{3,}/g;
const NUMBERED = /^\((\d+)\)\s*(.*)$/;

/**
 * Marcas del enunciado que convierten una pregunta de opciones en de varias, aunque solo tenga una
 * correcta. Se buscan sin mayúsculas ni tildes. "Varias" cuenta solo como marca ("(varias)",
 * "varias respuestas"…), no suelta: "en varias páginas" es una pregunta de una opción.
 */
const MULTIPLE_HINT =
  /una o mas|\bselecciona\s+(?:\d+|dos|tres|cuatro|cinco|seis)\b|\(varias\)|\bvarias\s+(?:respuestas|opciones|correctas)\b/;

/** Bloque de líneas de una pregunta, desde su `**N.**` hasta la siguiente pregunta o título. */
interface Block {
  number: number;
  section?: string;
  lines: string[];
}

/**
 * Clave de comparación: sin tildes ni mayúsculas.
 *
 * @param text Texto a normalizar.
 * @returns La clave.
 */
function key(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/**
 * Indica si una línea cierra el bloque de código abierto con `fence`.
 *
 * @param line Línea a mirar.
 * @param fence Marca de apertura: tres o más comillas invertidas o virgulillas.
 * @returns `true` si lo cierra.
 */
function closesFence(line: string, fence: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith(fence) && [...trimmed].every((char) => char === fence[0]);
}

/**
 * Une líneas en un texto quitando las líneas vacías del principio y del final.
 *
 * @param lines Líneas a unir.
 * @returns El texto, o `undefined` si no queda nada.
 */
function joinLines(lines: string[]): string | undefined {
  const text = lines.join('\n').trim();
  return text || undefined;
}

/**
 * Celdas de una fila de tabla Markdown (`| a | b |`).
 *
 * @param row Fila de la tabla.
 * @returns Las celdas, sin espacios alrededor.
 */
function cells(row: string): string[] {
  const inner = row
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '');
  return inner.split(/(?<!\\)\|/).map((cell) => cell.trim());
}

/**
 * Parejas de la tabla de una pregunta de relacionar, sin la fila de cabecera.
 *
 * @param rows Filas de la tabla, con la cabecera y la separadora.
 * @returns Las parejas.
 */
function parsePairs(rows: string[]): MatchPair[] {
  const table = rows.map(cells);
  if (table.some((row) => row.length !== 2)) {
    throw problem('la tabla de relacionar tiene que tener dos columnas');
  }
  if (table.length < 3 || !table[1].every((cell) => /^:?-+:?$/.test(cell))) {
    throw problem(
      'la tabla de relacionar necesita cabecera, fila separadora y al menos una pareja',
    );
  }
  return table.slice(2).map(([left, right], index) => {
    if (!left || !right) {
      throw problem(`la fila ${index + 1} de la tabla tiene una celda vacía`);
    }
    return { left, right };
  });
}

/**
 * Respuestas de una pregunta de escribir: separadas por ` · `, o numeradas `(1) …; (2) …`, o una
 * sola.
 *
 * @param raw Texto de la línea `**Respuesta:**`.
 * @returns Las respuestas, en el orden de los huecos.
 */
function parseTextAnswers(raw: string): string[] {
  let answers: string[];
  if (raw.startsWith('(1)')) {
    answers = raw.split(';').map((part, index) => {
      const match = NUMBERED.exec(part.trim());
      if (!match || Number(match[1]) !== index + 1) {
        throw problem(
          `la respuesta numerada tiene que seguir (1); (2)…, y la parte ${index + 1} es «${part.trim()}»`,
        );
      }
      return match[2].trim();
    });
  } else {
    answers = raw.split(' · ').map((part) => part.trim());
  }
  const empty = answers.findIndex((answer) => !answer);
  if (empty !== -1) throw problem(`la respuesta ${empty + 1} está vacía`);
  return answers;
}

/**
 * Letras de la respuesta de una pregunta de opciones, comprobando que existen.
 *
 * @param raw Texto de la línea `**Respuesta:**` (`b` o `a, b, d`).
 * @param choices Opciones de la pregunta.
 * @returns Las letras.
 */
function parseLetters(raw: string, choices: Choice[]): string[] {
  const letters = raw.split(',').map((part) => part.trim());
  const valid = new Set(choices.map((choice) => choice.letter));
  letters.forEach((letter, index) => {
    if (!/^[a-z]$/.test(letter)) {
      throw problem(`la respuesta «${raw}» no es una letra o una lista de letras`);
    }
    if (!valid.has(letter)) {
      throw problem(`la respuesta «${letter}» no es ninguna de las opciones`);
    }
    if (letters.indexOf(letter) !== index) {
      throw problem(`la respuesta «${letter}» está repetida`);
    }
  });
  return letters;
}

/**
 * Convierte el bloque de una pregunta en la pregunta, deduciendo el tipo de su forma.
 *
 * @param block Bloque de la pregunta.
 * @returns La pregunta.
 */
function parseQuestion(block: Block): Question {
  const statementLines: string[] = [];
  const noteLines: string[] = [];
  const choices: Choice[] = [];
  let answerRaw: string | undefined;
  let apartado: string | undefined;
  let phase: 'statement' | 'body' | 'note' = 'statement';
  let fence: string | undefined;

  block.lines.forEach((line) => {
    if (fence || (phase !== 'body' && FENCE.test(line))) {
      if (fence) {
        if (closesFence(line, fence)) fence = undefined;
      } else {
        fence = FENCE.exec(line)?.[1];
      }
      (phase === 'note' ? noteLines : statementLines).push(line);
      return;
    }
    const apartadoMatch = APARTADO.exec(line);
    if (apartadoMatch) {
      if (apartado !== undefined) throw problem('tiene dos líneas **Apartado:**');
      apartado = apartadoMatch[1].trim();
      if (!/^\d+(?:\.\d+)*$/.test(apartado)) {
        throw problem(`el apartado «${apartado}» no es un número como 1.2`);
      }
      if (phase === 'statement') phase = 'body';
      return;
    }
    if (phase === 'note') {
      noteLines.push(line);
      return;
    }
    if (NOTE.test(line)) {
      phase = 'note';
      noteLines.push(line);
      return;
    }
    const choice = CHOICE.exec(line);
    const answer = ANSWER.exec(line);
    if (choice) {
      if (answerRaw !== undefined) throw problem('tiene opciones después de la respuesta');
      const [, letter, text] = choice;
      if (choices.some((c) => c.letter === letter)) {
        throw problem(`la opción ${letter}) está repetida`);
      }
      if (!text.trim()) throw problem(`la opción ${letter}) está vacía`);
      choices.push({ letter, text: text.trim() });
      phase = 'body';
    } else if (answer) {
      if (answerRaw !== undefined) throw problem('tiene dos líneas **Respuesta:**');
      answerRaw = answer[1].trim();
      if (!answerRaw) throw problem('la respuesta está vacía');
      phase = 'body';
    } else if (phase === 'statement') {
      statementLines.push(line);
    } else if (line.trim()) {
      throw problem(`línea que no se sabe leer: «${line.trim()}»`);
    }
  });
  if (fence) throw problem('tiene un bloque de código sin cerrar');

  const note = joinLines(noteLines);
  const base = {
    number: block.number,
    ...(block.section ? { section: block.section } : {}),
    ...(note ? { note } : {}),
    ...(apartado ? { apartado } : {}),
  };

  if (answerRaw === undefined) {
    if (choices.length) throw problem('tiene opciones pero no **Respuesta:**');
    const lines = joinLines(statementLines)?.split('\n') ?? [];
    let start = lines.length;
    while (start > 0 && TABLE_ROW.test(lines[start - 1])) start -= 1;
    if (start === lines.length) {
      throw problem('no tiene **Respuesta:** ni tabla de relacionar');
    }
    const pairs = parsePairs(lines.slice(start));
    const statement = joinLines(lines.slice(0, start));
    if (!statement) throw problem('el enunciado está vacío');
    return { ...base, statement, type: 'match', pairs };
  }

  const statement = joinLines(statementLines);
  if (!statement) throw problem('el enunciado está vacío');

  if (choices.length) {
    const letters = parseLetters(answerRaw, choices);
    if (letters.length > 1 || MULTIPLE_HINT.test(key(statement))) {
      return { ...base, statement, type: 'multiple', choices, answer: letters };
    }
    return { ...base, statement, type: 'single', choices, answer: letters[0] };
  }

  const answers = parseTextAnswers(answerRaw);
  const blanks = statement.match(BLANK)?.length ?? 0;
  if (blanks > 0 && blanks !== answers.length) {
    throw problem(
      `tiene ${blanks} huecos (___) y ${answers.length} ${answers.length === 1 ? 'respuesta' : 'respuestas'}`,
    );
  }
  return { ...base, statement, type: 'text', answers };
}

/**
 * Lee un `TEST tema N.md`.
 *
 * @param markdown Contenido del fichero (acepta finales de línea `\r\n`).
 * @param source Nombre del fichero, para los mensajes de error.
 * @returns El test, con sus preguntas en el orden del fichero.
 * @throws {TestFormatError} Con todos los problemas del fichero si hay alguno.
 */
export function parseTest(markdown: string, source: string): ParsedTest {
  const problems: string[] = [];
  const blocks: Block[] = [];
  const introLines: string[] = [];
  let title: string | undefined;
  let section: string | undefined;
  let seenHeading = false;
  let current: Block | undefined;
  let fence: string | undefined;

  /**
   * Destino de una línea que no es título ni pregunta: la pregunta abierta, la introducción o
   * ninguno (entonces es un problema si no está vacía).
   *
   * @param line Línea a guardar.
   * @param index Índice de la línea, para el mensaje.
   */
  const keep = (line: string, index: number): void => {
    if (current) current.lines.push(line);
    else if (title !== undefined && !seenHeading) introLines.push(line);
    else if (line.trim()) problems.push(`${source}: línea ${index + 1} fuera de una pregunta`);
  };

  markdown
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .forEach((line, index) => {
      if (fence) {
        if (closesFence(line, fence)) fence = undefined;
        keep(line, index);
        return;
      }
      const fenceMatch = FENCE.exec(line);
      if (fenceMatch) {
        [, fence] = fenceMatch;
        keep(line, index);
        return;
      }
      const heading = HEADING.exec(line);
      if (heading) {
        current = undefined;
        if (heading[1].length === 1) {
          if (title !== undefined) problems.push(`${source}: tiene más de un título (#)`);
          title = titleFromHeading(line);
        } else {
          seenHeading = true;
          if (heading[1].length === 2) [, , section] = heading;
        }
        return;
      }
      const question = QUESTION.exec(line);
      if (question) {
        current = { number: Number(question[1]), section, lines: [question[2]] };
        blocks.push(current);
        return;
      }
      keep(line, index);
    });

  if (fence && !current) problems.push(`${source}: tiene un bloque de código sin cerrar`);
  if (title === undefined) problems.push(`${source}: falta el título (# Test tema N: …)`);
  if (!blocks.length) problems.push(`${source}: no tiene preguntas`);

  const seen = new Set<number>();
  const questions: Question[] = [];
  blocks.forEach((block) => {
    try {
      if (seen.has(block.number)) throw problem('número de pregunta repetido');
      seen.add(block.number);
      questions.push(parseQuestion(block));
    } catch (error) {
      if (!(error instanceof TestFormatError)) throw error;
      problems.push(`${source}, pregunta ${block.number}: ${error.message}`);
    }
  });

  if (problems.length) throw new TestFormatError(problems);
  const intro = joinLines(introLines);
  return { title: title ?? '', ...(intro ? { intro } : {}), questions };
}
