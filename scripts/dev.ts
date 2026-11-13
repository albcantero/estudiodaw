/**
 * @file Arranque de desarrollo: sincroniza los apuntes (si hay `APUNTES_DIR`) y lanza `astro dev`.
 * Los argumentos extra (`npm run dev -- --host`) pasan a Astro.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CONTENT_DIR, loadEnv, syncApuntes, watchApuntes } from './sync-apuntes.ts';

loadEnv();

let stopWatching: (() => void) | undefined;
const from = process.env.APUNTES_DIR;
if (from) {
  // Si el sync falla (origen que no existe, vacío…), Astro arranca igual con la copia del repo y
  // no se vigila nada: vigilar un origen equivocado solo repetiría el error.
  let synced = false;
  try {
    const { copied, removed } = syncApuntes(from, CONTENT_DIR);
    console.log(`[apuntes] ${copied} copiados, ${removed} borrados`);
    synced = true;
  } catch (error) {
    console.error(`[apuntes] ${(error as Error).message}`);
    console.error('[apuntes] se arranca Astro sin vigilar los apuntes');
  }
  if (synced) {
    try {
      stopWatching = watchApuntes(from, CONTENT_DIR);
    } catch (error) {
      console.error(`[apuntes] no se puede vigilar ${from}: ${(error as Error).message}`);
    }
  }
} else {
  console.log('[apuntes] Sin APUNTES_DIR en .env: se arranca solo Astro');
}

// Se ejecuta el JS de Astro con el mismo Node: funciona igual en Windows y sin shell.
const astroBin = fileURLToPath(new URL('../node_modules/astro/bin/astro.mjs', import.meta.url));
const astro = spawn(process.execPath, [astroBin, 'dev', ...process.argv.slice(2)], {
  stdio: 'inherit',
});

astro.on('error', (error) => {
  stopWatching?.();
  console.error(`No se pudo lanzar Astro: ${error.message}`);
  process.exit(1);
});
astro.on('exit', (code) => {
  stopWatching?.();
  process.exit(code ?? 1);
});
// Ctrl+C llega también a Astro (comparten consola); aquí solo se espera a que termine.
process.on('SIGINT', () => {});
