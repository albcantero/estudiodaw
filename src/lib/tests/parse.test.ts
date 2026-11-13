/**
 * @file Tests del lector de los TEST tema N.md (node --test). Los fragmentos están copiados del
 * formato real de los ficheros.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseTest, TestFormatError } from './parse.ts';

const SOURCE = 'TEST tema 1.md';

/**
 * Monta un test con su título y las líneas dadas.
 *
 * @param lines Líneas del cuerpo.
 * @returns El Markdown completo.
 */
function md(...lines: string[]): string {
  return ['# Test tema 1: Prueba', '', ...lines, ''].join('\n');
}

/**
 * Lee el fragmento y devuelve su primera pregunta.
 *
 * @param lines Líneas del cuerpo.
 * @returns La primera pregunta.
 */
function first(...lines: string[]) {
  return parseTest(md(...lines), SOURCE).questions[0];
}

/**
 * Comprueba que el fragmento hace fallar al lector con un mensaje que empieza por el dado.
 *
 * @param prefix Principio esperado del mensaje.
 * @param lines Líneas del cuerpo.
 */
function assertFails(prefix: string, ...lines: string[]): void {
  assert.throws(
    () => parseTest(md(...lines), SOURCE),
    (error: unknown) => error instanceof TestFormatError && error.message.startsWith(prefix),
  );
}

