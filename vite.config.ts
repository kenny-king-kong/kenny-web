import { defineConfig } from 'vite'

// https://vite.dev/guide/static-deploy
export default defineConfig({
  base: '/kenny-web/',
  build: {
    outDir: 'docs'
  }
})
