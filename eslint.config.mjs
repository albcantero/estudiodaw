/**
 * @file ESLint: guía de estilo de Airbnb en todo el JavaScript y TypeScript del proyecto
 * (eslint-config-airbnb-extended, su versión para ESLint 9 con TypeScript) y las reglas
 * recomendadas de Astro para los .astro. El formato lo pone Prettier: eslint-config-prettier, al
 * final, apaga las reglas de estilo que chocarían con él.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import js from '@eslint/js';
import { configs, plugins } from 'eslint-config-airbnb-extended';
import astro from 'eslint-plugin-astro';
import jsdoc from 'eslint-plugin-jsdoc';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

/** Bloque de Airbnb que apaga las reglas de TypeScript que necesitan información de tipos */
const TYPE_CHECKED_OFF = 'airbnb/config/base-typescript-disable-type-checked';

/**
 * Junta en un objeto las reglas de varios bloques de configuración.
 *
 * @param {import('eslint').Linter.Config[]} blocks Bloques de configuración.
 * @returns {import('eslint').Linter.RulesRecord} Las reglas de todos, juntas.
 */
const rulesOf = (blocks) => Object.assign({}, ...blocks.map((block) => block.rules ?? {}));

/**
 * Junta los plugins de varios bloques de configuración.
 *
 * @param {import('eslint').Linter.Config[]} blocks Bloques de configuración.
 * @returns {Record<string, import('eslint').ESLint.Plugin>} Los plugins de todos, juntos.
 */
const pluginsOf = (blocks) => Object.assign({}, ...blocks.map((block) => block.plugins ?? {}));

const airbnbPlugins = [plugins.stylistic, plugins.importX, plugins.typescriptEslint];

export default [
  { ignores: ['dist/', '.astro/', 'node_modules/', 'public/'] },

  js.configs.recommended,
  ...airbnbPlugins,
  ...configs.base.recommended,
  ...configs.base.typescript,
  ...astro.configs.recommended,

  // Airbnb ata sus reglas a .js y .ts; aquí se aplican también al frontmatter de los .astro.
  // Sin las que necesitan tipos (el parser de Astro no los da; ya los comprueba astro check).
  {
    files: ['**/*.astro'],
    plugins: pluginsOf(airbnbPlugins),
    rules: {
      ...rulesOf(configs.base.recommended),
      ...rulesOf(configs.base.typescript.filter((block) => block.name !== TYPE_CHECKED_OFF)),
      ...rulesOf(configs.base.typescript.filter((block) => block.name === TYPE_CHECKED_OFF)),
    },
  },

  {
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      // Las rutas de Astro y Vite (astro:content, ?raw, @tabler/icons/…) no las resuelve el
      // plugin de importaciones; TypeScript (astro check) ya comprueba que existen.
      'import-x/no-unresolved': 'off',
      'import-x/extensions': 'off',
      // Módulos de utilidades con una sola exportación con nombre: se importan por su nombre
      'import-x/prefer-default-export': 'off',
    },
  },

  // Scripts en línea (src/scripts/inline): scripts clásicos que se ejecutan antes del primer
  // pintado y dejan su función en window
  {
    files: ['src/scripts/inline/**/*.js'],
    languageOptions: { sourceType: 'script' },
    rules: {
      // Las llaman los <script> en línea que los cargan: boot() en Base.astro y setupPins() en
      // el panel lateral
      'no-unused-vars': ['error', { varsIgnorePattern: '^(boot|setupPins)$' }],
      strict: 'off',
    },
  },

  // Documentación: cabecera de fichero con @file, @author y @license, y JSDoc en cada función
  // con sus parámetros y lo que devuelve, todo descrito. En TypeScript los tipos ya van en el
  // código: el JSDoc no los repite; en JavaScript, sí.
  {
    files: ['**/*.{js,mjs,ts,astro}'],
    ...jsdoc.configs['flat/recommended-error'],
  },
  {
    files: ['**/*.ts', '**/*.astro'],
    ...jsdoc.configs['flat/recommended-typescript-error'],
  },
  {
    files: ['**/*.{js,mjs,ts,astro}'],
    rules: {
      'jsdoc/require-file-overview': [
        'error',
        {
          tags: {
            file: { mustExist: true, preventDuplicates: true, initialCommentsOnly: true },
            author: { mustExist: true, preventDuplicates: true, initialCommentsOnly: true },
            license: { mustExist: true, preventDuplicates: true, initialCommentsOnly: true },
          },
        },
      ],
      'jsdoc/require-jsdoc': [
        'error',
        {
          // Toda función con nombre: declarada, método o guardada en una constante. Las que son
          // un valor (callbacks de forEach o map, propiedades de un objeto de configuración) no:
          // se leen en su sitio
          require: { FunctionDeclaration: true, MethodDefinition: true },
          contexts: [
            'VariableDeclarator > ArrowFunctionExpression',
            'VariableDeclarator > FunctionExpression',
          ],
          checkConstructors: false,
          exemptEmptyFunctions: true,
        },
      ],
      'jsdoc/require-description': 'error',
      // Un parámetro desestructurado se describe entero, no propiedad a propiedad
      'jsdoc/require-param': ['error', { checkDestructured: false }],
      'jsdoc/check-param-names': ['error', { checkDestructured: false }],
      // Una línea en blanco entre la descripción y las etiquetas; entre etiquetas, la que haga falta
      // Los tipos de los .js son documentación: no los comprueba nada (los de .ts, TypeScript)
      'jsdoc/no-undefined-types': 'off',
      'jsdoc/tag-lines': ['error', 'any', { startLines: 1 }],
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-returns-description': 'error',
    },
  },
  // Los <script> de los .astro son trozos del componente: su cabecera es la del componente
  {
    files: ['**/*.astro/*.ts', '**/*.astro/*.js'],
    rules: { 'jsdoc/require-file-overview': 'off' },
  },

  // Configuración, herramientas y tests que corren en Node
  {
    files: [
      '*.config.{mjs,ts}',
      'src/plugins/**/*.ts',
      'src/lib/svg.ts',
      'src/lib/build-info.ts',
      'src/**/*.test.ts',
    ],
    languageOptions: { globals: { ...globals.node } },
  },

  prettier,
];
