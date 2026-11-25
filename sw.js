// Einfacher Offline-Cache für die App-Hülle (Kartenkacheln werden nicht vorab geladen).
const CACHE = "ioi-cluj-v26";
const SHELL = [
  "./", "index.html", "css/style.css", "js/i18n.js", "js/i18n-extra.js", "js/stations.js", "js/stations-locales.js", "js/audio.js", "js/boot.js", "js/app.js",
  "img/flags/en.svg", "img/flags/hu.svg", "img/flags/ro.svg", "img/flags/tr.svg", "img/flags/fa.svg", "img/flags/es.svg", "img/flags/ca.svg", "img/flags/de.svg", "img/flags/ar.svg", "img/flags/fr.svg",
  "img/icon.svg", "img/icon-192.png", "manifest.webmanifest",
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
  // Server-Antworten (Touren, Portal, Admin) nie zwischenspeichern
  if (url.origin === location.origin && url.pathname.startsWith("/api/")) return;
  // Audiodateien und Kartenkacheln: Netzwerk zuerst, bei Erfolg im Cache ablegen.
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.status === 200 && (url.origin === location.origin || url.hostname.endsWith("tile.openstreetmap.org"))) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
