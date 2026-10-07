/**
 * @file Configuración de Astro: dominio, sitemap, Tailwind, fuentes y resaltado de código.
 *
 * @author Alberto Cantero
 * @license MIT
 */
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { SITE_NAME } from './src/data/site';
import { codeLangBadge } from './src/plugins/code-lang-badge';
import { codeScrollFade } from './src/plugins/code-scroll-fade';

const SITE_URL = `https://${SITE_NAME}`;

/**
 * ¿Es la URL de un tema (/<asignatura>/<tema>)? Son solo redirecciones al primer documento,
 * así que no entran en el sitemap.
 *
 * @param page URL completa de la página.
 * @returns Si es la URL de un tema.
 */
const isTopicRedirect = (page: string): boolean =>
  new URL(page).pathname.replace(/\/$/, '').split('/').length === 3;

export default defineConfig({
  site: SITE_URL,
  // sitemap-index.xml para los buscadores
  integrations: [sitemap({ filter: (page) => !isTopicRedirect(page) })],
  vite: { plugins: [tailwindcss()] },
  // Imágenes remotas que se descargan al compilar y se sirven desde la web: el avatar del pie
  image: { domains: ['avatars.githubusercontent.com'] },
  // Fuentes de Google descargadas en el build y servidas desde el propio dominio. Astro genera
  // además una fuente de respaldo con las métricas ajustadas a partir de los genéricos de
  // fallbacks: el texto no salta cuando la fuente real termina de cargar.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Funnel Sans',
      cssVariable: '--font-funnel-sans',
      weights: ['300 800'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Cardo',
      cssVariable: '--font-cardo',
      // La negrita, solo para lo que resalta el buscador en los títulos
      weights: [400, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-default', dark: 'vesper' },
      // En este orden: el segundo busca el <pre> dentro de la <figure> del primero
      transformers: [codeLangBadge(), codeScrollFade()],
    },
  },
});
