import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { codeLangBadge } from './src/utils/code-lang-badge.mjs';

export default defineConfig({
  site: 'https://estudiodaw.dev',
  // sitemap-index.xml para buscadores; las URL de tema son solo redirecciones y no entran
  integrations: [sitemap({ filter: (page) => !/^https:\/\/estudiodaw\.dev\/[^/]+\/[^/]+\/?$/.test(page) })],
  vite: { plugins: [tailwindcss()] },
  // Fuentes de Google descargadas en el build y servidas desde el propio dominio.
  // Astro genera además una fuente de respaldo con las métricas ajustadas (size-adjust,
  // ascent/descent-override) a partir de los genéricos de fallbacks: el texto no salta
  // cuando la fuente real termina de cargar.
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
      weights: [400],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-default', dark: 'vesper' },
      transformers: [codeLangBadge()],
    },
  },
});
