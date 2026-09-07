// VisualCNS service worker. Bump CACHE when the offline shell changes so old
// caches are cleared on the next activation.
const CACHE = "visualcns-v1"
const OFFLINE_URL = "/offline"
const PRECACHE = [OFFLINE_URL, "/icon.svg", "/apple-icon.png"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  if (request.method !== "GET") return

  // Page navigations: try the network, fall back to the cached offline page so
  // the app opens something instead of the browser error when offline.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)))
    return
  }

  // Static same-origin assets: serve from cache first, then fill the cache.
  const url = new URL(request.url)
  if (url.origin === self.location.origin && /\.(?:css|js|svg|png|jpg|jpeg|webp|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone()
            caches.open(CACHE).then((cache) => cache.put(request, copy))
            return response
          }),
      ),
    )
  }
})
