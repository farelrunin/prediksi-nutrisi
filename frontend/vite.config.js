import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    host: true
  },
  build: {
    // Raise chunk warning threshold to 1500 KB
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Vite 8 / Rolldown: manualChunks must be a function
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Large animation/3D libs → isolated chunk
            if (id.includes('gsap') || id.includes('ogl')) {
              return 'vendor-animation';
            }
            // Recharts is heavy (~400KB) → isolated
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) {
              return 'vendor-charts';
            }
            // Icon libraries → rarely change, great for long-term HTTP caching
            if (id.includes('lucide-react') || id.includes('@heroicons')) {
              return 'vendor-icons';
            }
            // Google OAuth
            if (id.includes('@react-oauth')) {
              return 'vendor-auth';
            }
            // Axios
            if (id.includes('axios')) {
              return 'vendor-axios';
            }
            // React core + router → always cached together
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
})
