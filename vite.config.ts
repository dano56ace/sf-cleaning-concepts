import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'spa-route-rewrite',
      configureServer(server) {
        const legacyWpPostPaths = new Set([
          '/revitalize-your-office-space-with-south-florida-cleaning-concepts-unleashing-the-power-of-a-pristine-workspace',
          '/south-florida-cleaning-concepts-complete-guide-to-home-cleaning-tips-and-tricks',
          '/shining-a-light-on-clean-how-restaurant-and-bar-cleaning-services-enhance-your-business',
          '/office-cleaning-made-easy-with-south-florida-cleaning-concepts',
          '/short-term-rental-cleaning-with-south-florida-cleaning-concepts-the-ultimate-guide',
          '/high-quality-cleaning-services-south-florida-with-south-florida-cleaning-concepts',
          '/medical-office-cleaning-with-south-florida-cleaning-concepts-a-comprehensive-guide',
          '/deep-cleaning-for-homes-and-offices-with-south-florida-cleaning-concepts',
          '/post-construction-cleaning-with-south-florida-cleaning-concepts-a-comprehensive-guide',
          '/maximize-the-beauty-of-your-home-south-florida-home-maintenance-services-with-south-florida-cleaning-concepts',
          '/revitalize-your-home-a-journey-with-south-florida-cleaning-concepts-residential-cleaning-services',
        ]);
        server.middlewares.use((req, _res, next) => {
          if (req.url) {
            const rawPathname = req.url.split('?')[0];
            const cleanPathname =
              rawPathname.length > 1 && rawPathname.endsWith('/')
                ? rawPathname.slice(0, -1)
                : rawPathname;
            const isSpaRoute =
              cleanPathname === '/about-us' ||
              cleanPathname === '/about-us.html' ||
              cleanPathname === '/our-services' ||
              cleanPathname === '/our-services.html' ||
              cleanPathname === '/contact-us' ||
              cleanPathname === '/contact-us.html' ||
              cleanPathname === '/contact' ||
              cleanPathname === '/contact.html' ||
              cleanPathname === '/faqs' ||
              cleanPathname === '/faqs.html' ||
              cleanPathname === '/our-publications' ||
              cleanPathname === '/our-publications.html' ||
              cleanPathname === '/404' ||
              cleanPathname === '/404.html' ||
              cleanPathname === '/service' ||
              cleanPathname === '/service/index.html' ||
              rawPathname.startsWith('/service/') ||
              cleanPathname === '/service-areas' ||
              cleanPathname === '/service-areas.html' ||
              rawPathname.startsWith('/service-area/') ||
              rawPathname.startsWith('/blog/') ||
              legacyWpPostPaths.has(cleanPathname);
            if (isSpaRoute && !rawPathname.match(/\.(js|ts|tsx|css|png|jpg|jpeg|svg|gif|webp|mp4|mp3|woff2?|xml|txt|json)$/i)) {
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
    host: '0.0.0.0',
    allowedHosts: true,
    hmr: process.env.DISABLE_HMR !== 'true',
    open: false,
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: true,
    open: false,
  },
});
