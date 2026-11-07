const CACHE_NAME = 'sfcc-pwa-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.webmanifest',
  '/assets/images/logo/logo.svg',
  '/assets/images/icons/favicon.png',
  '/assets/images/icons/icon-192.png',
  '/assets/images/icons/icon-512.png',
  '/assets/videos/bg_video_13.jpeg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url || '';

  // Bypass non-GET, chrome-extension, and dev server requests
  if (
    event.request.method !== 'GET' ||
    !url.startsWith('http') ||
    url.includes('/@vite/') ||
    url.includes('/@react-refresh')
  ) {
    return;
  }

  // 1. Navigation requests -> Network-First with Cache Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((res) => res || caches.match('/')))
    );
    return;
  }

  // 2. Images and Fonts -> Cache-First with Network Fallback
  if (
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    url.includes('/assets/images/') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Static JS/CSS Bundles -> Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
