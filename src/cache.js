/* cache.js
 * Service worker.
 * This must live at the application's root.
 */

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open("akweather-1").then((cache) => {
    cache.addAll([
      "/",
      "/index.html",
      "/weather.css",
      "/mini.js",
      "/manifest.webmanifest",
    ]);
  }));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(async function() {
    const cachedResponse = await caches.match(event.request);
    if (cachedResponse) return cachedResponse;
    return fetch(event.request);
  }());
});
