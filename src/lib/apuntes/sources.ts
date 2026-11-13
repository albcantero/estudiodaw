/**
 * @file Clasificación de los ficheros de la carpeta de apuntes del DAW: qué se publica y de qué tipo es.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { syllabus } from '../../data/syllabus.ts';

/** Carpeta del módulo en la carpeta de apuntes → id del módulo en la web. */
export const SUBJECT_FOLDERS: Record<string, string> = {
  '04 Desarrollo Web en Entorno Cliente': 'dwec',
  '05 Desarrollo Web en Entorno Servidor': 'dwes',
  '06 Despliegue de Aplicaciones Web': 'dpl',
  '07 Digitalización Aplicada a los Sectores Productivos': 'dasp',
  '08 Diseño de Interfaces Web': 'diw',
  '10 Sostenibilidad Aplicada al Sistema Productivo': 'sasp',
};

export type SourceKind = 'teoria' | 'test' | 'ejercicios' | 'soluciones';

export interface SourceFile {
  /** Ruta relativa en NFC y con `/`. */
  relPath: string;
  /** Id del módulo (`diw`, `lm`...). */
  subject: string;
  /** Número de tema como texto (`"1"`, `"4.5"`). */
  temaNumber: string;
  /** Nombre de la carpeta `tema N - Título`, si la hay. */
  temaFolder?: string;
  kind: SourceKind;
}

const NUM = String.raw`(\d+(?:\.\d+)?)`;
const TEMA_FOLDER = /^tema (\d+(?:\.\d+)?) - .+$/i;
const APUNTES_FOLDER = 'mis apuntes';
const SOLUTIONS_FOLDER = 'mis soluciones';

/**
 * Clave de comparación: sin tildes ni mayúsculas, para tolerar TEORIÁ y similares.
 *
 * @param name Nombre a normalizar.
 * @returns La clave.
 */
