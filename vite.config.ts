import { defineConfig } from 'vite'

// https://vite.dev/guide/static-deploy
export default defineConfig({
  base: '/REPO_NAME/', // <-- IMPORTANT for GitHub Pages
})