describe('parseTest', () => {
  it('una opción', () => {
    const q = first(
      '**1.** La percepción es una ___ significativa de las sensaciones.',
      '',
      '- a) organización',
      '- b) interpretación',
      '- c) ordenación',
      '- d) invención',
      '',
      '**Respuesta:** b',
    );
    assert.equal(q.type, 'single');
    assert.ok(q.type === 'single');
    assert.equal(q.answer, 'b');
    assert.equal(q.choices.length, 4);
    assert.equal(q.number, 1);
    assert.equal(q.statement, 'La percepción es una ___ significativa de las sensaciones.');
    assert.deepEqual(q.choices[1], { letter: 'b', text: 'interpretación' });
  });

  it('verdadero o falso es una opción', () => {
    const q = first(
      '**1.** Siempre es preferible utilizar páginas web dinámicas antes que páginas web estáticas.',
      '',
      '- a) Verdadero',
      '- b) Falso',
      '',
      '**Respuesta:** b',
    );
    assert.equal(q.type, 'single');
  });

  it('varias', () => {
    const q = first(
      '**1.** Cuando un navegador descarga una página web, esta...',
      '',
      '- a) puede incluir también código en lenguaje JavaScript',
      '- b) puede incluir también referencias a una hoja de estilos CSS',
      '- c) puede incluir también comentarios en formato PHP',
      '- d) puede utilizar AJAX para obtener información de un servidor de Internet',
      '',
      '**Respuesta:** a, b, d',
    );
    assert.ok(q.type === 'multiple');
    assert.deepEqual(q.answer, ['a', 'b', 'd']);
  });

  it('varias con una sola correcta', () => {
    const q = first(
      '**1.** ¿Cuáles de los siguientes son lenguajes de guiones? (una o más)',
      '',
      '- a) Java',
      '- b) C#',
      '- c) PHP',
      '- d) Visual Basic.Net',
      '',
      '**Respuesta:** c',
    );
    assert.ok(q.type === 'multiple');
    assert.deepEqual(q.answer, ['c']);
  });

  it('huecos con ·', () => {
    const q = first(
      '**1.** Para realizar un buen diseño, una persona debe ___ las ideas y conceptos de una forma ___ y directa, por medio de los elementos ___.',
      '',
      '**Respuesta:** comunicar · clara · gráficos',
    );
    assert.ok(q.type === 'text');
    assert.deepEqual(q.answers, ['comunicar', 'clara', 'gráficos']);
  });

  it('huecos numerados con ;', () => {
    const q = first(
      '**1.** Rellena los huecos: ___ (1): es el contenedor de servlets de Tomcat. ___ (2): es el conector HTTP.',
      '',
      '**Respuesta:** (1) Catalina; (2) Coyote',
    );
    assert.ok(q.type === 'text');
    assert.deepEqual(q.answers, ['Catalina', 'Coyote']);
  });

  it('relacionar sin la palabra Relaciona', () => {
    const q = first(
      '**1.** Asocia los siguientes campos con sus correspondientes identificadores.',
      '',
      '| Campo | Identificador |',
      '|---|---|',
      '| authuser | %u |',
      '| host | %h |',
      '| date | %t |',
    );
    assert.ok(q.type === 'match');
    assert.equal(q.pairs.length, 3);
    assert.deepEqual(q.pairs[0], { left: 'authuser', right: '%u' });
    assert.equal(
      q.statement,
      'Asocia los siguientes campos con sus correspondientes identificadores.',
    );
  });

  it('bloque de código en el enunciado', () => {
    const q = first(
      '**1.** ¿Qué se muestra en pantalla al ejecutar el siguiente código?',
      '',
      '```php',
      '$a = "-3.1416";',
      String.raw`printf("La variable \'\$a\' vale %+.2f", $a);`,
      '```',
      '',
      "- a) La variable '$a' vale -3.14.",
      "- b) La variable '$a' vale +3.14.",
      String.raw`- c) La variable \\'$a\\' vale -3.14.`,
      String.raw`- d) La variable \\'$a\\' vale +3.14.`,
      '',
      '**Respuesta:** c',
    );
    assert.ok(q.type === 'single');
    assert.ok(q.statement.includes('```php'));
    assert.ok(q.statement.endsWith('```'));
    assert.equal(q.choices.length, 4);
  });

  it('nota Ojo', () => {
    const q = first(
      '**1.** En una aplicación web, se conoce como "back end" a:',
      '',
      '- a) El personal que se encarga de gestionar y administrar la aplicación',
      '- b) Los almacenes de datos a los que accede la aplicación',
      '',
      '**Respuesta:** b',
      '',
      '**Ojo:** el Moodle da por buena la a.',
    );
    assert.equal(q.note, '**Ojo:** el Moodle da por buena la a.');
  });

  it('apartado', () => {
    const q = first(
      '**1.** Los elementos conceptuales de diseño son el punto, ___, el plano y el volumen.',
      '',
      '- a) la recta',
      '- b) la línea',
      '',
      '**Respuesta:** b',
      '',
      '**Apartado:** 1.2',
    );
    assert.equal(q.apartado, '1.2');
  });

  it('título, introducción y apartado grande', () => {
    const test = parseTest(
      [
        '# Test tema 2: Tecnologías habilitadoras digitales (THD)',
        '',
        'Banco del cuestionario del Moodle.',
        '',
        '## 1. Elementos del lenguaje PHP',
        '',
        '### 1.1 Generación de código HTML',
        '',
        '**1.** ¿Siempre se puede sustituir una sentencia switch por otra sentencia if?',
        '',
        '- a) Sí',
        '- b) No',
        '',
        '**Respuesta:** a',
      ].join('\r\n'),
      SOURCE,
    );
    assert.equal(test.title, 'Tecnologías habilitadoras digitales (THD)');
    assert.equal(test.intro, 'Banco del cuestionario del Moodle.');
    assert.equal(test.questions[0].section, '1. Elementos del lenguaje PHP');
    assert.ok(test.questions[0].type === 'single');
    assert.equal(test.questions[0].choices[1].text, 'No');
  });

  it('letra inexistente', () => {
    assertFails(
      `${SOURCE}, pregunta 1: `,
      '**1.** Los elementos conceptuales de diseño son el punto, ___, el plano y el volumen.',
      '',
      '- a) la recta',
      '- b) el arco',
      '- c) la línea',
      '- d) el borde',
      '',
      '**Respuesta:** e',
    );
  });

  it('huecos que no cuadran', () => {
    assertFails(
      `${SOURCE}, pregunta 1: `,
      '**1.** Una persona debe ___ las ideas de una forma ___ y directa.',
      '',
      '**Respuesta:** comunicar',
    );
  });

  it('pregunta sin respuesta ni tabla', () => {
    assertFails(
      `${SOURCE}, pregunta 1: `,
      '**1.** ¿Son las líneas visibles en la naturaleza?',
      '',
      '- a) Verdadero',
      '- b) Falso',
    );
  });

  it('"varias" suelto no hace la pregunta de varias', () => {
    const q = first(
      '**1.** ¿Puedes utilizar include o require para incluir el mismo encabezado HTML en varias páginas?',
      '',
      '- a) Sí',
      '- b) No',
      '',
      '**Respuesta:** a',
    );
    assert.equal(q.type, 'single');
  });

  it('el error junta todos los problemas del fichero', () => {
    assert.throws(
      () =>
        parseTest(
          md(
            '**1.** ¿Son las líneas visibles en la naturaleza?',
            '',
            '- a) Verdadero',
            '- b) Falso',
            '',
            '**2.** Una persona debe ___ las ideas de una forma ___ y directa.',
            '',
            '**Respuesta:** comunicar',
          ),
          SOURCE,
        ),
      (error: unknown) =>
        error instanceof TestFormatError &&
        error.problems.length === 2 &&
        error.problems[1].startsWith(`${SOURCE}, pregunta 2: `),
    );
  });

  it('números de pregunta repetidos', () => {
    assertFails(
      `${SOURCE}, pregunta 1: `,
      '**1.** El lenguaje más utilizado en plataformas AMP es ___.',
      '',
      '**Respuesta:** PHP',
      '',
      '**1.** La directiva del tiempo máximo de ejecución se llama ___.',
      '',
      '**Respuesta:** max_execution_time',
    );
  });
});

