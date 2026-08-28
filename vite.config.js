import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  base: '/portfolio/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  },
  plugins: [
    {
      name: 'copy-404',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist');
        const indexHtml = resolve(distDir, 'index.html');
        const fourOhFourHtml = resolve(distDir, '404.html');
        if (fs.existsSync(indexHtml)) {
          fs.copyFileSync(indexHtml, fourOhFourHtml);
        }
      }
    }
  ]
});


