import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // keep console stamps
        drop_debugger: true,
        pure_funcs: ['console.debug', 'console.info'], // only remove debug/info, keep log/warn/error
      },
      format: {
        comments: /©|copyright/i, // Preserve copyright comments
      },
      mangle: {
        toplevel: true, // Obfuscate top-level variable and function names
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          html2canvas: ['html2canvas'],
        },
      },
    },
  },
});