import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@cabalex/platinum-extract': path.resolve(__dirname, 'public/platinum-extract/index.js')
    }
  },
  plugins: [svelte()]
});
