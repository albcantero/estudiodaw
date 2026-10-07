/**
 * @file Versión de la web: el commit del que se ha compilado y su fecha, para el pie. Se calcula al
 * compilar, en Node (no se puede importar desde el navegador).
 *
 * El commit sale de Vercel (VERCEL_GIT_COMMIT_SHA) y, en local, de git. La fecha es la del
 * commit si git responde y, si no, la de la compilación: Vercel no la da y su copia del
 * repositorio puede venir sin historial. Como cada push despliega, coinciden.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { execSync } from 'node:child_process';

/** Letras del commit que se enseñan, como las abreviaturas de git y GitHub */
const SHORT_SHA_LENGTH = 7;

/** Piezas de la fecha en español, con el mes abreviado ("oct"). En Madrid, no en UTC. */
const dateFormat = new Intl.DateTimeFormat('es-ES', {
  timeZone: 'Europe/Madrid',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/**
 * Fecha para el pie: "el 4 oct, 2026".
 *
 * @param date Fecha.
 * @returns La fecha formateada.
 */
function formatDate(date: Date): string {
  const parts = Object.fromEntries(
    dateFormat.formatToParts(date).map(({ type, value }) => [type, value]),
  );
  return `el ${parts.day} ${parts.month}, ${parts.year}`;
}

/** Versión de la web */
export interface BuildInfo {
  /** Commit abreviado; null si no se sabe */
  shortSha: string | null;
  /** Fecha del commit (o de la compilación) */
  date: Date;
  /** La misma fecha, para leer: "el 4 oct, 2026" */
  dateLabel: string;
}

/**
 * Ejecuta un comando de git y devuelve su salida, o null si falla (sin git, sin historial).
 *
 * @param args Argumentos de git.
 * @returns La salida del comando, o null.
 */
function git(args: string): string | null {
  try {
    const output = execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] });
    return output.toString().trim() || null;
  } catch {
    return null;
  }
}

/** La versión ya leída: el pie sale en todas las páginas y git solo se consulta una vez */
let cached: BuildInfo | null = null;

/**
 * Lee la versión de la web de git: commit y fecha.
 *
 * @returns El commit y su fecha.
 */
function readBuildInfo(): BuildInfo {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? git('rev-parse HEAD');
  const committedAt = git('log -1 --format=%cI');
  const date = committedAt ? new Date(committedAt) : new Date();
  return {
    shortSha: sha?.slice(0, SHORT_SHA_LENGTH) ?? null,
    date,
    dateLabel: formatDate(date),
  };
}

/**
 * Versión de la web: commit y fecha. Se lee una vez por build (en desarrollo, una vez
 * por arranque del servidor).
 *
 * @returns El commit y su fecha.
 */
export function getBuildInfo(): BuildInfo {
  cached ??= readBuildInfo();
  return cached;
}
