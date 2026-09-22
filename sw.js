// Fast open: pages come from the cache if the network is slow (over 1.2 s),
// and the newest version is saved in the background for next time.
// Other files: cache first, refreshed in the background.
const CACHE = "ladtee-v35";
const SHELL = ["./", "./index.html", "./th.html", "./en.html", "./manifest.webmanifest", "./smile-180.png", "./smile-192.png", "./smile-512.png", "./smile-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
  const isPage = req.mode === "navigate";
  // start the network request right away and keep the worker alive while it saves
  const netP = fetch(req, isPage ? { cache: "no-store" } : undefined);
  const saveP = netP.then(res => {
    if (res && (res.ok || res.type === "opaque")) { const copy = res.clone(); return caches.open(CACHE).then(c => c.put(req, copy)); }
  }).catch(() => {});
  e.waitUntil(saveP);
  if (isPage) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(cached => {
      if (!cached) return netP.catch(() => caches.match("./index.html").then(r => r || Response.error()));
      const slow = new Promise(r => setTimeout(() => r(cached), 1200));
      return Promise.race([netP.catch(() => cached), slow]);
    }));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || netP));
});
