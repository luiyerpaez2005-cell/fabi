const CACHE_NAME = 'peaje-sombrero-v2';
const assets = [
  './',
  'index.html',
  'manifest.json'
];

// 1. Guardar los archivos en la memoria del teléfono al instalar
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Guardando archivos en memoria para uso sin internet...');
      return cache.addAll(assets);
    }).then(() => self.skipWaiting())
  );
});

// 2. Limpiar versiones viejas si haces cambios en el futuro
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. LA MAGIA: Si no hay internet, carga el sistema desde el teléfono
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Si está guardado en el teléfono, lo usa. Si no, va a buscarlo a internet.
      return cachedResponse || fetch(event.request);
    }).catch(() => {
      // Si falla todo (no internet y no caché), intenta buscar al menos la página principal
      return caches.match('index.html');
    })
  );
});
