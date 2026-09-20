// Pages: network first (always newest when online, cached copy when offline).
// Other files: cache first, refreshed in the background.
const CACHE = "ladtee-v15";
const SHELL = ["./", "./index.html", "./en.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const isPage = req.mode === "navigate" || req.url.endsWith(".html") || req.url.endsWith("/");
  const save = res => { if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };
  if (isPage) {
    e.respondWith(fetch(req, {cache: "no-store"}).then(save).catch(() => caches.match(req).then(hit => hit || caches.match("./index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => { const net = fetch(req).then(save).catch(() => hit); return hit || net; }));
});
