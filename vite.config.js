import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // scripts/prerender.mjs reads the manifest to preload each page's own chunk
    manifest: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // One small icon chunk instead of dozens of tiny per-icon files
        manualChunks: (id) => (id.includes('node_modules/lucide-react') ? 'icons' : undefined),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
