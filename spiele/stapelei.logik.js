/* Stapelei – reine Spielregeln, ohne DOM.
   Regelquelle (recherchiert 08.11.2026): offizielle Spielanleitung des Herstellers zum Vorbild
   (Instruction Sheet 42050, © 2009, service.mattel.com/instruction_sheets/42050-0920.pdf), Abschnitte
   You should have, Let's start, How to set up play, Further explanation of card piles, How to play,
   Scoring and winning, Short game. Abgeglichen mit de/en.wikipedia.
   Regeln, wie umgesetzt:
   1. 162 Karten: je zwölfmal die Zahlen 1–12 (= 144) und 18 Joker (im Original eigene Sonderkarte).
   2. Geber teilt jeder Person einen verdeckten Vorratsstapel aus: 30 Karten bei 2–4 Personen, 20 bei 5–6.
      Die oberste Vorratskarte liegt offen. Rest = Nachziehstapel. Option „Kurzes Spiel“ (offiziell): 10 Karten.
      Erster Geber wird ausgelost (statt „höchste Karte ziehen“, gleichwertig), danach wandert das Geben nach links.
   3. In der Mitte entstehen bis zu vier gemeinsame Aufbaustapel. Nur eine 1 oder ein Joker beginnt einen
      Aufbaustapel, dann geht es lückenlos aufwärts bis 12. Joker gelten als jede Zahl.
      Ein Stapel mit 12 Karten ist fertig, wird beiseitegelegt, und an seiner Stelle kann ein neuer beginnen.
   4. Jede Person hat bis zu vier eigene Ablagestapel (beliebige Karten in beliebiger Folge, nur die oberste ist
      spielbar). Karten wandern nie von Ablage zu Ablage oder von der Ablage zurück.
   5. Zug: zuerst auf fünf Handkarten auffüllen. Dann beliebig viele Karten auf Aufbaustapel legen – von der Hand,
      die oberste Vorratskarte (danach liegt die nächste offen) oder die oberste Karte eines eigenen Ablagestapels.
      Wer alle fünf Handkarten gelegt hat, zieht sofort fünf neue und spielt weiter. Der Zug endet, indem man eine
      Handkarte auf einen eigenen Ablagestapel legt (auch wenn man nicht legen kann oder will).
   6. Ist der Nachziehstapel leer, werden die fertigen Aufbaustapel gemischt und bilden den neuen Nachziehstapel.
      Ist auch dort nichts, wird nur gezogen, was da ist; wer dann ohne Handkarte dasteht, beendet den Zug ohne
      Ablegen. Geht reihum bei niemandem mehr etwas (nichts zu ziehen, keine Handkarten, keine offene Karte passt),
      endet die Partie ohne Siegerin (beides Auslegung, in der Anleitung nicht geregelt; kommt praktisch nie vor).
   7. Wer die letzte Karte seines Vorratsstapels spielt, gewinnt die Partie sofort.
      Option „Punkte bis 500“ (offiziell als „mehrere Partien mit Wertung“): Siegerin bekommt 25 Punkte plus
      5 je Karte in den Vorratsstapeln der anderen; wer zuerst 500 hat, gewinnt das Spiel. Vorgabe: eine Partie.
   Kartenform: {id, w: 1…12 | 'J'}. Vorrat/Ablagen/Aufbaustapel: Arrays, oberste Karte = letztes Element.
   Aufbaustapel tragen Einträge {...karte, als: Zahl}. */
