import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '^/api/*' :{
        target: process.env.SERVER_URL,
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, ''),
      }
    }
  }
})
