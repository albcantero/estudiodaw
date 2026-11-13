/**
 * @file Tests de la Ayuda por apartado de un test (node --test).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { answerTexts, checkHelp, helpLabel, helpTargets } from './help.ts';
import type { Question } from './types.ts';

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

describe('helpLabel', () => {
  const consistency = { slug: 'consistencia', text: '2.2 Consistencia' };
  const base = { number: 23, statement: 'Enunciado', apartado: '2.2' };

  it('con la opción correcta en el título, solo cita el apartado', () => {
    const question: Question = {
      ...base,
      type: 'single',
      choices: [
        { letter: 'a', text: 'Persistencia' },
        { letter: 'b', text: '<strong>Consistencia</strong>' },
      ],
      answer: 'b',
    };
    assert.equal(helpLabel(consistency, '2.2', question), 'apartado 2.2');
  });

  it('con una opción incorrecta en el título, enseña el título', () => {
    const question: Question = {
      ...base,
      type: 'single',
      choices: [
        { letter: 'a', text: 'Consistencia' },
        { letter: 'b', text: 'Persistencia' },
      ],
      answer: 'b',
    };
    assert.equal(helpLabel(consistency, '2.2', question), '2.2 Consistencia');
  });

  it('cualquier opción correcta de varias delata, sin tildes ni mayúsculas', () => {
    const target = {
      slug: 'elementos',
      text: '1.3 Elementos visuales: forma, medida, color, textura',
    };
    const question: Question = {
      ...base,
      type: 'multiple',
      choices: [
        { letter: 'a', text: 'Lógica' },
        { letter: 'b', text: 'MEDIDA' },
      ],
      answer: ['a', 'b'],
    };
    assert.equal(helpLabel(target, '1.3', question), 'apartado 1.3');
  });

  it('una opción correcta de menos de cuatro caracteres no cuenta', () => {
    const question: Question = {
      ...base,
      type: 'single',
      choices: [
        { letter: 'a', text: 'Sí' },
        { letter: 'b', text: 'No' },
      ],
      answer: 'a',
    };
    assert.equal(helpLabel(consistency, '2.2', question), '2.2 Consistencia');
  });

  it('una respuesta escrita en el título delata', () => {
    const question: Question = { ...base, type: 'text', answers: ['`consistencia`'] };
    assert.equal(helpLabel(consistency, '2.2', question), 'apartado 2.2');
  });

  it('una pareja de relacionar en el título delata', () => {
    const target = { slug: 'tablas', text: '3.4 Tablas, capas, marcos' };
    const question: Question = {
      ...base,
      type: 'match',
      pairs: [
        { left: 'Rejilla', right: 'Tablas' },
        { left: 'Superpuesto', right: 'Capas' },
      ],
    };
    assert.equal(helpLabel(target, '3.4', question), 'apartado 3.4');
  });

  it('el número del título no cuenta como respuesta', () => {
    const question: Question = { ...base, type: 'text', answers: ['2'] };
    assert.equal(helpLabel(consistency, '2.2', question), '2.2 Consistencia');
  });
});

describe('answerTexts', () => {
  it('deshace etiquetas y entidades de las opciones renderizadas', () => {
    const question: Question = {
      number: 1,
      statement: 'Enunciado',
      type: 'single',
      choices: [{ letter: 'a', text: '<code>&lt;table&gt;</code>' }],
      answer: 'a',
    };
    assert.deepEqual(answerTexts(question), ['<table>']);
  });
});
