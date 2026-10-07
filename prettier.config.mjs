/**
 * @file Configuración de Prettier: el formato de todo el proyecto. Punto y coma, comillas
 * simples, comas finales y 100 columnas, lo que pide la guía de estilo de Airbnb.
 * prettier-plugin-tailwindcss ordena las clases de Tailwind; tiene que ir el último.
 *
 * @author Alberto Cantero
 * @license MIT
 */
export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/styles/global.css',
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
