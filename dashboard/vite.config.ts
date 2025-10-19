import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  define: {
    // Force production Worker URL in development
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://elderlink-dev.elderlinkhelper.workers.dev')
  }
})
