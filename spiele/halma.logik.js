/* Halma (Stern-Halma) – reine Spielregeln, ohne DOM.
   Regelquellen (recherchiert 08.11.2026): de.wikipedia „Halma“ (Abschnitt Sternhalma: Häuser zu 15 Feldern bei zwei
   und drei Personen, zu 10 Feldern darüber), en.wikipedia „Chinese checkers“ (Hüpfen über einzelne Steine, eigene
   wie fremde, in jede der sechs Richtungen, Ketten optional, Schritt und Hüpfen nie im selben Zug mischen, kein Schlagen),
   ludomax.de/spielregeln/halma (Blockade im Zielhof als vereinbarte Zusatzregel), checkersonline.io (Blockade).
   Regeln, wie umgesetzt:
   1. Brett: sechszackiger Stern mit 121 Feldern (Sechseck 61 + sechs Zacken zu je 10). Koordinaten sind Würfelkoordinaten
      (x, y, z mit x+y+z=0); ein Feld gehört zum Stern, wenn alle drei Werte ≥ −4 ODER alle drei ≤ 4 sind.
   2. Spielerzahl und Steine: 2 Personen je 15 Steine (gegenüberliegende Ecken), 3 Personen je 15 (jede zweite Ecke),
      4 Personen je 10 (zwei gegenüberliegende Paare, zwei Ecken bleiben leer), 6 Personen je 10. 15 Steine füllen
      ein Fünf-Reihen-Dreieck (Zacke plus die Randreihe des Sechsecks), 10 Steine eine Zacke.
   3. Ziel: alle eigenen Steine in die Ecke genau gegenüber. Wer das zuerst schafft, gewinnt (die Partie endet dann).
   4. Zug: ein eigener Stein geht entweder auf ein angrenzendes freies Feld ODER hüpft über einen unmittelbar
      angrenzenden Stein (eigen oder fremd) auf das dahinter liegende freie Feld, mehrfach hintereinander, wenn möglich.
      Eine Hüpfkette darf nach jedem Hüpfer enden. Hüpfen und Schritt werden nie gemischt. Kein Stein wird geschlagen.
      Umsetzung: In einer Kette wird kein Feld zweimal betreten (kein Gewinn, nur Schleifen).
   5. Blockade des Zielhofs (Auslegung, in der Quellenlage Zusatzregel): Bleibt ein einzelner fremder Stein auf einem
      Feld deines Zielhofs stehen, zählt der Hof als gefüllt, sobald alle übrigen Felder dort deine Steine tragen
      (Regel „blockade“, Vorgabe). Option „streng“: alle eigenen Steine müssen im Zielhof stehen, fremde Steine blockieren.
      Beide Regeln gelten für jede Person nach jedem Zug, auch wenn ein anderer Zug die Lage verändert.
   6. Kann eine Person nicht ziehen (praktisch nie), setzt sie aus. Kann niemand ziehen: Remis.
   Reihenfolge der Personen = im Uhrzeigersinn, beginnend unten. */
