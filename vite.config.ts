import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const fileName = fileURLToPath(import.meta.url)
const dirName = dirname(fileName)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(dirName, './src')
    }
  },
  preview: {
    port: 5173
  }
})
