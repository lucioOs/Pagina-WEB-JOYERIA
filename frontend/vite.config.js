import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceso externo (ej. desde Cloudflare)
    proxy: {
      '/api': 'http://localhost:3000'
    },
    allowedHosts: [
      'footwear-breakfast-worldwide-ons.trycloudflare.com'
    ]
  }
});
