import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'bikelanes.html',
    },
  },
  server: {
    port: 9000,
  },
});
