import { defineConfig } from 'vite'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...(process.env.NODE_ENV === 'production'
        ? {
            '@huggingface/transformers':
              'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0-alpha.9',
          }
        : {}),
    },
  },
  plugins: [vue()],
  build: {
    target: 'esnext',
  },
})
