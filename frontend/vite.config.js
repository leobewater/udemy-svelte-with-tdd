import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => {
        //   console.log(path);
        //   const p = path.replace(/^\/api/, '/api');
        //   console.log(p);
        //   return path;
        // },
      },
    },
  },
});
