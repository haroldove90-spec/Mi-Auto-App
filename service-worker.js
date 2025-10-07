// This is a basic service worker for caching static assets.
var CACHE_NAME = 'mi-auto-app-cache-v1';
var urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  // Note: We don't cache Tailwind CDN as it's external and handled by the browser cache.
  // We should also avoid caching API calls here unless we have a sophisticated strategy.
  // Caching the main image URLs for offline-first experience
  'https://miautoapp.com.mx/wp-content/uploads/2025/10/Toyota-Corolla.png',
  'https://miautoapp.com.mx/wp-content/uploads/2025/10/Honda-CR-V.png',
  'https://miautoapp.com.mx/wp-content/uploads/2025/10/Ford-Mustang.png',
  'https://miautoapp.com.mx/wp-content/uploads/2025/10/Chevrolet-Suburban.png',
  'https://miautoapp.com.mx/wp-content/uploads/2025/10/Tesla-Model-3.png',
  'https://miautoapp.com.mx/wp-content/uploads/2025/10/porshe.png',
  'https://miautoapp.com.mx/wp-content/uploads/2025/06/Mi-Auto-App-transparente.png',
  'https://miautoapp.com.mx/miautoapp.png' // New icon for install prompt
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});