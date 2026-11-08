/* Mühle (Neunermühle) – reine Spielregeln, ohne DOM.
   Regelquellen (recherchiert 08.11.2026):
   - Wikipedia „Nine men's morris“ (Phasen, Springen bei drei Steinen, Entnahme aus Mühlen, Verlust bei < 3 Steinen
     oder ohne Zug), ludomax.de/spielregeln/muehle, spielregeln.de/muehle.html, move-this.com (Spielregeln, Remis).
   Regeln, wie umgesetzt:
   1. Brett mit 24 Punkten (drei ineinanderliegende Quadrate, vier Verbindungen über die Seitenmitten), 16 Mühlen.
   2. Jede Seite hat 9 Steine. Phase 1: abwechselnd je einen Stein auf einen freien Punkt setzen (Steine bleiben liegen).
      Erst wenn beide Seiten alle neun gesetzt haben, beginnt Phase 2. (Wer noch Steine in der Hand hat, setzt weiter.)
   3. Phase 2: ziehen auf einen angrenzenden freien Punkt. Phase 3 (Springen): hat jemand NUR NOCH drei Steine
      (und keinen mehr in der Hand), darf er auf jeden freien Punkt springen.
   4. Wer mit einem Zug (Setzen, Ziehen, Springen) drei eigene Steine in eine Linie bringt (Mühle), nimmt einen
      gegnerischen Stein vom Brett. Steine in einer geschlossenen Mühle sind geschützt – außer ALLE gegnerischen Steine
      auf dem Brett stehen in Mühlen. Schließt ein Zug zwei Mühlen zugleich, wird dennoch nur EIN Stein genommen.
      Eine Mühle darf geöffnet und wieder geschlossen werden (jedes Schließen zählt neu).
   5. Verloren hat, wer weniger als drei Steine insgesamt (Brett + Hand) hat, oder wer in Phase 2 am Zug ist und keinen
      Zug ausführen kann (eingesperrt; Springer sind nie eingesperrt).
   6. Remis: die offizielle Quellenlage ist uneinheitlich (Turniere kennen Einigung, Wiederholung, Zugzähler).
      Umgesetzt wird die gängige Regel: dieselbe Stellung (Steine, Hand, wer am Zug ist) zum DRITTEN Mal = Remis,
      automatisch. Keine 20-Züge-Regel (nur in einzelnen Regelheften, würde das Setzen verfälschen).
   Spieler sind 1 und 2. */
