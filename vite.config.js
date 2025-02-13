import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0, // This ensures assets are properly handled
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  base: './' // This helps with relative paths in production
});