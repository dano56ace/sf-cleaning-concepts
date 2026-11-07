import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

/**
 * Collects all HTML entries for Rollup multi-page build:
 * - 6 Core pages in root
 * - 11 Service pages in service/
 * - 11 Blog pages in blog/
 */
function getHtmlEntries() {
  const entries = {};

  // 1. Root HTML files
  const rootFiles = [
    'index.html',
    'about-us.html',
    'our-services.html',
    'contact-us.html',
    'faqs.html',
    'our-publications.html',
    '404.html'
  ];

  for (const file of rootFiles) {
    const fullPath = resolve(__dirname, file);
    if (fs.existsSync(fullPath)) {
      const key = file === 'index.html' ? 'main' : file.replace('.html', '');
      entries[key] = fullPath;
    }
  }

  // 2. Scan subdirectories (service, blog)
  const subDirs = ['service', 'blog'];
  for (const dirName of subDirs) {
    const dirPath = resolve(__dirname, dirName);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      for (const file of files) {
        if (file.endsWith('.html')) {
          const fullPath = resolve(dirPath, file);
          const baseName = file.replace('.html', '');
          const key = `${dirName}_${baseName}`;
          entries[key] = fullPath;
        }
      }
    }
  }

  return entries;
}

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    rollupOptions: {
      input: getHtmlEntries(),
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    open: false
  },
  preview: {
    port: 4173,
    open: false
  }
});
