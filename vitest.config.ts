import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [
        'node_modules/',
        'src/setupTests.ts',
        '**/*.d.ts',
        '**/*.config.ts',
        'build/',
        'dist/',
        'demo/',
        '.history/',
        'coverage/',
        '**/*.test.*',
        '**/*.spec.*',
        '.git/',
        '.cursor/',
        '*.config.*',
        '*.js',
      ],
    },
  },
}) 