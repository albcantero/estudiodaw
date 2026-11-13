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
import { syllabus } from '../src/data/syllabus.ts';
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

  it('borra lo que desaparece del origen si a la vez copia algo', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    put(`${NOTES}/TEST tema 1.md`);
    syncApuntes(from, to);

    fs.rmSync(path.join(from, NOTES, 'TEST tema 1.md'));
    put(`${NOTES}/TEORÍA tema 1.md`, '# Tema 1: Digitalización y empresa\n\nNuevo\n');
    const result = syncApuntes(from, to);

    assert.deepEqual(result, { copied: 1, removed: 1 });
    assert.deepEqual(list(to), [`${NOTES}/TEORÍA tema 1.md`]);
  });

  it('solo borrar, sin copiar nada, pide --force', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    put(`${NOTES}/TEST tema 1.md`);
    syncApuntes(from, to);
    fs.rmSync(path.join(from, NOTES, 'TEST tema 1.md'));

    assert.throws(() => syncApuntes(from, to), /se borrarían 1 ficheros sin copiar ninguno/);
    assert.equal(list(to).length, 2);

    assert.deepEqual(syncApuntes(from, to, { force: true }), { copied: 0, removed: 1 });
    assert.deepEqual(list(to), [`${NOTES}/TEORÍA tema 1.md`]);
  });

  it('con un origen que no existe, falla sin tocar el destino', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    syncApuntes(from, to);
    const missing = path.join(tmp, 'no-existe');

    assert.throws(
      () => syncApuntes(missing, to),
      (e: Error) => e.message.includes(`no existe la carpeta de origen ${missing}`),
    );
    assert.deepEqual(list(to), [`${NOTES}/TEORÍA tema 1.md`]);
  });

  it('con un origen que es un fichero, falla sin tocar el destino', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    syncApuntes(from, to);
    const file = path.join(from, NOTES, 'TEORÍA tema 1.md');

    assert.throws(() => syncApuntes(file, to), /no existe la carpeta de origen/);
    assert.deepEqual(list(to), [`${NOTES}/TEORÍA tema 1.md`]);
  });

  it('con un origen vacío, falla sin tocar el destino aunque se fuerce', () => {
    put(`${NOTES}/TEORÍA tema 1.md`);
    syncApuntes(from, to);
    const empty = path.join(tmp, 'vacio');
    fs.mkdirSync(path.join(empty, NOTES), { recursive: true });
    fs.writeFileSync(path.join(empty, NOTES, 'tarea 1.md'), 'privado');

    [{}, { force: true }].forEach((options) => {
      assert.throws(
        () => syncApuntes(empty, to, options),
        (e: Error) => e.message.includes(`no hay ningún apunte publicable en ${empty}`),
      );
    });
    assert.deepEqual(list(to), [`${NOTES}/TEORÍA tema 1.md`]);
  });

  it('no publica lo que está más hondo que la carpeta del tema', () => {
    put(`${NOTES}/tema 1 - Uno/TEORÍA tema 1.md`);
    put(`${NOTES}/tema 1 - Uno/img/a.png`, 'png');
    put(`${NOTES}/tema 1 - Uno/tarea 1/ejercicios.md`);

    assert.throws(() => syncApuntes(from, to), /tarea 1\/ejercicios\.md/);
    assert.equal(fs.existsSync(to), false);

    fs.rmSync(path.join(from, NOTES, 'tema 1 - Uno', 'tarea 1'), { recursive: true });
    syncApuntes(from, to);
    assert.deepEqual(list(to), [
      `${NOTES}/tema 1 - Uno/TEORÍA tema 1.md`,
      `${NOTES}/tema 1 - Uno/img/a.png`,
    ]);
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

  it('avisa de dos temas con el mismo slug, con las dos rutas', () => {
    put(`${NOTES}/tema 1 - Repaso/ejercicios.md`);
    put(`${NOTES}/tema 2 - Repaso/ejercicios.md`);
    const { problems } = scanSources(from);

    assert.equal(problems.length, 1);
    assert.match(problems[0], /dasp\/repaso/);
    assert.ok(problems[0].includes(`${NOTES}/tema 1 - Repaso/ejercicios.md`));
    assert.ok(problems[0].includes(`${NOTES}/tema 2 - Repaso/ejercicios.md`));
    assert.throws(() => syncApuntes(from, to), /Tema repetido en dasp/);
  });

  it('el título sale del temario oficial y la URL de la carpeta', () => {
    put(`${NOTES}/TEORÍA tema 1.md`, '# Tema 1: Digitalización y empresa\n');
    put(`${NOTES}/TEST tema 7.md`, '# Test tema 7: Un tema sin UD en el temario\n');
    const [first, seventh] = scanSources(from).temas;

    assert.equal(first.title, syllabus.dasp[0].title);
    assert.equal(first.slug, 'digitalizacion-y-empresa');
    assert.equal(seventh.title, 'Un tema sin UD en el temario');
  });
});
