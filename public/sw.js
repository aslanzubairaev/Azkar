/* Минимальный Service Worker для PWA-установки.
   Пропускает все запросы в сеть без кэширования. */
self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
});
