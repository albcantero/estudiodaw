/**
 * @file Tests de la clasificación de los ficheros de la carpeta de apuntes (node --test).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  classifySource,
  looksPublishable,
  slugify,
  temaTitle,
  titleFromHeading,
  unitOf,
} from './sources.ts';

describe('classifySource', () => {
  it('teoría de un tema con carpeta', () => {
    const relPath =
      '08 Diseño de Interfaces Web/mis apuntes/tema 1 - Planificación de interfaces/TEORÍA tema 1.md';
    assert.deepEqual(classifySource(relPath), {
      relPath,
      subject: 'diw',
      temaNumber: '1',
      temaFolder: 'tema 1 - Planificación de interfaces',
      kind: 'teoria',
    });
  });

  it('test de un ligero, sin carpeta de tema', () => {
    assert.equal(
      classifySource('10 Sostenibilidad Aplicada al Sistema Productivo/mis apuntes/TEST tema 2.md')
        ?.temaNumber,
      '2',
    );
  });

  it('tilde mal puesta: TEORIÁ', () => {
    assert.equal(
      classifySource('01 Lenguaje de Marcas/mis apuntes/tema 1 - XML/TEORIÁ tema 1.md')?.kind,
      'teoria',
    );
  });

  it('nombre en NFD (Mac) se reconoce y sale en NFC', () => {
    const nfc = '08 Diseño de Interfaces Web/mis apuntes/tema 1 - X/TEORÍA tema 1.md';
    const nfd = nfc.normalize('NFD');
    assert.equal(classifySource(nfd)?.relPath, nfc);
  });

  it('tema 4.5', () => {
    assert.equal(
      classifySource(
        '08 Diseño de Interfaces Web/mis apuntes/tema 4.5 - Flexbox y Grid/TEORÍA tema 4.5.md',
      )?.temaNumber,
      '4.5',
    );
  });

  it('ejercicios y soluciones', () => {
    assert.equal(
      classifySource('08 Diseño de Interfaces Web/mis apuntes/tema 1 - X/ejercicios.md')?.kind,
      'ejercicios',
    );
    assert.equal(
      classifySource(
        '08 Diseño de Interfaces Web/mis apuntes/tema 1 - X/ejercicios con soluciones propuestas.md',
      )?.kind,
      'soluciones',
    );
  });

  it('ejercicios sin carpeta de tema no se clasifican', () => {
    assert.equal(classifySource('08 Diseño de Interfaces Web/mis apuntes/ejercicios.md'), null);
  });

  it('no publicables', () => {
    const paths = [
      '08 Diseño de Interfaces Web/mis apuntes/tema 1 - X/tarea 1.md',
      '08 Diseño de Interfaces Web/mis apuntes/tema 1 - X/mis soluciones/TEST tema 1.md',
      '09 IPE II/mis apuntes/TEORÍA tema 1.md',
    ];
    paths.forEach((p) => assert.equal(classifySource(p), null));
  });
});

describe('looksPublishable', () => {
  it('parece publicable pero no encaja', () => {
    const p = '08 Diseño de Interfaces Web/mis apuntes/tema 2 - X/TEST tema 2 (copia).md';
    assert.equal(looksPublishable(p), true);
    assert.equal(classifySource(p), null);
  });

  it('lo de mis soluciones y lo ajeno a mis apuntes no lo parece', () => {
    assert.equal(
      looksPublishable(
        '08 Diseño de Interfaces Web/mis apuntes/tema 1 - X/mis soluciones/TEST tema 1.md',
      ),
      false,
    );
    assert.equal(looksPublishable('08 Diseño de Interfaces Web/tarea 1/TEST tema 1.md'), false);
  });
});

describe('títulos', () => {
  it('quita los prefijos del encabezado', () => {
    assert.equal(
      titleFromHeading('# Tema 1: Digitalización y actividad de la empresa'),
      'Digitalización y actividad de la empresa',
    );
    assert.equal(titleFromHeading('# TEORÍA tema 2: Retos ambientales'), 'Retos ambientales');
    assert.equal(
      titleFromHeading('# Unidad 4.5. Maquetación moderna: Flexbox y Grid'),
      'Maquetación moderna: Flexbox y Grid',
    );
    assert.equal(
      titleFromHeading('# Tema 1 — XML: estructura y sintaxis'),
      'XML: estructura y sintaxis',
    );
  });

  it('acepta el encabezado sin la almohadilla', () => {
    assert.equal(titleFromHeading('Test tema 3: Residuos'), 'Residuos');
  });

  it('el título de la carpeta manda sobre el del encabezado', () => {
    assert.equal(
      temaTitle('tema 1 - Planificación de interfaces', '# Unidad 1. Otra cosa'),
      'Planificación de interfaces',
    );
    assert.equal(temaTitle(undefined, '# Unidad 1. Otra cosa'), 'Otra cosa');
  });
});

describe('slugify y unitOf', () => {
  it('slug y UD', () => {
    assert.equal(slugify('Planificación de interfaces'), 'planificacion-de-interfaces');
    assert.equal(unitOf('3'), 'UD3');
    assert.equal(unitOf('4.5'), undefined);
  });
});