(function () {
  'use strict';
  // Punkt p = ring*8 + i ; ring 0 außen, 1 Mitte, 2 innen; i: 0 oben links, 1 oben, 2 oben rechts, 3 rechts,
  // 4 unten rechts, 5 unten, 6 unten links, 7 links.
  const XY = [];
  for (let r = 0; r < 3; r++) {
    const d = r * 1, a = d, b = 6 - d, m = 3;
    XY.push([a, a], [m, a], [b, a], [b, m], [b, b], [m, b], [a, b], [a, m]);
  }
  const NACH = [];
  for (let p = 0; p < 24; p++) NACH.push([]);
  const verbinde = (a, b) => { NACH[a].push(b); NACH[b].push(a); };
  for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) verbinde(r * 8 + i, r * 8 + (i + 1) % 8);
  for (let i = 1; i < 8; i += 2) { verbinde(i, 8 + i); verbinde(8 + i, 16 + i); }
  NACH.forEach(l => l.sort((a, b) => a - b));
  const MUEHLEN = [];
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) MUEHLEN.push([r * 8 + 2 * k, r * 8 + 2 * k + 1, r * 8 + (2 * k + 2) % 8]);
  for (let i = 1; i < 8; i += 2) MUEHLEN.push([i, 8 + i, 16 + i]);
  const MUEHLEN_VON = NACH.map((_, p) => MUEHLEN.filter(m => m.includes(p)));

  const gegner = p => 3 - p;
  const klon = s => JSON.parse(JSON.stringify(s));
  const imBrett = (s, p) => s.b.reduce((n, v) => n + (v === p ? 1 : 0), 0);
  const gesamt = (s, p) => imBrett(s, p) + s.hand[p];
  const inMuehle = (b, p, spieler) => MUEHLEN_VON[p].some(m => m.every(q => b[q] === spieler));

  function neu(opts = {}) {
    const start = opts.start === 2 ? 2 : 1;
    const s = {b: Array(24).fill(0), hand: [0, 9, 9], am: start, nehmen: false, sieger: 0, grund: '', zuege: 0, start, stellungen: {}};
    s.stellungen[schluessel(s)] = 1;
    return s;
  }
  function schluessel(s) { return s.b.join('') + '|' + s.am + '|' + s.hand[1] + s.hand[2]; }
  function phase(s, p) {
    if (s.hand[p] > 0) return 'setzen';
    return imBrett(s, p) === 3 ? 'springen' : 'ziehen';
  }
  // Steine, die der Spieler gerade nehmen darf (gegnerische, nicht in Mühle – außer alle in Mühlen)
  function nehmbar(s, p = s.am) {
    const g = gegner(p), alle = [];
    s.b.forEach((v, i) => { if (v === g) alle.push(i); });
    const frei = alle.filter(i => !inMuehle(s.b, i, g));
    return frei.length ? frei : alle;
  }
  function zugZiele(s, von) {
    const p = s.am;
    if (s.b[von] !== p) return [];
    const ph = phase(s, p);
    if (ph === 'springen') return s.b.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0);
    if (ph === 'ziehen') return NACH[von].filter(q => s.b[q] === 0);
    return [];
  }
  // alle erlaubten Handlungen des Spielers am Zug
  function zuege(s) {
    if (s.sieger) return [];
    if (s.nehmen) return nehmbar(s).map(an => ({art: 'nehmen', an}));
    const p = s.am, ph = phase(s, p), l = [];
    if (ph === 'setzen') { s.b.forEach((v, i) => { if (v === 0) l.push({art: 'setzen', nach: i}); }); return l; }
    s.b.forEach((v, i) => { if (v === p) zugZiele(s, i).forEach(q => l.push({art: 'ziehen', von: i, nach: q})); });
    return l;
  }
  function erlaubt(s, z) {
    return zuege(s).some(a => a.art === z.art && a.von === z.von && a.nach === z.nach && a.an === z.an);
  }
  function wechseln(n) {
    n.am = gegner(n.am);
    const k = schluessel(n);
    n.stellungen[k] = (n.stellungen[k] || 0) + 1;
    // Verlust durch Einsperren
    if (phase(n, n.am) === 'ziehen' && !zuege(n).length) { n.sieger = gegner(n.am); n.grund = 'eingesperrt'; return; }
    if (n.stellungen[k] >= 3) { n.sieger = 'remis'; n.grund = 'wiederholung'; }
  }
  // Führt einen Zug aus; wirft bei unerlaubtem Zug. Rückgabe: neuer Zustand (Original bleibt unverändert).
  function anwenden(s, z) {
    if (!erlaubt(s, z)) throw new Error('Unerlaubter Zug');
    const n = klon(s), p = n.am;
    n.zuege++;
    n.letzter = z;
    if (z.art === 'nehmen') {
      n.b[z.an] = 0; n.nehmen = false;
      if (gesamt(n, gegner(p)) < 3) { n.sieger = p; n.grund = 'zuwenig'; return n; }
      wechseln(n); return n;
    }
    let ziel;
    if (z.art === 'setzen') { n.b[z.nach] = p; n.hand[p]--; ziel = z.nach; }
    else { n.b[z.von] = 0; n.b[z.nach] = p; ziel = z.nach; }
    if (inMuehle(n.b, ziel, p)) { n.nehmen = true; n.muehle = ziel; return n; }
    delete n.muehle;
    wechseln(n); return n;
  }
  const api = {XY, NACH, MUEHLEN, neu, phase, nehmbar, zugZiele, zuege, erlaubt, anwenden, imBrett, gesamt, gegner, inMuehle, schluessel};
  if (typeof module !== 'undefined') module.exports = api; else window.Muehle = api;
})();