(function () {
  'use strict';
  const LOECHER = [], INDEX = new Map();
  for (let z = -8; z <= 8; z++) for (let x = -8; x <= 8; x++) {
    const y = -x - z; if (y < -8 || y > 8) continue;
    if ((x >= -4 && y >= -4 && z >= -4) || (x <= 4 && y <= 4 && z <= 4)) { INDEX.set(x + ',' + y + ',' + z, LOECHER.length); LOECHER.push({x, y, z}); }
  }
  const N = LOECHER.length;
  const RICHTUNGEN = [[1, -1, 0], [1, 0, -1], [0, 1, -1], [-1, 1, 0], [-1, 0, 1], [0, -1, 1]];
  const idx = (x, y, z) => { const i = INDEX.get(x + ',' + y + ',' + z); return i === undefined ? -1 : i; };
  const NACH = LOECHER.map(h => RICHTUNGEN.map(d => idx(h.x + d[0], h.y + d[1], h.z + d[2])));
  const SPRUNG = LOECHER.map((h, i) => RICHTUNGEN.map((d, k) => { const m = NACH[i][k]; return m < 0 ? -1 : NACH[m][k]; }));
  // Bildschirmlage: pointy-top, y nach unten. Einheit = Abstand zweier Nachbarn / √3.
  const PUNKT = LOECHER.map(h => ({px: Math.sqrt(3) * (h.x + h.z / 2), py: 1.5 * h.z}));
  // Zacken im Uhrzeigersinn von oben: 0 oben, 1 oben rechts, 2 unten rechts, 3 unten, 4 unten links, 5 oben links
  const ZACKEN = [{k: 'z', s: -1}, {k: 'x', s: 1}, {k: 'y', s: -1}, {k: 'z', s: 1}, {k: 'x', s: -1}, {k: 'y', s: 1}];
  const zackenFelder = (t, reihen) => {
    const g = 9 - reihen, k = ZACKEN[t].k, sg = ZACKEN[t].s, l = [];
    LOECHER.forEach((h, i) => { if (sg * h[k] >= g && ['x', 'y', 'z'].every(c => c === k || sg * h[c] >= -4)) l.push(i); });
    return l;
  };
  const SITZE = {2: [3, 0], 3: [3, 5, 1], 4: [3, 4, 0, 1], 6: [3, 4, 5, 0, 1, 2]};
  const STEINE = {2: 15, 3: 15, 4: 10, 6: 10};
  const gegenueber = t => (t + 3) % 6;

  function neu(opts = {}) {
    const n = opts.anzahl;
    if (!SITZE[n]) throw new Error('Spielerzahl muss 2, 3, 4 oder 6 sein');
    const steine = STEINE[n], reihen = steine === 15 ? 5 : 4;
    const feld = Array(N).fill(0);
    SITZE[n].forEach((t, i) => zackenFelder(t, reihen).forEach(f => { feld[f] = i + 1; }));
    return {n, steine, reihen, sitze: [0].concat(SITZE[n]), feld, am: Math.min(n, Math.max(1, opts.start || 1)), sieger: 0, regel: opts.regel === 'streng' ? 'streng' : 'blockade', zuege: 0};
  }
  const startFelder = (s, p) => zackenFelder(s.sitze[p], s.reihen);
  const zielFelder = (s, p) => zackenFelder(gegenueber(s.sitze[p]), s.reihen);
  const imZiel = (s, p) => zielFelder(s, p).filter(f => s.feld[f] === p).length;

  function schritte(feld, von) { return NACH[von].filter(m => m >= 0 && feld[m] === 0); }
  // Landefelder eines einzelnen Hüpfers von „von“; die Stellung „feld“ enthält den hüpfenden Stein bereits auf „von“
  function huepfer(feld, von) {
    const l = [];
    for (let k = 0; k < 6; k++) { const m = NACH[von][k], z = SPRUNG[von][k]; if (m >= 0 && z >= 0 && feld[m] !== 0 && feld[z] === 0) l.push(z); }
    return l;
  }
  // Stellung, nachdem ein Stein dem Weg (Liste von Feldern) bis zum Ende gefolgt ist
  function mitWeg(s, weg) { const f = s.feld.slice(); const p = f[weg[0]]; f[weg[0]] = 0; f[weg[weg.length - 1]] = p; return f; }
  // Mögliche nächste Hüpfer, wenn der Stein schon entlang „weg“ unterwegs ist (weg endet beim Stein)
  function weiter(s, weg) {
    const f = mitWeg(s, weg), l = huepfer(f, weg[weg.length - 1]);
    return l.filter(z => !weg.includes(z));
  }
  function ersteZiele(s, von) {
    if (s.sieger || s.feld[von] !== s.am) return {schritte: [], huepfer: []};
    return {schritte: schritte(s.feld, von), huepfer: weiter(s, [von])};
  }
  function hatZug(s, p) {
    for (let i = 0; i < N; i++) if (s.feld[i] === p && (schritte(s.feld, i).length || huepfer(s.feld, i).length)) return true;
    return false;
  }
  function gewonnen(s, p) {
    const ziel = zielFelder(s, p); let eigen = 0, fremd = 0, leer = 0;
    ziel.forEach(f => { const v = s.feld[f]; if (v === p) eigen++; else if (v === 0) leer++; else fremd++; });
    if (eigen === s.steine) return true;
    if (s.regel === 'blockade') return leer === 0 && fremd === 1 && eigen === ziel.length - 1;
    return false;
  }
  // weg = [von, f1, f2, ...]; wirft bei Regelverstoß. Rückgabe: neuer Zustand.
  function ziehen(s, weg) {
    if (s.sieger) throw new Error('Partie ist beendet');
    if (!Array.isArray(weg) || weg.length < 2) throw new Error('Weg zu kurz');
    const von = weg[0];
    if (s.feld[von] !== s.am) throw new Error('Kein eigener Stein');
    if (new Set(weg).size !== weg.length) throw new Error('Feld doppelt betreten');
    if (weg.length === 2 && schritte(s.feld, von).includes(weg[1])) { /* Schritt */ }
    else for (let i = 1; i < weg.length; i++) if (!weiter(s, weg.slice(0, i)).includes(weg[i])) throw new Error('Unerlaubter Hüpfer');
    const n = JSON.parse(JSON.stringify(s));
    n.feld = mitWeg(s, weg); n.zuege++; n.letzter = weg.slice();
    const reihe = [n.am].concat(Array.from({length: n.n}, (_, i) => i + 1).filter(p => p !== n.am));
    for (const p of reihe) if (gewonnen(n, p)) { n.sieger = p; return n; }
    for (let k = 1; k <= n.n; k++) { const p = ((n.am - 1 + k) % n.n) + 1; if (hatZug(n, p)) { n.am = p; return n; } }
    n.sieger = 'remis'; return n;
  }
  const api = {N, LOECHER, NACH, SPRUNG, PUNKT, ZACKEN, SITZE, STEINE, RICHTUNGEN, zackenFelder, gegenueber, neu, startFelder, zielFelder, imZiel,
    schritte, huepfer, weiter, ersteZiele, hatZug, gewonnen, ziehen, mitWeg, idx};
  if (typeof module !== 'undefined') module.exports = api; else window.Halma = api;
})();
