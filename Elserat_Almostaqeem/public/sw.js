const CACHE_NAME = 'zad-cache-v3'; // Bumped version to force update
const BG_SYNC_QUEUE = 'zad-bg-sync-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-512.webp',
    '/icons/icon-192.webp',
    '/apple-touch-icon.png'
];

self.addEventListener('install', event => {
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event => {
    // Delete any old caches to ensure the new version is loaded
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like API calls or external audio streams
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network-First Strategy for HTML (navigation) to always get the latest app shell
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    if (event.request.method !== 'GET') {
        event.respondWith((async () => {
            try {
                return await fetch(event.request);
            } catch (err) {
                await queueRequest(event.request);
                if (self.registration.sync) {
                    await self.registration.sync.register(BG_SYNC_QUEUE);
                }
                return new Response(JSON.stringify({ queued: true }), {
                    status: 202,
                    headers: { 'content-type': 'application/json' }
                });
            }
        })());
        return;
    }

    // Cache-First (Stale-While-Revalidate) Strategy for assets (CSS, JS, Images)
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                });
                return networkResponse;
            }).catch(() => { });

            return cachedResponse || fetchPromise;
        })
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag !== BG_SYNC_QUEUE) return;
    event.waitUntil(flushQueuedRequests());
});

async function queueRequest(request) {
    const cache = await caches.open(BG_SYNC_QUEUE);
    const key = new Request(`/__bg_sync__/${Date.now()}-${Math.random()}`);
    await cache.put(key, new Response(JSON.stringify({
        url: request.url,
        method: request.method,
    }), { headers: { 'content-type': 'application/json' } }));
}

async function flushQueuedRequests() {
    const cache = await caches.open(BG_SYNC_QUEUE);
    const keys = await cache.keys();
    for (const key of keys) {
        try {
            const data = await (await cache.match(key)).json();
            await fetch(data.url, { method: data.method || 'GET', mode: 'cors', credentials: 'omit' });
            await cache.delete(key);
        } catch (_) {
            // keep queued for next sync
        }
    }
}

self.addEventListener('push', event => {
    let data = {};
    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        console.error('Error parsing push data', e);
    }

    const title = data.title || 'الصراط المستقيم';
    const options = {
        body: data.body || 'لديك إشعار جديد',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {
            url: data.url || '/'
        },
        dir: 'rtl',
        vibrate: [200, 100, 200]
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
                for (let client of windowClients) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data.url);
                }
            })
        );
    }
});
