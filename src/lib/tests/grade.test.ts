/**
 * @file Tests de la corrección de respuestas de un test (node --test).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { gradeKey, isCorrect, normalizeAnswer } from './grade.ts';
import type { Question } from './types.ts';

describe('normalizeAnswer', () => {
  it('recorta, pasa a minúsculas y quita tildes', () => {
    assert.equal(normalizeAnswer('  Gráficos '), 'graficos');
  });

  it('quita las comillas invertidas', () => {
    assert.equal(normalizeAnswer('`table#nuevo`'), 'table#nuevo');
  });

  it('junta los espacios repetidos sin quitar los de dentro', () => {
    assert.equal(normalizeAnswer('a   b\t c'), 'a b c');
    assert.notEqual(normalizeAnswer('table#nuevo'), normalizeAnswer('table #nuevo'));
  });

  it('normaliza a NFC antes de comparar', () => {
    assert.equal(normalizeAnswer('é'), normalizeAnswer('é'));
  });
});

describe('isCorrect', () => {
  it('texto: los espacios de dentro cuentan', () => {
    assert.equal(isCorrect({ type: 'text', answers: ['table#nuevo'] }, ['table #nuevo']), false);
  });

  it('texto: ignora mayúsculas en cada hueco', () => {
    assert.equal(
      isCorrect({ type: 'text', answers: ['comunicar', 'clara'] }, ['Comunicar', 'CLARA']),
      true,
    );
  });

  it('texto: faltan huecos', () => {
    assert.equal(isCorrect({ type: 'text', answers: ['a', 'b'] }, ['a']), false);
  });

  it('multiple: mismo conjunto en cualquier orden', () => {
    assert.equal(isCorrect({ type: 'multiple', answer: ['a', 'd'] }, ['d', 'a']), true);
  });

  it('multiple: un subconjunto no vale', () => {
    assert.equal(isCorrect({ type: 'multiple', answer: ['a', 'd'] }, ['a']), false);
  });

  it('single: compara la letra', () => {
    assert.equal(isCorrect({ type: 'single', answer: 'b' }, 'b'), true);
    assert.equal(isCorrect({ type: 'single', answer: 'b' }, 'c'), false);
  });

  it('match: cada fila con su pareja', () => {
    assert.equal(isCorrect({ type: 'match', rights: ['x', 'y'] }, ['x', 'y']), true);
    assert.equal(isCorrect({ type: 'match', rights: ['x', 'y'] }, ['y', 'x']), false);
  });
});

describe('gradeKey', () => {
  const base = { number: 1, statement: 'Enunciado' };

  it('deja solo lo mínimo de cada tipo', () => {
    const choices = [{ letter: 'a', text: 'A' }];
    const single: Question = { ...base, type: 'single', choices, answer: 'a' };
    const multiple: Question = { ...base, type: 'multiple', choices, answer: ['a'] };
    const text: Question = { ...base, type: 'text', answers: ['x'] };
    const match: Question = {
      ...base,
      type: 'match',
      pairs: [
        { left: 'l1', right: 'r1' },
        { left: 'l2', right: 'r2' },
      ],
    };
    assert.deepEqual(gradeKey(single), { type: 'single', answer: 'a' });
    assert.deepEqual(gradeKey(multiple), { type: 'multiple', answer: ['a'] });
    assert.deepEqual(gradeKey(text), { type: 'text', answers: ['x'] });
    assert.deepEqual(gradeKey(match), { type: 'match', rights: ['r1', 'r2'] });
  });
});
