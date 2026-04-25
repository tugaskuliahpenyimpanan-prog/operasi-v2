/* ═══════════════════════════════════════════
   OK Operasi — Service Worker
   Strategi: Cache-first untuk aset statis,
   Network-first untuk halaman utama
═══════════════════════════════════════════ */

const CACHE = 'ok-operasi-v1';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

/* ── Install: pre-cache semua aset ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => {
      return Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => {
          console.warn('[SW] Gagal cache:', url);
        }))
      );
    }).then(() => self.skipWaiting())
  );
});

/* ── Activate: hapus cache lama ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first untuk aset, network-first untuk navigasi ── */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Skip non-GET dan request ke API speech (tidak di-cache)
  if (e.request.method !== 'GET') return;
  if (url.hostname.includes('speech') || url.hostname.includes('google.com/speech')) return;

  // Network-first untuk dokumen HTML utama
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache-first untuk semua aset lain
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => cached);
    })
  );
});
