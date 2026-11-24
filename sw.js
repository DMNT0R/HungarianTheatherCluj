// Einfacher Offline-Cache für die App-Hülle (Kartenkacheln werden nicht vorab geladen).
const CACHE = "buehne-kolozsvar-v2";
const SHELL = [
  "./", "index.html", "css/style.css", "js/stations.js", "js/audio.js", "js/app.js",
  "img/icon.svg", "manifest.webmanifest",
  "vendor/leaflet/leaflet.css",
  "vendor/leaflet/leaflet.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Audiodateien und Kartenkacheln: Netzwerk zuerst, bei Erfolg im Cache ablegen.
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && (url.origin === location.origin || url.hostname.endsWith("tile.openstreetmap.org"))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
