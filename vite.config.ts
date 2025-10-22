import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
    {
      name: 'copy-files',
      writeBundle() {
        // Copy manifest.json
        copyFileSync('manifest.json', 'dist/manifest.json')
        // Copy content.css
        copyFileSync('src/content.css', 'dist/content.css')
      }
    }
  ],
  build: {
    outDir: 'dist',
    minify: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/content.tsx'),
      output: {
        entryFileNames: 'content.js',
        format: 'iife',
        name: 'ChatGPTMessageNavigator',
        inlineDynamicImports: true,
        manualChunks: undefined
      }
    }
  }
})
