/* Schiffe versenken – reine Spielregeln (ohne DOM).

   QUELLEN (abgerufen 08.11.2026)
   - de.wikipedia.org/wiki/Schiffe_versenken: 10×10 (Spalten A–J, Zeilen 1–10), zehn Schiffe – 1 Schlachtschiff (5),
     2 Kreuzer (4), 3 Zerstörer (3), 4 U-Boote (2) –, Schiffe nur waagerecht/senkrecht, nicht um die Ecke, dürfen am
     Rand liegen, sich aber nicht berühren. Grundform: abwechselnd je ein Schuss. Antwort Wasser / Treffer / versenkt.
     Gewonnen hat, wer zuerst alle gegnerischen Schiffe versenkt.
   - spielregeln-spielanleitungen.de/spiel/schiffe-versenken: gleiche Flotte, zwischen zwei Schiffen mindestens ein
     Kästchen Wasser, „Felder rund um ein versenktes Schiff sind immer Wasser“; abwechselnd schießen, Weiterschießen
     nach Treffer als beliebte Variante; wer beginnt, wird ausgelost.
   - elo-games.com (Anleitung): Abstand „horizontal, vertikal aber auch diagonal“.
   - Brettspiel-Ausgabe des Originalverlags (schmidtspiele.de 49092): fünf Schiffe (5, 4, 3, 3, 2), Berühren nur
     waagerecht/senkrecht verboten – als Variante angeboten.

   GRUNDREGEL (Vorgabe), wie hier umgesetzt
   - Flotte „zehn“: 5, 4, 4, 3, 3, 3, 2, 2, 2, 2 (30 Felder). Kein Berühren, auch nicht über Eck (Auslegung der
     Papierfassung: rundherum Wasser). Abwechselnd je ein Schuss. Wer beginnt, lost das Spiel aus.
   - Ein Feld kann nur einmal beschossen werden. Versenkt ist ein Schiff, wenn alle seine Felder getroffen sind.

   OPTIONEN (beschriftet auf der Startseite)
   - flotte: 'zehn' (Vorgabe) | 'fuenf' (5, 4, 3, 3, 2).
   - abstand: 'eck' (Vorgabe, rundherum Wasser) | 'kante' (über Eck erlaubt) | 'frei' (Berühren erlaubt).
   - nachTreffer: 'wechsel' (Vorgabe, abwechselnd) | 'weiter' (wer trifft, schießt nochmal).
*/
"use strict";
(function () {
  const N = 10;
  const SPALTEN = 'ABCDEFGHIJ';
  const FLOTTEN = {
    zehn: [['Schlachtschiff', 5], ['Kreuzer', 4], ['Kreuzer', 4], ['Zerstörer', 3], ['Zerstörer', 3], ['Zerstörer', 3],
      ['U-Boot', 2], ['U-Boot', 2], ['U-Boot', 2], ['U-Boot', 2]],
    fuenf: [['Schlachtschiff', 5], ['Kreuzer', 4], ['Zerstörer', 3], ['Zerstörer', 3], ['U-Boot', 2]]
  };
  const STANDARD = {flotte: 'zehn', abstand: 'eck', nachTreffer: 'wechsel'};

  const feldName = i => SPALTEN[i % N] + (Math.floor(i / N) + 1);
  /** Felder eines Schiffs {x, y, r:'h'|'v', laenge} – null, wenn es aus dem Raster ragt. */
  function felder(sch) {
    const out = [];
    for (let k = 0; k < sch.laenge; k++) {
      const x = sch.x + (sch.r === 'h' ? k : 0), y = sch.y + (sch.r === 'v' ? k : 0);
      if (x < 0 || y < 0 || x >= N || y >= N) return null;
      out.push(y * N + x);
    }
    return out;
  }
  function nachbarn(i, abstand) {
    const x = i % N, y = Math.floor(i / N), out = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue; if (abstand === 'kante' && dx && dy) continue;
      const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < N && ny < N) out.push(ny * N + nx);
    }
    return out;
  }
  /** Prüft, ob ein Schiff zu den übrigen (ohne Index ohne) passt. Gibt Grund oder '' zurück. */
  function grund(schiffe, sch, abstand, ohne = -1) {
    const f = felder(sch); if (!f) return 'ragt über den Rand';
    const belegt = new Set(), nah = new Set();
    schiffe.forEach((s, j) => {
      if (j === ohne || s.x == null) return;
      felder(s).forEach(i => { belegt.add(i); if (abstand !== 'frei') nachbarn(i, abstand).forEach(n => nah.add(n)); });
    });
    if (f.some(i => belegt.has(i))) return 'liegt auf einem anderen Schiff';
    if (f.some(i => nah.has(i))) return abstand === 'kante' ? 'berührt ein anderes Schiff' : 'braucht rundherum Wasser';
    return '';
  }
  const passt = (schiffe, sch, abstand, ohne) => !grund(schiffe, sch, abstand, ohne);

  function leereFlotte(art = 'zehn') { return FLOTTEN[art].map(([name, laenge], id) => ({id, name, laenge, x: null, y: null, r: 'h'})); }

  /** Zufällig aufstellen (zufall(n) → 0..n-1). Gibt eine neue Flotte zurück. */
  function zufaellig(art, abstand, zufall) {
    for (let versuch = 0; versuch < 400; versuch++) {
      const fl = leereFlotte(art); let ok = true;
      for (const s of fl) {
        let gesetzt = false;
        for (let k = 0; k < 300 && !gesetzt; k++) {
          const r = zufall(2) ? 'v' : 'h';
          const x = zufall(r === 'h' ? N - s.laenge + 1 : N), y = zufall(r === 'v' ? N - s.laenge + 1 : N);
          const kandidat = {...s, x, y, r};
          if (passt(fl, kandidat, abstand, s.id)) { Object.assign(s, {x, y, r}); gesetzt = true; }
        }
        if (!gesetzt) { ok = false; break; }
      }
      if (ok) return fl;
    }
    throw new Error('Keine Aufstellung gefunden');
  }

  function flotteGueltig(fl, abstand, art) {
    const soll = FLOTTEN[art].map(x => x[1]).sort().join(), ist = fl.map(s => s.laenge).sort().join();
    if (soll !== ist) return false;
    return fl.every((s, j) => s.x != null && passt(fl, s, abstand, j));
  }

  function neu({namen, farben = [], optionen = {}, beginner = 0}) {
    if (!Array.isArray(namen) || namen.length !== 2) throw new Error('genau 2 Personen');
    const o = Object.assign({}, STANDARD, optionen);
    return {
      v: 1, optionen: o,
      spieler: namen.map((n, i) => ({name: n, farbe: farben[i] || '#f2c14e', flotte: leereFlotte(o.flotte), bereit: false, beschossen: []})),
      phase: 'aufstellen', aufsteller: 0, beginner, dran: beginner, letzter: null, sieger: null, zuege: 0
    };
  }
  /** Aufstellung einer Person festschreiben. */
  function aufstellen(s, i, flotte) {
    if (s.phase !== 'aufstellen' || s.aufsteller !== i) throw new Error('Nicht an der Reihe beim Aufstellen');
    if (!flotteGueltig(flotte, s.optionen.abstand, s.optionen.flotte)) throw new Error('Aufstellung ungültig');
    s.spieler[i].flotte = flotte.map(x => ({id: x.id, name: x.name, laenge: x.laenge, x: x.x, y: x.y, r: x.r}));
    s.spieler[i].bereit = true;
    if (i === 0) s.aufsteller = 1; else { s.phase = 'spiel'; s.dran = s.beginner; }
    return s;
  }
  const gegner = i => 1 - i;
  /** Was liegt auf Feld f des Bretts von Person i? Schiff oder null. */
  function schiffAuf(s, i, f) { return s.spieler[i].flotte.find(sch => felder(sch).includes(f)) || null; }
  const istVersenkt = (s, i, sch) => felder(sch).every(f => s.spieler[i].beschossen.includes(f));
  /** Zielansicht für die Person am Zug: je Feld 'leer' | 'wasser' | 'treffer' | 'versenkt' (+ 'frei' = sicher Wasser). */
  function zielbild(s, schuetze) {
    const z = gegner(schuetze), b = s.spieler[z].beschossen, out = Array(N * N).fill('leer');
    b.forEach(f => { const sch = schiffAuf(s, z, f); out[f] = !sch ? 'wasser' : istVersenkt(s, z, sch) ? 'versenkt' : 'treffer'; });
    if (s.optionen.abstand !== 'frei') {
      s.spieler[z].flotte.filter(sch => istVersenkt(s, z, sch)).forEach(sch => felder(sch).forEach(f =>
        nachbarn(f, s.optionen.abstand).forEach(n => { if (out[n] === 'leer') out[n] = 'frei'; })));
    }
    return out;
  }
  function versenkteSchiffe(s, i) { return s.spieler[i].flotte.filter(sch => istVersenkt(s, i, sch)); }

  function schiessen(s, f) {
    if (s.phase !== 'spiel') throw new Error('Gerade wird nicht geschossen');
    if (!Number.isInteger(f) || f < 0 || f >= N * N) throw new Error('Feld ungültig');
    const z = gegner(s.dran), ziel = s.spieler[z];
    if (ziel.beschossen.includes(f)) throw new Error('Feld schon beschossen');
    ziel.beschossen.push(f); s.zuege++;
    const sch = schiffAuf(s, z, f);
    let ergebnis = 'wasser';
    if (sch) ergebnis = istVersenkt(s, z, sch) ? 'versenkt' : 'treffer';
    const alle = ziel.flotte.every(x => istVersenkt(s, z, x));
    s.letzter = {schuetze: s.dran, feld: f, ergebnis, schiff: sch ? {name: sch.name, laenge: sch.laenge, felder: felder(sch)} : null, alle};
    if (alle) { s.phase = 'ende'; s.sieger = s.dran; }
    else if (!sch || s.optionen.nachTreffer !== 'weiter') s.dran = z;
    return s.letzter;
  }

  const Schiffe = {N, SPALTEN, FLOTTEN, STANDARD, feldName, felder, nachbarn, grund, passt, leereFlotte, zufaellig,
    flotteGueltig, neu, aufstellen, schiffAuf, istVersenkt, zielbild, versenkteSchiffe, schiessen, gegner};
  if (typeof module !== 'undefined') module.exports = Schiffe; else window.Schiffe = Schiffe;
})();
