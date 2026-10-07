/**
 * @file Tests de las funciones de usuario y código del login (node --test).
 *
 * @author Alberto Cantero
 * @license MIT
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isValidUser,
  nameFromEmail,
  normalizeCode,
  normalizeName,
  normalizeUser,
  toSchoolEmail,
  usernameOf,
} from './user.ts';

describe('normalizeUser', () => {
  it('quita espacios y pasa a minúsculas', () => {
    assert.equal(normalizeUser('  Ejemplo.Correo '), 'ejemplo.correo');
  });

  it('se queda con lo de antes de la @ si pegan el correo entero', () => {
    assert.equal(normalizeUser('Ejemplo.Correo@educa.jcyl.es '), 'ejemplo.correo');
    assert.equal(normalizeUser('correo@gmail.com'), 'correo');
  });

  it('devuelve vacío si no hay usuario', () => {
    assert.equal(normalizeUser('   '), '');
    assert.equal(normalizeUser('@educa.jcyl.es'), '');
  });
});

describe('isValidUser', () => {
  it('admite letras, cifras, punto, guion y guion bajo', () => {
    assert.ok(isValidUser('ejemplo.correo_2-b'));
  });

  it('rechaza vacío, espacios y otros caracteres', () => {
    assert.ok(!isValidUser(''));
    assert.ok(!isValidUser('ejemplo correo'));
    assert.ok(!isValidUser('correo+x'));
    assert.ok(!isValidUser('añá'));
  });
});

describe('toSchoolEmail', () => {
  it('junta el usuario con el dominio del centro', () => {
    assert.equal(toSchoolEmail('ejemplo.correo'), 'ejemplo.correo@educa.jcyl.es');
  });
});

describe('normalizeCode', () => {
  it('se queda solo con las cifras', () => {
    assert.equal(normalizeCode('123 456'), '123456');
    assert.equal(normalizeCode('123-456'), '123456');
  });

  it('corta a 6 cifras', () => {
    assert.equal(normalizeCode('12345678'), '123456');
  });
});

describe('usernameOf', () => {
  it('es lo de antes de la @', () => {
    assert.equal(usernameOf('ejemplo.correo@educa.jcyl.es'), 'ejemplo.correo');
  });

  it('sin @, el correo tal cual', () => {
    assert.equal(usernameOf('correo'), 'correo');
  });
});

describe('nameFromEmail', () => {
  it('es la primera parte del usuario, con mayúscula', () => {
    assert.equal(nameFromEmail('ejemplo.correo@educa.jcyl.es'), 'Ejemplo');
    assert.equal(nameFromEmail('ejemplo_correo@educa.jcyl.es'), 'Ejemplo');
    assert.equal(nameFromEmail('correo-ejemplo@educa.jcyl.es'), 'Correo');
  });

  it('sin las cifras', () => {
    assert.equal(nameFromEmail('ejemplo23.correo@educa.jcyl.es'), 'Ejemplo');
  });

  it('vacío si no queda nada que parezca un nombre', () => {
    assert.equal(nameFromEmail('1234@educa.jcyl.es'), '');
    assert.equal(nameFromEmail(''), '');
  });
});

describe('normalizeName', () => {
  it('quita los espacios de los bordes y junta los de dentro', () => {
    assert.equal(normalizeName('  Nombre   Compuesto '), 'Nombre Compuesto');
  });

  it('corta a 50 caracteres', () => {
    assert.equal(normalizeName('a'.repeat(60)).length, 50);
  });

  it('devuelve vacío si solo hay espacios', () => {
    assert.equal(normalizeName('   '), '');
  });
});
