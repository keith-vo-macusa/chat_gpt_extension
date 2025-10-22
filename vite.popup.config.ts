import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/popup.tsx'),
      output: {
        entryFileNames: 'popup.js',
        format: 'iife',
        name: 'ChatGPTPopup'
      }
    }
  }
})
