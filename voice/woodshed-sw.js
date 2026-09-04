const CACHE_NAME = 'findyourvoice-v1';
const ASSETS = [
  './index.html',
  './woodshed.css',
  './woodshed-tunes-core.js',
  './woodshed-manifest.json',
  './woodshed-icon-192.svg',
  './woodshed-icon-512.svg',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://unpkg.com/vexflow@4.2.5/build/cjs/vexflow.js',
  'https://cdn.jsdelivr.net/npm/tone@15.0.4/build/Tone.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
