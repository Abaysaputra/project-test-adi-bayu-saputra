import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
          '/api': {
            target: 'https://suitmedia-backend.suitdev.com',
            changeOrigin: true,
          },
          '/images': {
            target: 'https://assets.suitdev.com',
            changeOrigin: true,
            headers: {
              Referer: 'https://assets.suitdev.com/'
            },
            rewrite: (path) => path.replace(/^\/images/, ''),
          }
        },
  },
})
