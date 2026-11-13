/**
 * @file Copia los apuntes publicables de la carpeta del DAW a `src/content/apuntes/`.
 * Uso: `node scripts/sync-apuntes.ts` (una vez) o con `--watch` (vigila el origen). Con `--force`,
 * sincroniza aunque solo vaya a borrar (por ejemplo, al quitar un tema del origen).
 * El origen es de solo lectura: aquí solo se lee de él.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanSources, walkFiles } from '../src/lib/apuntes/scan.ts';

const DEBOUNCE_MS = 300;
const MISSING_ENV = 'Falta APUNTES_DIR en .env: la ruta de "2do curso - 2027"';

/** Destino de la sincronización real. */
export const CONTENT_DIR = fileURLToPath(new URL('../src/content/apuntes', import.meta.url));

/**
 * Indica si `child` está dentro de `parent` (o es el mismo).
 *
 * @param parent Carpeta contenedora.
 * @param child Ruta a comprobar.
 * @returns `true` si `child` cuelga de `parent`.
 */
function isInside(parent: string, child: string): boolean {
  const rel = path.relative(path.resolve(parent), path.resolve(child));
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

/**
 * Borra las carpetas vacías bajo `dir`, de dentro hacia fuera.
 *
 * @param dir Carpeta a limpiar.
 * @param removeSelf Si también se borra `dir` cuando queda vacía.
 */
function pruneEmptyDirs(dir: string, removeSelf: boolean): void {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (entry.isDirectory()) pruneEmptyDirs(path.join(dir, entry.name), true);
  });
  if (removeSelf && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}

/**
 * Sincroniza el origen con el destino: copia lo publicable que cambió y borra del destino lo que
 * ya no está en el origen. Falla, sin tocar nada, si hay ficheros que no encajan, si el origen no
 * existe o no tiene nada publicable, o si iba a borrar sin copiar nada (un origen equivocado
 * vaciaría la copia del repo); lo último se puede forzar con `force`.
 *
 * @param from Carpeta de origen (solo se lee).
 * @param to Carpeta de destino (la única donde se escribe y se borra).
 * @param options Opciones.
 * @param options.force Sincroniza aunque solo vaya a borrar.
 * @returns Ficheros copiados y borrados.
 */
export function syncApuntes(
  from: string,
  to: string,
  { force = false }: { force?: boolean } = {},
): { copied: number; removed: number } {
  if (isInside(from, to) || isInside(to, from)) {
    throw new Error('El origen y el destino no pueden estar uno dentro del otro');
  }
  if (!fs.existsSync(from) || !fs.statSync(from).isDirectory()) {
    throw new Error(`No se sincroniza: no existe la carpeta de origen ${from}`);
  }
  const { files, problems } = scanSources(from);
  if (problems.length > 0) {
    throw new Error(
      `No se sincroniza; hay que revisar:\n${problems.map((p) => `  ${p}`).join('\n')}`,
    );
  }
  if (files.length === 0) {
    throw new Error(`No se sincroniza: no hay ningún apunte publicable en ${from}`);
  }

  // Carpetas con fuentes: sus `img/` hermanas también se copian.
  const sourceDirs = new Set(files.map((f) => path.posix.dirname(f.relPath)));
  const wanted = new Set(files.map((f) => f.relPath));
  const walked = walkFiles(from);
  const realByRel = new Map(walked.map((w) => [w.rel, w.real]));
  walked.forEach(({ rel }) => {
    const parts = rel.split('/');
    const inImg = parts.some(
      (part, i) =>
        i < parts.length - 1 &&
        part.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase() === 'img' &&
        sourceDirs.has(parts.slice(0, i).join('/')),
    );
    if (inImg) wanted.add(rel);
  });

  // Se decide todo antes de escribir, para poder negarse sin haber tocado el destino
  const toCopy = [...wanted].flatMap((rel) => {
    const data = fs.readFileSync(path.join(from, realByRel.get(rel) ?? rel));
    const target = path.join(to, rel);
    return fs.existsSync(target) && data.equals(fs.readFileSync(target)) ? [] : [{ target, data }];
  });
  const toRemove = walkFiles(to)
    .filter(({ rel }) => !wanted.has(rel))
    .map(({ real }) => path.join(to, real))
    // Red de seguridad: jamás se borra fuera del destino.
    .filter((target) => isInside(to, target) && path.resolve(target) !== path.resolve(to));

  if (toRemove.length > 0 && toCopy.length === 0 && !force) {
    throw new Error(
      `No se sincroniza: se borrarían ${toRemove.length} ficheros sin copiar ninguno. ` +
        `Revisa que el origen ${from} es el bueno o repite con --force`,
    );
  }

  toCopy.forEach(({ target, data }) => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, data);
  });
  toRemove.forEach((target) => fs.rmSync(target));
  pruneEmptyDirs(to, false);

  return { copied: toCopy.length, removed: toRemove.length };
}

/**
 * Sincroniza y escribe el resultado en consola; los errores se muestran, no se lanzan.
 *
 * @param from Carpeta de origen.
 * @param to Carpeta de destino.
 */
function syncAndLog(from: string, to: string): void {
  try {
    const { copied, removed } = syncApuntes(from, to);
    if (copied || removed) console.log(`[apuntes] ${copied} copiados, ${removed} borrados`);
  } catch (error) {
    console.error(`[apuntes] ${(error as Error).message}`);
  }
}

/**
 * Vigila el origen y sincroniza al cambiar algo, agrupando los eventos.
 *
 * @param from Carpeta de origen.
 * @param to Carpeta de destino.
 * @returns Función que detiene la vigilancia.
 */
export function watchApuntes(from: string, to: string): () => void {
  let timer: NodeJS.Timeout | undefined;
  const watcher = fs.watch(from, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => syncAndLog(from, to), DEBOUNCE_MS);
  });
  // Sin este manejador, un error del vigilante (carpeta renombrada, bloqueada...) tumba el proceso.
  watcher.on('error', (error) => {
    console.error(`[apuntes] se deja de vigilar ${from}: ${error.message}`);
    clearTimeout(timer);
    watcher.close();
  });
  return () => {
    clearTimeout(timer);
    watcher.close();
  };
}

/**
 * Carga `.env` de la raíz del repo, si existe.
 */
export function loadEnv(): void {
  const envFile = fileURLToPath(new URL('../.env', import.meta.url));
  if (fs.existsSync(envFile)) process.loadEnvFile(envFile);
}

/**
 * Punto de entrada de la línea de comandos. Sin process.exit para no cortar la salida en Windows.
 */
function main(): void {
  loadEnv();
  const from = process.env.APUNTES_DIR;
  if (!from) {
    console.error(MISSING_ENV);
    process.exitCode = 1;
    return;
  }
  try {
    const { copied, removed } = syncApuntes(from, CONTENT_DIR, {
      force: process.argv.includes('--force'),
    });
    console.log(`[apuntes] ${copied} copiados, ${removed} borrados`);
  } catch (error) {
    console.error((error as Error).message);
    process.exitCode = 1;
    return;
  }
  if (process.argv.includes('--watch')) {
    watchApuntes(from, CONTENT_DIR);
    console.log(`[apuntes] vigilando ${from}`);
  }
}

if (import.meta.main) main();
