/**
 * @file Tests de la sincronización de apuntes con carpetas temporales (node --test).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { scanSources } from '../src/lib/apuntes/scan.ts';
import { syncApuntes } from './sync-apuntes.ts';

const SUBJECT = '07 Digitalización Aplicada a los Sectores Productivos';
const NOTES = `${SUBJECT}/mis apuntes`;

let tmp: string;
let from: string;
let to: string;

/**
 * Escribe un fichero en el origen, creando las carpetas que falten.
 *
 * @param rel Ruta relativa al origen.
 * @param content Contenido del fichero.
 */
function put(rel: string, content = '# Tema 1: Digitalización y empresa\n'): void {
  const full = path.join(from, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
}

/**
 * Lista recursiva de ficheros de una carpeta (rutas relativas con `/`, en NFC).
 *
 * @param dir Carpeta a recorrer.
 * @returns Las rutas ordenadas.
 */
function list(dir: string): string[] {
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) =>
      path.relative(dir, path.join(e.parentPath, e.name)).replaceAll('\\', '/').normalize('NFC'),
    )
    .sort();
}

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'apuntes-'));
  from = path.join(tmp, 'from');
  to = path.join(tmp, 'to');
  fs.mkdirSync(from);
});

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe('syncApuntes', () => {
  it('copia solo la lista blanca', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    put(`${NOTES}/TEST tema 1.md`);
    put(`${NOTES}/tarea 1.md`);
    put(`${NOTES}/mis soluciones/x.md`);
    put(`${NOTES}/img/a.png`, 'png');

    syncApuntes(from, to);

    assert.deepEqual(list(to), [
      `${NOTES}/TEORÍA tema 1.md`,
      `${NOTES}/TEST tema 1.md`,
      `${NOTES}/img/a.png`,
    ]);
  });

  it('borra lo que desaparece del origen', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    put(`${NOTES}/TEST tema 1.md`);
    syncApuntes(from, to);

    fs.rmSync(path.join(from, NOTES, 'TEST tema 1.md'));
    const result = syncApuntes(from, to);

    assert.equal(result.removed, 1);
    assert.deepEqual(list(to), [`${NOTES}/TEORÍA tema 1.md`]);
  });

  it('solo copia lo que cambia', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    assert.equal(syncApuntes(from, to).copied, 1);
    assert.equal(syncApuntes(from, to).copied, 0);
  });

  it('no toca el origen', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    put(`${NOTES}/tarea 1.md`);
    /**
     * Foto del origen: rutas y fechas de modificación.
     *
     * @returns Lista de `ruta:mtime`.
     */
    const snapshot = () =>
      list(from).map((rel) => `${rel}:${fs.statSync(path.join(from, rel)).mtimeMs}`);
    const before = snapshot();

    syncApuntes(from, to);
    fs.rmSync(to, { recursive: true });
    syncApuntes(from, to);

    assert.deepEqual(snapshot(), before);
  });

  it('falla con un fichero que no encaja', () => {
    put(`${NOTES}/TEST tema 2 (copia).md`);
    assert.throws(
      () => syncApuntes(from, to),
      (e: Error) => e.message.includes('TEST tema 2 (copia).md'),
    );
  });

  it('se niega a mezclar origen y destino', () => {
    assert.throws(() => syncApuntes(from, path.join(from, 'dentro')));
    assert.throws(() => syncApuntes(path.join(to, 'dentro'), to));
  });
});

describe('scanSources', () => {
  it('temas', () => {
    put(`${NOTES}/TEORÍA tema 1.md`, '# Tema 1: Digitalización y empresa\n\ntexto\n');
    const { temas, problems } = scanSources(from);

    assert.deepEqual(problems, []);
    assert.equal(temas.length, 1);
    assert.partialDeepStrictEqual(temas[0], {
      subject: 'dasp',
      slug: 'digitalizacion-y-empresa',
      number: 1,
      unit: 'UD1',
    });
  });

  it('avisa de dos carpetas con el mismo número de tema', () => {
    put(`${NOTES}/tema 1 - Uno/ejercicios.md`);
    put(`${NOTES}/tema 1 - Otro/ejercicios.md`);
    assert.equal(scanSources(from).problems.length, 1);
  });
});
