const CACHE_NAME = 'ssstikpro-cache-v3';
const MEDIA_CACHE = 'ssstikpro-media-v2';
const MAX_MEDIA_ENTRIES = 50;

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) => Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== MEDIA_CACHE) return caches.delete(key);
        })
      )),
      self.clients.claim()
    ])
  );
});

// Helper to limit cache size
const limitCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxItems));
      }
    });
  });
};

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache Media/Proxy Requests (GET only)
  if (url.pathname.startsWith('/api/proxy') && event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(MEDIA_CACHE).then((cache) => {
              cache.put(event.request, copy);
              limitCacheSize(MEDIA_CACHE, MAX_MEDIA_ENTRIES);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Common assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networked = fetch(event.request)
        .then((response) => {
          if (response.ok) {
             const copy = response.clone();
             caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networked;
    })
  );
});
