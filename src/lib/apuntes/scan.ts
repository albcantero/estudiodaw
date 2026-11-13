/**
 * @file Recorrido de la carpeta de apuntes del DAW: ficheros publicables, temas y problemas.
 * Solo lee; nunca escribe en la carpeta de origen.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  classifySource,
  looksPublishable,
  officialTitle,
  slugify,
  temaTitle,
  unitOf,
  type SourceFile,
} from './sources.ts';

export interface TemaInfo {
  /** `<asignatura>/<slug>`. */
  id: string;
  subject: string;
  slug: string;
  number: number;
  title: string;
  unit?: string;
  files: SourceFile[];
}

export interface ScanResult {
  files: SourceFile[];
  temas: TemaInfo[];
  /** Rutas que parecen publicables y no encajan, y temas repetidos. */
  problems: string[];
}

export interface WalkedFile {
  /** Ruta relativa tal cual está en disco (puede estar en NFD si viene de un Mac). */
  real: string;
  /** Ruta relativa en NFC y con `/`. */
  rel: string;
}

/**
 * Lista todos los ficheros bajo `root`, sin seguir nada fuera de él.
 *
 * @param root Carpeta a recorrer.
 * @returns Los ficheros, ordenados por ruta normalizada.
 */
export function walkFiles(root: string): WalkedFile[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const real = path.relative(root, path.join(entry.parentPath, entry.name));
      return { real, rel: real.replaceAll('\\', '/').normalize('NFC') };
    })
    .sort((a, b) => (a.rel < b.rel ? -1 : Number(a.rel > b.rel)));
}

/**
 * Primer encabezado de primer nivel de un fichero.
 *
 * @param file Ruta absoluta del fichero.
 * @returns El encabezado con su `# `, o `undefined` si no hay.
 */
function firstHeading(file: string): string | undefined {
  return fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .find((line) => /^#\s+\S/.test(line));
}

/**
 * Recorre la carpeta de apuntes y agrupa los ficheros publicables por tema.
 *
 * @param root Carpeta `2do curso - 2027`.
 * @returns Ficheros, temas y problemas.
 */
export function scanSources(root: string): ScanResult {
  const walked = walkFiles(root);
  const files: SourceFile[] = [];
  const problems: string[] = [];
  const realByRel = new Map<string, string>();

  walked.forEach(({ real, rel }) => {
    const source = classifySource(rel);
    if (source) {
      files.push(source);
      realByRel.set(source.relPath, real);
    } else if (looksPublishable(rel)) {
      problems.push(`Fichero que no encaja en la lista blanca: ${rel}`);
    }
  });

  const groups = new Map<string, SourceFile[]>();
  files.forEach((file) => {
    const groupKey = `${file.subject}/${Number(file.temaNumber)}`;
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), file]);
  });

  const temas: TemaInfo[] = [];
  groups.forEach((group) => {
    const folders = new Set(group.flatMap((f) => (f.temaFolder ? [f.temaFolder] : [])));
    const { subject, temaNumber } = group[0];
    if (folders.size > 1) {
      problems.push(
        `Tema repetido en ${subject}: el tema ${temaNumber} está en ${[...folders].join(' y ')}`,
      );
    }
    const folder = group.find((f) => f.temaFolder)?.temaFolder;
    const main = group.find((f) => f.kind === 'teoria') ?? group.find((f) => f.kind === 'test');
    const heading = main ? firstHeading(path.join(root, realByRel.get(main.relPath) ?? '')) : '';
    // La URL sale de la carpeta o del encabezado; el título, del temario oficial si lo hay
    const sourceTitle = temaTitle(folder, heading);
    const slug = slugify(sourceTitle);
    const title = officialTitle(subject, temaNumber) ?? sourceTitle;
    const unit = unitOf(temaNumber);
    temas.push({
      id: `${subject}/${slug}`,
      subject,
      slug,
      number: Number(temaNumber),
      title,
      ...(unit ? { unit } : {}),
      files: group,
    });
  });

  // Dos temas de la misma asignatura con el mismo slug se pisarían en la URL y en las colecciones
  const byId = new Map<string, TemaInfo>();
  temas.forEach((tema) => {
    const other = byId.get(tema.id);
    if (other) {
      problems.push(
        `Tema repetido en ${tema.subject}: la URL ${tema.id} sale de ${other.files[0].relPath} y de ${tema.files[0].relPath}`,
      );
    } else {
      byId.set(tema.id, tema);
    }
  });

  temas.sort((a, b) => a.subject.localeCompare(b.subject) || a.number - b.number);
  return { files, temas, problems };
}
