/**
 * @file Loaders de Astro para las colecciones `temas` y `docs`: leen la copia de los apuntes del
 * DAW (`src/content/apuntes/`, la llena `npm run sync`) tal cual, sin JSON ni frontmatter. El tema
 * sale de la carpeta y del nombre de cada fichero (`scanSources`); la teoría, los ejercicios y las
 * soluciones se pasan a HTML como haría el loader `glob`, y cada test se lee con `parseTest` y se
 * deja preparado para la página.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';
import { DOC_LABELS } from '../../data/doc-kinds.ts';
import { gradeKey } from '../tests/grade.ts';
import { parseTest } from '../tests/parse.ts';
import type { Question, RenderedQuestion, RenderedTest } from '../tests/types.ts';
import { scanSources, walkFiles, type TemaInfo } from './scan.ts';
import type { SourceFile } from './sources.ts';

/** Espera tras el último cambio de la carpeta antes de recargar: el sync copia varios a la vez. */
const RELOAD_DEBOUNCE_MS = 200;

/**
 * Versión de lo que produce este loader. Entra en el digest de cada entrada: Astro guarda las
 * colecciones entre arranques y builds, y sin esto una entrada cuyo fichero no cambió seguiría con
 * el HTML o los datos de antes. Súbelo al cambiar cómo se renderiza o la forma de los datos.
 */
const LOADER_VERSION = 1;

/** `#` del principio del fichero: el título, que la página ya pinta como `<h1>`. */
const TITLE_LINE = /^\uFEFF?\s*#[ \t]+[^\n]*(?:\n|$)/;

/** Separador (`---`, `***`, `___`) justo debajo del título. */
const LEADING_RULE = /^\s*(?:-{3,}|\*{3,}|_{3,})[ \t]*\r?(?:\n|$)/;

/** Párrafo único que envuelve el HTML de un texto corto. */
const SINGLE_PARAGRAPH = /^<p>([\s\S]*)<\/p>$/;

type RenderMarkdown = LoaderContext['renderMarkdown'];

/**
 * Carpeta de los apuntes en disco.
 *
 * @param context Contexto del loader; trae la raíz del proyecto.
 * @param root Carpeta relativa a la raíz del proyecto.
 * @returns Ruta absoluta.
 */
function absoluteRoot(context: LoaderContext, root: string): string {
  return path.resolve(fileURLToPath(context.config.root), root);
}

/**
 * Indica si una ruta está dentro de una carpeta.
 *
 * @param parent Carpeta.
 * @param child Ruta a comprobar.
 * @returns `true` si `child` cuelga de `parent`.
 */
function isInside(parent: string, child: string): boolean {
  const rel = path.relative(parent, path.resolve(child));
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

/**
 * Recorre la carpeta de apuntes. Un fichero que no encaja o un tema repetido paran el build: el
 * sync ya los rechaza, así que aquí solo llegan si alguien tocó la copia a mano.
 *
 * @param context Contexto del loader.
 * @param absRoot Carpeta de los apuntes.
 * @returns Los temas.
 */
function scanOrThrow(context: LoaderContext, absRoot: string): TemaInfo[] {
  if (!fs.existsSync(absRoot)) {
    context.logger.warn(`No existe ${absRoot}: sin apuntes publicados (falta npm run sync)`);
  }
  const { temas, problems } = scanSources(absRoot);
  if (problems.length > 0) throw new Error(problems.join('\n'));
  return temas;
}

/**
 * En desarrollo, vuelve a cargar la colección cuando cambia algo dentro de la carpeta de apuntes.
 * Los cambios seguidos se juntan en una recarga, y las recargas van de una en una.
 *
 * @param context Contexto del loader; sin `watcher` (en el build) no hace nada.
 * @param absRoot Carpeta de los apuntes.
 * @param reload Carga completa de la colección.
 */
function watchSources(context: LoaderContext, absRoot: string, reload: () => Promise<void>): void {
  const { watcher, logger } = context;
  if (!watcher) return;
  watcher.add(absRoot);
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = Promise.resolve();
  /**
   * Programa una recarga si el cambio es de la carpeta de apuntes.
   *
   * @param changed Ruta del fichero que cambió.
   */
  const onEvent = (changed: string) => {
    if (!isInside(absRoot, changed)) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      running = running
        .then(reload)
        .then(() => logger.info('Apuntes recargados'))
        .catch((error: unknown) => {
          // Un fichero a medio escribir no tumba el servidor: se avisa y se espera al siguiente
          logger.error(error instanceof Error ? error.message : String(error));
        });
    }, RELOAD_DEBOUNCE_MS);
  };
  watcher.on('add', onEvent);
  watcher.on('change', onEvent);
  watcher.on('unlink', onEvent);
}

/**
 * Quita el título (`#`) del principio y el separador que lo siga. El título ya está en la página;
 * el separador, sin título encima, sobra, y además `renderMarkdown` tomaría un `---` al principio
 * por el comienzo de un frontmatter.
 *
 * @param markdown Fichero tal cual.
 * @returns El cuerpo sin el título.
 */
