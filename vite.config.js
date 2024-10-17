import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';  // Importar el plugin de PWA

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Mi Aplicación PWA',
        short_name: 'MiApp',
        description: 'Una aplicación progresiva para monitoreo',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192x192.png',  // Debes tener estos íconos en la carpeta public
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      registerType: 'autoUpdate', // Actualiza automáticamente cuando haya cambios en el Service Worker
    }),
  ],
  server: {
    proxy: {
      '/login': {
        target: 'https://ws.gmys.com.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/login/, '/login'),
      },
    },
  },
});
