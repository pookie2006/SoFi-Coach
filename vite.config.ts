import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { scanApiPlugin } from './vite-plugin-scan-api.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), scanApiPlugin()],
  base: process.env.VITE_BASE || '/',
  server: {
    host: true,
    port: 5180,
    strictPort: true,
    allowedHosts: true,
  },
})
