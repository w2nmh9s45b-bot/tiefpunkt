/* Spieltisch - Service Worker. Offline zuerst: jeder Start kommt aus dem Speicher des Geraets.
   Eine neue Fassung laedt ALLE Dateien in einen eigenen Speicher und gilt ab dem naechsten Start.
   Ein laufendes Spiel wird dabei nie neu geladen. VERSION setzt Werkzeuge/bauen.py. */
var VERSION = "4c042d3ff388";
var CACHE = "spieltisch-" + VERSION;
var ASSETS = [
  "./",
  "./fonts/atkinson-400.woff2",
  "./fonts/atkinson-700.woff2",
  "./fonts/bricolage.woff2",
  "./gemeinsam/kern.css",
  "./gemeinsam/kern.js",
  "./gemeinsam/netz.js",
  "./gemeinsam/three.module.min.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./manifest.webmanifest",
  "./spiele/dame.html",
  "./spiele/dame.logik.js",
  "./spiele/etappen.html",
  "./spiele/etappen.logik.js",
  "./spiele/fuenferpasch.html",
  "./spiele/fuenferpasch.logik.js",
  "./spiele/funkstille.daten.js",
  "./spiele/funkstille.html",
  "./spiele/funkstille.logik.js",
  "./spiele/halma.html",
  "./spiele/halma.logik.js",
  "./spiele/heimlauf.html",
  "./spiele/heimlauf.logik.js",
  "./spiele/igelhuegel.html",
  "./spiele/igelhuegel.logik.js",
  "./spiele/kritzeln.daten.js",
  "./spiele/kritzeln.html",
  "./spiele/kritzeln.logik.js",
  "./spiele/letztekarte.html",
  "./spiele/letztekarte.logik.js",
  "./spiele/maexchen.html",
  "./spiele/maexchen.logik.js",
  "./spiele/maumau.html",
  "./spiele/maumau.logik.js",
  "./spiele/muehle.html",
  "./spiele/muehle.logik.js",
  "./spiele/paare.daten.js",
  "./spiele/paare.html",
  "./spiele/paare.logik.js",
  "./spiele/poker.html",
  "./spiele/poker.logik.js",
  "./spiele/rheinbaron.html",
  "./spiele/rheinbaron.logik.js",
  "./spiele/romme.html",
  "./spiele/romme.logik.js",
  "./spiele/ruhighand.daten.js",
  "./spiele/ruhighand.html",
  "./spiele/ruhighand.logik.js",
  "./spiele/schach.html",
  "./spiele/schach.logik.js",
  "./spiele/schiffe.html",
  "./spiele/schiffe.logik.js",
  "./spiele/schwimmen.html",
  "./spiele/schwimmen.logik.js",
  "./spiele/stadtlandfluss.html",
  "./spiele/stadtlandfluss.logik.js",
  "./spiele/stapelei.html",
  "./spiele/stapelei.logik.js",
  "./spiele/tiefpunkt.html",
  "./spiele/vierreihe.html",
  "./spiele/vierreihe.logik.js",
  "./spiele/wortverbot.daten.js",
  "./spiele/wortverbot.html",
  "./spiele/wortverbot.logik.js",
  "./spiele/zahlenromme.html",
  "./spiele/zahlenromme.logik.js",
  "./spiele/zahnweh.html",
  "./spiele/zahnweh.logik.js"
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
    return Promise.all(keys.filter(function (k) { return (k.indexOf('spieltisch-') === 0 || k.indexOf('tiefpunkt-') === 0) && k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(e.request, {ignoreSearch: true}).then(function (hit) {
      if (hit) return hit;
      if (e.request.mode === 'navigate' && /\/$/.test(url.pathname)) return c.match('./');
      return fetch(e.request);
    });
  }));
});
