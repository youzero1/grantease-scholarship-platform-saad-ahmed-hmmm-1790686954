import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { fileURLToPath } from 'url';
import path from 'path';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: projectRoot,
  plugins: [
    tanstackRouter({ target: 'react' }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': path.join(projectRoot, 'src') },
  },
  server: {
    hmr: { overlay: false },
  },
});
