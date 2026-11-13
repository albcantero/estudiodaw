/**
 * @file Tests de la Ayuda por apartado de un test (node --test).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { checkHelp, helpTargets } from './help.ts';

const targets = helpTargets([
  { depth: 2, slug: '1-introduccion', text: '1. Introducción' },
  { depth: 3, slug: 'elementos-conceptuales', text: '1.2 Elementos conceptuales' },
  { depth: 4, slug: 'zona-de-navegacion', text: '2.4.1 Zona de navegación' },
  { depth: 3, slug: 'sin-numero', text: 'Sin número' },
  { depth: 5, slug: 'profundo', text: '1.2.3.4 Demasiado profundo' },
  { depth: 1, slug: 'titulo', text: '9 Título general' },
]);

describe('helpTargets', () => {
  it('indexa por el número inicial del título, solo de nivel 2 a 4', () => {
    assert.deepEqual([...targets.keys()], ['1', '1.2', '2.4.1']);
    assert.equal(targets.get('1')?.slug, '1-introduccion');
    assert.equal(targets.get('2.4.1')?.text, '2.4.1 Zona de navegación');
    assert.deepEqual(targets.get('1.2'), {
      slug: 'elementos-conceptuales',
      text: '1.2 Elementos conceptuales',
    });
  });
});

describe('checkHelp', () => {
  it('sin ningún apartado devuelve none', () => {
    assert.equal(checkHelp([{ number: 1 }, { number: 2 }], targets, 'tema 1'), 'none');
  });

  it('con todos presentes y válidos devuelve ok', () => {
    const questions = [
      { number: 1, apartado: '1.2' },
      { number: 2, apartado: '1' },
      { number: 3, apartado: '2.4.1' },
    ];
    assert.equal(checkHelp(questions, targets, 'tema 1'), 'ok');
  });

  it('si falta uno mientras otros están, lanza con falta el apartado', () => {
    const questions = [{ number: 1, apartado: '1.2' }, { number: 2 }];
    assert.throws(() => checkHelp(questions, targets, 'tema 1'), /pregunta 2.*falta el apartado/);
  });

  it('con un apartado que no está en la teoría, lanza con el número de pregunta', () => {
    const questions = [
      { number: 3, apartado: '1.2' },
      { number: 4, apartado: '7.7' },
    ];
    assert.throws(
      () => checkHelp(questions, targets, 'tema 1'),
      new Error('tema 1, pregunta 4: apartado 7.7 no está en la teoría'),
    );
  });

  it('sin teoría devuelve none', () => {
    assert.equal(checkHelp([{ number: 1, apartado: '1.2' }], undefined, 'tema 1'), 'none');
  });
});
