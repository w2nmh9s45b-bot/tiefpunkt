/* Tiefpunkt - Service Worker. Offline zuerst: jeder Start kommt aus dem Speicher des Geraets.
   Neue Fassung: Der Browser installiert den neuen Worker, der laedt ALLE Dateien in einen eigenen
   Speicher und uebernimmt erst, wenn jede Datei angekommen ist. Ein laufendes Spiel wird dabei nicht
   neu geladen; die neue Fassung gilt ab dem naechsten Start. VERSION setzt Werkzeuge/offline-bauen.py. */
var VERSION = "70b24dd77f13";
var CACHE = "tiefpunkt-" + VERSION;
var ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./fonts/atkinson-400.woff2",
  "./fonts/atkinson-700.woff2",
  "./fonts/bricolage.woff2",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(ASSETS.map(function (u) {
      return fetch(new Request(u, {cache: 'reload'})).then(function (r) {
        if (!r.ok) throw new Error(u + ' ' + r.status);
        return c.put(u, r);
      });
    }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('tiefpunkt-') === 0 && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    var key = e.request.mode === 'navigate' ? './' : e.request;
    return c.match(key, {ignoreSearch: true}).then(function (hit) {
      return hit || fetch(e.request);
    });
  }));
});
