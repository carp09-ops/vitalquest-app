const CACHE_NAME = 'vitalquest-shell-v4';
const APP_ROOT = '/vitalquest-app/';
const CORE_ASSETS = [
  APP_ROOT,
  '/vitalquest-app/manifest.json',
  '/vitalquest-app/assets/branding/icon-192.png',
  '/vitalquest-app/assets/branding/apple-touch-icon.png',
  '/vitalquest-app/art/v1/mythic-world.webp',
  '/vitalquest-app/art/v1/mythic-hero.webp',
  '/vitalquest-app/art/v1/training-hall.webp',
  '/vitalquest-app/art/v1/quest-gate.webp',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(APP_ROOT)) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        return cached || caches.match(APP_ROOT);
      })
  );
});
