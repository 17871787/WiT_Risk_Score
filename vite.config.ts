import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
          'ui-vendor': ['lucide-react'],
          'state': ['zustand'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts', 'zustand'],
  },
})