export function withoutTitle(markdown: string): string {
  if (!TITLE_LINE.test(markdown)) return markdown;
  const rest = markdown.replace(TITLE_LINE, '');
  return rest.replace(LEADING_RULE, '');
}

/**
 * HTML de un texto corto sin el `<p>` que lo envuelve, si es un solo párrafo.
 *
 * @param html HTML de `renderMarkdown`.
 * @returns El HTML sin el párrafo exterior.
 */
export function unwrapParagraph(html: string): string {
  const match = SINGLE_PARAGRAPH.exec(html.trim());
  return match && !match[1].includes('<p>') ? match[1] : html;
}

/**
 * Generador pseudoaleatorio con semilla (Park-Miller): mismo número, misma secuencia. Solo
 * aritmética entera que cabe en un `number` sin perder precisión.
 *
 * @param seed Semilla.
 * @returns Función que devuelve números en [0, 1).
 */
function seededRandom(seed: number): () => number {
  const modulus = 2147483647;
  let state = (Math.abs(Math.trunc(seed)) % (modulus - 1)) + 1;
  /**
   * Siguiente número de la secuencia.
   *
   * @returns Número en [0, 1).
   */
  const next = () => {
    state = (state * 16807) % modulus;
    return (state - 1) / (modulus - 1);
  };
  // Las primeras salidas de semillas seguidas (1, 2, 3…) se parecen: se descartan
  for (let i = 0; i < 5; i += 1) next();
  return next;
}

/**
 * Baraja una lista con semilla fija, para que el HTML no cambie entre builds. Si sale en el mismo
 * orden que tenía (con pocas opciones pasa a menudo), la gira una posición: así nunca queda
 * resuelta de entrada.
 *
 * @param items Lista a barajar; no se modifica.
 * @param seed Semilla (el número de la pregunta).
 * @returns Lista barajada.
 */
export function seededShuffle<T>(items: T[], seed: number): T[] {
  const random = seededRandom(seed);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  const unchanged = result.every((item, index) => item === items[index]);
  return unchanged && result.length > 1 ? [...result.slice(1), result[0]] : result;
}

/**
 * Pasa a HTML los textos de una pregunta y le añade su clave de corrección.
 *
 * @param question Pregunta leída del Markdown.
 * @param block Markdown de bloque a HTML.
 * @param inline Markdown corto a HTML, sin el párrafo exterior.
 * @returns La pregunta lista para la página.
 */
async function renderQuestion(
  question: Question,
  block: (text: string) => Promise<string>,
  inline: (text: string) => Promise<string>,
): Promise<RenderedQuestion> {
  const statement = await block(question.statement);
  const note = question.note === undefined ? undefined : await block(question.note);
  const common = { statement, ...(note === undefined ? {} : { note }), key: gradeKey(question) };

  switch (question.type) {
    case 'single':
    case 'multiple': {
      const choices = await Promise.all(
        question.choices.map(async (choice) => ({ ...choice, text: await inline(choice.text) })),
      );
      return { ...question, ...common, choices };
    }
    case 'text':
      return { ...question, ...common };
    default: {
      const pairs = await Promise.all(
        question.pairs.map(async (pair) => ({ ...pair, left: await inline(pair.left) })),
      );
      const options = seededShuffle(
        [...new Set(question.pairs.map((p) => p.right))],
        question.number,
      );
      const optionLabels = await Promise.all(options.map(inline));
      return { ...question, ...common, pairs, options, optionLabels };
    }
  }
}

/**
 * Lee un test y lo deja listo para la página. Si una pregunta está mal escrita, `parseTest` lanza
 * con el fichero y el número, y eso para el build.
 *
 * @param markdown Fichero del test tal cual.
 * @param source Ruta del fichero, para los mensajes de error.
 * @param renderMarkdown Render de Markdown de Astro.
 * @param fileURL Fichero, para resolver rutas relativas.
 * @returns El test con sus textos en HTML.
 */
async function renderTest(
  markdown: string,
  source: string,
  renderMarkdown: RenderMarkdown,
  fileURL: URL,
): Promise<RenderedTest> {
  const parsed = parseTest(markdown, source);
  /**
   * Markdown de bloque a HTML.
   *
   * @param text Markdown.
   * @returns HTML.
   */
  const block = async (text: string) => (await renderMarkdown(text, { fileURL })).html;
  /**
   * Markdown corto a HTML, sin el párrafo exterior.
   *
   * @param text Markdown.
   * @returns HTML.
   */
  const inline = async (text: string) => unwrapParagraph(await block(text));

  const intro = parsed.intro === undefined ? undefined : await block(parsed.intro);
  const questions = await Promise.all(
    parsed.questions.map((question) => renderQuestion(question, block, inline)),
  );
  return { title: parsed.title, ...(intro === undefined ? {} : { intro }), questions };
}

