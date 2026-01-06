// ============================================
// FILE: vite.config.js
// Updated with cache busting for production
// ============================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    // Force new build hash on every deployment
    rollupOptions: {
      output: {
        // Generate unique filenames with hash for cache busting
        manualChunks: undefined,
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    // Ensure clean builds
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext'
  }
})