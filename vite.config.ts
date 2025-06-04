import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'demo',
  base: '/svg-mesh/',
  build: {
    outDir: '../build',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
}) 