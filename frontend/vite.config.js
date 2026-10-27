import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    // El front (5173) pide /api/... a su mismo origen y Vite lo reenvía a la
    // API de Express (3000). Para el navegador es el mismo origen: no hay CORS.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
