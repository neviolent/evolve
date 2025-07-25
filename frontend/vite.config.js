// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr(), // Убедитесь, что svgr() здесь
  ],
  server: {
    host: true, // или '0.0.0.0'
  },
});

