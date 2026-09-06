import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 5173,
    proxy: {
      // Contact API is served by the Express app in ./server during development.
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        /**
         * Split vendor code by module path rather than by package name.
         *
         * The object form (`{ react: ['react-dom'] }`) only matches a
         * package's entry module, so `react-dom/client` and its internals
         * were landing in the app chunk instead — which meant every content
         * edit invalidated ~200kB of unchanged framework code in visitors'
         * caches. Matching on the resolved path catches the whole subtree.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/node_modules[/\\](react-router|@remix-run)/.test(id)) return 'router';
          if (/node_modules[/\\](react-dom|react|scheduler)[/\\]/.test(id)) return 'react';
          if (/node_modules[/\\](motion|framer-motion)/.test(id)) return 'motion';
          // Anything else stays with the entry chunk. There is no catch-all
          // 'vendor' group because these four are the only dependencies —
          // emitting one would just produce an empty file.
          return undefined;
        },
      },
    },
  },
});
