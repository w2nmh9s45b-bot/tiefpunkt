/* Ruhige Hand – reine Spielregeln und Berührungsrechnung (ohne DOM). Geschicklichkeitsspiel: Teile aus ihren Mulden
   holen, ohne den Rand zu berühren.

   QUELLE: Spielanleitung des bekannten Operationsspiels mit Summer (Ausgabe des Originalverlags mit Arzt- und
   Spezialistenkarten) nach bekanntem Wortlaut – beim Bau am 09.11.2026 nicht erneut online nachgelesen.

   GRUNDREGEL, wie hier umgesetzt (Begriffe eigen: Aufgabenkarte = Arztkarte, Fachkarte = Spezialistenkarte)
   - Zu jedem Teil gibt es eine Aufgabenkarte mit Belohnung und eine Fachkarte.
   - Vorbereitung: Die Fachkarten werden gemischt und reihum vollständig an alle verteilt (offen vor sich hingelegt).
     Die Aufgabenkarten liegen gemischt und verdeckt als Stapel bereit.
   - Wer dran ist, zieht die oberste Aufgabenkarte und versucht, genau dieses Teil herauszuholen, ohne den Rand zu
     berühren. Gelingt es, gibt es die Belohnung von der Bank und das Teil bleibt draußen.
   - Summt es (Rand berührt), ist der Versuch vorbei, das Teil kommt zurück in seine Mulde. Jetzt darf, wer die
     passende Fachkarte hat, es sofort versuchen – gelingt es, gibt es die DOPPELTE Belohnung.
   - Misslingt auch das (oder hat niemand sonst die Fachkarte), kommt die Aufgabenkarte unter den Stapel.
   - Danach ist die nächste Person (nach der, die die Karte gezogen hat) dran.
   - Spielende: wenn alle Teile draußen sind. Wer die meisten Taler hat, gewinnt; Gleichstand: geteilter Sieg.

   AUSLEGUNGEN
   - Hält die Person, die gerade gesummt hat, selbst die Fachkarte, gibt es keinen zweiten Versuch: Karte unter den Stapel.
   - Wer beginnt: laut Anleitung die jüngste Person – am Gerät Spieler 1 (Option: Zufall).
   - Allein (1 Person): ohne Fachkarten; jede misslungene Aufgabe kommt unter den Stapel. Gezählt werden Taler und Summer.
   - Auf dem Bildschirm wird das Teil nicht mit einer Pinzette angehoben, sondern mit dem Finger durch seinen Gang aus
     dem Körper gezogen. Die Mulde mit Gang ist genau die Fläche, die die (konvexe Hülle der) Form überstreicht, wenn
     man sie den vorgesehenen Weg entlangschiebt – erweitert um den Randabstand (Schwierigkeit: leicht/mittel/schwer).
     Berührt wird, sobald ein Punkt des echten Umrisses (alle 3 Einheiten abgetastet) diese Fläche verlässt. Zwischen
     zwei Fingerpositionen wird in Schritten von höchstens 1,5 Einheiten geprüft – schnelles Ziehen springt nicht über
     den Rand. Geschafft ist es, wenn das ganze Teil seitlich außerhalb des Körpers liegt. Loslassen ist erlaubt:
     das Teil bleibt liegen, wo es ist, und man kann weiterziehen.
*/
"use strict";
(function () {
  const DATEN = typeof module !== 'undefined' ? require('./ruhighand.daten.js') : window.RuhigeHandDaten;
  const {BRETT, TEILE} = DATEN;
  const RANDABSTAND = {leicht: 15, mittel: 10, schwer: 6};
  const PROBE = 3, SCHRITT = 1.5;

  /* ---------- Geometrie ---------- */
  const kreuz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  function huelle(pkt) { // konvexe Hülle (monotone Kette)
    const p = [...pkt].sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (p.length < 3) return p;
    const u = [], l = [];
    for (const q of p) { while (l.length >= 2 && kreuz(l[l.length - 2], l[l.length - 1], q) <= 0) l.pop(); l.push(q); }
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (u.length >= 2 && kreuz(u[u.length - 2], u[u.length - 1], q) <= 0) u.pop(); u.push(q); }
    return l.slice(0, -1).concat(u.slice(0, -1));
  }
  function abstandStrecke(q, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy;
    let t = l ? ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / l : 0; t = Math.max(0, Math.min(1, t));
    return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy);
  }
  function innenKonvex(q, poly) { // poly aus huelle(): gleichbleibender Umlaufsinn
    for (let i = 0; i < poly.length; i++) if (kreuz(poly[i], poly[(i + 1) % poly.length], q) < 0) return false;
    return true;
  }
  function abstandKonvex(q, poly) {
    if (innenKonvex(q, poly)) return 0;
    let m = Infinity; for (let i = 0; i < poly.length; i++) m = Math.min(m, abstandStrecke(q, poly[i], poly[(i + 1) % poly.length]));
    return m;
  }
  function abtasten(umriss, st = PROBE) { // Umriss alle `st` Einheiten
    const out = [];
    for (let i = 0; i < umriss.length; i++) {
      const a = umriss[i], b = umriss[(i + 1) % umriss.length], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / st));
      for (let k = 0; k < n; k++) out.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    return out;
  }
  const GEO = {};
  /** Vorberechnung je Teil: Hülle, Abtastpunkte, voller Weg (mit Endpunkt draußen), Bahn-Polygone (absolut). */
  function geo(id) {
    if (GEO[id]) return GEO[id];
    const t = TEILE.find(x => x.id === id); if (!t) throw new Error('Unbekanntes Teil: ' + id);
    const H = huelle(t.umriss), [rx, ry] = t.ruhe;
    const weg = [[0, 0], ...t.weg], letzt = weg[weg.length - 1], links = letzt[0] < 0;
    const xs = H.map(p => p[0]);
    const endX = links ? BRETT.torso.x0 - 14 - (rx + Math.max(...xs)) : BRETT.torso.x1 + 14 - (rx + Math.min(...xs));
    weg.push([endX, letzt[1]]);
    const polys = [];
    for (let i = 0; i < weg.length - 1; i++) {
      const a = weg[i], b = weg[i + 1];
      const p = huelle([...H.map(q => [rx + a[0] + q[0], ry + a[1] + q[1]]), ...H.map(q => [rx + b[0] + q[0], ry + b[1] + q[1]])]);
      const bx = p.map(q => q[0]), by = p.map(q => q[1]);
      polys.push({p, x0: Math.min(...bx), x1: Math.max(...bx), y0: Math.min(...by), y1: Math.max(...by)});
    }
    return (GEO[id] = {id, teil: t, H, proben: abtasten(t.umriss), weg, polys, links, ruhe: t.ruhe});
  }
  const ausserhalb = q => q[0] < BRETT.torso.x0 || q[0] > BRETT.torso.x1;
  /** Liegt Punkt q (Brett) in der freien Fläche von Teil g bei Randabstand c? */
  function punktFrei(g, q, c) {
    if (ausserhalb(q)) return true;
    for (const P of g.polys) {
      if (q[0] < P.x0 - c || q[0] > P.x1 + c || q[1] < P.y0 - c || q[1] > P.y1 + c) continue;
      if (abstandKonvex(q, P.p) <= c) return true;
    }
    return false;
  }
  /** Teil an Versatz o (relativ zur Ruhelage): frei? Bei Berührung der erste Kontaktpunkt. */
  function lageFrei(id, o, c) {
    const g = geo(id), [rx, ry] = g.ruhe;
    for (const p of g.proben) { const q = [rx + o[0] + p[0], ry + o[1] + p[1]]; if (!punktFrei(g, q, c)) return {frei: false, kontakt: q}; }
    return {frei: true};
  }
  /** Ganz draußen neben dem Körper? */
  function draussen(id, o) {
    const g = geo(id), [rx] = g.ruhe;
    return g.links ? g.H.every(p => rx + o[0] + p[0] < BRETT.torso.x0) : g.H.every(p => rx + o[0] + p[0] > BRETT.torso.x1);
  }
  /** Bewegung von Versatz a nach b prüfen (in kleinen Schritten). → {ok, draussen, bei, kontakt} */
  function bewegen(id, a, b, c) {
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(d / SCHRITT));
    let letzt = a;
    for (let k = 1; k <= n; k++) {
      const o = [a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n];
      const r = lageFrei(id, o, c);
      if (!r.frei) return {ok: false, draussen: false, bei: letzt, kontakt: r.kontakt};
      letzt = o;
      if (draussen(id, o)) return {ok: true, draussen: true, bei: o};
    }
    return {ok: true, draussen: false, bei: b};
  }
  const trifft = (id, q) => { const g = geo(id), t = g.teil; return punktImPolygon([q[0] - t.ruhe[0], q[1] - t.ruhe[1]], t.umriss); };
  function punktImPolygon(q, poly) {
    let innen = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > q[1]) !== (yj > q[1]) && q[0] < (xj - xi) * (q[1] - yi) / (yj - yi) + xi) innen = !innen;
    }
    return innen;
  }

  /* ---------- Spielregeln ---------- */
  function standardMischen(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function neu({namen, farben = [], schwierigkeit = 'mittel', beginner = 0, mischen = standardMischen}) {
    if (!namen || namen.length < 1 || namen.length > 6) throw new Error('1 bis 6 Personen');
    if (!RANDABSTAND[schwierigkeit]) throw new Error('Unbekannte Schwierigkeit');
    const n = namen.length, b = beginner % n, ids = TEILE.map(t => t.id);
    const spieler = namen.map((name, i) => ({name, farbe: farben[i] || '#f2c14e', taler: 0, teile: [], fehl: 0, fach: []}));
    if (n > 1) mischen([...ids]).forEach((id, k) => spieler[(b + k) % n].fach.push(id));
    return {v: 1, schwierigkeit, spieler, stapel: mischen([...ids]), raus: {}, dran: b, beginner: b, phase: 'ziehen',
      aufgabe: null, aktiv: null, art: null, summer: 0, nr: 0, letzter: null, sieger: null};
  }
  const teil = id => TEILE.find(t => t.id === id);
  const fachVon = (S, id) => S.spieler.findIndex(p => p.fach.includes(id));
  function ziehen(S) {
    if (S.phase !== 'ziehen' || !S.stapel.length) throw new Error('Jetzt wird keine Karte gezogen.');
    S.aufgabe = S.stapel.shift(); S.phase = 'operieren'; S.aktiv = S.dran; S.art = 'normal'; S.nr++;
    S.letzter = {art: 'gezogen', teil: S.aufgabe, spieler: S.dran};
    return S.aufgabe;
  }
  function naechster(S) {
    S.aufgabe = null; S.aktiv = null; S.art = null; S.nr++;
    if (Object.keys(S.raus).length === TEILE.length) { S.phase = 'ende'; S.sieger = sieger(S); return; }
    S.phase = 'ziehen'; S.dran = (S.dran + 1) % S.spieler.length;
  }
  /** Ergebnis eines Versuchs. ok = herausgeholt, sonst Rand berührt. */
  function versuch(S, ok) {
    if (S.phase !== 'operieren') throw new Error('Gerade läuft kein Versuch.');
    const id = S.aufgabe, p = S.spieler[S.aktiv], fach = S.art === 'fach';
    if (ok) {
      const betrag = teil(id).belohnung * (fach ? 2 : 1);
      p.taler += betrag; p.teile.push(id); S.raus[id] = S.aktiv;
      S.letzter = {art: 'geschafft', teil: id, spieler: S.aktiv, betrag, fach};
      naechster(S);
      return {art: 'geschafft', betrag, ende: S.phase === 'ende'};
    }
    S.summer++; p.fehl++;
    S.letzter = {art: 'beruehrt', teil: id, spieler: S.aktiv, fach};
    if (!fach) {
      const f = fachVon(S, id);
      if (f >= 0 && f !== S.aktiv) { S.aktiv = f; S.art = 'fach'; S.nr++; return {art: 'fach', an: f}; }
    }
    S.stapel.push(id); // unter den Stapel
    naechster(S);
    return {art: 'beruehrt'};
  }
  function sieger(S) {
    const best = Math.max(...S.spieler.map(p => p.taler));
    return S.spieler.map((p, i) => p.taler === best ? i : -1).filter(i => i >= 0);
  }
  function rangliste(S) {
    return S.spieler.map((p, i) => ({i, name: p.name, farbe: p.farbe, taler: p.taler, teile: p.teile.length, fehl: p.fehl}))
      .sort((a, b) => b.taler - a.taler || b.teile - a.teile || a.fehl - b.fehl || a.i - b.i);
  }
  /** Was ein Mitspieler sehen darf: der Aufgabenstapel nur als Anzahl. */
  function sicht(S) { const k = JSON.parse(JSON.stringify(S)); k.stapel = S.stapel.length; return k; }

  const RuhigeHand = {BRETT, TEILE, RANDABSTAND, teil, neu, ziehen, versuch, fachVon, sieger, rangliste, sicht,
    geo, lageFrei, bewegen, draussen, trifft, huelle, abstandKonvex, punktImPolygon, abtasten};
  if (typeof module !== 'undefined') module.exports = RuhigeHand; else window.RuhigeHand = RuhigeHand;
})();
