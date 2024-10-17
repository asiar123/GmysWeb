import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': {
        target: 'https://ws.gmys.com.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/login/, '/login'), // Esto reenvía la solicitud correctamente
      },
    },
  },
});
