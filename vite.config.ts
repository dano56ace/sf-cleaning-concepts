import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'spa-route-rewrite',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url) {
            const pathname = req.url.split('?')[0];
            const isSpaRoute =
              pathname === '/about-us' ||
              pathname === '/about-us.html' ||
              pathname === '/our-services' ||
              pathname === '/our-services.html' ||
              pathname === '/contact-us' ||
              pathname === '/contact-us.html' ||
              pathname === '/faqs' ||
              pathname === '/faqs.html' ||
              pathname === '/our-publications' ||
              pathname === '/our-publications.html' ||
              pathname === '/404' ||
              pathname === '/404.html' ||
              pathname === '/service' ||
              pathname === '/service/' ||
              pathname === '/service/index.html' ||
              pathname.startsWith('/service/') ||
              pathname.startsWith('/blog/');
            if (isSpaRoute && !pathname.match(/\.(js|ts|tsx|css|png|jpg|jpeg|svg|gif|webp|mp4|mp3|woff2?|xml|txt|json)$/i)) {
              req.url = '/index.html';
            }
          }
          next();
        });
      },
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2022',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/react/') || id.includes('/react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('/react-router') || id.includes('/react-router-dom/')) {
              return 'vendor-router';
            }
            if (id.includes('/lucide-react/')) {
              return 'vendor-icons';
            }
            return 'vendor-misc';
          }
          if (id.includes('/src/data/')) {
            return 'site-data';
          }
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (assetInfo.name && /\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (assetInfo.name && /\.(png|jpe?g|svg|webp|gif|avif)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  preview: {
    port: 4173,
    open: false,
  },
});