describe('formatos que no se aceptan', () => {
  it('opciones sin guion: la respuesta de letra no pasa por texto', () => {
    assertFails(
      `${SOURCE}, pregunta 1: la respuesta «b» son letras`,
      '**1.** ¿Qué principio pide que lo igual se vea igual?',
      '',
      'a) Persistencia',
      'b) Consistencia',
      '',
      '**Respuesta:** b',
    );
  });

  it('opciones con asterisco o en mayúscula y varias letras', () => {
    assertFails(
      `${SOURCE}, pregunta 1: la respuesta «A, C» son letras`,
      '**1.** ¿Cuáles son lenguajes de guiones? (una o más)',
      '',
      '* A) PHP',
      '- B) HTML',
      '* C) Python',
      '',
      '**Respuesta:** A, C',
    );
  });

  it('una respuesta escrita de varias letras sigue siendo texto', () => {
    const q = first('**1.** La etiqueta de tabla es ___.', '', '**Respuesta:** table');
    assert.ok(q.type === 'text');
    assert.deepEqual(q.answers, ['table']);
  });

  it('la primera pregunta tiene que ser la 1', () => {
    assertFails(
      `${SOURCE}, pregunta 2: número de pregunta fuera de orden: tocaba la 1`,
      '**2.** El lenguaje más utilizado en plataformas AMP es ___.',
      '',
      '**Respuesta:** PHP',
    );
  });

  it('un salto en la numeración falla', () => {
    assertFails(
      `${SOURCE}, pregunta 3: número de pregunta fuera de orden: tocaba la 2`,
      '**1.** El lenguaje más utilizado en plataformas AMP es ___.',
      '',
      '**Respuesta:** PHP',
      '',
      '**3.** La directiva del tiempo máximo de ejecución se llama ___.',
      '',
      '**Respuesta:** max_execution_time',
    );
  });
});

describe('todos los tests del repo se leen', () => {
  const root = fileURLToPath(new URL('../../content/apuntes/', import.meta.url));
  const files = existsSync(root)
    ? readdirSync(root, { recursive: true, encoding: 'utf8' })
        .filter((path) => /^test.*\.md$/i.test(basename(path)))
        .sort()
    : [];

  it('sin errores en ninguna pregunta', { skip: files.length === 0 }, () => {
    const problems: string[] = [];
    files.forEach((path) => {
      try {
        const test = parseTest(readFileSync(join(root, path), 'utf8'), path);
        if (test.questions.length === 0) problems.push(`${path}: no tiene preguntas`);
      } catch (error) {
        if (!(error instanceof TestFormatError)) throw error;
        problems.push(...error.problems);
      }
    });
    assert.deepEqual(problems, []);
  });
});
