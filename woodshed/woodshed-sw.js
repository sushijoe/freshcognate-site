// The Woodshed moved to /voice/ (renamed "Find Your Voice").
// This service worker REPLACES the old caching one at this URL. It self-
// destructs: clears the old Woodshed caches, unregisters itself, and reloads
// any open client so the next navigation hits the network and lands on the
// redirect page (index.html) → /voice/. This releases anyone who installed
// the old PWA from its cache-first grip. Only woodshed-* caches are touched,
// so the new Find Your Voice app's cache (findyourvoice-v1) is left intact.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.includes('woodshed')).map(k => caches.delete(k)));
    try { await self.registration.unregister(); } catch (e) {}
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(c => { try { c.navigate(c.url); } catch (e) {} });
  })());
});

// Never serve from cache — always pass through so the redirect page loads.
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request).catch(() => new Response('', { status: 504 })));
});
