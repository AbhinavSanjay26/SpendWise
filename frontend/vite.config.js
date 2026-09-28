import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'lovely-energy-production-bfa4.up.railway.app'
    ]
  },

  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'lovely-energy-production-bfa4.up.railway.app'
    ]
  }
})