/**
 * Carga un documento en la colección `docs`. Si el fichero no cambió desde la última carga, deja
 * la entrada como está.
 *
 * @param context Contexto del loader.
 * @param tema Tema del documento.
 * @param file Fichero de origen.
 * @param absPath Ruta absoluta del fichero en disco.
 * @returns Id de la entrada.
 */
async function loadDoc(
  context: LoaderContext,
  tema: TemaInfo,
  file: SourceFile,
  absPath: string,
): Promise<string> {
  const { store, parseData, renderMarkdown, generateDigest, config } = context;
  const id = `${tema.id}/${file.kind}`;
  const body = fs.readFileSync(absPath, 'utf8');
  const filePath = path.relative(fileURLToPath(config.root), absPath).replaceAll('\\', '/');
  const digest = generateDigest({ version: LOADER_VERSION, id, filePath, body });

  // Sin cambios: la entrada guardada conserva su HTML y sus imágenes (assetImports)
  if (store.get(id)?.digest === digest) return id;

  const fileURL = pathToFileURL(absPath);
  const base = { title: DOC_LABELS[file.kind], kind: file.kind };

  if (file.kind === 'test') {
    const test = await renderTest(body, filePath, renderMarkdown, fileURL);
    const data = await parseData({ id, data: { ...base, test }, filePath: absPath });
    store.set({ id, data, body, filePath, digest });
    return id;
  }

  const rendered = await renderMarkdown(withoutTitle(body), { fileURL });
  const data = await parseData({ id, data: base, filePath: absPath });
  store.set({
    id,
    data,
    body,
    filePath,
    digest,
    rendered,
    assetImports: rendered.metadata?.imagePaths,
  });
  return id;
}

/**
 * Carga completa de `docs`: un documento por fichero publicable. Borra las entradas de ficheros
 * que ya no están.
 *
 * @param context Contexto del loader.
 * @param absRoot Carpeta de los apuntes.
 */
async function syncDocs(context: LoaderContext, absRoot: string): Promise<void> {
  const temas = scanOrThrow(context, absRoot);
  // Ruta real en disco de cada fichero (en NFD si viene de un Mac), por su ruta en NFC
  const realByRel = new Map(walkFiles(absRoot).map(({ real, rel }) => [rel, real]));
  const untouched = new Set(context.store.keys());
  const seen = new Set<string>();

  await Promise.all(
    temas.flatMap((tema) =>
      tema.files.map(async (file) => {
        const id = `${tema.id}/${file.kind}`;
        if (seen.has(id)) throw new Error(`Documento repetido en ${tema.id}: ${file.relPath}`);
        seen.add(id);
        const absPath = path.join(absRoot, realByRel.get(file.relPath) ?? file.relPath);
        untouched.delete(await loadDoc(context, tema, file, absPath));
      }),
    ),
  );
  untouched.forEach((id) => context.store.delete(id));
}

/**
 * Carga completa de `temas`: uno por tema con algún fichero publicable.
 *
 * @param context Contexto del loader.
 * @param absRoot Carpeta de los apuntes.
 */
async function syncTemas(context: LoaderContext, absRoot: string): Promise<void> {
  const { store, parseData, generateDigest } = context;
  const temas = scanOrThrow(context, absRoot);
  const untouched = new Set(store.keys());

  await Promise.all(
    temas.map(async (tema) => {
      const { id, subject, slug, number, title, unit } = tema;
      const raw = { subject, slug, number, title, ...(unit ? { unit } : {}), downloads: [] };
      untouched.delete(id);
      const digest = generateDigest({ version: LOADER_VERSION, ...raw });
      if (store.get(id)?.digest === digest) return;
      store.set({ id, data: await parseData({ id, data: raw }), digest });
    }),
  );
  untouched.forEach((id) => store.delete(id));
}

/**
 * Loader de la colección `temas`.
 *
 * @param root Carpeta de los apuntes, relativa a la raíz del proyecto (`src/content/apuntes`).
 * @returns El loader.
 */
export function temasLoader(root: string): Loader {
  return {
    name: 'apuntes-temas',
    load: async (context) => {
      const absRoot = absoluteRoot(context, root);
      await syncTemas(context, absRoot);
      watchSources(context, absRoot, () => syncTemas(context, absRoot));
    },
  };
}

/**
 * Loader de la colección `docs`: teoría, test, ejercicios y soluciones de cada tema.
 *
 * @param root Carpeta de los apuntes, relativa a la raíz del proyecto (`src/content/apuntes`).
 * @returns El loader.
 */
export function docsLoader(root: string): Loader {
  return {
    name: 'apuntes-docs',
    load: async (context) => {
      const absRoot = absoluteRoot(context, root);
      await syncDocs(context, absRoot);
      watchSources(context, absRoot, () => syncDocs(context, absRoot));
    },
  };
}
