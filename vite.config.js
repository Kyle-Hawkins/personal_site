import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src-resume'),
      '@components': path.resolve(__dirname, './src-resume/components'),
      '@utils': path.resolve(__dirname, './src-resume/utils')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