(function () {
  'use strict';
  function stdZufall(n) { return Math.floor(Math.random() * n); }
  function mischen(a, rnd) { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function deck() {
    const d = []; let id = 0;
    for (let w = 1; w <= 12; w++) for (let k = 0; k < 12; k++) d.push({id: id++, w});
    for (let k = 0; k < 18; k++) d.push({id: id++, w: 'J'});
    return d;
  }
  const vorratGroesse = (n, kurz) => kurz ? 10 : n <= 4 ? 30 : 20;

  function neu({namen, ziel = 0, kurz = false}, rnd = stdZufall, test = {}) {
    const z = {v: 1, namen: namen.slice(), ziel, kurz, punkte: namen.map(() => 0), partie: 0, geber: rnd(namen.length), verlauf: []};
    neuePartie(z, rnd, test, true);
    return z;
  }
  function melde(z, t) { z.log.push(t); if (z.log.length > 6) z.log.shift(); }
  const n = z => z.namen.length;
  function neuePartie(z, rnd = stdZufall, test = {}, erste = false) {
    if (!erste) z.geber = (z.geber + 1) % n(z);
    z.partie++;
    z.stapel = test.stapel ? test.stapel.slice() : mischen(deck(), rnd);
    const g = vorratGroesse(n(z), z.kurz);
    z.vorrat = z.namen.map(() => []);
    for (let r = 0; r < g; r++) for (let i = 1; i <= n(z); i++) z.vorrat[(z.geber + i) % n(z)].push(z.stapel.pop());
    z.haende = z.namen.map(() => []); z.ablagen = z.namen.map(() => [[], [], [], []]);
    z.aufbau = [[], [], [], []]; z.fertig = []; z.log = []; z.ergebnis = null; z.phase = 'zug';
    z.dran = (z.geber + 1) % n(z);
    auffuellen(z, z.dran, rnd);
    return z;
  }
  /* Hand auf fünf auffüllen; fertige Aufbaustapel werden gemischt, wenn der Nachziehstapel leer ist. */
  function auffuellen(z, sp, rnd = stdZufall) {
    let k = 0;
    while (z.haende[sp].length < 5) {
      if (!z.stapel.length) {
        if (!z.fertig.length) break;
        z.stapel = mischen(z.fertig.map(c => ({id: c.id, w: c.w})), rnd); z.fertig = [];
        melde(z, 'Die fertigen Aufbaustapel werden gemischt und sind der neue Nachziehstapel.');
      }
      z.haende[sp].push(z.stapel.pop()); k++;
    }
    return k;
  }
  const obenAuf = a => a[a.length - 1];
  /* Karte zur Quelle: {art:'hand', id} | {art:'vorrat'} | {art:'ablage', nr} */
  function karteVon(z, q) {
    const sp = z.dran;
    if (q.art === 'hand') return z.haende[sp].find(k => k.id === q.id) || null;
    if (q.art === 'vorrat') return obenAuf(z.vorrat[sp]) || null;
    if (q.art === 'ablage') return obenAuf(z.ablagen[sp][q.nr] || []) || null;
    return null;
  }
  const passtAuf = (stapel, k) => !!k && stapel.length < 12 && (k.w === 'J' || k.w === stapel.length + 1);
  function ziele(z, q) { if (z.phase !== 'zug') return []; const k = karteVon(z, q); return [0, 1, 2, 3].filter(i => passtAuf(z.aufbau[i], k)); }
  function legen(z, q, nr, rnd = stdZufall) {
    if (z.phase !== 'zug') return {ok: false};
    const sp = z.dran, k = karteVon(z, q);
    if (!k) return {ok: false, grund: 'Da liegt keine Karte.'};
    const st = z.aufbau[nr];
    if (!st || !passtAuf(st, k)) return {ok: false, grund: st && st.length ? `Hier fehlt eine ${st.length + 1}.` : 'Ein Aufbaustapel beginnt mit einer 1 oder einem Joker.'};
    if (q.art === 'hand') z.haende[sp].splice(z.haende[sp].indexOf(k), 1);
    else if (q.art === 'vorrat') z.vorrat[sp].pop();
    else z.ablagen[sp][q.nr].pop();
    st.push({...k, als: st.length + 1});
    const r = {ok: true, karte: k, als: st.length, fertig: false, nachgezogen: 0, sieg: false};
    if (st.length === 12) { z.fertig.push(...st); z.aufbau[nr] = []; r.fertig = true; melde(z, 'Ein Aufbaustapel ist bis 12 fertig und wird beiseitegelegt.'); }
    if (q.art === 'vorrat' && !z.vorrat[sp].length) { partieWerten(z, sp); r.sieg = true; return r; }
    if (q.art === 'hand' && !z.haende[sp].length) { r.nachgezogen = auffuellen(z, sp, rnd); if (r.nachgezogen) melde(z, `${z.namen[sp]} hat alle Handkarten gelegt und zieht fünf neue.`); }
    return r;
  }
  function abwerfen(z, id, nr, rnd = stdZufall) {
    if (z.phase !== 'zug') return {ok: false};
    const sp = z.dran, h = z.haende[sp], k = h.find(c => c.id === id);
    if (!k || !(nr >= 0 && nr < 4)) return {ok: false, grund: 'Lege eine Handkarte auf einen deiner Ablagestapel.'};
    h.splice(h.indexOf(k), 1); z.ablagen[sp][nr].push(k);
    melde(z, `${z.namen[sp]} legt eine ${k.w === 'J' ? 'Joker' : k.w} ab.`);
    zugWechsel(z, rnd);
    return {ok: true};
  }
  /* Nur wenn nichts mehr auf der Hand ist und nichts nachzuziehen war. */
  function passen(z, rnd = stdZufall) {
    if (z.phase !== 'zug' || z.haende[z.dran].length) return {ok: false};
    melde(z, `${z.namen[z.dran]} hat keine Handkarte und beendet den Zug.`);
    z.passe = (z.passe || 0) + 1;
    if (z.passe >= n(z) && festgefahren(z)) { partieWerten(z, null); return {ok: true, festgefahren: true}; }
    zugWechsel(z, rnd); return {ok: true};
  }
  /* Nichts mehr zu ziehen, keine Handkarten, und keine offene Karte passt irgendwo hin. */
  function festgefahren(z) {
    if (z.stapel.length || z.fertig.length || z.haende.some(h => h.length)) return false;
    return !z.namen.some((_, sp) => [obenAuf(z.vorrat[sp]), ...z.ablagen[sp].map(obenAuf)].some(k => k && z.aufbau.some(a => passtAuf(a, k))));
  }
  function zugWechsel(z, rnd) { if (z.haende[z.dran].length || z.phase !== 'zug') z.passe = 0; z.dran = (z.dran + 1) % n(z); auffuellen(z, z.dran, rnd); }

  function partieWerten(z, sieger) {
    const rest = z.vorrat.map(v => v.length);
    if (sieger === null) { // festgefahren: Partie ohne Siegerin
      z.ergebnis = {sieger: null, punkte: 0, rest, spielSieger: null, festgefahren: true};
      z.phase = z.ziel === 0 ? 'spielende' : 'partieende'; melde(z, 'Nichts geht mehr: Die Partie endet ohne Siegerin.'); return;
    }
    const punkte = 25 + 5 * rest.reduce((s, x, i) => s + (i === sieger ? 0 : x), 0);
    z.punkte[sieger] += punkte;
    z.verlauf.push({partie: z.partie, sieger, punkte});
    const fertig = z.ziel === 0 || z.punkte[sieger] >= z.ziel;
    z.ergebnis = {sieger, punkte, rest, spielSieger: fertig ? sieger : null};
    z.phase = fertig ? 'spielende' : 'partieende';
    melde(z, `${z.namen[sieger]} hat den Vorratsstapel leer gespielt.`);
  }
  function naechstePartie(z, rnd = stdZufall, test) { if (z.phase !== 'partieende') return {ok: false}; neuePartie(z, rnd, test); return {ok: true}; }
  function zaehlen(z) {
    return z.stapel.length + z.fertig.length + z.aufbau.reduce((s, a) => s + a.length, 0) + z.vorrat.reduce((s, a) => s + a.length, 0) +
      z.haende.reduce((s, a) => s + a.length, 0) + z.ablagen.reduce((s, a) => s + a.reduce((t, b) => t + b.length, 0), 0);
  }

  const api = {deck, vorratGroesse, neu, neuePartie, naechstePartie, auffuellen, karteVon, passtAuf, ziele, legen, abwerfen, passen, zaehlen, mischen, obenAuf};
  if (typeof module !== 'undefined') module.exports = api; else window.Stapelei = api;
})();
