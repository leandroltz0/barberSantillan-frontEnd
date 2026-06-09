// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'static',
  adapter: vercel(),
  server: { port: 4321 },
  vite: {
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
  },
});
