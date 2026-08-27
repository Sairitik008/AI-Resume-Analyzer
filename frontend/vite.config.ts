import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Auto-inject SCSS variables + mixins into every .scss/.module.scss file.
        // Component module files do NOT need @import — Vite handles it here.
        additionalData: `
          @import "@/styles/abstracts/_variables";
          @import "@/styles/abstracts/_mixins";
        `,
      },
    },
  },
});
