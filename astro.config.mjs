import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { codeLangBadge } from './src/utils/code-lang-badge.mjs';

export default defineConfig({
  site: 'https://estudiodaw.dev',
  vite: { plugins: [tailwindcss()] },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light-default', dark: 'vesper' },
      transformers: [codeLangBadge()],
    },
  },
});