function key(name: string): string {
  return name.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/**
 * Ruta en NFC y con `/`.
 *
 * @param relPath Ruta relativa original.
 * @returns La ruta normalizada.
 */
function normalizePath(relPath: string): string {
  return relPath.normalize('NFC').replaceAll('\\', '/');
}

const SUBJECT_BY_KEY = new Map(
  Object.entries(SUBJECT_FOLDERS).map(([folder, id]) => [key(folder), id]),
);

/**
 * Carpetas de módulo que no se publican aunque tengan apuntes: el sync las ignora sin fallar.
 * Lenguaje de Marcas (13 nov. 2026): sus carpetas no siguen la numeración del temario oficial
 * (su "tema 2 - XSD" es la UD4).
 */
const UNPUBLISHED_FOLDERS = new Set(['01 Lenguaje de Marcas'].map(key));

/**
 * Indica si un fichero tiene pinta de ser una fuente publicable. El sync falla si esto es
 * verdadero y `classifySource` devuelve `null`, para no perder apuntes por un nombre mal escrito.
 *
 * @param relPath Ruta relativa del fichero.
 * @returns `true` si parece una fuente publicable.
 */
export function looksPublishable(relPath: string): boolean {
  const parts = normalizePath(relPath).split('/');
  if (parts.length < 3 || key(parts[1]) !== APUNTES_FOLDER) return false;
  if (UNPUBLISHED_FOLDERS.has(key(parts[0]))) return false;
  const name = key(parts[parts.length - 1]);
  if (!name.endsWith('.md')) return false;
  if (parts.slice(2, -1).some((p) => key(p) === SOLUTIONS_FOLDER)) return false;
  return /^(teoria|test|ejercicios)/.test(name);
}

/**
 * Clasifica un fichero de la carpeta de apuntes; `null` si no es publicable.
 *
 * @param relPath Ruta relativa del fichero.
 * @returns La clasificación, o `null`.
 */
export function classifySource(relPath: string): SourceFile | null {
  const path = normalizePath(relPath);
  const parts = path.split('/');
  if (parts.length < 3 || key(parts[1]) !== APUNTES_FOLDER) return null;
  const subject = SUBJECT_BY_KEY.get(key(parts[0]));
  if (!subject) return null;

  // Entre `mis apuntes/` y el fichero cabe como mucho una carpeta `tema N - …`: lo que esté más
  // hondo (una tarea, mis soluciones…) no se publica nunca.
  const middle = parts.slice(2, -1);
  if (middle.length > 1) return null;
  const folderMatch = middle.length === 1 ? TEMA_FOLDER.exec(middle[0]) : null;
  if (middle.length === 1 && !folderMatch) return null;
  const temaFolder = folderMatch ? middle[0] : undefined;
  const folderNumber = folderMatch?.[1];

  const name = key(parts[parts.length - 1]);
  const named = new RegExp(String.raw`^(teoria|test) tema ${NUM}\.md$`).exec(name);
  if (named) {
    return {
      relPath: path,
      subject,
      temaNumber: named[2],
      ...(temaFolder ? { temaFolder } : {}),
      kind: named[1] as SourceKind,
    };
  }

  let kind: SourceKind | null = null;
  if (name === 'ejercicios.md') kind = 'ejercicios';
  else if (name === 'ejercicios con soluciones propuestas.md') kind = 'soluciones';
  // Sin carpeta `tema N - …` no hay forma de saber el tema de unos ejercicios.
  if (!kind || !folderNumber || !temaFolder) return null;
  return { relPath: path, subject, temaNumber: folderNumber, temaFolder, kind };
}

/**
 * Quita del encabezado los prefijos tipo `TEORÍA tema N:`, `Tema N:`, `Tema N —` o `Unidad N.`.
 *
 * @param h1 Encabezado, con o sin `# `.
 * @returns El título sin prefijo.
 */
export function titleFromHeading(h1: string): string {
  const text = h1.replace(/^#\s+/, '').trim();
  const prefixes = [
    new RegExp(String.raw`^teor[ií]a tema ${NUM}\s*:\s*`, 'i'),
    new RegExp(String.raw`^test tema ${NUM}\s*:\s*`, 'i'),
    new RegExp(String.raw`^tema ${NUM}\s*(?::|—)\s*`, 'i'),
    new RegExp(String.raw`^unidad ${NUM}\s*\.\s*`, 'i'),
  ];
  const prefix = prefixes.find((re) => re.test(text));
  return prefix ? text.replace(prefix, '').trim() : text;
}

/**
 * Título del tema: el de la carpeta `tema N - Título` o, si no hay, el del encabezado.
 *
 * @param folder Nombre de la carpeta del tema, si la hay.
 * @param h1 Encabezado de primer nivel del fichero, si lo hay.
 * @returns El título sin prefijos.
 */
export function temaTitle(folder: string | undefined, h1: string | undefined): string {
  const fromFolder = folder
    ? /^tema \d+(?:\.\d+)? - (.+)$/i.exec(folder.normalize('NFC'))?.[1]
    : '';
  if (fromFolder) return fromFolder.trim();
  return titleFromHeading(h1 ?? '');
}

/**
 * Slug para URLs: minúsculas, sin tildes y con guiones.
 *
 * @param title Título a convertir.
 * @returns El slug.
 */
export function slugify(title: string): string {
  return key(title)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Unidad didáctica de un tema entero (`"3"` → `"UD3"`); los temas con punto no tienen.
 *
 * @param temaNumber Número de tema como texto.
 * @returns La unidad, o `undefined` si el tema lleva punto.
 */
export function unitOf(temaNumber: string): string | undefined {
  return /^\d+$/.test(temaNumber) ? `UD${temaNumber}` : undefined;
}

/**
 * Título oficial de un tema: el de su UD en el temario de la asignatura (data/syllabus.ts). Solo
 * para los temas enteros con su UD cargada; el resto se queda con el de la carpeta o el encabezado.
 * La URL no sale de aquí: sigue saliendo de la carpeta o el encabezado.
 *
 * @param subject Id de la asignatura.
 * @param temaNumber Número de tema como texto.
 * @returns El título de la UD, o `undefined` si no hay.
 */
export function officialTitle(subject: string, temaNumber: string): string | undefined {
  if (!unitOf(temaNumber)) return undefined;
  return syllabus[subject]?.[Number(temaNumber) - 1]?.title;
}
