/* Service worker for the Roblox Game Idea Randomizer.
   Scope: this folder only (registered as ./sw.js with scope ./), so it never handles
   requests for other tools or sites on the same domain.
   BUILD_VERSION is replaced with a content hash at deploy time; any change to the app
   produces a new service worker, which waits until the user chooses "Update available — reload". */
const BUILD_VERSION = "__BUILD_HASH__";
const CACHE_PREFIX = "gir-pwa-";
const CACHE = CACHE_PREFIX + BUILD_VERSION;
const SCOPE_PATH = new URL("./", self.location).pathname;
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  // Fetch fresh copies (bypassing the HTTP cache) so a new version never caches stale files.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))));
  // No skipWaiting() here: a new version waits for the user's "reload" click.
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    // Remove only this app's old caches; other apps on the same domain use other names.
    await Promise.all(names.filter(n => n.startsWith(CACHE_PREFIX) && n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data && event.data.type === "GET_VERSION" && event.ports[0]) event.ports[0].postMessage(BUILD_VERSION);
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE_PATH)) return; // not ours: let the browser handle it

  if (req.mode === "navigate") {
    // App shell first; works offline. Falls back to the network for anything not cached.
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const hit = await cache.match(req, { ignoreSearch: true }) || await cache.match("./index.html");
      if (hit) return hit;
      return fetch(req);
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok && res.type === "basic") cache.put(req, res.clone()); // keep extra same-folder files for offline use
      return res;
    } catch (err) {
      return new Response("Offline and not cached", { status: 503, statusText: "Offline" });
    }
  })());
});
